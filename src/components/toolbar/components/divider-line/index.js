/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import DividerControl from '../../../divider-control';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarDividerSetting } from '../../../../icons';

/**
 * Divider
 */

const Divider = props => {
	const { blockName, lineOrientation, onChange } = props;

	if (blockName !== 'maxi-blocks/divider-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__divider-line'
			tooltip={__('Divider', 'maxi-blocks')}
			icon={toolbarDividerSetting}
			advancedOptions='line settings'
			tab={0}
		>
			<div className='toolbar-item__divider-line__popover'>
				<DividerControl
					{...getGroupAttributes(props, ['divider', 'size'])}
					onChange={obj => {
						onChange(obj);
					}}
					lineOrientation={lineOrientation}
					disableColor
					disableLineStyle
					disableBorderRadius
				/>
			</div>
		</ToolbarPopover>
	);
};

export default Divider;
