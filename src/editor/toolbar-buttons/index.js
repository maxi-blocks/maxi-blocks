/**
 * WordPress dependencies
 */
import { subscribe } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../../components/button';
import Icon from '../../components/icon';
import ResponsiveSelector from '../responsive-selector';
import {
	getIsSiteEditor,
	getIsTemplatesListOpened,
} from '../../extensions/fse';
/**
 * Styles
 */
import './editor.scss';
import { main } from '../../icons';

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
	 * - Hide original WP toolbar on selected Maxi Blocks
	 */
	let isMaxiToolbar = false;

	const unsubscribe = subscribe(() => {
		if (
			// Resetting isMaxiToolbar if we are switching to a different template
			getIsTemplatesListOpened() ||
			!document.querySelector('#maxi-blocks__toolbar-buttons')
		)
			isMaxiToolbar = false;

		if (isMaxiToolbar) return;

		const maxiToolbar = document.querySelector(
			'#maxi-blocks__toolbar-buttons'
		);
		const parentNode =
			document.querySelector('.edit-post-header__toolbar') ||
			document.querySelector('.edit-site-header__toolbar');

		// Insert Maxi buttons on Gutenberg topbar
		if (!maxiToolbar && parentNode) {
			isMaxiToolbar = true;

			const toolbarButtonsWrapper = document.createElement('div');
			toolbarButtonsWrapper.id = 'maxi-blocks__toolbar-buttons';

			parentNode.appendChild(toolbarButtonsWrapper);

			const root = wp.element.createRoot(toolbarButtonsWrapper);
			root.render(<ToolbarButtons />);

			if (!getIsSiteEditor()) {
				unsubscribe();
			}
		}
	});
});
