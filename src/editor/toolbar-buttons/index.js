/**
 * WordPress dependencies
 */
import { subscribe } from '@wordpress/data';
import { render, useState, createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Icon from '@components/icon';
import ResponsiveSelector from '@editor/responsive-selector';
import { getIsSiteEditor, getIsTemplatesListOpened } from '@extensions/fse';

/**
 * Styles
 */
import './editor.scss';
import { main } from '@maxi-icons';

/**
 * Component
 */
const getUserToolbarPreference = () => {
	if (typeof window === 'undefined') return undefined;

	const storedPreference = window.maxiSettings?.user_settings
		?.master_toolbar_open;

	if (storedPreference === '' || storedPreference === undefined) {
		return undefined;
	}

	if (storedPreference === '0' || storedPreference === 0) return false;
	if (storedPreference === '1' || storedPreference === 1) return true;

	if (typeof storedPreference === 'boolean') return storedPreference;

	return undefined;
};

const getInitialOpenState = () => {
	const preference = getUserToolbarPreference();
	return preference ?? true;
};

const persistToolbarState = async isOpen => {
	try {
		await apiFetch({
			path: '/maxi-blocks/v1.0/user-settings',
			method: 'POST',
			data: {
				master_toolbar_open: isOpen,
			},
		});

		if (typeof window !== 'undefined' && window.maxiSettings?.user_settings) {
			window.maxiSettings.user_settings.master_toolbar_open = isOpen;
		}
	} catch (error) {
		console.error('Unable to persist Maxi toolbar preference:', error);
	}
};

const ToolbarButtons = () => {
	const [isResponsiveOpen, setIsResponsiveOpen] = useState(
		getInitialOpenState
	);

	const handleClose = () => {
		persistToolbarState(false);
		setIsResponsiveOpen(false);
	};

	const handleToggle = () => {
		setIsResponsiveOpen(prevState => {
			const nextState = !prevState;
			persistToolbarState(nextState);
			return nextState;
		});
	};

	const handleAiToggle = () => {
		if (typeof window === 'undefined') return;
		window.dispatchEvent(new CustomEvent('maxi-ai-toggle'));
	};

	return (
		<>
			<div className='maxi-toolbar-layout'>
				<Button
					className='maxi-toolbar-layout__button'
					aria-pressed={isResponsiveOpen}
					onClick={handleToggle}
				>
					<Icon icon={main} />
				</Button>
				<Button
					className='maxi-toolbar-layout__ai-button'
					onClick={handleAiToggle}
					title={__('Maxi AI', 'maxi-blocks')}
					aria-label={__('Toggle Maxi AI', 'maxi-blocks')}
				>
					<span className='maxi-toolbar-layout__ai-icon'>*</span>
				</Button>
			</div>
			<ResponsiveSelector
				isOpen={isResponsiveOpen}
				onClose={handleClose}
			/>
		</>
	);
};

wp.domReady(() => {
	/**
	 * Mutation Observer for:
	 * - Add special classes on Settings Sidebar
	 * - Hide original WP toolbar on selected MaxiBlocks
	 */
	let isMaxiToolbar = false;
	let currentRoot = null;
	let isReact18 = false;

	const addMaxiToolbar = () => {
		const maxiToolbar = document.querySelector(
			'#maxi-blocks__toolbar-buttons'
		);
		const parentNode =
			document.querySelector('.edit-post-header__toolbar') ||
			document.querySelector('.edit-site-header__toolbar') ||
			document.querySelector('.edit-site-header-edit-mode') ||
			document.querySelector('.editor-header__toolbar');

		// Insert Maxi buttons on Gutenberg topbar
		if (!maxiToolbar && parentNode) {
			const toolbarButtonsWrapper = document.createElement('div');
			toolbarButtonsWrapper.id = 'maxi-blocks__toolbar-buttons';

			if (parentNode.children.length > 1) {
				parentNode.insertBefore(
					toolbarButtonsWrapper,
					parentNode.children[1]
				);
			} else {
				parentNode.appendChild(toolbarButtonsWrapper);
			}

			// Cleanup previous root if it exists (React 18 only)
			if (currentRoot && isReact18) {
				try {
					currentRoot.unmount();
				} catch (error) {
					console.error('Error unmounting previous root:', error);
				}
			}

			// check if createRoot is available (since React 18)
			if (typeof createRoot === 'function') {
				isReact18 = true;
				currentRoot = createRoot(toolbarButtonsWrapper);
				currentRoot.render(<ToolbarButtons />);
			} else {
				// for React 17 and below
				isReact18 = false;
				currentRoot = null;
				render(<ToolbarButtons />, toolbarButtonsWrapper);
			}

			isMaxiToolbar = true;
		}
	};

	const unsubscribe = subscribe(() => {
		if (
			// Resetting isMaxiToolbar if we are switching to a different template
			getIsTemplatesListOpened() ||
			!document.querySelector('#maxi-blocks__toolbar-buttons')
		)
			isMaxiToolbar = false;

		if (isMaxiToolbar) return;

		addMaxiToolbar();
	});

	// Use MutationObserver to detect when the toolbar gets re-rendered
	// This handles cases like editing reusable blocks where the parent node re-renders
	const observer = new MutationObserver(() => {
		const maxiToolbar = document.querySelector(
			'#maxi-blocks__toolbar-buttons'
		);
		if (!maxiToolbar) {
			isMaxiToolbar = false;
			addMaxiToolbar();
		}
	});

	// Try to observe a more specific container if available for better performance
	const observeTarget =
		document.querySelector('.interface-interface-skeleton__editor') ||
		document.querySelector('.edit-post-layout') ||
		document.querySelector('.edit-site-layout') ||
		document.body;

	// Start observing the target element for changes to the toolbar
	observer.observe(observeTarget, {
		childList: true,
		subtree: true,
	});

	// Cleanup function for when the page unloads
	window.addEventListener('beforeunload', () => {
		unsubscribe();
		observer.disconnect();
		// Only attempt to unmount if using React 18
		if (currentRoot && isReact18) {
			try {
				currentRoot.unmount();
			} catch (error) {
				console.error('Error unmounting root on cleanup:', error);
			}
		}
	});
});
