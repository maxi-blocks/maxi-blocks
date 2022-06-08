/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../../../select-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarIconAlign } from '../../../../icons';

/**
 * Size
 */
const IconPosition = props => {
	const { blockName, onChange } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__icon-position'
			tooltip={__('Icon Position', 'maxi-blocks')}
			icon={toolbarIconAlign}
		>
			<div className='toolbar-item__icon-position__popover'>
				<SelectControl
					label={__('Icon position', 'maxi-block')}
					className='maxi-icon__position'
					value={props['icon-position']}
					options={[
						{
							label: __('Left', 'maxi-blocks'),
							value: 'left',
						},
						{
							label: __('Right', 'maxi-blocks'),
							value: 'right',
						},
					]}
					onChange={val => {
						onChange({
							'icon-position': val,
						});
					}}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default IconPosition;
