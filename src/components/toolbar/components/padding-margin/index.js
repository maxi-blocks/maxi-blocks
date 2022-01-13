/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import AxisControl from '../../../axis-control';
import { getGroupAttributes } from '../../../../extensions/styles';
import Button from '../../../button';
import Dropdown from '../../../dropdown';

/**
 * Styles & Icons
 */
import './editor.scss';
// import { toolbarPadding } from '../../../../icons';

/**
 * PaddingMargin
 */
const PaddingMargin = props => {
	const {
		blockName,
		breakpoint,
		disableMargin = false,
		disablePadding = false,
		isIconToolbar = false,
		marginTarget = 'margin',
		onChange,
		paddingTarget = 'padding',
		advancedOptions = 'background',
	} = props;

	if (blockName !== 'maxi-blocks/button-maxi' && !isIconToolbar) return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions={advancedOptions}
			// tooltip={
			// 	!isBackgroundColor
			// 		? __('Background Colour Disabled', 'maxi-blocks')
			// 		: __('Background Colour', 'maxi-blocks')
			// }
			// icon={backgroundColor}
		/>
	);
};

export default PaddingMargin;
