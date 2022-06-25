/**
 * WordPress dependencies
 */
import { subscribe } from '@wordpress/data';
import { useState, render } from '@wordpress/element';
import { DotTip } from '@wordpress/nux';

/**
 * Internal dependencies
 */
import Button from '../../components/button';
import Icon from '../../components/icon';
import ResponsiveSelector from '../responsive-selector';
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
					<DotTip tipId='guide/maxi-toolbar'>
						Start by toggling the Maxi toolbar.
					</DotTip>
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
	const unsubscribe = subscribe(() => {
		const maxiToolbar = document.querySelector(
			'#maxi-blocks__toolbar-buttons'
		);
		const parentNode = document.querySelector('.edit-post-header__toolbar');

		// Insert Maxi buttons on Gutenberg topbar
		if (!maxiToolbar && parentNode) {
			const toolbarButtonsWrapper = document.createElement('div');
			toolbarButtonsWrapper.id = 'maxi-blocks__toolbar-buttons';

			parentNode.appendChild(toolbarButtonsWrapper);

			render(<ToolbarButtons />, toolbarButtonsWrapper);

			unsubscribe();
		}
	});
});
