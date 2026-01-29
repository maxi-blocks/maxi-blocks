import { createPortal, useEffect, useState } from '@wordpress/element';
import ChatWindow from './components/ChatWindow';
import LauncherButton from './components/LauncherButton';
import './editor.scss';

const AiChatPanel = ({ defaultOpen = false }) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const [launcherTarget, setLauncherTarget] = useState(null);

	useEffect(() => {
		if (typeof document === 'undefined') return undefined;

		const findTarget = () =>
			document.querySelector('#maxi-blocks__toolbar-buttons') ||
			document.querySelector('.edit-post-header__toolbar') ||
			document.querySelector('.edit-site-header__toolbar') ||
			document.querySelector('.editor-header__toolbar');

		const ensureTarget = () => {
			const target = findTarget();
			if (!target) return;

			let mountNode = target.querySelector('#maxi-ai-launcher-root');
			if (!mountNode) {
				mountNode = document.createElement('div');
				mountNode.id = 'maxi-ai-launcher-root';
				target.appendChild(mountNode);
			}

			if (launcherTarget !== mountNode) {
				setLauncherTarget(mountNode);
			}
		};

		ensureTarget();

		const observer = new MutationObserver(ensureTarget);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
		};
	}, [launcherTarget]);

	useEffect(() => {
		const handleToggle = () => setIsOpen(prev => !prev);
		const handleOpen = () => setIsOpen(true);
		const handleClose = () => setIsOpen(false);

		window.addEventListener('maxi-ai-toggle', handleToggle);
		window.addEventListener('maxi-ai-open', handleOpen);
		window.addEventListener('maxi-ai-close', handleClose);

		return () => {
			window.removeEventListener('maxi-ai-toggle', handleToggle);
			window.removeEventListener('maxi-ai-open', handleOpen);
			window.removeEventListener('maxi-ai-close', handleClose);
		};
	}, []);

	const launcher = (
		<LauncherButton
			isOpen={isOpen}
			onToggle={() => setIsOpen(prev => !prev)}
			variant={launcherTarget ? 'toolbar' : 'floating'}
		/>
	);

	return (
		<>
			{launcherTarget ? createPortal(launcher, launcherTarget) : launcher}
			<ChatWindow
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
};

export default AiChatPanel;

