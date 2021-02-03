/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../../../extensions/styles/getLastBreakpointAttribute';
import AlignmentControl from '../../../alignment-control';
import ToolbarPopover from '../toolbar-popover';
import getGroupAttributes from '../../../../extensions/styles/getGroupAttributes';

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
const ALLOWED_BLOCKS = [
	'maxi-blocks/text-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/font-icon-maxi',
];

const TEXT_BLOCKS = ['maxi-blocks/text-maxi'];

const Alignment = props => {
	const { blockName, onChange, breakpoint } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const isText = TEXT_BLOCKS.includes(blockName);

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
		<ToolbarPopover
			className='toolbar-item__alignment'
			tooltip={__('Alignment', 'maxi-blocks')}
			icon={alignIcon(
				getLastBreakpointAttribute(
					isText ? 'text-alignment' : 'alignment',
					breakpoint,
					props
				)
			)}
			content={
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
			}
		/>
	);
};

export default Alignment;
