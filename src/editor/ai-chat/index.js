/**
 * WordPress dependencies
 */
import { createRoot, render, useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AIChatPanel from '@components/ai-chat-panel';

const ROOT_ID = 'maxi-blocks__ai-chat-root';

const AIChatWrapper = () => {
	const [isOpen, setIsOpen] = useState(false);

	// Expose toggle functions globally for toolbar button (assigned once via useEffect)
	useEffect(() => {
		window.maxiToggleAIChat = () => setIsOpen(prev => !prev);
		window.maxiOpenAIChat = () => setIsOpen(true);
		window.maxiCloseAIChat = () => setIsOpen(false);

		return () => {
			delete window.maxiToggleAIChat;
			delete window.maxiOpenAIChat;
			delete window.maxiCloseAIChat;
		};
	}, []);

	return <AIChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />;
};

const mountChatPanel = () => {
	let rootElement = document.getElementById(ROOT_ID);
	if (rootElement) return; // Already mounted

	rootElement = document.createElement('div');
	rootElement.id = ROOT_ID;
	document.body.appendChild(rootElement);

	const isReact18 = typeof createRoot === 'function';

	if (isReact18) {
		const root = createRoot(rootElement);
		root.render(<AIChatWrapper />);
	} else {
		render(<AIChatWrapper />, rootElement);
	}
};

wp.domReady(() => {
	// Mount the chat panel
	mountChatPanel();

	// Re-mount if removed
	const observer = new MutationObserver(() => {
		if (!document.getElementById(ROOT_ID)) {
			mountChatPanel();
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: false,
	});
});
