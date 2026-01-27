/**
 * WordPress dependencies
 */
import {
	createRoot,
	render,
	unmountComponentAtNode,
	useState,
	useEffect,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import AIChatPanel from '@components/ai-chat-panel';

const ROOT_ID = 'maxi-blocks__ai-chat-root';
const AI_CHAT_STATE_EVENT = 'maxi-ai-chat-state';

// Module-level cache for React root to avoid memory leaks
let reactRoot = null;
let reactRootContainer = null;

const broadcastAIChatState = isOpen => {
	if (typeof window === 'undefined') return;
	window.maxiAIChatIsOpen = isOpen;
	window.dispatchEvent(
		new CustomEvent(AI_CHAT_STATE_EVENT, { detail: { isOpen } })
	);
};

const AIChatWrapper = () => {
	const [isOpen, setIsOpen] = useState(false);

	// Expose toggle functions globally for toolbar button (assigned once via useEffect)
	useEffect(() => {
		if (typeof window === 'undefined') return undefined;

		window.maxiToggleAIChat = () => setIsOpen(prev => !prev);
		window.maxiOpenAIChat = () => setIsOpen(true);
		window.maxiCloseAIChat = () => setIsOpen(false);

		return () => {
			delete window.maxiToggleAIChat;
			delete window.maxiOpenAIChat;
			delete window.maxiCloseAIChat;
			broadcastAIChatState(false);
		};
	}, []);

	useEffect(() => {
		broadcastAIChatState(isOpen);
	}, [isOpen]);

	return <AIChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />;
};

const mountChatPanel = () => {
	let rootElement = document.getElementById(ROOT_ID);
	
	// Already mounted with same container - no action needed
	if (rootElement && reactRootContainer === rootElement) return;
	
	// Cleanup if the container changed
	if (reactRootContainer && reactRootContainer !== rootElement) {
		unmountChatPanel();
	}

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
	} else if (reactRootContainer) {
		unmountComponentAtNode(reactRootContainer);
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

