/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { loadColumnsTemplate, getTemplates } from '@extensions/column-templates';
import { findBestIcon, findIconCandidates, extractIconQuery, extractIconQueries, extractIconStyleIntent, stripIconStylePhrases } from '../iconSearch';
import { getSkillContextForBlock } from '../skillContext';
import { findBestPattern, extractPatternQuery } from '../patternSearch';
import { AI_BLOCK_PATTERNS, getAiHandlerForBlock, getAiPromptForBlockName } from '../ai/registry';
import { buildRoutingContext, routeClientSide } from '../ai/router';
import { buildColorUpdate, getColorTargetLabel } from '../ai/color/colorClarify';
import { isInteractionBuilderMessage } from '../ai/utils/contextDetection';
import { maybeOpenFlowSidebar } from '../ai/utils/openFlowSidebar';
import { collectBlocks, getBlockPrefix, isLabelBlock, isHeadingTextBlock, findGroupRootForIconBlock, buildTextContentChange, buildIconRelatedText, getIconLabelFromBlock, findLabelForIconBlock } from '../ai/utils/blockHelpers';
import { extractUrl } from '../ai/utils/messageExtractors';
import { resolveImageRatioValue } from '../ai/utils/messageExtractors';
import { openSidebarAccordion } from '@extensions/inspector/inspectorPath';
import onRequestInsertPattern from '../../../editor/library/utils/onRequestInsertPattern';
import ADVANCED_CSS_PROMPT from '../ai/prompts/advanced-css';
import STYLE_CARD_MAXI_PROMPT from '../ai/prompts/style-card';
import META_MAXI_PROMPT from '../ai/prompts/meta';
import INTERACTION_BUILDER_PROMPT from '../ai/prompts/interaction-builder';
import SYSTEM_PROMPT from '../ai/prompts/system';
import { updateSCOnEditor } from '@extensions/style-cards';
import { getNewActiveStyleCards } from '@extensions/style-cards/store/reducer';
import openCloudSCLibrary from '../utils/openCloudSCLibrary';
import { buildPassthroughLlmContext } from './llm/buildPassthroughLlmContext';
import { executePassthroughLlmTurn } from './llm/executePassthroughLlmTurn';

/**
 * Provides sendMessage, handleKeyDown, and handleSuggestion for the AI chat panel.
 *
 * @param {Object}   args
 * @param {string}   args.input                  Current input field value.
 * @param {Function} args.setInput               State setter.
 * @param {string}   args.scope                  Current AI scope.
 * @param {Function} args.setScopeChosen         State setter.
 * @param {Object}   args.conversationContext    Current FSM context.
 * @param {Function} args.setConversationContext State setter.
 * @param {Object}   args.selectedBlock          Currently selected block.
 * @param {Array}    args.messages               Current messages array.
 * @param {Object}   args.messagesRef            Ref kept in sync with messages.
 * @param {Function} args.setMessages            State setter.
 * @param {boolean}  args.isLoading              Loading flag.
 * @param {Function} args.setIsLoading           State setter.
 * @param {Object}   args.allBlocks              Snapshot of all blocks (may be stale).
 * @param {Object}   args.registry               WP data registry.
 * @param {Function} args.updateBlockAttributes  WP dispatch.
 * @param {Object}   args.activeStyleCard        Current style card.
 * @param {Object}   args.allStyleCards          All style cards.
 * @param {Array}    args.customColors           Custom palette colours.
 * @param {Function} args.saveMaxiStyleCards     SC save function.
 * @param {Function} args.resetSC               SC reset function.
 * @param {Function} args.setActiveStyleCard     SC active setter.
 * @param {Function} args.setSelectedStyleCard   SC selected setter.
 * @param {Function} args.removeStyleCard        SC remove function.
 * @param {Function} args.saveSCStyles           SC styles save function.
 * @param {Function} args.parseAndExecuteAction  From useAiChatActions.
 * @param {Function} args.handleRecoveryChoice   From useAiChatRecovery.
 * @param {Function} args.buildRecoveryResponse  From useAiChatRecovery.
 * @param {Function} args.runCloudLibraryIntent  From useAiChatCloud.
 * @param {Function} args.getContentAreaClientId From useAiChatCloud.
 * @param {Function} args.openSidebarForProperty From useAiChatSidebar.
 * @param {Function} args.logAIDebug             Conditional debug logger.
 * @returns {{ sendMessage: Function, handleKeyDown: Function, handleSuggestion: Function }}
 */
const useAiChatMessages = ({
	input,
	setInput,
	scope,
	setScopeChosen,
	conversationContext,
	setConversationContext,
	selectedBlock,
	messages,
	messagesRef,
	setMessages,
	isLoading,
	setIsLoading,
	allBlocks,
	registry,
	updateBlockAttributes,
	activeStyleCard,
	allStyleCards,
	customColors,
	saveMaxiStyleCards,
	resetSC,
	setActiveStyleCard,
	setSelectedStyleCard,
	removeStyleCard,
	saveSCStyles,
	parseAndExecuteAction,
	handleRecoveryChoice,
	buildRecoveryResponse,
	runCloudLibraryIntent,
	getContentAreaClientId,
	openSidebarForProperty,
	logAIDebug,
}) => {
	/**
	 * Sends a message through the AI pipeline (or handles active FSM context).
	 *
	 * @param {string} [overriddenRawMessage] When set, use this text instead of the input field value.
	 * @returns {Promise<void>}
	 */
	const sendMessage = async overriddenRawMessage => {
		const sourceText = typeof overriddenRawMessage === 'string' ? overriddenRawMessage : input;
		const rawMessage = String(sourceText || '').trim();
		if (!rawMessage) return;

		setScopeChosen(true);

		const aiSettings = window.maxiSettings?.ai_settings ?? {};
		const useShared = aiSettings.ai_panel_use_shared !== false;
		const hasKey = useShared ? !!aiSettings.has_ai_key : !!aiSettings.has_ai_panel_key;

		if (!hasKey) {
			setMessages(prev => [
				...prev,
				{ role: 'user', content: rawMessage },
				{
					role: 'assistant',
					content: __('Please configure your AI API key in the Maxi AI dashboard settings before using the chat panel.', 'maxi-blocks'),
					isError: true,
				},
			]);
			setInput('');
			return;
		}

		// Handle recovery context — user typed a response to a recovery question.
		if (conversationContext?.type === 'recovery') {
			setInput('');
			await handleRecoveryChoice(rawMessage);
			return;
		}

		const userMessage = { role: 'user', content: rawMessage };
		setMessages(prev => [...prev, userMessage]);
		setInput('');

		// === FLOW STATE MACHINE BYPASS ===
		if (conversationContext && conversationContext.flow) {
			if (scope === 'global') {
				setConversationContext(null);
			} else {
				console.log('[Maxi AI Conversation] Active flow detected:', conversationContext.flow);
				const options = conversationContext.currentOptions;
				const hasOptions = Array.isArray(options) && options.length > 0;
				const isOptionMatch =
					hasOptions &&
					options.some(o =>
						(typeof o === 'string' ? o.toLowerCase() : o.label.toLowerCase()) ===
						rawMessage.toLowerCase()
					);
				if (isOptionMatch || !hasOptions) {
					handleSuggestion(rawMessage); // eslint-disable-line no-use-before-define
					return;
				}
				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: 'Please select an option or colour to continue.', executed: false },
				]);
				setIsLoading(false);
				return;
			}
		}

		// Handle insert_block layout-picker reply (typed path)
		if (conversationContext?.type === 'insert_block') {
			const lower = rawMessage.toLowerCase();
			setConversationContext(null);
			const contentAreaId = getContentAreaClientId();
			if (lower.includes('cloud') || lower.includes('library') || lower.includes('browse')) {
				await runCloudLibraryIntent(rawMessage);
				setIsLoading(false);
				return;
			} else if (lower.includes('sidebar')) {
				const row = createBlock('maxi-blocks/row-maxi');
				const rootBlock = createBlock('maxi-blocks/container-maxi', {}, [row]);
				dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
				loadColumnsTemplate('1-3', row.clientId, 'general', 2);
			} else if (lower.includes('hero') || lower.includes('full-width') || lower.includes('full width')) {
				const rootBlock = createBlock('maxi-blocks/container-maxi', { 'full-width-general': true });
				dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
			} else {
				const colMatch = lower.match(/(\d+)/);
				const numCols = colMatch ? Math.min(parseInt(colMatch[1]), 6) : 1;
				if (numCols > 1) {
					const templateName =
						getTemplates(true, 'general', numCols).find(t => !t.isMoreThanEightColumns)?.name ||
						`${numCols} columns`;
					const row = createBlock('maxi-blocks/row-maxi');
					const rootBlock = createBlock('maxi-blocks/container-maxi', {}, [row]);
					dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
					loadColumnsTemplate(templateName, row.clientId, 'general', numCols);
				} else {
					const rootBlock = createBlock('maxi-blocks/container-maxi');
					dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
				}
			}
			setMessages(prev => [...prev, { role: 'assistant', content: `Added ${rawMessage}.`, executed: true }]);
			setIsLoading(false);
			return;
		}

		// Handle colour-of-what clarification (typed path)
		if (conversationContext?.type === 'color_what') {
			const lower = rawMessage.toLowerCase();
			let target;
			if (lower.includes('text') || lower.includes('font') || lower.includes('label')) target = 'text';
			else if (lower.includes('background') || lower.includes('bg')) target = 'background';
			else if (lower.includes('border')) target = 'border';

			setConversationContext(null);
			setMessages(prev => [...prev, { role: 'user', content: rawMessage }]);
			if (target) {
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: `Choose a colour for the ${getColorTargetLabel(target)}:`,
						options: true,
						optionsType: 'palette',
						colorTarget: target,
						executed: false,
					},
				]);
			} else {
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: 'Please select one of the options: Text colour, Background colour, or Border colour.',
						options: ['Text colour', 'Background colour', 'Border colour'],
						optionsType: 'text',
						executed: false,
					},
				]);
				setConversationContext({ type: 'color_what' });
			}
			setIsLoading(false);
			return;
		}

		const currentScope = scope === 'global' ? 'global' : (conversationContext?.mode || scope);

		// Selection scope guard
		if (currentScope === 'selection' && !selectedBlock) {
			const selectionRecovery = buildRecoveryResponse('no_selection', { originalMessage: rawMessage });
			setConversationContext(selectionRecovery.recoveryCtx);
			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: selectionRecovery.content,
					options: selectionRecovery.options,
					executed: false,
					testId: 'maxi-ai-selection-required',
				},
			]);
			return;
		}

		setIsLoading(true);

		const queueDirectAction = directAction => {
			setIsLoading(true);
			setTimeout(async () => {
				logAIDebug('Queue direct action', directAction);
				const result = await parseAndExecuteAction(directAction);
				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: result.message, executed: result.executed },
				]);
				setIsLoading(false);
			}, 50);
		};

		// ── Cloud-icon async handler ──────────────────────────────────────────
		const handleCloudIconSearch = async ({
			rawMessage: iconMsg,
			lowerMessage: lower,
			currentScope: iconScope,
			selectedBlock: iconBlock,
			iconBlocksInScope,
			buttonBlocksInScope,
			wantsMultipleIcons,
			matchTitlesToIconsIntent,
			matchTitlesIntent,
			shouldTreatAsIconTheme,
			hasIconBlocksInScope,
			cloudIconTarget,
		}) => {
			const selectedName = iconBlock?.name || '';
			const formatList = items =>
				items.length > 3
					? `${items.slice(0, 3).join(', ')} and ${items.length - 3} more`
					: items.join(', ');

			const styleIntent = extractIconStyleIntent(iconMsg);
			const styleLabel = styleIntent
				? styleIntent === 'line' ? 'line' : styleIntent === 'shape' ? 'shape' : 'filled'
				: '';
			const messageForQuery = styleIntent ? stripIconStylePhrases(iconMsg) : iconMsg;
			const explicitQueries = extractIconQueries(messageForQuery);
			const hasExplicitList = explicitQueries.length > 1;
			const searchQuery = extractIconQuery(messageForQuery);

			if (matchTitlesToIconsIntent) {
				if (!hasIconBlocksInScope || iconBlocksInScope.length === 0) {
					setMessages(prev => [
						...prev,
						{ role: 'assistant', content: iconScope === 'selection' ? 'No icon blocks found in the selection.' : 'No icon blocks found on this page.', executed: false },
					]);
					setIsLoading(false);
					return;
				}

				const updates = [];
				const missingIconLabels = [];
				const missingTextTargets = [];
				const processedTextBlocks = new Set();

				iconBlocksInScope.forEach((iconBlock2, index) => {
					const iconLabel = getIconLabelFromBlock(iconBlock2);
					if (!iconLabel) { missingIconLabels.push(`icon ${index + 1}`); return; }
					const groupRoot = findGroupRootForIconBlock(iconBlock2);
					const groupTextBlocks = groupRoot
						? collectBlocks(groupRoot.innerBlocks || [], block => isLabelBlock(block?.name))
						: [];
					if (groupTextBlocks.length === 0) { missingTextTargets.push(iconLabel); return; }
					let bodyIndex = 0;
					groupTextBlocks.forEach(textBlock => {
						if (processedTextBlocks.has(textBlock.clientId)) return;
						const nextText = buildIconRelatedText(iconLabel, textBlock, bodyIndex);
						const changes = buildTextContentChange(textBlock, nextText);
						if (changes) { updates.push({ block: textBlock, changes }); processedTextBlocks.add(textBlock.clientId); }
						if (!isHeadingTextBlock(textBlock)) bodyIndex += 1;
					});
				});

				if (updates.length === 0) {
					let message = 'I could not match titles to the icons.';
					if (missingIconLabels.length) message += ` Missing icon labels for ${formatList(missingIconLabels)}.`;
					if (missingTextTargets.length) message += ` Missing text blocks for: ${formatList(missingTextTargets)}.`;
					setMessages(prev => [...prev, { role: 'assistant', content: message, executed: false }]);
					setIsLoading(false);
					return;
				}

				registry.batch(() => { updates.forEach(({ block, changes }) => updateBlockAttributes(block.clientId, changes)); });
				let message = iconScope === 'selection' ? `Updated ${updates.length} text blocks to match the icons.` : `Updated ${updates.length} text blocks on the page to match the icons.`;
				if (missingIconLabels.length) message += ` Missing icon labels for ${formatList(missingIconLabels)}.`;
				if (missingTextTargets.length) message += ` Missing text blocks for: ${formatList(missingTextTargets)}.`;
				setMessages(prev => [...prev, { role: 'assistant', content: message, executed: true }]);
				setIsLoading(false);
				return;
			}

			if (matchTitlesIntent) {
				if (!hasIconBlocksInScope || iconBlocksInScope.length === 0) {
					setMessages(prev => [
						...prev,
						{ role: 'assistant', content: iconScope === 'selection' ? 'No icon blocks found in the selection.' : 'No icon blocks found on this page.', executed: false },
					]);
					setIsLoading(false);
					return;
				}

				const labeledBlocks = [];
				const missingLabels = [];
				iconBlocksInScope.forEach((block, index) => {
					const label = findLabelForIconBlock(block);
					if (label) labeledBlocks.push({ block, label });
					else missingLabels.push(`icon ${index + 1}`);
				});

				if (labeledBlocks.length === 0) {
					let message = 'I could not find any text labels below the icons. Make sure each icon has a text or heading block beneath it.';
					if (missingLabels.length) message += ` Missing labels for ${formatList(missingLabels)}.`;
					setMessages(prev => [...prev, { role: 'assistant', content: message, executed: false }]);
					setIsLoading(false);
					return;
				}

				const results = await Promise.all(
					labeledBlocks.map(item =>
						findBestIcon(item.label, { target: 'svg', requireStrongMatch: true, style: styleIntent, requireStyleMatch: Boolean(styleIntent) })
					)
				);

				const updates = [];
				const missingMatches = [];
				const proOnly = [];
				const missingStyles = [];
				results.forEach((result, index) => {
					const { block, label } = labeledBlocks[index];
					if (!result || !result.svgCode || result.noStrongMatch) { missingMatches.push(label); return; }
					if (result.noStyleMatch) { missingStyles.push(label); return; }
					if (result.isPro) { proOnly.push(label); return; }
					updates.push({ block, result, label });
				});

				if (updates.length === 0) {
					let message = 'I could not find matching icons for the titles below in the Cloud Library.';
					if (missingLabels.length) message += ` Missing labels for ${formatList(missingLabels)}.`;
					if (missingMatches.length) message += ` No matches for: ${formatList(missingMatches)}.`;
					if (missingStyles.length) message += ` No ${styleLabel} icons for: ${formatList(missingStyles)}.`;
					if (proOnly.length) message += ` Pro only: ${formatList(proOnly)}.`;
					setMessages(prev => [...prev, { role: 'assistant', content: message, executed: false }]);
					setIsLoading(false);
					return;
				}

				let updatedCount = 0;
				registry.batch(() => {
					updates.forEach(({ block, result, label }) => {
						const blockHandler = getAiHandlerForBlock(block);
						if (!blockHandler) return;
						const prefix = getBlockPrefix(block.name);
						const handlerResult = blockHandler(block, 'icon_svg', { svgCode: result.svgCode, svgType: result.svgType, title: result.title || label }, prefix, { mode: iconScope });
						let changes = null;
						if (handlerResult?.action === 'apply') changes = handlerResult.attributes;
						else if (handlerResult && !handlerResult.action) changes = handlerResult;
						if (changes) { updateBlockAttributes(block.clientId, changes); updatedCount += 1; }
					});
				});

				let message = iconScope === 'selection' ? `Updated ${updatedCount} icons to match the titles below.` : `Updated ${updatedCount} icons on the page to match the titles below.`;
				if (missingLabels.length) message += ` Missing labels for ${formatList(missingLabels)}.`;
				if (missingMatches.length) message += ` No matches for: ${formatList(missingMatches)}.`;
				if (missingStyles.length) message += ` No ${styleLabel} icons for: ${formatList(missingStyles)}.`;
				if (proOnly.length) message += ` Pro only: ${formatList(proOnly)}.`;
				setMessages(prev => [...prev, { role: 'assistant', content: message, executed: true }]);
				setIsLoading(false);
				return;
			}

			if (!searchQuery && !hasExplicitList) {
				setMessages(prev => [...prev, { role: 'assistant', content: 'Which icon should I search for in the Cloud Library?', executed: false }]);
				setIsLoading(false);
				return;
			}

			const wantsDifferent = /\b(different|another|alternative|new|other)\b/.test(lower);
			let targetMeta = cloudIconTarget;
			if (shouldTreatAsIconTheme && hasIconBlocksInScope && !selectedName.includes('button')) {
				targetMeta = { targetBlock: 'icon', property: 'icon_svg', svgTarget: 'svg' };
			}

			const isButtonTarget = targetMeta.targetBlock === 'button';
			const isIconTarget = targetMeta.targetBlock === 'icon';
			const currentSvg = isButtonTarget ? iconBlock?.attributes?.['icon-content'] : iconBlock?.attributes?.content;
			const excludeSvgCodes = wantsDifferent && currentSvg ? [currentSvg] : [];
			const isMultiIconRequest = wantsMultipleIcons || hasExplicitList;
			const targetBlocks = isMultiIconRequest ? (isButtonTarget ? buttonBlocksInScope : iconBlocksInScope) : [];

			if (iconScope === 'selection' && !isMultiIconRequest) {
				const mismatch =
					(isButtonTarget && !selectedName.includes('button')) ||
					(isIconTarget && !selectedName.includes('icon'));
				if (mismatch) {
					setMessages(prev => [
						...prev,
						{ role: 'assistant', content: isButtonTarget ? 'Please select a button block to change its icon.' : 'Please select an Icon block to change its icon.', executed: false },
					]);
					setIsLoading(false);
					return;
				}
			}

			if (isMultiIconRequest && targetBlocks.length === 0) {
				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: iconScope === 'selection' ? 'No icon blocks found in the selection.' : 'No icon blocks found on this page.', executed: false },
				]);
				setIsLoading(false);
				return;
			}

			if (hasExplicitList && isMultiIconRequest && targetBlocks.length > 1) {
				const maxQueries = Math.min(12, explicitQueries.length);
				const queryList = explicitQueries.slice(0, maxQueries);
				const results = await Promise.all(queryList.map(query => findBestIcon(query, { target: targetMeta.svgTarget, requireStrongMatch: true, style: styleIntent, requireStyleMatch: Boolean(styleIntent) })));

				const usable = [];
				const missing = [];
				const proOnly = [];
				const missingStyles = [];
				results.forEach((result, index) => {
					const query = queryList[index];
					if (!result || !result.svgCode || result.noStrongMatch) { missing.push(query); return; }
					if (result.noStyleMatch) { missingStyles.push(query); return; }
					if (result.isPro) { proOnly.push(query); return; }
					usable.push({ title: result.title, svgCode: result.svgCode, svgType: result.svgType });
				});

				const normalizeSvgCode = value => String(value || '').replace(/\s+/g, ' ').trim();
				const uniqueUsable = [];
				const seenSvg = new Set();
				for (const item of usable) {
					const key = normalizeSvgCode(item.svgCode);
					if (!key || seenSvg.has(key)) continue;
					seenSvg.add(key);
					uniqueUsable.push(item);
				}

				if (uniqueUsable.length < 2) {
					setMessages(prev => [...prev, { role: 'assistant', content: 'I could only find one matching icon for that list. Try different keywords.', executed: false }]);
					setIsLoading(false);
					return;
				}

				let updatedCount = 0;
				registry.batch(() => {
					targetBlocks.forEach((block, index) => {
						const choice = uniqueUsable[index % uniqueUsable.length];
						const blockHandler = getAiHandlerForBlock(block);
						if (!blockHandler) return;
						const prefix = getBlockPrefix(block.name);
						const result = blockHandler(block, targetMeta.property, { svgCode: choice.svgCode, svgType: choice.svgType, title: choice.title }, prefix, { mode: iconScope });
						let changes = null;
						if (result?.action === 'apply') changes = result.attributes;
						else if (result && !result.action) changes = result;
						if (changes) { updateBlockAttributes(block.clientId, changes); updatedCount += 1; }
					});
				});

				let message = iconScope === 'selection' ? `Updated ${updatedCount} icons using the requested list.` : `Updated ${updatedCount} icons on the page using the requested list.`;
				if (missing.length) message += ` Missing: ${formatList(missing)}.`;
				if (missingStyles.length) message += ` No ${styleLabel} icons for: ${formatList(missingStyles)}.`;
				if (proOnly.length) message += ` Pro only: ${formatList(proOnly)}.`;
				setMessages(prev => [...prev, { role: 'assistant', content: message, executed: true }]);
				setIsLoading(false);
				return;
			}

			if (isMultiIconRequest && targetBlocks.length > 1) {
				const candidateLimit = Math.min(24, Math.max(12, targetBlocks.length * 3));
				const candidateResult = await findIconCandidates(searchQuery, { target: targetMeta.svgTarget, limit: candidateLimit, style: styleIntent, requireStyleMatch: Boolean(styleIntent) });

				if (candidateResult?.noStyleMatch) { setMessages(prev => [...prev, { role: 'assistant', content: `I couldn't find ${styleLabel} icons for "${searchQuery}" in the Cloud Library. Try a different keyword.`, executed: false }]); setIsLoading(false); return; }
				if (candidateResult?.hasOnlyPro) { setMessages(prev => [...prev, { role: 'assistant', content: `Found icons for "${searchQuery}" but they are Pro. Upgrade to MaxiBlocks Pro to use them.`, executed: false }]); setIsLoading(false); return; }
				if (!candidateResult?.icons || candidateResult.icons.length === 0) { setMessages(prev => [...prev, { role: 'assistant', content: `I couldn't find icons for "${searchQuery}" in the Cloud Library. Try a different keyword.`, executed: false }]); setIsLoading(false); return; }
				if (candidateResult.icons.length <= 1) { setMessages(prev => [...prev, { role: 'assistant', content: `I only found one icon for "${searchQuery}" in the Cloud Library.`, executed: false }]); setIsLoading(false); return; }

				let updatedCount = 0;
				registry.batch(() => {
					targetBlocks.forEach((block, index) => {
						const choice = candidateResult.icons[index % candidateResult.icons.length];
						const blockHandler = getAiHandlerForBlock(block);
						if (!blockHandler) return;
						const prefix = getBlockPrefix(block.name);
						const result = blockHandler(block, targetMeta.property, { svgCode: choice.svgCode, svgType: choice.svgType, title: choice.title }, prefix, { mode: iconScope });
						let changes = null;
						if (result?.action === 'apply') changes = result.attributes;
						else if (result && !result.action) changes = result;
						if (changes) { updateBlockAttributes(block.clientId, changes); updatedCount += 1; }
					});
				});
				setMessages(prev => [...prev, { role: 'assistant', content: iconScope === 'selection' ? `Updated ${updatedCount} icons with "${searchQuery}" variations.` : `Updated ${updatedCount} icons on the page with "${searchQuery}" variations.`, executed: true }]);
				setIsLoading(false);
				return;
			}

			const fallbackQuery = hasExplicitList && explicitQueries.length > 0 ? explicitQueries[0] : searchQuery;
			const iconResult = await findBestIcon(fallbackQuery, { target: targetMeta.svgTarget, excludeSvgCodes, preferDifferent: wantsDifferent && excludeSvgCodes.length > 0, style: styleIntent, requireStyleMatch: Boolean(styleIntent) });

			if (iconResult?.noStyleMatch) { setMessages(prev => [...prev, { role: 'assistant', content: `I couldn't find ${styleLabel} icons for "${fallbackQuery}" in the Cloud Library. Try a different keyword.`, executed: false }]); setIsLoading(false); return; }
			if (wantsDifferent && (iconResult?.noAlternative || iconResult?.total === 1)) { setMessages(prev => [...prev, { role: 'assistant', content: `I only found one icon for "${fallbackQuery}" in the Cloud Library.`, executed: false }]); setIsLoading(false); return; }
			if (!iconResult || !iconResult.svgCode) { setMessages(prev => [...prev, { role: 'assistant', content: `I couldn't find an icon for "${fallbackQuery}" in the Cloud Library. Try a different keyword.`, executed: false }]); setIsLoading(false); return; }
			if (iconResult.isPro) { setMessages(prev => [...prev, { role: 'assistant', content: `Found "${iconResult.title}" but it's a Pro icon. Upgrade to MaxiBlocks Pro to use it.`, executed: false }]); setIsLoading(false); return; }

			const directIconAction = {
				action: iconScope === 'selection' ? 'update_selection' : 'update_page',
				property: targetMeta.property,
				value: { svgCode: iconResult.svgCode, svgType: iconResult.svgType, title: iconResult.title },
				target_block: targetMeta.targetBlock,
				message: iconScope === 'selection' ? `Updated icon to "${iconResult.title}".` : `Updated ${isIconTarget ? 'icon blocks' : 'button icons'} to "${iconResult.title}".`,
			};
			const iconActionResult = await parseAndExecuteAction(directIconAction);
			setMessages(prev => [...prev, { role: 'assistant', content: iconActionResult.message, executed: iconActionResult.executed }]);
			setIsLoading(false);
		};

		// ── Pattern / create-block handler ───────────────────────────────────
		const handleCreateBlock = async ({ rawMessage: patternMsg, targetClientId }) => {
			try {
				const searchQuery = extractPatternQuery(patternMsg);
				const patternResult = await findBestPattern(searchQuery);

				if (!patternResult) {
					setMessages(prev => [...prev, { role: 'assistant', content: `I couldn't find a pattern for "${searchQuery}" in the Cloud Library. Try browsing the Cloud Library manually or use different keywords.`, executed: false }]);
					setIsLoading(false);
					return;
				}
				if (patternResult.isPro) {
					setMessages(prev => [...prev, { role: 'assistant', content: `Found "${patternResult.title}" but it's a Pro pattern. Upgrade to MaxiBlocks Pro to use it!`, executed: false }]);
					setIsLoading(false);
					return;
				}
				if (targetClientId && patternResult.gutenbergCode) {
					await onRequestInsertPattern(patternResult.gutenbergCode, false, true, targetClientId);
					setMessages(prev => [...prev, { role: 'assistant', content: ` Created "${patternResult.title}"! The pattern has been inserted.`, executed: true }]);
				} else {
					setMessages(prev => [...prev, { role: 'assistant', content: `Found "${patternResult.title}" but please select a block first to replace with this pattern.`, executed: false }]);
				}
			} catch (error) {
				console.error('[Maxi AI] Pattern insert error:', error);
				setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error creating the pattern. Please try again.', executed: false }]);
			}
			setIsLoading(false);
		};

		// ── Route via client-side router ─────────────────────────────────────
		const routingCtx = buildRoutingContext(rawMessage, { currentScope, selectedBlock, messagesRef, allBlocks });
		const routeResult = await routeClientSide(rawMessage, routingCtx, select);

		switch (routeResult.type) {
			case 'action':
				queueDirectAction(routeResult.payload);
				return;
			case 'clarify':
				setMessages(prev => [...prev, routeResult.message]);
				setIsLoading(false);
				return;
			case 'flow':
				if (routeResult.sidebarProperty) openSidebarForProperty(routeResult.sidebarProperty);
				setConversationContext(routeResult.flowContext);
				setMessages(prev => [...prev, routeResult.message]);
				setIsLoading(false);
				return;
			case 'immediate_updates':
				registry.batch(() => {
					routeResult.updates.forEach(({ clientId, attributes }) => updateBlockAttributes(clientId, attributes));
				});
				if (routeResult.sidebarProperty) openSidebarForProperty(routeResult.sidebarProperty);
				setMessages(prev => [...prev, routeResult.message]);
				setIsLoading(false);
				return;
			case 'cloud_icon': {
				const statusMsg = routeResult.params.matchTitlesToIconsIntent ? 'Matching text to icons...' : 'Searching Cloud Library for icons...';
				setMessages(prev => [...prev, { role: 'assistant', content: statusMsg }]);
				setTimeout(async () => {
					try {
						await handleCloudIconSearch(routeResult.params);
					} catch (err) {
						console.error('[Maxi AI] Cloud icon error:', err);
						setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error searching the Cloud Library for icons.', executed: false }]);
						setIsLoading(false);
					}
				}, 100);
				return;
			}
			case 'insert_block': {
				const lowerInsert = rawMessage.toLowerCase();
				const insertHasCloud = lowerInsert.includes('cloud') || lowerInsert.includes('library') || lowerInsert.includes('browse');
				const insertHasSidebar = lowerInsert.includes('sidebar');
				const insertHasHero = lowerInsert.includes('hero') || lowerInsert.includes('full-width') || lowerInsert.includes('full width');
				const insertColMatch = lowerInsert.match(/(\d+)\s*(?:equal\s+)?col/);
				const insertNumCols = insertColMatch ? Math.min(parseInt(insertColMatch[1]), 6) : 0;

				if (insertHasCloud || insertHasSidebar || insertHasHero || insertNumCols > 1) {
					if (insertHasCloud) {
						await runCloudLibraryIntent(rawMessage);
						setMessages(prev => [...prev, { role: 'assistant', content: `Added ${rawMessage}.`, executed: true }]);
						setIsLoading(false);
					} else {
						const contentAreaId = getContentAreaClientId();
						setTimeout(() => {
							let rootBlock;
							if (insertHasSidebar) {
								const row = createBlock('maxi-blocks/row-maxi');
								rootBlock = createBlock('maxi-blocks/container-maxi', {}, [row]);
								dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
								setTimeout(() => loadColumnsTemplate('1-3', row.clientId, 'general', 2), 100);
							} else if (insertHasHero) {
								rootBlock = createBlock('maxi-blocks/container-maxi', { 'full-width-general': true });
								dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
							} else {
								const templateName = getTemplates(true, 'general', insertNumCols).find(t => !t.isMoreThanEightColumns)?.name || `${insertNumCols} columns`;
								const row = createBlock('maxi-blocks/row-maxi');
								rootBlock = createBlock('maxi-blocks/container-maxi', {}, [row]);
								dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
								setTimeout(() => loadColumnsTemplate(templateName, row.clientId, 'general', insertNumCols), 100);
							}
							setMessages(prev => [...prev, { role: 'assistant', content: `Added ${rawMessage}.`, executed: true }]);
							setIsLoading(false);
						}, 50);
					}
					return;
				}

				setConversationContext({ type: 'insert_block', blockType: routeResult.params.blockType });
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: 'What layout would you like?',
						options: ['Single container', '2 equal columns', '3 equal columns', '4 equal columns', 'Sidebar (1/3 + 2/3)', 'Full-width hero', 'Browse Cloud Library'],
					},
				]);
				setIsLoading(false);
				return;
			}
			case 'create_block':
				setMessages(prev => [...prev, { role: 'assistant', content: 'Searching Cloud Library...' }]);
				setTimeout(async () => { await handleCreateBlock(routeResult.params); }, 100);
				return;
			case 'open_cloud_library': {
				const cloudMsg = routeResult.params?.rawMessage ?? rawMessage;
				try {
					await runCloudLibraryIntent(cloudMsg);
				} catch (openCloudErr) {
					console.error('[Maxi AI] Open Cloud Library error:', String(openCloudErr?.message || openCloudErr));
					setMessages(prev => [...prev, { role: 'assistant', content: __('Could not open the Cloud Library. Use the Cloud Library button in the Maxi toolbar.', 'maxi-blocks'), executed: false }]);
				}
				setIsLoading(false);
				return;
			}
			case 'sc_action': {
				const { action: scAction, name } = routeResult.params;

				const findSCKey = searchName => {
					if (!allStyleCards || !searchName) return null;
					const want = searchName.toLowerCase().trim();
					for (const [key, card] of Object.entries(allStyleCards)) {
						if ((card.name || '').toLowerCase() === want) return key;
					}
					for (const [key, card] of Object.entries(allStyleCards)) {
						if ((card.name || '').toLowerCase().includes(want)) return key;
					}
					return null;
				};
				const addMsg = content => setMessages(prev => [...prev, { role: 'assistant', content }]);

				if (scAction === 'current') {
					let cardName = null;
					if (allStyleCards) {
						for (const [key, card] of Object.entries(allStyleCards)) {
							if (card.status === 'active') { cardName = card.name || key; break; }
						}
					}
					if (!cardName) {
						cardName = activeStyleCard?.value?.name || allStyleCards?.[activeStyleCard?.key]?.value?.name || activeStyleCard?.key;
					}
					addMsg(cardName ? `Active Style Card: **${cardName}**` : __('No active Style Card found.', 'maxi-blocks'));
					setIsLoading(false);
					return;
				}
				if (scAction === 'reset') {
					addMsg(__('Resetting Style Cards to defaults…', 'maxi-blocks'));
					setTimeout(() => { resetSC?.(); setIsLoading(false); }, 100);
					return;
				}
				if (scAction === 'activate') {
					const key = findSCKey(name);
					if (!key) { addMsg(`Style Card "${name}" not found. Use "show me style cards" to see what's available.`); setIsLoading(false); return; }
					const cardName = allStyleCards[key]?.name || name;
					addMsg(`Activating **${cardName}**…`);
					setTimeout(() => {
						const freshCards = select('maxiBlocks/style-cards')?.receiveMaxiStyleCards() || allStyleCards;
						const newCollection = getNewActiveStyleCards(freshCards, key);
						saveMaxiStyleCards?.(newCollection, true);
						updateSCOnEditor(newCollection[key]);
						saveSCStyles?.(true);
						setIsLoading(false);
					}, 100);
					return;
				}
				if (scAction === 'delete') {
					const key = findSCKey(name);
					if (!key) { addMsg(`Style Card "${name}" not found.`); setIsLoading(false); return; }
					if (key === 'sc_maxi') { addMsg('The default Maxi Style Card cannot be deleted.'); setIsLoading(false); return; }
					const cardName = allStyleCards[key]?.name || name;
					addMsg(`Deleting **${cardName}**…`);
					setTimeout(() => { removeStyleCard?.(key); setIsLoading(false); }, 100);
					return;
				}
				if (scAction === 'edit') {
					if (name) {
						const key = findSCKey(name);
						if (key) setSelectedStyleCard?.(key);
						else addMsg(`Style Card "${name}" not found — opening editor with current card.`);
					}
					addMsg(__('Opening Style Cards editor…', 'maxi-blocks'));
					setTimeout(async () => { await openCloudSCLibrary({ showLocalOnly: true }); setIsLoading(false); }, 100);
					return;
				}
				setIsLoading(false);
				return;
			}
			case 'browse_cloud_sc': {
				const { query, category, importFirst, showLocalOnly } = routeResult.params;
				let hint;
				if (showLocalOnly) hint = __('Opening Style Cards…', 'maxi-blocks');
				else if (category && query) hint = `Searching for ${query} style cards in the "${category}" category…`;
				else if (category) hint = `Opening Style Cards cloud library — filtering by "${category}"…`;
				else if (query) hint = `Searching for "${query}" in the Style Cards cloud library…`;
				else hint = __('Opening Style Cards cloud library…', 'maxi-blocks');
				setMessages(prev => [...prev, { role: 'assistant', content: hint }]);
				setTimeout(async () => {
					try {
						const opened = await openCloudSCLibrary({ query, category, importFirst, showLocalOnly });
						if (!opened) {
							setMessages(prev => [...prev, { role: 'assistant', content: __('Could not open the Style Cards library automatically. Click "Browse style cards" inside the Style Cards panel.', 'maxi-blocks'), executed: false }]);
						}
					} catch (scBrowseErr) {
						console.error('[Maxi AI] Browse Cloud SC error:', String(scBrowseErr?.message || scBrowseErr));
					}
					setIsLoading(false);
				}, 100);
				return;
			}
			case 'passthrough':
			default:
				break;
		}

		// Passthrough to LLM API
		setIsLoading(true);
		try {
			const context = buildPassthroughLlmContext({ scope, selectedBlock, activeStyleCard, logDebug: logAIDebug });
			const blockPrompt = scope === 'selection' && selectedBlock ? getAiPromptForBlockName(selectedBlock.name) : '';
			const wantsInteractionBuilder = isInteractionBuilderMessage(rawMessage.toLowerCase());
			const scopePrompt = scope === 'global' ? STYLE_CARD_MAXI_PROMPT : wantsInteractionBuilder ? INTERACTION_BUILDER_PROMPT : blockPrompt;
			const sharedPrompts = scope === 'global' ? [] : wantsInteractionBuilder ? [] : [ADVANCED_CSS_PROMPT, META_MAXI_PROMPT, INTERACTION_BUILDER_PROMPT].filter(Boolean);
			const systemPrompt = [SYSTEM_PROMPT, scopePrompt, ...sharedPrompts].filter(Boolean).join('\n\n');

			const { executed, message, options, optionsType } = await executePassthroughLlmTurn({
				messages,
				rawMessage,
				userMessage,
				scope,
				systemPrompt,
				context,
				selectedBlock,
				getSkillContextForBlock,
				parseAndExecuteAction,
				logDebug: logAIDebug,
			});

			setMessages(prev => [...prev, { role: 'assistant', content: message, options, optionsType, executed }]);
		} catch (error) {
			console.error('AI Chat error:', error);
			const rawError = String(error?.message || '');
			let parsedError = null;
			if (rawError.trim().startsWith('{')) {
				try { parsedError = JSON.parse(rawError); } catch {}
			}
			const errorCode = parsedError?.code;
			const errorText = parsedError?.message || rawError;
			let errorMessage = __('Error: I could not match that request to a supported prompt. Try rephrasing or update the prompt mapping.', 'maxi-blocks');
			if (errorCode === 'no_api_key' || /OpenAI API key/i.test(errorText)) {
				errorMessage = __('Error: AI API key not found. Please check your AI settings or reload the editor and try again.', 'maxi-blocks');
			} else if (errorCode === 'unsupported_provider') {
				errorMessage = __('Error: Unsupported AI provider configured.', 'maxi-blocks');
			} else if (errorCode === 'openai_api_error') {
				errorMessage = __('Error: The AI provider returned an error. Check your API key, model, or quota.', 'maxi-blocks');
			} else if (errorCode === 'invalid_messages' || errorCode === 'invalid_prompt') {
				errorMessage = __('Error: The AI request payload was invalid. Try rephrasing or check prompt mappings.', 'maxi-blocks');
			} else if (errorText) {
				if (errorText.includes('<') && errorText.includes('>')) {
					errorMessage = __('Server Error: Received HTML instead of JSON. Check server logs.', 'maxi-blocks');
				} else if (errorText.length < 150) {
					errorMessage = `Error: ${errorText}`;
				}
			}
			setMessages(prev => [...prev, { role: 'assistant', content: errorMessage, isError: true }]);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Submits the message when the user presses Enter (without Shift).
	 *
	 * @param {KeyboardEvent} e
	 */
	const handleKeyDown = e => {
		if (e.key !== 'Enter' || e.shiftKey) return;
		e.preventDefault();
		e.stopPropagation();
		if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
		if (isLoading) return;
		if (!String(input || '').trim()) return;
		void sendMessage();
	};

	/**
	 * Handles option chip clicks and typed suggestions.
	 *
	 * @param {string} suggestion
	 * @returns {Promise<void>}
	 */
	const handleSuggestion = async suggestion => {
		// Recovery context chip
		if (conversationContext?.type === 'recovery') {
			setIsLoading(true);
			await handleRecoveryChoice(suggestion);
			return;
		}

		// insert_block layout picker chip
		if (conversationContext?.type === 'insert_block') {
			const lower = suggestion.toLowerCase();
			setConversationContext(null);
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setIsLoading(true);
			const contentAreaId = getContentAreaClientId();
			if (lower.includes('cloud') || lower.includes('library') || lower.includes('browse')) {
				try {
					await runCloudLibraryIntent(suggestion);
				} catch (browseCloudErr) {
					console.error('[Maxi AI] Browse Cloud from layout picker:', String(browseCloudErr?.message || browseCloudErr));
					setMessages(prev => [...prev, { role: 'assistant', content: __('Could not open the Cloud Library. Use the toolbar Cloud button.', 'maxi-blocks'), executed: false }]);
				}
				setIsLoading(false);
				return;
			} else if (lower.includes('sidebar')) {
				const row = createBlock('maxi-blocks/row-maxi');
				const rootBlock = createBlock('maxi-blocks/container-maxi', {}, [row]);
				dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
				loadColumnsTemplate('1-3', row.clientId, 'general', 2);
			} else if (lower.includes('hero') || lower.includes('full-width') || lower.includes('full width')) {
				const rootBlock = createBlock('maxi-blocks/container-maxi', { 'full-width-general': true });
				dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
			} else {
				const colMatch = lower.match(/(\d+)/);
				const numCols = colMatch ? Math.min(parseInt(colMatch[1]), 6) : 1;
				if (numCols > 1) {
					const templateName = getTemplates(true, 'general', numCols).find(t => !t.isMoreThanEightColumns)?.name || `${numCols} columns`;
					const row = createBlock('maxi-blocks/row-maxi');
					const rootBlock = createBlock('maxi-blocks/container-maxi', {}, [row]);
					dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
					loadColumnsTemplate(templateName, row.clientId, 'general', numCols);
				} else {
					const rootBlock = createBlock('maxi-blocks/container-maxi');
					dispatch('core/block-editor').insertBlocks(rootBlock, undefined, contentAreaId);
				}
			}
			setMessages(prev => [...prev, { role: 'assistant', content: `Added ${suggestion}.`, executed: true }]);
			setIsLoading(false);
			return;
		}

		// color_what clarification chip
		if (conversationContext?.type === 'color_what') {
			const lower = suggestion.toLowerCase();
			let target;
			if (lower.includes('text') || lower.includes('font') || lower.includes('label')) target = 'text';
			else if (lower.includes('background') || lower.includes('bg')) target = 'background';
			else if (lower.includes('border')) target = 'border';

			setConversationContext(null);
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			if (target) {
				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: `Choose a colour for the ${getColorTargetLabel(target)}:`, options: true, optionsType: 'palette', colorTarget: target, executed: false },
				]);
			} else {
				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: 'Please select one of the options: Text colour, Background colour, or Border colour.', options: ['Text colour', 'Background colour', 'Border colour'], optionsType: 'text', executed: false },
				]);
				setConversationContext({ type: 'color_what' });
			}
			setIsLoading(false);
			return;
		}

		// Active conversation flow
		if (conversationContext) {
			let value = suggestion;
			if (typeof suggestion === 'string' && suggestion.startsWith('Color ')) {
				const num = parseInt(suggestion.replace('Color ', ''));
				if (!isNaN(num)) value = num;
			} else if (conversationContext.currentOptions && conversationContext.currentOptions.length > 0) {
				const match = conversationContext.currentOptions.find(o => (typeof o === 'object' && o.label) ? o.label === suggestion : o === suggestion);
				if (match && typeof match === 'object' && match.value !== undefined) value = match.value;
			}

			const updatedData = { ...conversationContext.data, [conversationContext.pendingTarget]: value };
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setIsLoading(true);
			setConversationContext(prev => ({ ...prev, data: updatedData }));

			const targetIds = conversationContext.blockIds || [];
			if (targetIds.length === 0 && selectedBlock) targetIds.push(selectedBlock.clientId);

			const freshBlocks = select('core/block-editor').getBlocks();
			const fullBlocks = collectBlocks(freshBlocks, b => targetIds.includes(b.clientId));
			if (fullBlocks.length === 0 && selectedBlock && targetIds.includes(selectedBlock.clientId)) fullBlocks.push(selectedBlock);

			if (fullBlocks.length === 0) {
				const recovery = buildRecoveryResponse('lost_blocks', { originalMessage: suggestion });
				setConversationContext(recovery.recoveryCtx);
				setMessages(prev => [...prev, { role: 'assistant', content: recovery.content, options: recovery.options, executed: false }]);
				setIsLoading(false);
				return;
			}

			let nextStepResponse = null;
			let finalMsg = 'Done.';
			let isUnchanged = true;
			const primaryBlock = fullBlocks[0];
			const prefix = getBlockPrefix(primaryBlock.name);
			const flowHandler = getAiHandlerForBlock(primaryBlock);
			const logicResult = flowHandler ? flowHandler(primaryBlock, conversationContext.flow, null, prefix, updatedData) : null;

			if (logicResult) {
				if (logicResult.action === 'ask_options' || logicResult.action === 'ask_palette') {
					nextStepResponse = logicResult;
				} else if (logicResult.action === 'apply') {
					fullBlocks.forEach(blk => {
						const p = getBlockPrefix(blk.name);
						const blockHandler = getAiHandlerForBlock(blk);
						const res = blockHandler ? blockHandler(blk, conversationContext.flow, null, p, updatedData) : null;
						if (res && res.action === 'apply' && res.attributes) {
							dispatch('core/block-editor').updateBlockAttributes(blk.clientId, res.attributes);
							isUnchanged = false;
						}
					});
					if (logicResult.done) {
						nextStepResponse = { done: true };
						if (logicResult.message) finalMsg = logicResult.message;
						else {
							const pattern = AI_BLOCK_PATTERNS.find(p => p.property === conversationContext.flow);
							if (pattern && pattern.pageMsg) finalMsg = pattern.pageMsg;
						}
					}
				}
			}

			const sidebarMode = conversationContext.mode;
			const sidebarFlowProperty = conversationContext.flow;
			const sidebarClientId = primaryBlock?.clientId || null;

			setTimeout(() => {
				maybeOpenFlowSidebar({
					flow: sidebarFlowProperty,
					mode: sidebarMode,
					clientId: sidebarClientId,
					selectBlock: clientId => dispatch('core/block-editor').selectBlock(clientId),
					openSidebarForProperty,
				});

				if (nextStepResponse) {
					if (nextStepResponse.done) {
						setConversationContext(null);
						setMessages(prev => [...prev, { role: 'assistant', content: finalMsg, executed: true }]);
					} else {
						setConversationContext(prev => ({ ...prev, pendingTarget: nextStepResponse.target, currentOptions: nextStepResponse.options || [] }));
						setMessages(prev => [
							...prev,
							{
								role: 'assistant',
								content: nextStepResponse.msg,
								options: nextStepResponse.options ? nextStepResponse.options.map(o => o.label || o) : (nextStepResponse.action === 'ask_palette' ? ['palette'] : []),
								optionsType: nextStepResponse.action === 'ask_palette' ? 'palette' : 'text',
								colorTarget: nextStepResponse.target,
								executed: false,
							},
						]);
					}
				} else {
					const recovery = buildRecoveryResponse('flow_error', { originalMessage: suggestion });
					setConversationContext(recovery.recoveryCtx);
					setMessages(prev => [...prev, { role: 'assistant', content: recovery.content, options: recovery.options, executed: false }]);
				}
				setIsLoading(false);
			}, 500);
			return;
		}

		// Standard direct-action routing for chip clicks
		let directAction = null;

		const lastClarificationMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.options);
		const targetContext = lastClarificationMsg?.targetContext;
		const lastClarifyContent =
			typeof lastClarificationMsg?.content === 'string' ? lastClarificationMsg.content.toLowerCase() : '';
		const ratioOptionMatch = typeof suggestion === 'string' ? suggestion.trim().match(/^(\d+)\s*[:/]\s*(\d+)$/) : null;
		const isImageRatioContext =
			lastClarifyContent.includes('image') ||
			lastClarifyContent.includes('images') ||
			selectedBlock?.name?.includes('image') ||
			targetContext === 'image';
		const spacingBase = lastClarificationMsg?.spacingBase;
		const spacingSide = lastClarificationMsg?.spacingSide;
		const spacingPresetValue = { Compact: 60, Comfortable: 100, Spacious: 140 };
		const lastShadowPrompt = lastClarifyContent.includes('shadow');
		const lastShapeDividerMsg = [...messages].reverse().find(m => m.shapeDividerLocation || m.shapeDividerTarget);
		const shapeDividerLocations = ['Top', 'Bottom', 'Both'];
		const shapeDividerStyles = ['Wave', 'Curve', 'Slant', 'Triangle'];
		const spacingPresets = {
			Compact: { desktop: '60px', tablet: '40px', mobile: '20px' },
			Comfortable: { desktop: '100px', tablet: '60px', mobile: '40px' },
			Spacious: { desktop: '140px', tablet: '80px', mobile: '60px' },
		};
		const linkOptionLabels = ['Open in new tab', 'Make it nofollow', 'Both'];
		const lastOptions = Array.isArray(lastClarificationMsg?.options) ? lastClarificationMsg.options : [];
		const isColumnTopBottomClarify =
			(suggestion === 'Top' || suggestion === 'Bottom') &&
			lastClarifyContent &&
			!lastShapeDividerMsg?.shapeDividerLocation &&
			(lastClarifyContent.includes('empty column') ||
				lastClarifyContent.includes('each empty column') ||
				(lastClarifyContent.includes('button') && lastClarifyContent.includes('column')));

		if (isColumnTopBottomClarify) {
			const freshBlocks = select('core/block-editor').getBlocks();
			const emptyColumns = collectBlocks(freshBlocks, b => typeof b.name === 'string' && b.name.includes('column-maxi') && (!b.innerBlocks || b.innerBlocks.length === 0));
			if (emptyColumns.length > 0) {
				directAction = {
					action: 'MODIFY_BLOCK',
					payload: { ops: emptyColumns.map(col => ({ op: 'append_child', parent_clientId: col.clientId, block: { name: 'maxi-blocks/button-maxi', attributes: {}, innerBlocks: [] } })) },
					message: __('Added a button to each empty column.', 'maxi-blocks'),
				};
			}
		}

		const isLinkOptionContext = linkOptionLabels.includes(suggestion) && (lastClarifyContent.includes('link') || lastOptions.some(option => linkOptionLabels.includes(option)));
		if (isLinkOptionContext) {
			const recentMessages = messagesRef.current || [];
			let lastUrl = null;
			for (let i = recentMessages.length - 1; i >= 0; i -= 1) {
				const msg = recentMessages[i];
				if (msg?.role !== 'user' || typeof msg.content !== 'string') continue;
				lastUrl = extractUrl(msg.content);
				if (lastUrl) break;
			}
			if (!lastUrl) lastUrl = selectedBlock?.attributes?.linkSettings?.url || null;
			const opensInNewTab = suggestion === 'Open in new tab' || suggestion === 'Both';
			const noFollow = suggestion === 'Make it nofollow' || suggestion === 'Both';
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			directAction = {
				action: actionType,
				property: 'link_settings',
				value: { ...(lastUrl ? { url: lastUrl } : {}), opensInNewTab, noFollow },
				...(actionType === 'update_page' ? { target_block: 'container' } : {}),
				message: lastUrl ? 'Updated the link options.' : 'Updated link options. Add a URL to activate the link.',
			};
		}

		if (lastShapeDividerMsg?.shapeDividerLocation && shapeDividerLocations.includes(suggestion)) {
			const location = suggestion.toLowerCase();
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setMessages(prev => [...prev, { role: 'assistant', content: 'Which shape style should the divider use?', options: shapeDividerStyles, shapeDividerTarget: location, executed: false }]);
			return;
		}

		if (lastShapeDividerMsg?.shapeDividerTarget && shapeDividerStyles.includes(suggestion)) {
			const target = lastShapeDividerMsg.shapeDividerTarget;
			const property = target === 'top' ? 'shape_divider_top' : target === 'bottom' ? 'shape_divider_bottom' : 'shape_divider_both';
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			const shape = suggestion.toLowerCase();
			const message = target === 'both' ? `Added ${shape} shape dividers to the top and bottom.` : `Added ${shape} shape divider to the ${target}.`;
			directAction = { action: actionType, property, value: shape, target_block: 'container', message };
		}

		if (ratioOptionMatch && (lastClarifyContent.includes('ratio') || lastClarifyContent.includes('aspect')) && isImageRatioContext) {
			const ratioValue = resolveImageRatioValue(ratioOptionMatch[1], ratioOptionMatch[2]);
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			directAction = { action: actionType, property: 'image_ratio', value: ratioValue, target_block: targetContext || 'image', message: `Aspect ratio set to ${ratioOptionMatch[1]}:${ratioOptionMatch[2]}.` };
		} else if (lastShadowPrompt && ['Soft', 'Crisp', 'Bold', 'Glow'].includes(suggestion)) {
			const styleMap = { Soft: { x: 0, y: 10, blur: 30, spread: 0 }, Crisp: { x: 0, y: 2, blur: 4, spread: 0 }, Bold: { x: 0, y: 20, blur: 25, spread: -5 }, Glow: { x: 0, y: 0, blur: 15, spread: 2 } };
			const isVideoTarget = selectedBlock?.name?.includes('video');
			const property = isVideoTarget ? 'video_box_shadow' : 'box_shadow';
			const value = isVideoTarget ? { ...styleMap[suggestion], color: 8 } : styleMap[suggestion];
			const tgt = isVideoTarget ? 'video' : targetContext;
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			directAction = { action: actionType, property, value, target_block: tgt, message: tgt ? `Applied ${suggestion} shadow to all ${tgt}s.` : `Applied ${suggestion} shadow.` };
		} else if (suggestion === 'Remove' && (lastClarifyContent.includes('spacing') || lastClarifyContent.includes('padding') || lastClarifyContent.includes('margin'))) {
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			const base = lastClarifyContent.includes('margin') ? 'margin' : 'padding';
			let property = base;
			if (base === 'padding' && targetContext === 'video') property = 'video_padding';
			directAction = { action: actionType, property, value: 0, ...(targetContext ? { target_block: targetContext } : {}), message: `Removed ${base}.` };
		} else if (suggestion.includes('Subtle (8px)')) {
			directAction = { action: 'update_page', property: 'border_radius', value: 8, target_block: targetContext, message: 'Applied Subtle rounded corners (8px).' };
		} else if (suggestion.includes('Soft (24px)')) {
			directAction = { action: 'update_page', property: 'border_radius', value: 24, target_block: targetContext, message: 'Applied Soft rounded corners (24px).' };
		} else if (suggestion.includes('Full (50px)')) {
			directAction = { action: 'update_page', property: 'border_radius', value: 50, target_block: targetContext, message: 'Applied Full rounded corners (50px).' };
		} else if (spacingSide && spacingBase && ['Compact', 'Comfortable', 'Spacious', 'Remove'].includes(suggestion)) {
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			let property = `${spacingBase}_${spacingSide}`;
			if (spacingBase === 'padding' && targetContext === 'video') property = `video_padding_${spacingSide}`;
			const value = suggestion === 'Remove' ? 0 : spacingPresetValue[suggestion];
			directAction = { action: actionType, property, value, ...(targetContext ? { target_block: targetContext } : {}), message: suggestion === 'Remove' ? `Removed ${spacingSide} ${spacingBase}.` : `Applied ${suggestion} ${spacingSide} ${spacingBase}.` };
		} else if (spacingBase && suggestion === 'Remove') {
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			let property = spacingBase;
			if (spacingBase === 'padding' && targetContext === 'video') property = 'video_padding';
			directAction = { action: actionType, property, value: 0, ...(targetContext ? { target_block: targetContext } : {}), message: `Removed ${spacingBase}.` };
		} else if (targetContext === 'video' && ['Compact', 'Comfortable', 'Spacious'].includes(suggestion)) {
			const presetValue = { Compact: 60, Comfortable: 100, Spacious: 140 }[suggestion];
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			directAction = { action: actionType, property: 'video_padding_vertical', value: presetValue, target_block: 'video', message: scope === 'selection' ? `Applied ${suggestion} top/bottom padding to the selected video.` : `Applied ${suggestion} top/bottom padding to all videos.` };
		} else if (['Compact', 'Comfortable', 'Spacious'].includes(suggestion)) {
			if (scope === 'selection') {
				directAction = { action: 'update_selection', property: 'responsive_padding', value: spacingPresets[suggestion], target_block: targetContext || 'container', message: `Applied ${suggestion} spacing across selected breakpoints.` };
			} else {
				directAction = { action: 'apply_responsive_spacing', preset: suggestion.toLowerCase(), target_block: targetContext || 'container', message: `Applied ${suggestion} spacing across all breakpoints.` };
			}
		} else if (suggestion === 'Brand Glow') {
			directAction = { action: 'update_page', property: 'box_shadow', value: { x: 0, y: 10, blur: 25, spread: -5, color: 'var(--highlight)' }, target_block: targetContext, message: 'Applied Brand Glow (using theme variable).' };
		} else if (suggestion === 'Subtle Border') {
			directAction = { action: 'update_page', property: 'border', value: { width: 1, style: 'solid', color: 'var(--p)' }, target_block: targetContext, message: targetContext ? `Applied Subtle Border to all ${targetContext}s.` : 'Applied Subtle Border.' };
		} else if (suggestion === 'Strong Border') {
			directAction = { action: 'update_page', property: 'border', value: { width: 3, style: 'solid', color: 'var(--h1)' }, target_block: targetContext, message: targetContext ? `Applied Strong Border to all ${targetContext}s.` : 'Applied Strong Border.' };
		} else if (suggestion === 'Brand Border') {
			directAction = { action: 'update_page', property: 'border', value: { width: 2, style: 'solid', color: 'var(--highlight)' }, target_block: targetContext, message: targetContext ? `Applied Brand Border to all ${targetContext}s.` : 'Applied Brand Border.' };
		} else if (suggestion === 'Ghost Button') {
			directAction = { action: 'update_page', property: 'border', value: { width: 2, style: 'solid', color: 'var(--highlight)' }, message: 'Applied Ghost Button style.' };
		} else if (suggestion === 'Yes, show me' || suggestion === 'Display Mobile') {
			directAction = { action: 'switch_viewport', value: 'Mobile', message: 'Switched to mobile view.' };
		} else if (/^Color .+$/.test(suggestion)) {
			const idPart = suggestion.replace('Color ', '');
			let colorValue = null;
			let isPalette = false;
			const paletteNum = parseInt(idPart);
			if (!isNaN(paletteNum) && String(paletteNum) === idPart && paletteNum >= 1 && paletteNum <= 8) {
				colorValue = paletteNum; isPalette = true;
			} else {
				const customColor = customColors.find(c => String(c.id) === idPart);
				if (customColor) colorValue = customColor.value;
				else { console.warn('Maxi AI: Unknown color ID:', idPart); colorValue = 4; isPalette = true; }
			}

			const prevMsg = messagesRef.current?.findLast(m => m.colorTarget);
			if (prevMsg?.colorTarget === 'border' || prevMsg?.colorTarget === 'button-border') {
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, { role: 'assistant', content: 'Which border style?', options: ['Solid Thin', 'Solid Medium', 'Solid Fat', 'Dashed', 'Dotted'], borderColorChoice: colorValue, targetContext: prevMsg?.colorTarget === 'button-border' ? 'button' : prevMsg.targetContext, executed: false }]);
				return;
			} else if (prevMsg?.colorTarget === 'box-shadow') {
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, { role: 'assistant', content: 'Which shadow style?', options: ['Soft', 'Crisp', 'Bold', 'Glow'], shadowColorChoice: colorValue, targetContext: prevMsg.targetContext, executed: false }]);
				return;
			} else {
				const target = prevMsg?.colorTarget;
				const colorUpdate = buildColorUpdate(target, colorValue, { selectedBlock });
				const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
				directAction = { action: actionType, property: colorUpdate.property, value: colorUpdate.value, target_block: colorUpdate.targetBlock, message: `Applied ${isPalette ? 'Colour ' + colorValue : 'Custom Colour'} to ${colorUpdate.msgText}.` };
			}
		} else if (['Align Text', 'Align Items'].includes(suggestion)) {
			const prevMsg = messagesRef.current?.findLast(m => m.alignmentType);
			const alignVal = prevMsg?.alignmentType || 'center';
			if (suggestion === 'Align Text') directAction = { action: 'update_page', property: 'text_align', value: alignVal, message: `Aligned all text ${alignVal}.` };
			else directAction = { action: 'update_page', property: 'align_items', value: alignVal, message: `Aligned all items ${alignVal}.` };
		} else if (['Align Left', 'Align Center', 'Align Right'].includes(suggestion)) {
			const alignVal = suggestion.replace('Align ', '').toLowerCase();
			directAction = { action: 'update_page', property: 'align_everything', value: alignVal, message: `Aligned everything ${alignVal}.` };
		} else if (suggestion === 'Small (10px)') {
			const prevMsg = messagesRef.current?.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection' ? { action: 'update_selection', property: 'gap', value: 10, message: 'Applied small gap (10px).' } : { action: 'update_page', property: 'gap', value: 10, target_block: 'container', message: 'Applied small gap (10px) to containers.' };
		} else if (suggestion === 'Medium (20px)') {
			const prevMsg = messagesRef.current?.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection' ? { action: 'update_selection', property: 'gap', value: 20, message: 'Applied medium gap (20px).' } : { action: 'update_page', property: 'gap', value: 20, target_block: 'container', message: 'Applied medium gap (20px) to containers.' };
		} else if (suggestion === 'Large (40px)') {
			const prevMsg = messagesRef.current?.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection' ? { action: 'update_selection', property: 'gap', value: 40, message: 'Applied large gap (40px).' } : { action: 'update_page', property: 'gap', value: 40, target_block: 'container', message: 'Applied large gap (40px) to containers.' };
		} else if (['Solid Normal', 'Solid Fat', 'Dashed Normal', 'Dashed Fat', 'Dotted Normal', 'Dotted Fat', 'Solid Thin', 'Solid Medium', 'Dashed', 'Dotted'].includes(suggestion)) {
			const lastAssistantMsg = messagesRef.current?.findLast(m => m.role === 'assistant');
			if (lastAssistantMsg?.content === 'Done.' || lastAssistantMsg?.executed === true) {
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, { role: 'assistant', content: 'The previous flow is complete. Say "outline buttons" to start a new border style flow!', executed: false }]);
				return;
			}
			const prevMsg = messagesRef.current?.findLast(m => m.borderColorChoice !== undefined);
			const borderColor = prevMsg?.borderColorChoice || 1;
			const targetBlock = prevMsg?.targetContext;
			const styleMap = { 'Solid Normal': { width: 1, style: 'solid' }, 'Solid Fat': { width: 4, style: 'solid' }, 'Dashed Normal': { width: 1, style: 'dashed' }, 'Dashed Fat': { width: 2, style: 'dashed' }, 'Dotted Normal': { width: 1, style: 'dotted' }, 'Dotted Fat': { width: 2, style: 'dotted' }, 'Solid Thin': { width: 1, style: 'solid' }, 'Solid Medium': { width: 2, style: 'solid' }, Dashed: { width: 2, style: 'dashed' }, Dotted: { width: 2, style: 'dotted' } };
			const style = styleMap[suggestion];
			let finalTarget = targetBlock;
			let finalAction = scope === 'selection' ? 'update_selection' : 'update_page';
			if (!finalTarget && ['Solid Thin', 'Solid Medium', 'Solid Fat', 'Dashed', 'Dotted'].includes(suggestion)) { finalTarget = 'button'; finalAction = 'update_page'; }
			if (finalTarget === 'button') finalAction = 'update_page';
			directAction = { action: finalAction, property: 'border', value: { ...style, color: borderColor }, target_block: finalTarget, message: finalTarget ? `Applied ${suggestion} border to all ${finalTarget}s.` : `Applied ${suggestion} border.` };
		} else if (['Soft', 'Crisp', 'Bold', 'Glow'].includes(suggestion)) {
			const prevMsg = messagesRef.current?.findLast(m => m.shadowColorChoice !== undefined);
			if (prevMsg?.shadowColorChoice !== undefined) {
				const shadowColor = prevMsg.shadowColorChoice;
				const targetBlock = prevMsg?.targetContext;
				const styleMap = { Soft: { x: 0, y: 10, blur: 30, spread: 0 }, Crisp: { x: 0, y: 2, blur: 4, spread: 0 }, Bold: { x: 0, y: 20, blur: 25, spread: -5 }, Glow: { x: 0, y: 0, blur: 15, spread: 2 } };
				const style = styleMap[suggestion];
				const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
				directAction = { action: actionType, property: 'box_shadow', value: { ...style, color: shadowColor }, target_block: targetBlock, message: targetBlock ? `Applied ${suggestion} shadow to all ${targetBlock}s.` : `Applied ${suggestion} shadow.` };
			}
		} else if (['Thin', 'Medium', 'Thick'].includes(suggestion)) {
			const prevMsg = messages.findLast(m => m.lineWidthTarget !== undefined);
			if (prevMsg?.lineWidthTarget === 'icon') {
				const widthMap = { Thin: 1, Medium: 1.9, Thick: 4 };
				directAction = { action: 'update_page', property: 'svg_stroke_width', value: widthMap[suggestion], target_block: 'svg-icon', message: `Applied ${suggestion} line width to all icons.` };
			}
		}

		if (directAction && scope === 'selection') {
			if (directAction.action === 'update_page' || directAction.action === 'apply_responsive_spacing') {
				directAction.action = 'update_selection';
				directAction.message = directAction.message.replace('all', 'selected').replace('page', 'selection');
			}
		}

		if (directAction) {
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setInput('');
			setIsLoading(true);
			setTimeout(async () => {
				try {
					console.log('[Maxi AI Intercept] Executing direct action:', directAction);
					const result = await parseAndExecuteAction(directAction);
					let nextOptions = undefined;
					if (directAction.property === 'responsive_padding') nextOptions = ['Yes, show me', 'No, thanks'];
					setMessages(prev => [...prev, { role: 'assistant', content: result.message, options: nextOptions || result.options, optionsType: result.optionsType, executed: true }]);
				} catch (e) {
					console.error('Direct action failed:', e);
					setMessages(prev => [...prev, { role: 'assistant', content: 'Error executing action.', isError: true }]);
				} finally {
					setIsLoading(false);
				}
			}, 600);
			return;
		}

		// Fallback: send chip text through the full pipeline
		if (typeof suggestion === 'string' && suggestion.trim()) {
			void sendMessage(suggestion.trim());
		}
	};

	return { sendMessage, handleKeyDown, handleSuggestion };
};

export default useAiChatMessages;
