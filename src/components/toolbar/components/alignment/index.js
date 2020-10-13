/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../../../utils';
import AlignmentControl from '../../../alignment-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

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
];

const Alignment = props => {
	const { blockName, alignment, onChange, breakpoint } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const alignmentValue = !isObject(alignment)
		? JSON.parse(alignment)
		: alignment;

	const alignIcon = CurrentAlignIcon => {
		switch (CurrentAlignIcon) {
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
				getLastBreakpointValue(alignmentValue, 'alignment', breakpoint)
			)}
			content={
				<AlignmentControl
					alignment={alignment}
					onChange={alignment => onChange(alignment)}
					disableJustify={
						!(
							blockName === 'maxi-blocks/text-maxi' ||
							blockName === 'maxi-blocks/button-maxi'
						)
					}
					breakpoint={breakpoint}
				/>
			}
		/>
	);
};

export default Alignment;
