/**
 * WordPress dependencies
 */
import { Button, Icon } from '@wordpress/components';
import { useState, render, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
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
		<Fragment>
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
		</Fragment>
	);
};

// export default ToolbarButtons;

document.addEventListener('readystatechange', () => {
	if (document.readyState === 'complete') {
		// Insert Maxi buttons on Gutenberg topbar
		if (!document.querySelector('#maxi-blocks__toolbar-buttons')) {
			const toolbarButtonsWrapper = document.createElement('div');
			toolbarButtonsWrapper.id = 'maxi-blocks__toolbar-buttons';

			document
				.querySelector('.edit-post-header__toolbar')
				.appendChild(toolbarButtonsWrapper);

			render(<ToolbarButtons />, toolbarButtonsWrapper);
		}
	}
});
