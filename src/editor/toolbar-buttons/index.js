/**
 * WordPress dependencies
 */
const { Button, Icon } = wp.components;
const { useState, render, Fragment } = wp.element;
const { useDispatch } = wp.data;
const { createBlock } = wp.blocks;

/**
 * Internal dependencies
 */
import ResponsiveSelector from '../responsive-selector';
import MaxiStyleCardsEditor from '../style-cards';

/**
 * Icons
 */
import { main, responsive } from '../../icons';

/**
 * Component
 */
const ToolbarButtons = () => {
	const [isResponsiveOpen, setIsResponsiveOpen] = useState(false);

	const { insertBlock } = useDispatch('core/block-editor');

	const addCloudLibrary = () => {
		insertBlock(createBlock('maxi-blocks/maxi-cloud'));
	};

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
					onClick={() => addCloudLibrary()}
				>
					<Icon icon={main} />
					Maxi Cloud Library
				</Button>
				<MaxiStyleCardsEditor />
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
