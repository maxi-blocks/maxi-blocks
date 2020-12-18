/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { ColorPicker, Icon } = wp.components;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import { toolbarDividerSetting } from '../../../../icons';

/**
 * DividerColor
 */
const DividerColor = props => {
	const { blockName, onChange } = props;

	if (blockName !== 'maxi-blocks/divider-maxi') return null;

	const divider = { ...props.divider };

	const updateDivider = val => {
		divider.general['border-color'] = val.hex;

		onChange(divider);
	};

	return (
		<ToolbarPopover
			className='toolbar-item__text-options'
			tooltip={__('Divider color', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__text-options__icon'
					style={{
						background: divider.general['border-color'],
						borderWidth: '1px',
						borderColor: '#fff',
						borderStyle: 'solid',
					}}
				>
					<Icon
						className='toolbar-item__text-options__inner-icon'
						icon={toolbarDividerSetting}
					/>
				</div>
			}
			content={
				<ColorPicker
					color={divider.general['border-color']}
					onChangeComplete={val => updateDivider(val)}
				/>
			}
		/>
	);
};

export default DividerColor;
