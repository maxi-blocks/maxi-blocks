/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AlignmentControl from '../../../alignment-control';
import ToolbarPopover from '../toolbar-popover';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';
import Button from '../../../button';
import Dropdown from '../../../dropdown';

/**
 * Styles & Icons
 */
import './editor.scss';
import {
	alignLeft,
	alignCenter,
	alignRight,
	alignJustify,
} from '../../../../icons';

/**
 * Alignment
 */
const ALLOWED_BLOCKS = ['maxi-blocks/button-maxi'];

const TEXT_BLOCKS = ['maxi-blocks/text-maxi'];

const Alignment = props => {
	const { blockName, onChange, breakpoint, isCaptionToolbar = false } = props;

	if (!ALLOWED_BLOCKS.includes(blockName) && !isCaptionToolbar) return null;

	const isText = TEXT_BLOCKS.includes(blockName) || isCaptionToolbar;

	const alignIcon = currentAlignIcon => {
		switch (currentAlignIcon) {
			case 'left':
				return alignLeft;
			case 'right':
				return alignRight;
			case 'justify':
				return alignJustify;
			case 'center':
				return alignCenter;
			default:
				return alignLeft;
		}
	};

	return (
		// <ToolbarPopover
		// 	className='toolbar-item__alignment'
		// 	tooltip={__('Alignment', 'maxi-blocks')}
		// 	icon={alignIcon(
		// 		getLastBreakpointAttribute(
		// 			isText ? 'text-alignment' : 'alignment',
		// 			breakpoint,
		// 			props
		// 		)
		// 	)}
		// >
		// 	<AlignmentControl
		// 		{...getGroupAttributes(
		// 			props,
		// 			isText ? 'textAlignment' : 'alignment'
		// 		)}
		// 		onChange={obj => onChange(obj)}
		// 		disableJustify={!isText}
		// 		breakpoint={breakpoint}
		// 		type={isText && 'text'}
		// 	/>
		// </ToolbarPopover>
		<Dropdown
			className='toolbar-item__alignment'
			contentClassName='maxi-dropdown__child-content'
			position='right top'
			renderToggle={({ isOpen, onToggle }) => (
				<Button onClick={onToggle} text='Copy'>
					{__('Align', 'maxi-blocks')}
				</Button>
			)}
			renderContent={() => (
				<AlignmentControl
					{...getGroupAttributes(
						props,
						isText ? 'textAlignment' : 'alignment'
					)}
					onChange={obj => onChange(obj)}
					disableJustify={!isText}
					breakpoint={breakpoint}
					type={isText && 'text'}
				/>
			)}
		/>
	);
};

export default Alignment;
