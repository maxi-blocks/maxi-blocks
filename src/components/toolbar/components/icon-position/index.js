/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
// import SettingTabsControl from '../../../setting-tabs-control';
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
					label={__('Icon Position', 'maxi-block')}
					className='maxi-icon__position'
					selected={props['icon-position']}
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
				{/* <SettingTabsControl
					label={__('Icon Position', 'maxi-block')}
					type='buttons'
					selected={props['icon-position']}
					items={[
						{
							label: __('Right', 'maxi-block'),
							value: 'right',
						},
						{ label: __('Left', 'maxi-block'), value: 'left' },
					]}
					onChange={val =>
						onChange({
							'icon-position': val,
						})
					}
				/> */}
			</div>
		</ToolbarPopover>
	);
};

export default IconPosition;
