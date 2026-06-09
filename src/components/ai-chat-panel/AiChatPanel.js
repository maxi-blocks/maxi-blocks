/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import ChatWindow from './components/ChatWindow';

const AI_CHAT_STATE_EVENT = 'maxi-ai-chat-state';

const AiChatPanelContainer = ({ defaultOpen = false } = {}) => {
	const resolveInitialOpenState = () => {
		if (typeof window !== 'undefined' && window.maxiAIChatIsOpen !== undefined) {
			return Boolean(window.maxiAIChatIsOpen);
		}
		return Boolean(defaultOpen);
	};
	const [isOpen, setIsOpen] = useState(resolveInitialOpenState);

	useEffect(() => {
		if (typeof window === 'undefined') return undefined;

		const toggle = () => setIsOpen(prev => !prev);
		const open = () => setIsOpen(true);
		const close = () => setIsOpen(false);

		window.addEventListener('maxi-ai-toggle', toggle);
		window.addEventListener('maxi-ai-open', open);
		window.addEventListener('maxi-ai-close', close);

		window.maxiToggleAIChat = toggle;

		return () => {
			window.removeEventListener('maxi-ai-toggle', toggle);
			window.removeEventListener('maxi-ai-open', open);
			window.removeEventListener('maxi-ai-close', close);

			if (window.maxiToggleAIChat === toggle) {
				delete window.maxiToggleAIChat;
			}
		};
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const nextState = Boolean(isOpen);
		window.maxiAIChatIsOpen = nextState;
		window.dispatchEvent(
			new CustomEvent(AI_CHAT_STATE_EVENT, { detail: { isOpen: nextState } })
		);
	}, [isOpen]);

	return (
		<ChatWindow
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
		/>
	);
};

export default AiChatPanelContainer;
