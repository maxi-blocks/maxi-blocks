/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingTabsControl, ToggleSwitch, ColorControl } from '..';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

const AccordionBackgroundSettings = props => {
	const { onChange, breakpoint } = props;

	return (
		<SettingTabsControl
			deviceType={breakpoint}
			depth={2}
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: (
						<ColorControl
							label={__('Background', 'maxi-blocks')}
							color={getLastBreakpointAttribute({
								target: 'background-color',
								breakpoint,
								attributes: props,
							})}
							prefix='background-'
							paletteStatus={getLastBreakpointAttribute({
								target: 'background-palette-status',
								breakpoint,
								attributes: props,
							})}
							paletteColor={getLastBreakpointAttribute({
								target: 'background-palette-color',
								breakpoint,
								attributes: props,
							})}
							paletteOpacity={getLastBreakpointAttribute({
								target: 'background-palette-opacity',
								breakpoint,
								attributes: props,
							})}
							onChange={({
								color,
								paletteColor,
								paletteStatus,
								paletteOpacity,
							}) => {
								onChange({
									[getAttributeKey(
										'background-palette-status',
										false,
										'',
										breakpoint
									)]: paletteStatus,
									[getAttributeKey(
										'background-palette-color',
										false,
										'',
										breakpoint
									)]: paletteColor,
									[getAttributeKey(
										'background-palette-opacity',
										false,
										'',
										breakpoint
									)]: paletteOpacity,
									[getAttributeKey(
										'background-color',
										false,
										'',
										breakpoint
									)]: color,
								});
							}}
							deviceType={breakpoint}
						/>
					),
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__(
									'Enable background hover',
									'maxi-blocks'
								)}
								selected={props['background-status-hover']}
								onChange={val =>
									onChange({
										'background-status-hover': val,
									})
								}
							/>

							{props['background-status-hover'] && (
								<ColorControl
									label={__('Background', 'maxi-blocks')}
									color={getLastBreakpointAttribute({
										target: 'background-color',
										breakpoint,
										attributes: props,
										isHover: true,
									})}
									prefix='background-'
									paletteStatus={getLastBreakpointAttribute({
										target: 'background-palette-status',
										breakpoint,
										attributes: props,
										isHover: true,
									})}
									paletteColor={getLastBreakpointAttribute({
										target: 'background-palette-color',
										breakpoint,
										attributes: props,
										isHover: true,
									})}
									paletteOpacity={getLastBreakpointAttribute({
										target: 'background-palette-opacity',
										breakpoint,
										attributes: props,
										isHover: true,
									})}
									onChange={({
										color,
										paletteColor,
										paletteStatus,
										paletteOpacity,
									}) => {
										onChange({
											[getAttributeKey(
												'background-palette-status',
												true,
												'',
												breakpoint
											)]: paletteStatus,
											[getAttributeKey(
												'background-palette-color',
												true,
												'',
												breakpoint
											)]: paletteColor,
											[getAttributeKey(
												'background-palette-opacity',
												true,
												'',
												breakpoint
											)]: paletteOpacity,
											[getAttributeKey(
												'background-color',
												true,
												'',
												breakpoint
											)]: color,
										});
									}}
									deviceType={breakpoint}
								/>
							)}
						</>
					),
				},
			]}
		/>
	);
};
export default AccordionBackgroundSettings;
