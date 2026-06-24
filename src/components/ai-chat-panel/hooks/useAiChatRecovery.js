/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { loadColumnsTemplate } from '@extensions/column-templates';

/**
 * Provides recovery UX helpers: turns dead-end failures into actionable chip prompts.
 *
 * @param {Object}   args
 * @param {Object}   args.conversationContext      Current FSM context (may be type:'recovery').
 * @param {Function} args.setConversationContext   State setter.
 * @param {Object}   args.selectedBlock            Currently selected block.
 * @param {Function} args.setMessages              State setter for chat messages.
 * @param {Function} args.setIsLoading             State setter for loading flag.
 * @param {Function} args.handleUpdatePage         From useAiChatBlocks.
 * @param {Function} args.handleUpdateSelection    From useAiChatBlocks.
 * @param {Function} args.getContentAreaClientId   From useAiChatCloud.
 * @param {Function} args.runCloudLibraryIntent    From useAiChatCloud.
 * @param {Function} args.sendMessage              From useAiChatMessages (forward ref — provided at call time).
 * @returns {{ buildRecoveryResponse: Function, handleRecoveryChoice: Function }}
 */
const useAiChatRecovery = ({
	conversationContext,
	setConversationContext,
	selectedBlock,
	setMessages,
	setIsLoading,
	handleUpdatePage,
	handleUpdateSelection,
	getContentAreaClientId,
	runCloudLibraryIntent,
	sendMessage,
}) => {
	/**
	 * Builds a recovery message with option chips instead of a dead-end error.
	 *
	 * @param {'no_match'|'no_selection'|'no_blocks_inserted'|'flow_error'|'lost_blocks'} type
	 * @param {Object} ctx Contextual data replayed when the user picks an option.
	 * @returns {{ content: string, options: string[], recoveryCtx: Object }}
	 */
	const buildRecoveryResponse = (type, ctx = {}) => {
		switch (type) {
			case 'no_match':
				return {
					content: `I couldn't apply that to the selected block (${
						ctx.blockName || 'unknown'
					}). What should I do?`,
					options: [
						'Apply to the whole page instead',
						'Select a different block and retry',
						'Skip this change',
					],
					recoveryCtx: { type: 'recovery', action: 'no_match', ...ctx },
				};
			case 'no_selection':
				return {
					content: 'No block is selected. Should I apply this to the whole page or wait until you select a block?',
					options: [
						'Apply to the whole page',
						"I'll select a block — try again",
					],
					recoveryCtx: { type: 'recovery', action: 'no_selection', ...ctx },
				};
			case 'no_blocks_inserted':
				return {
					content: "I couldn't insert the block — there may be no container to put it in yet. What would you like to do?",
					options: [
						'Add a container first, then retry',
						'Browse the Cloud Library instead',
						'Skip',
					],
					recoveryCtx: { type: 'recovery', action: 'no_blocks_inserted', ...ctx },
				};
			case 'flow_error':
				return {
					content: 'Something went wrong in the flow. Want to start over or skip this step?',
					options: ['Start over', 'Skip'],
					recoveryCtx: { type: 'recovery', action: 'flow_error', ...ctx },
				};
			case 'lost_blocks':
				return {
					content: 'I lost track of the target blocks (they may have been removed). What would you like to do?',
					options: ['Retry with the currently selected block', 'Skip'],
					recoveryCtx: { type: 'recovery', action: 'lost_blocks', ...ctx },
				};
			default:
				return {
					content: "Something didn't work as expected. What would you like to do?",
					options: ['Try again', 'Skip'],
					recoveryCtx: { type: 'recovery', action: 'generic', ...ctx },
				};
		}
	};

	/**
	 * Handles a user's choice inside a `recovery` conversation context.
	 * Returns true if it consumed the input.
	 *
	 * @param {string} choice The chosen option label (chip text or typed reply).
	 * @returns {Promise<boolean>}
	 */
	const handleRecoveryChoice = async choice => {
		if (conversationContext?.type !== 'recovery') return false;

		const { property, value, targetBlock, originalMessage } = conversationContext;
		const lower = choice.toLowerCase();

		setConversationContext(null);
		setMessages(prev => [...prev, { role: 'user', content: choice }]);
		setIsLoading(true);

		// Apply to whole page
		if (lower.includes('whole page') || lower.includes('apply to the page')) {
			if (property && value !== undefined) {
				const resultMsg = handleUpdatePage(property, value, targetBlock);
				setMessages(prev => [...prev, { role: 'assistant', content: resultMsg, executed: true }]);
			} else {
				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: 'No pending change to apply.', executed: false },
				]);
			}
			setIsLoading(false);
			return true;
		}

		// Add container then retry
		if (lower.includes('add a container')) {
			const contentAreaId = getContentAreaClientId();
			const row = createBlock('maxi-blocks/row-maxi');
			const container = createBlock('maxi-blocks/container-maxi', {}, [row]);
			dispatch('core/block-editor').insertBlocks(container, undefined, contentAreaId);
			loadColumnsTemplate('1-1', row.clientId, 'general', 1);
			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: 'Added a container. Select a block inside it and try your request again.',
					executed: true,
				},
			]);
			setIsLoading(false);
			return true;
		}

		// Browse Cloud Library
		if (lower.includes('cloud library') || lower.includes('browse')) {
			await runCloudLibraryIntent(originalMessage || 'browse cloud library');
			setIsLoading(false);
			return true;
		}

		// Let user select a block
		if (lower.includes("i'll select") || lower.includes('select a block')) {
			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: 'Go ahead — select a block and send the same message again.',
					executed: false,
				},
			]);
			setIsLoading(false);
			return true;
		}

		// Retry with selected block
		if (lower.includes('retry') || lower.includes('currently selected')) {
			if (property && value !== undefined && selectedBlock) {
				const resultMsg = handleUpdateSelection(property, value, targetBlock);
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: resultMsg,
						executed: !resultMsg.includes('No matching'),
					},
				]);
			} else if (originalMessage) {
				await sendMessage(originalMessage);
			} else {
				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: 'Please send your request again.', executed: false },
				]);
			}
			setIsLoading(false);
			return true;
		}

		// Start over
		if (lower.includes('start over')) {
			setMessages(prev => [
				...prev,
				{ role: 'assistant', content: 'OK — what would you like to do?', executed: false },
			]);
			setIsLoading(false);
			return true;
		}

		// Skip / any other choice
		setMessages(prev => [
			...prev,
			{
				role: 'assistant',
				content: "Skipped. Let me know what you'd like to do next.",
				executed: false,
			},
		]);
		setIsLoading(false);
		return true;
	};

	return { buildRecoveryResponse, handleRecoveryChoice };
};

export default useAiChatRecovery;
