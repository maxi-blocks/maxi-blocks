/**
 * WordPress dependencies
 */
import { subscribe } from '@wordpress/data';
import { render, useState, createRoot } from '@wordpress/element';

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
const ToolbarButtons = () => {
	const [isResponsiveOpen, setIsResponsiveOpen] = useState(false);

	return (
		<>
			<div className='maxi-toolbar-layout'>
				<Button
					className='maxi-toolbar-layout__button'
					aria-pressed={isResponsiveOpen}
					onClick={() => setIsResponsiveOpen(!isResponsiveOpen)}
				>
					<Icon icon={main} />
				</Button>
			</div>
			<ResponsiveSelector
				isOpen={isResponsiveOpen}
				onClose={() => setIsResponsiveOpen(false)}
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

			// Cleanup previous root if it exists
			if (currentRoot) {
				try {
					currentRoot.unmount();
				} catch (error) {
					console.log('Error unmounting previous root:', error);
				}
			}

			// check if createRoot is available (since React 18)
			if (typeof createRoot === 'function') {
				currentRoot = createRoot(toolbarButtonsWrapper);
				currentRoot.render(<ToolbarButtons />);
			} else {
				// for React 17 and below
				render(<ToolbarButtons />, toolbarButtonsWrapper);
			}

			if (getIsSiteEditor()) {
				const toolbarButtonMaxi = document.querySelector(
					'#maxi-blocks__toolbar-buttons button'
				);

				if (!toolbarButtonMaxi) return;

				const widthLeftMenu = document.querySelector(
					'div.edit-site-header-edit-mode__start'
				)?.offsetWidth;

				const widthSiteIcon = document.querySelector(
					'div.edit-site-site-hub'
				)?.offsetWidth;

				if (!widthLeftMenu || !widthSiteIcon) return;

				const leftSpace = widthLeftMenu + widthSiteIcon;
				toolbarButtonMaxi.style.left = `${leftSpace}px`;
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

	// Start observing the document for changes to the toolbar
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// Cleanup function for when the page unloads
	window.addEventListener('beforeunload', () => {
		unsubscribe();
		observer.disconnect();
		if (currentRoot) {
			try {
				currentRoot.unmount();
			} catch (error) {
				console.error('Error unmounting root on cleanup:', error);
			}
		}
	});
});
