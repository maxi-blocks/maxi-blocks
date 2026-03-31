/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { select, useDispatch, useSelect, useRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { useStyleCardData, createStyleCardHandlers } from '../ai/style-card';
import { applyUpdatesToBlocks as _applyUpdatesToBlocks } from '../ai/utils/applyUpdatesToBlocks';
import useAiChatHistory from './useAiChatHistory';
import useAiChatDrag from './useAiChatDrag';
import useAiChatBlocks from './useAiChatBlocks';
import useAiChatSidebar from './useAiChatSidebar';
import useAiChatCloud from './useAiChatCloud';
import useAiChatRecovery from './useAiChatRecovery';
import useAiChatActions from './useAiChatActions';
import useAiChatMessages from './useAiChatMessages';

export const useAiChat = ({ onClose } = {}) => {
	// ─── Core state ──────────────────────────────────────────────────────────
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [scope, setScope] = useState('page');
	const [scopeChosen, setScopeChosen] = useState(false);
	const [conversationContext, setConversationContext] = useState(null);
	const [showHistory, setShowHistory] = useState(false);

	// ─── History ─────────────────────────────────────────────────────────────
	const {
		chatHistory,
		currentChatId,
		saveCurrentChat,
		startNewChat: startNewChatHistory,
		loadChat: loadChatHistory,
		deleteHistoryItem,
	} = useAiChatHistory({ messages, setMessages, setInput, setConversationContext });

	const startNewChat = () => {
		startNewChatHistory();
		setShowHistory(false);
		setScopeChosen(false);
	};

	const loadChat = entry => {
		loadChatHistory(entry);
		setShowHistory(false);
		setScopeChosen(true);
	};

	// ─── Refs ─────────────────────────────────────────────────────────────────
	const messagesEndRef = useRef(null);

	// Keep a ref in sync with messages so that async handlers always access the latest list.
	const messagesRef = useRef(messages);
	useEffect(() => { messagesRef.current = messages; }, [messages]);

	// ─── Debug helpers ────────────────────────────────────────────────────────
	const isAIDebugEnabled = () => typeof window !== 'undefined' && window.maxiBlocksDebug;
	const logAIDebug = (...args) => {
		if (isAIDebugEnabled()) console.log('[Maxi AI Debug]', ...args);
	};

	// ─── WP data ─────────────────────────────────────────────────────────────
	const selectedBlock = useSelect(
		selectFn => selectFn('core/block-editor').getSelectedBlock(),
		[]
	);

	const postTypeLabel = useSelect(selectFn => {
		const type = selectFn('core/editor').getCurrentPostType();
		const obj = selectFn('core').getPostType(type);
		return (
			obj?.labels?.singular_name ||
			(type ? type.charAt(0).toUpperCase() + type.slice(1) : __('Page', 'maxi-blocks'))
		);
	}, []);

	const selectedBlockDisplayName = selectedBlock
		? selectedBlock.name
			.replace('maxi-blocks/', '')
			.replace('-maxi', '')
			.split('-')
			.map(w => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ')
		: null;

	// Intentionally stale snapshot (performance) — imperative code must use select() directly.
	const allBlocks = useSelect(selectFn => selectFn('core/block-editor').getBlocks(), []);

	const registry = useRegistry();

	// ─── Style Cards ─────────────────────────────────────────────────────────
	const {
		activeStyleCard,
		activeCard,
		allStyleCards,
		customColors,
		saveMaxiStyleCards,
		resetSC,
		setActiveStyleCard,
		setSelectedStyleCard,
		removeStyleCard,
		saveSCStyles,
	} = useStyleCardData();

	const { handleUpdateStyleCard, handleApplyTheme } = createStyleCardHandlers({
		allStyleCards,
		saveMaxiStyleCards,
		resetSC,
		setActiveStyleCard,
	});

	// ─── Dispatchers ─────────────────────────────────────────────────────────
	const { updateBlockAttributes } = useDispatch('core/block-editor');
	const { undo: undoPost } = useDispatch('core/editor') || {};
	const { undo: undoSite } = useDispatch('core/edit-site') || {};

	// ─── Convenience wrapper (passes scope to the generic helper) ────────────
	const applyUpdatesToBlocks = (
		blocksToUpdate,
		property,
		value,
		targetBlock = null,
		specificClientId = null
	) =>
		_applyUpdatesToBlocks(
			blocksToUpdate,
			property,
			value,
			targetBlock,
			specificClientId,
			updateBlockAttributes,
			scope
		);

	// ─── Sub-hooks ───────────────────────────────────────────────────────────

	const { position, isDragging, handleMouseDown } = useAiChatDrag();

	const { handleUpdatePage, handleUpdateSelection, applyHoverAnimation } = useAiChatBlocks({
		selectedBlock,
		scope,
		registry,
		updateBlockAttributes,
	});

	const { openSidebarForProperty } = useAiChatSidebar({ selectedBlock });

	const { getContentAreaClientId, runCloudLibraryIntent } = useAiChatCloud({
		setMessages,
		logAIDebug,
	});

	// Recovery — sendMessage is forward-declared; pass it via wrapper to avoid a circular dep.
	const sendMessageRef = useRef(null);
	const { buildRecoveryResponse, handleRecoveryChoice } = useAiChatRecovery({
		conversationContext,
		setConversationContext,
		selectedBlock,
		setMessages,
		setIsLoading,
		handleUpdatePage,
		handleUpdateSelection,
		getContentAreaClientId,
		runCloudLibraryIntent,
		// Proxy so recovery can call sendMessage after it's defined.
		sendMessage: (...args) => sendMessageRef.current?.(...args),
	});

	const { parseAndExecuteAction, normalizeActionProperty, resolveButtonIconFromTypesense } =
		useAiChatActions({
			scope,
			selectedBlock,
			conversationContext,
			setConversationContext,
			setMessages,
			handleUpdatePage,
			handleUpdateSelection,
			applyHoverAnimation,
			openSidebarForProperty,
			buildRecoveryResponse,
			getContentAreaClientId,
			updateBlockAttributes,
			handleUpdateStyleCard,
			handleApplyTheme,
			logAIDebug,
		});

	const { sendMessage, handleKeyDown, handleSuggestion } = useAiChatMessages({
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
	});

	// Expose sendMessage to the recovery hook after it's created.
	sendMessageRef.current = sendMessage;

	// ─── Undo ─────────────────────────────────────────────────────────────────
	const handleUndo = () => {
		if (typeof undoPost === 'function') {
			undoPost();
		} else if (typeof undoSite === 'function') {
			undoSite();
		} else {
			console.warn('Maxi AI: Undo not available in this context.');
		}
		setMessages(prev => {
			const newMessages = [...prev];
			for (let i = newMessages.length - 1; i >= 0; i--) {
				if (newMessages[i].role === 'assistant' && newMessages[i].executed && !newMessages[i].undone) {
					newMessages[i].undone = true;
					break;
				}
			}
			return newMessages;
		});
	};

	// ─── Scope helpers ────────────────────────────────────────────────────────
	const handleScopeChange = nextScope => {
		if (nextScope === scope) return;
		setScope(nextScope);
		setScopeChosen(true);
		if (conversationContext) setConversationContext(null);
	};

	// Auto-reset scope to 'page' when selected block is deselected.
	useEffect(() => {
		if (scope === 'selection' && !selectedBlock) setScope('page');
	}, [selectedBlock]); // eslint-disable-line react-hooks/exhaustive-deps

	// Reset conversation context when scope changes.
	useEffect(() => {
		if (scope === 'global') {
			if (conversationContext) setConversationContext(null);
			return;
		}
		if (conversationContext?.mode && conversationContext.mode !== scope) {
			setConversationContext(null);
		}
	}, [scope, conversationContext]);

	// ─── Scroll to bottom on new messages ────────────────────────────────────
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};
	useEffect(() => { scrollToBottom(); }, [messages]);

	// ─── Palette colours ─────────────────────────────────────────────────────
	const getPaletteColors = () =>
		[1, 2, 3, 4, 5, 6, 7, 8].map(i => `rgba(var(--maxi-light-color-${i}), 1)`);

	// ─── Public API ───────────────────────────────────────────────────────────
	return {
		messages,
		input,
		setInput,
		isLoading,
		scope,
		sendMessage,
		handleKeyDown,
		handleSuggestion,
		handleUndo,
		handleScopeChange,
		showHistory,
		setShowHistory,
		chatHistory,
		loadChat,
		deleteHistoryItem,
		startNewChat,
		currentChatId,
		position,
		isDragging,
		handleMouseDown,
		selectedBlock,
		postTypeLabel,
		selectedBlockDisplayName,
		scopeChosen,
		setScopeChosen,
		getPaletteColors,
		customColors,
		messagesEndRef,
	};
};

export default useAiChat;
