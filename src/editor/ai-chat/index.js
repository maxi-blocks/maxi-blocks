/**
 * WordPress dependencies
 */
import { createRoot, render, useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AIChatPanel from '@components/ai-chat-panel';

const ROOT_ID = 'maxi-blocks__ai-chat-root';

// Module-level cache for React root to avoid memory leaks
let reactRoot = null;
let reactRootContainer = null;

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
	
	// Already mounted with same container - no action needed
	if (rootElement && reactRootContainer === rootElement) return;
	
	// Create DOM element if needed
	if (!rootElement) {
		rootElement = document.createElement('div');
		rootElement.id = ROOT_ID;
		document.body.appendChild(rootElement);
	}

	const isReact18 = typeof createRoot === 'function';

	if (isReact18) {
		// Create or reuse React root
		if (!reactRoot || reactRootContainer !== rootElement) {
			reactRoot = createRoot(rootElement);
			reactRootContainer = rootElement;
		}
		reactRoot.render(<AIChatWrapper />);
	} else {
		render(<AIChatWrapper />, rootElement);
		reactRootContainer = rootElement;
	}
};

const unmountChatPanel = () => {
	if (reactRoot?.unmount) {
		reactRoot.unmount();
	}
	reactRoot = null;
	reactRootContainer = null;
};

wp.domReady(() => {
	// Mount the chat panel
	mountChatPanel();

	// Re-mount if removed (with proper cleanup)
	const observer = new MutationObserver(() => {
		if (!document.getElementById(ROOT_ID)) {
			unmountChatPanel();
			mountChatPanel();
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: false,
	});
});

