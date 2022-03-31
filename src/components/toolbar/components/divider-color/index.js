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
import { getLastBreakpointAttribute } from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarShapeLineColor } from '../../../../icons';

/**
 * DividerColor
 */
const DividerColor = props => {
	const { blockName, onChange, breakpoint } = props;

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
					color={getLastBreakpointAttribute(
						'divider-border-color',
						breakpoint,
						props
					)}
					prefix='border-'
					paletteColor={getLastBreakpointAttribute(
						'divider-border-palette-color',
						breakpoint,
						props
					)}
					paletteOpacity={getLastBreakpointAttribute(
						'divider-border-palette-opacity',
						breakpoint,
						props
					)}
					paletteStatus={getLastBreakpointAttribute(
						'divider-border-palette-status',
						breakpoint,
						props
					)}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) => {
						onChange({
							[`divider-border-color-${breakpoint}`]: color,
							[`divider-border-palette-color-${breakpoint}`]:
								paletteColor,
							[`divider-border-palette-opacity-${breakpoint}`]:
								paletteOpacity,
							[`divider-border-palette-status-${breakpoint}`]:
								paletteStatus,
						});
					}}
					disableGradient
					globalProps={{ target: '', type: 'divider' }}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default DividerColor;
