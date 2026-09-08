/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

const HISTORY_KEY = 'maxi_ai_chat_history';
const MAX_HISTORY = 20;

/**
 * useAiChatHistory
 *
 * Manages chat session persistence — saves, loads, and deletes chat sessions
 * in localStorage. Decoupled from message-sending logic so it can be tested
 * and reasoned about independently.
 *
 * @param {Array}    messages              Current active message list.
 * @param {Function} setMessages           Setter for the active message list.
 * @param {Function} setInput              Setter to clear the input field.
 * @param {Function} setConversationContext Setter to clear conversation context.
 */
const useAiChatHistory = ({
	messages,
	setMessages,
	setInput,
	setConversationContext,
}) => {
	const [chatHistory, setChatHistory] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
		} catch {
			return [];
		}
	});
	const [currentChatId, setCurrentChatId] = useState(() => Date.now().toString());

	const persistHistory = updated => {
		try {
			localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
		} catch {}
	};

	const saveCurrentChat = msgs => {
		if (!msgs || msgs.length === 0) return;
		const title =
			msgs.find(m => m.role === 'user')?.content?.slice(0, 60) ||
			__('New chat', 'maxi-blocks');
		const entry = { id: currentChatId, title, messages: msgs, timestamp: Date.now() };
		setChatHistory(prev => {
			const updated = [entry, ...prev.filter(c => c.id !== currentChatId)].slice(
				0,
				MAX_HISTORY
			);
			persistHistory(updated);
			return updated;
		});
	};

	// Auto-save whenever messages change
	useEffect(() => {
		if (messages.length > 0) saveCurrentChat(messages);
	}, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

	const startNewChat = () => {
		setMessages([]);
		setInput('');
		setConversationContext(null);
		setCurrentChatId(Date.now().toString());
	};

	const loadChat = entry => {
		saveCurrentChat(messages);
		setMessages(entry.messages);
		setCurrentChatId(entry.id);
	};

	const deleteHistoryItem = (id, e) => {
		e.stopPropagation();
		setChatHistory(prev => {
			const updated = prev.filter(c => c.id !== id);
			persistHistory(updated);
			return updated;
		});
	};

	return {
		chatHistory,
		currentChatId,
		saveCurrentChat,
		startNewChat,
		loadChat,
		deleteHistoryItem,
	};
};

export default useAiChatHistory;
