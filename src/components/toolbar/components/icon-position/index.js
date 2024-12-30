/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '@components/select-control';
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import { getDefaultAttribute } from '@extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarIconAlign } from '@maxi-icons';

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
					__nextHasNoMarginBottom
					label={__('Icon position', 'maxi-blocks')}
					className='maxi-icon__position'
					value={props['icon-position']}
					defaultValue={getDefaultAttribute('icon-position')}
					onReset={() =>
						onChange({
							'icon-position':
								getDefaultAttribute('icon-position'),
							isReset: true,
						})
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
