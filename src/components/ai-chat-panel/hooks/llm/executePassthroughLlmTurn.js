/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { requestAiChatCompletion } from './requestAiChatCompletion';

/**
 * Resolves the model id for the chat API (matches shared vs dedicated key in maxiSettings).
 *
 * @returns {string} Non-empty model id.
 */
export function resolveAiPanelModel() {
	const ai = typeof window !== 'undefined' ? window.maxiSettings?.ai_settings ?? {} : {};
	const useShared = ai.ai_panel_use_shared !== false;
	const raw = useShared ? ai.model : ai.ai_panel_model;
	const trimmed = typeof raw === 'string' ? raw.trim() : '';
	if (trimmed !== '') {
		return trimmed;
	}
	return useShared ? 'gpt-3.5-turbo' : 'gpt-4o-mini';
}

/**
 * Runs one passthrough LLM request: chat completion, global-scope guardrails, then action execution.
 *
 * @param {Object}   params
 * @param {Array}    params.messages              Chat transcript (hook state).
 * @param {string}   params.rawMessage          Latest user text.
 * @param {Object}   params.userMessage         User message object (for global apply_theme coercion).
 * @param {string}   params.scope               'page' | 'selection' | 'global'
 * @param {string}   params.systemPrompt        Composed system prompt string.
 * @param {string}   params.context             Second system message body from buildPassthroughLlmContext.
 * @param {Object|null} params.selectedBlock    Selected block, if any.
 * @param {Function} params.getSkillContextForBlock Block name → skills string.
 * @param {Function} params.parseAndExecuteAction Parses model output and applies editor updates.
 * @param {Function} params.logDebug            Optional debug logger.
 * @returns {Promise<{executed:boolean,message:string,options?:*,optionsType?:*}>}
 */
export async function executePassthroughLlmTurn({
	messages,
	rawMessage,
	userMessage,
	scope,
	systemPrompt,
	context,
	selectedBlock,
	getSkillContextForBlock,
	parseAndExecuteAction,
	logDebug = () => {},
}) {
	const data = await requestAiChatCompletion({
		messages: [
			{ role: 'system', content: systemPrompt },
			{
				role: 'system',
				content:
					'Context: ' +
					context +
					(selectedBlock ? '\n\nBlock Skills: ' + getSkillContextForBlock(selectedBlock.name) : ''),
			},
			...messages
				.filter(m => m.role !== 'assistant' || !m.executed)
				.slice(-6)
				.map(m => ({
					role: m.role === 'assistant' ? 'assistant' : 'user',
					content: typeof m.content === 'string' ? m.content : String(m.content || ''),
				})),
			{ role: 'user', content: rawMessage },
		],
		model: resolveAiPanelModel(),
		temperature: 0.2,
		streaming: false,
	});

	let assistantContent =
		data?.choices?.[0]?.message?.content ||
		__('Sorry, I couldn\'t process that.', 'maxi-blocks');

	logDebug('Raw AI response:', assistantContent);

	if (scope === 'global') {
		try {
			const parsed = JSON.parse(assistantContent.trim());
			const allowedGlobalActions = new Set([
			'apply_theme', 'update_style_card', 'message',
			'post_management', 'sc_action', 'browse_cloud_sc', 'cloud_icon',
			'CLOUD_MODAL_UI', 'CLARIFY',
		]);
			if (parsed.action && !allowedGlobalActions.has(parsed.action)) {
				logDebug('Forcing apply_theme for global scope');
				assistantContent = JSON.stringify({ action: 'apply_theme', prompt: userMessage });
			}
		} catch (e) {
			logDebug('Non-JSON response, creating apply_theme for global scope');
			assistantContent = JSON.stringify({ action: 'apply_theme', prompt: userMessage });
		}
	}

	const result = await parseAndExecuteAction(assistantContent, rawMessage);
	logDebug('Parsed action result:', {
		executed: result.executed,
		message: result.message,
		options: result.options,
	});

	return result;
}
