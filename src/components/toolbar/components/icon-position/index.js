/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../../../select-control';
import ToolbarPopover from '../toolbar-popover';
import { getDefaultAttribute } from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarIconAlign } from '../../../../icons';
import { handleOnReset } from '../../../../extensions/attributes';

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
			position='bottom center'
			icon={toolbarIconAlign}
		>
			<div className='toolbar-item__icon-position__popover'>
				<SelectControl
					label={__('Icon position', 'maxi-block')}
					className='maxi-icon__position'
					value={props['icon-position']}
					onReset={() =>
						onChange(
							handleOnReset({
								'icon-position':
									getDefaultAttribute('icon-position'),
							})
						)
					}
					options={[
						{
							label: __('Top', 'maxi-blocks'),
							value: 'top',
						},
						{
							label: __('Bottom', 'maxi-blocks'),
							value: 'bottom',
						},
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
