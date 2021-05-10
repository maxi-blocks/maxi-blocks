/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Icon from '../../../icon';
import { getDefaultAttribute } from '../../../../extensions/styles';
import ColorControl from '../../../color-control';
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

	return (
		<ToolbarPopover
			className='toolbar-item__text-options'
			tooltip={__('Divider color', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__text-options__icon'
					style={{
						background: props['divider-border-color'],
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
		>
			<ColorControl
				label={__('Divider', 'maxi-blocks')}
				color={props['divider-border-color']}
				defaultColor={getDefaultAttribute('border-color')}
				onChange={val => onChange({ 'divider-border-color': val })}
				disableGradient
			/>
		</ToolbarPopover>
	);
};

export default DividerColor;
