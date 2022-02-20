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
import { getDefaultAttribute } from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarShapeLineColor } from '../../../../icons';

/**
 * DividerColor
 */
const DividerColor = props => {
	const { blockName, onChange } = props;

	if (blockName !== 'maxi-blocks/divider-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__divider'
			tooltip={__('Divider line colour', 'maxi-blocks')}
			icon={
				<div className='toolbar-item__divider__icon'>
					<Icon
						className='toolbar-item__divider-icon'
						icon={toolbarShapeLineColor}
					/>
				</div>
			}
			advancedOptions='line settings'
		>
			<div className='toolbar-item__divider-color__popover'>
				<ColorControl
					color={props['divider-border-color']}
					defaultColor={getDefaultAttribute('border-color')}
					paletteColor={props['divider-border-palette-color']}
					paletteStatus={props['divider-border-palette-status']}
					onChange={({ color, paletteColor, paletteStatus }) =>
						onChange({
							'divider-border-color': color,
							'divider-border-palette-color': paletteColor,
							'divider-border-palette-status': paletteStatus,
						})
					}
					disableGradient
					globalProps={{ target: '', type: 'divider' }}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default DividerColor;
