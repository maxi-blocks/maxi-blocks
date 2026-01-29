import { createRoot, render } from '@wordpress/element';
import AiChatPanel from './AiChatPanel';

const ROOT_ID = 'maxi-ai-chat-panel-root';

let currentRoot = null;
let isReact18 = false;

const ensureRootElement = () => {
	let node = document.getElementById(ROOT_ID);
	if (!node) {
		node = document.createElement('div');
		node.id = ROOT_ID;
		document.body.appendChild(node);
	}
	return node;
};

export const mountAiChatPanel = (props = {}) => {
	if (typeof document === 'undefined') return null;
	const node = ensureRootElement();

	if (currentRoot && isReact18) {
		try {
			currentRoot.unmount();
		} catch (error) {
			// ignore
		}
	}

	if (typeof createRoot === 'function') {
		isReact18 = true;
		currentRoot = createRoot(node);
		currentRoot.render(<AiChatPanel {...props} />);
		return currentRoot;
	}

	isReact18 = false;
	currentRoot = null;
	render(<AiChatPanel {...props} />, node);
	return node;
};

export const unmountAiChatPanel = () => {
	if (!currentRoot) return;
	if (isReact18 && currentRoot?.unmount) {
		currentRoot.unmount();
	}
	currentRoot = null;
};

if (typeof wp !== 'undefined' && typeof wp.domReady === 'function') {
	wp.domReady(() => {
		mountAiChatPanel();
	});
}

export default mountAiChatPanel;

