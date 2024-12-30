/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '@components/color-control';
import Icon from '@components/icon';
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import { getLastBreakpointAttribute } from '@extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarShapeLineColor } from '@maxi-icons';

/**
 * DividerColor
 */
const DividerColor = props => {
	const { blockName, onChangeInline, onChange, breakpoint } = props;

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
					label={__('Divider line', 'maxi-blocks')}
					color={getLastBreakpointAttribute({
						target: 'divider-border-color',
						breakpoint,
						attributes: props,
					})}
					prefix='divider-border-'
					paletteColor={getLastBreakpointAttribute({
						target: 'divider-border-palette-color',
						breakpoint,
						attributes: props,
					})}
					paletteOpacity={getLastBreakpointAttribute({
						target: 'divider-border-palette-opacity',
						breakpoint,
						attributes: props,
					})}
					paletteStatus={getLastBreakpointAttribute({
						target: 'divider-border-palette-status',
						breakpoint,
						attributes: props,
					})}
					paletteSCStatus={getLastBreakpointAttribute({
						target: 'divider-border-palette-sc-status',
						breakpoint,
						attributes: props,
					})}
					onChangeInline={({ color }) =>
						onChangeInline({ 'border-color': color })
					}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteSCStatus,
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
							[`divider-border-palette-status-sc-${breakpoint}`]:
								paletteSCStatus,
						});
					}}
					deviceType={breakpoint}
					disableGradient
					globalProps={{ target: '', type: 'divider' }}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default DividerColor;
