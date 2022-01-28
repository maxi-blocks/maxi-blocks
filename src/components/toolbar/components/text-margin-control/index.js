/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
// import ToolbarPopover from '../toolbar-popover';
import AxisControl from '../../../axis-control';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
// import './editor.scss';
// import { toolbarPadding } from '../../../../icons';

/**
 * PaddingMargin
 */
const TextMarginControl = props => {
	const {
		// blockName,
		breakpoint,
		disableMargin = false,
		disablePadding = false,
		isIconToolbar = false,
		marginTarget = 'margin',
		onChange,
		paddingTarget = 'padding',
	} = props;

	// if (blockName !== 'maxi-blocks/button-maxi' && !isIconToolbar) return null;

	return (
		<div className='toolbar-item__padding-margin__popover'>
			{!disablePadding && (
				<AxisControl
					{...getGroupAttributes(
						props,
						isIconToolbar ? 'iconPadding' : 'padding'
					)}
					label={__('Icon padding', 'maxi-blocks')}
					onChange={obj => onChange(obj)}
					breakpoint={breakpoint}
					target={paddingTarget}
					disableAuto
					disableSync
					disableIcon
				/>
			)}
			{!disableMargin && (
				<AxisControl
					{...getGroupAttributes(props, 'margin')}
					label={__('Margin', 'maxi-blocks')}
					onChange={onChange}
					breakpoint={breakpoint}
					target={marginTarget}
					optionType='string'
					disableSync
					disableIcon
					disableAuto
				/>
			)}
		</div>
	);
};

export default TextMarginControl;
