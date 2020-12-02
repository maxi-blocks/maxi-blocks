/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import DividerControl from '../../../divider-control';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarDividerSetting } from '../../../../icons';

/**
 * Divider
 */

const Divider = props => {
	const {
		blockName,
		divider,
		defaultDivider,
		lineOrientation,
		onChange,
	} = props;

	if (blockName !== 'maxi-blocks/divider-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__divider-line'
			tooltip={__('Divider', 'maxi-blocks')}
			icon={toolbarDividerSetting}
			advancedOptions='line'
			content={
				<div className='toolbar-item__divider-line__popover'>
					<DividerControl
						divider={divider}
						defaultDivider={defaultDivider}
						onChange={divider => {
							onChange(divider);
						}}
						lineOrientation={lineOrientation}
						disableColor
						disableLineStyle
						disableBorderRadius
					/>
				</div>
			}
		/>
	);
};

export default Divider;
