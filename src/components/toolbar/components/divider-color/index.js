/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../../../color-control';
import Icon from '../../../icon';
import ToolbarPopover from '../toolbar-popover';
import {
	getDefaultAttribute,
	getBlockStyle,
	getColorRGBAString,
} from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarDividerSetting } from '../../../../icons';

/**
 * DividerColor
 */
const DividerColor = props => {
	const { blockName, onChange, clientId } = props;

	if (blockName !== 'maxi-blocks/divider-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__text-options'
			tooltip={__('Divider color', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__text-options__icon'
					style={{
						background: props['divider-palette-border-color-status']
							? getColorRGBAString({
									firstVal: `color-${props['divider-palette-border-color']}`,
									opacity:
										props['divider-palette-border-opacity'],
									blockStyle: getBlockStyle(clientId),
							  })
							: props['divider-color'],
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
			<div className='toolbar-item__divider-color__popover'>
				<ColorControl
					label={__('Divider', 'maxi-blocks')}
					color={props['divider-border-color']}
					defaultColor={getDefaultAttribute('border-color')}
					paletteColor={props['divider-palette-border-color']}
					paletteStatus={props['divider-palette-border-color-status']}
					onChange={({ color, paletteColor, paletteStatus }) =>
						onChange({
							'divider-border-color': color,
							'divider-palette-border-color': paletteColor,
							'divider-palette-border-color-status':
								paletteStatus,
						})
					}
					disableGradient
					globalProps={{ target: 'color-global', type: 'divider' }}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default DividerColor;
