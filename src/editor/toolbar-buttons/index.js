/**
 * WordPress dependencies
 */
const { Button, Icon } = wp.components;
const { useState, render, Fragment } = wp.element;

/**
 * Internal dependencies
 */
import ResponsiveSelector from '../responsive-selector';

/**
 * Icons
 */
import { main, responsive } from '../../icons';

/**
 * Component
 */
const ToolbarButtons = () => {
	const [isResponsiveOpen, setIsResponsiveOpen] = useState(false);

	return (
		<Fragment>
			<div className='maxi-toolbar-layout'>
				<Button
					id='maxi-button__show-responsive'
					className='button maxi-button maxi-button__toolbar'
					onClick={() => setIsResponsiveOpen(!isResponsiveOpen)}
				>
					<Icon icon={responsive} />
				</Button>
				<Button
					id='maxi-button__layout'
					className='button maxi-button maxi-button__toolbar'
					aria-label='Maxi Cloud Library'
				>
					<Icon icon={main} />
					Maxi Cloud Library
				</Button>
				<Button
					id='maxi-button__go-to-customizer'
					className='button maxi-button maxi-button__toolbar'
					aria-label='Global Styles'
				>
					<Icon icon={main} />
					Global Styles
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
