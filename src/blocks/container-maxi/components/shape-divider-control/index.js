/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ColorControl from '@components/color-control';
import Dropdown from '@components/dropdown';
import OpacityControl from '@components/opacity-control';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SettingTabsControl from '@components/setting-tabs-control';
import ToggleSwitch from '@components/toggle-switch';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	wavesTop,
	wavesBottom,
	wavesTopOpacity,
	wavesBottomOpacity,
	waveTop,
	waveBottom,
	waveTopOpacity,
	waveBottomOpacity,
	triangleTop,
	triangleBottom,
	swishTop,
	swishBottom,
	swishTopOpacity,
	swishBottomOpacity,
	slantTop,
	slantBottom,
	slantTopOpacity,
	slantBottomOpacity,
	peakTop,
	peakBottom,
	mountainsTop,
	mountainsBottom,
	mountainsTopOpacity,
	mountainsBottomOpacity,
	curveTop,
	curveBottom,
	curveTopOpacity,
	curveBottomOpacity,
	arrowTop,
	arrowBottom,
	arrowTopOpacity,
	arrowBottomOpacity,
	asymmetricTop,
	asymmetricBottom,
	asymmetricTopOpacity,
	asymmetricBottomOpacity,
	cloudTop,
	cloudBottom,
	cloudTopOpacity,
	cloudBottomOpacity,
} from '@maxi-icons';

/**
 * Component
 */
const ShapeDividerControl = props => {
	const { onChangeInline, onChange, breakpoint } = props;

	const shapeItemsTop = [
		{ label: __('None', 'maxi-blocks'), value: '' },
		{ icon: wavesTop, value: 'waves-top' },
		{ icon: wavesTopOpacity, value: 'waves-top-opacity' },
		{ icon: waveTop, value: 'wave-top' },
		{ icon: waveTopOpacity, value: 'wave-top-opacity' },
		{ icon: triangleTop, value: 'triangle-top' },
		{ icon: swishTop, value: 'swish-top' },
		{ icon: swishTopOpacity, value: 'swish-top-opacity' },
		{ icon: slantTop, value: 'slant-top' },
		{ icon: slantTopOpacity, value: 'slant-top-opacity' },
		{ icon: peakTop, value: 'peak-top' },
		{ icon: mountainsTop, value: 'mountains-top' },
		{ icon: mountainsTopOpacity, value: 'mountains-top-opacity' },
		{ icon: curveTop, value: 'curve-top' },
		{ icon: curveTopOpacity, value: 'curve-top-opacity' },
		{ icon: arrowTop, value: 'arrow-top' },
		{ icon: arrowTopOpacity, value: 'arrow-top-opacity' },
		{ icon: asymmetricTop, value: 'asymmetric-top' },
		{ icon: asymmetricTopOpacity, value: 'asymmetric-top-opacity' },
		{ icon: cloudTop, value: 'cloud-top' },
		{ icon: cloudTopOpacity, value: 'cloud-top-opacity' },
	];

	const shapeItemsBottom = [
		{ label: __('None', 'maxi-blocks'), value: '' },
		{ icon: wavesBottom, value: 'waves-bottom' },
		{ icon: wavesBottomOpacity, value: 'waves-bottom-opacity' },
		{ icon: waveBottom, value: 'wave-bottom' },
		{ icon: waveBottomOpacity, value: 'wave-bottom-opacity' },
		{ icon: triangleBottom, value: 'triangle-bottom' },
		{ icon: swishBottom, value: 'swish-bottom' },
		{ icon: swishBottomOpacity, value: 'swish-bottom-opacity' },
		{ icon: slantBottom, value: 'slant-bottom' },
		{ icon: slantBottomOpacity, value: 'slant-bottom-opacity' },
		{ icon: peakBottom, value: 'peak-bottom' },
		{ icon: mountainsBottom, value: 'mountains-bottom' },
		{ icon: mountainsBottomOpacity, value: 'mountains-bottom-opacity' },
		{ icon: curveBottom, value: 'curve-bottom' },
		{ icon: curveBottomOpacity, value: 'curve-bottom-opacity' },
		{ icon: arrowBottom, value: 'arrow-bottom' },
		{ icon: arrowBottomOpacity, value: 'arrow-bottom-opacity' },
		{ icon: asymmetricBottom, value: 'asymmetric-bottom' },
		{ icon: asymmetricBottomOpacity, value: 'asymmetric-bottom-opacity' },
		{ icon: cloudBottom, value: 'cloud-bottom' },
		{ icon: cloudBottomOpacity, value: 'cloud-bottom-opacity' },
	];

	const showShapes = position => {
		switch (
			position === 'top'
				? props['shape-divider-top-shape-style']
				: props['shape-divider-bottom-shape-style']
		) {
			case 'waves-top':
				return wavesTop;
			case 'waves-bottom':
				return wavesBottom;
			case 'waves-top-opacity':
				return wavesTopOpacity;
			case 'waves-bottom-opacity':
				return wavesBottomOpacity;
			case 'wave-top':
				return waveTop;
			case 'wave-bottom':
				return waveBottom;
			case 'wave-top-opacity':
				return waveTopOpacity;
			case 'wave-bottom-opacity':
				return waveBottomOpacity;
			case 'triangle-top':
				return triangleTop;
			case 'triangle-bottom':
				return triangleBottom;
			case 'swish-top':
				return swishTop;
			case 'swish-bottom':
				return swishBottom;
			case 'swish-top-opacity':
				return swishTopOpacity;
			case 'swish-bottom-opacity':
				return swishBottomOpacity;
			case 'slant-top':
				return slantTop;
			case 'slant-bottom':
				return slantBottom;
			case 'slant-top-opacity':
				return slantTopOpacity;
			case 'slant-bottom-opacity':
				return slantBottomOpacity;
			case 'peak-top':
				return peakTop;
			case 'peak-bottom':
				return peakBottom;
			case 'mountains-top':
				return mountainsTop;
			case 'mountains-bottom':
				return mountainsBottom;
			case 'mountains-top-opacity':
				return mountainsTopOpacity;
			case 'mountains-bottom-opacity':
				return mountainsBottomOpacity;
			case 'curve-top':
				return curveTop;
			case 'curve-bottom':
				return curveBottom;
			case 'curve-top-opacity':
				return curveTopOpacity;
			case 'curve-bottom-opacity':
				return curveBottomOpacity;
			case 'arrow-top':
				return arrowTop;
			case 'arrow-bottom':
				return arrowBottom;
			case 'arrow-top-opacity':
				return arrowTopOpacity;
			case 'arrow-bottom-opacity':
				return arrowBottomOpacity;
			case 'asymmetric-top':
				return asymmetricTop;
			case 'asymmetric-bottom':
				return asymmetricBottom;
			case 'asymmetric-top-opacity':
				return asymmetricTopOpacity;
			case 'asymmetric-bottom-opacity':
				return asymmetricBottomOpacity;
			case 'cloud-top':
				return cloudTop;
			case 'cloud-bottom':
				return cloudBottom;
			case 'cloud-top-opacity':
				return cloudTopOpacity;
			case 'cloud-bottom-opacity':
				return cloudBottomOpacity;
			default:
				return __('Divider style', 'maxi-blocks');
		}
	};

	return (
		<div className='maxi-shape-divider-control'>
			<SettingTabsControl
				items={[
					{
						label: __('Top shape', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									className='shape-divider-top-status'
									label={__(
										'Enable top shape divider',
										'maxi-blocks'
									)}
									selected={props['shape-divider-top-status']}
									onChange={val =>
										onChange({
											'shape-divider-top-status': val,
										})
									}
								/>
								{!!props['shape-divider-top-status'] && (
									<>
										<Dropdown
											className='maxi-shape-divider-control__shape-selector'
											contentClassName='maxi-shape-divider-control_popover'
											position='bottom center'
											renderToggle={({
												isOpen,
												onToggle,
											}) => (
												<button
													className='maxi-shape-divider-control__shape-selector__display'
													onClick={onToggle}
													type='button'
												>
													{showShapes('top')}
												</button>
											)}
											renderContent={({ onClose }) => (
												<SettingTabsControl
													type='buttons'
													className='maxi-shape-divider-control__shape-list'
													selected={
														props[
															'shape-divider-top-shape-style'
														]
													}
													items={shapeItemsTop}
													onChange={shapeStyle => {
														onChange({
															'shape-divider-top-shape-style':
																shapeStyle,
														});
														onClose();
													}}
												/>
											)}
										/>
										<ResponsiveTabsControl
											breakpoint={breakpoint}
										>
											<>
												<OpacityControl
													label={__(
														'Colour opacity',
														'maxi-blocks'
													)}
													opacity={getLastBreakpointAttribute(
														{
															target: 'shape-divider-top-opacity',
															breakpoint,
															attributes: props,
														}
													)}
													breakpoint={breakpoint}
													prefix='shape-divider-top-'
													onChange={onChange}
													disableRTC
												/>
												<ColorControl
													label={__(
														'Divider',
														'maxi-blocks'
													)}
													color={getLastBreakpointAttribute(
														{
															target: 'shape-divider-top-color',
															breakpoint,
															attributes: props,
														}
													)}
													prefix='shape-divider-top-'
													paletteColor={getLastBreakpointAttribute(
														{
															target: 'shape-divider-top-palette-color',
															breakpoint,
															attributes: props,
														}
													)}
													paletteStatus={getLastBreakpointAttribute(
														{
															target: 'shape-divider-top-palette-status',
															breakpoint,
															attributes: props,
														}
													)}
													paletteSCStatus={getLastBreakpointAttribute(
														{
															target: 'shape-divider-top-palette-sc-status',
															breakpoint,
															attributes: props,
														}
													)}
													onChangeInline={({
														color,
													}) =>
														onChangeInline({
															fill: color,
														})
													}
													onChange={({
														color,
														paletteColor,
														paletteStatus,
														paletteSCStatus,
													}) =>
														onChange({
															[`shape-divider-top-color-${breakpoint}`]:
																color,
															[`shape-divider-top-palette-color-${breakpoint}`]:
																paletteColor,
															[`shape-divider-top-palette-status-${breakpoint}`]:
																paletteStatus,
															[`shape-divider-top-palette-sc-status-${breakpoint}`]:
																paletteSCStatus,
														})
													}
													disableOpacity
												/>
												<AdvancedNumberControl
													className='maxi-shape-divider-control__height'
													label={__(
														'Divider height',
														'maxi-blocks'
													)}
													enableUnit
													unit={getLastBreakpointAttribute(
														{
															target: 'shape-divider-top-height-unit',
															breakpoint,
															attributes: props,
														}
													)}
													allowedUnits={['px']}
													onChangeUnit={val =>
														onChange({
															[`shape-divider-top-height-unit-${breakpoint}`]:
																val,
														})
													}
													value={getLastBreakpointAttribute(
														{
															target: 'shape-divider-top-height',
															breakpoint,
															attributes: props,
														}
													)}
													onChangeValue={(
														val,
														meta
													) =>
														onChange({
															[`shape-divider-top-height-${breakpoint}`]:
																val,
															meta,
														})
													}
													onReset={() =>
														onChange({
															[`shape-divider-top-height-${breakpoint}`]:
																getDefaultAttribute(
																	[
																		`shape-divider-top-height-${breakpoint}`,
																	]
																),
															[`shape-divider-top-height-unit-${breakpoint}`]:
																getDefaultAttribute(
																	[
																		`shape-divider-top-height-unit-${breakpoint}`,
																	]
																),
															isReset: true,
														})
													}
												/>
												<ToggleSwitch
													className='shape-divider-top-effects-status'
													label={__(
														'Enable scroll effect',
														'maxi-blocks'
													)}
													selected={
														props[
															'shape-divider-top-effects-status'
														]
													}
													onChange={val =>
														onChange({
															'shape-divider-top-effects-status':
																val,
														})
													}
												/>
											</>
										</ResponsiveTabsControl>
									</>
								)}
							</>
						),
						extraIndicators: ['shape-divider-top-status'],
					},
					{
						label: __('Bottom shape', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									className='shape-divider-bottom-status'
									label={__(
										'Enable bottom shape divider',
										'maxi-blocks'
									)}
									selected={
										props['shape-divider-bottom-status']
									}
									onChange={val =>
										onChange({
											'shape-divider-bottom-status': val,
										})
									}
								/>
								{!!props['shape-divider-bottom-status'] && (
									<>
										<Dropdown
											className='maxi-shape-divider-control__shape-selector'
											contentClassName='maxi-shape-divider-control_popover'
											position='bottom center'
											renderToggle={({
												isOpen,
												onToggle,
											}) => (
												<button
													className='maxi-shape-divider-control__shape-selector__display'
													onClick={onToggle}
													type='button'
												>
													{showShapes('bottom')}
												</button>
											)}
											renderContent={({ onClose }) => (
												<SettingTabsControl
													type='buttons'
													className='maxi-shape-divider-control__shape-list'
													selected={
														props[
															'shape-divider-bottom-shape-style'
														]
													}
													items={shapeItemsBottom}
													onChange={shapeStyle => {
														onChange({
															'shape-divider-bottom-shape-style':
																shapeStyle,
														});
														onClose();
													}}
												/>
											)}
										/>
										<ResponsiveTabsControl
											breakpoint={breakpoint}
										>
											<>
												<OpacityControl
													label={__(
														'Colour opacity',
														'maxi-blocks'
													)}
													opacity={getLastBreakpointAttribute(
														{
															target: 'shape-divider-bottom-opacity',
															breakpoint,
															attributes: props,
														}
													)}
													breakpoint={breakpoint}
													prefix='shape-divider-bottom-'
													onChange={onChange}
													disableRTC
												/>
												<ColorControl
													label={__(
														'Divider',
														'maxi-blocks'
													)}
													color={getLastBreakpointAttribute(
														{
															target: 'shape-divider-bottom-color',
															breakpoint,
															attributes: props,
														}
													)}
													prefix='shape-divider-bottom-'
													paletteColor={getLastBreakpointAttribute(
														{
															target: 'shape-divider-bottom-palette-color',
															breakpoint,
															attributes: props,
														}
													)}
													paletteStatus={getLastBreakpointAttribute(
														{
															target: 'shape-divider-bottom-palette-status',
															breakpoint,
															attributes: props,
														}
													)}
													paletteSCStatus={getLastBreakpointAttribute(
														{
															target: 'shape-divider-bottom-palette-sc-status',
															breakpoint,
															attributes: props,
														}
													)}
													onChangeInline={({
														color,
													}) =>
														onChangeInline({
															fill: color,
														})
													}
													onChange={({
														color,
														paletteColor,
														paletteStatus,
														paletteSCStatus,
													}) =>
														onChange({
															[`shape-divider-bottom-color-${breakpoint}`]:
																color,
															[`shape-divider-bottom-palette-color-${breakpoint}`]:
																paletteColor,
															[`shape-divider-bottom-palette-status-${breakpoint}`]:
																paletteStatus,
															[`shape-divider-bottom-palette-sc-status-${breakpoint}`]:
																paletteSCStatus,
														})
													}
													disableOpacity
												/>
												<AdvancedNumberControl
													className='maxi-shape-divider-control__height'
													label={__(
														'Divider height',
														'maxi-blocks'
													)}
													enableUnit
													unit={getLastBreakpointAttribute(
														{
															target: 'shape-divider-bottom-height-unit',
															breakpoint,
															attributes: props,
														}
													)}
													allowedUnits={['px']}
													onChangeUnit={val =>
														onChange({
															[`shape-divider-bottom-height-unit-${breakpoint}`]:
																val,
														})
													}
													value={getLastBreakpointAttribute(
														{
															target: 'shape-divider-bottom-height',
															breakpoint,
															attributes: props,
														}
													)}
													onChangeValue={(
														val,
														meta
													) =>
														onChange({
															[`shape-divider-bottom-height-${breakpoint}`]:
																val,
															meta,
														})
													}
													onReset={() =>
														onChange({
															[`shape-divider-bottom-height-${breakpoint}`]:
																getDefaultAttribute(
																	[
																		`shape-divider-bottom-height-${breakpoint}`,
																	]
																),
															[`shape-divider-bottom-height-unit-${breakpoint}`]:
																getDefaultAttribute(
																	[
																		`shape-divider-bottom-height-unit-${breakpoint}`,
																	]
																),
															isReset: true,
														})
													}
												/>
												<ToggleSwitch
													className='shape-divider-bottom-effects-status'
													label={__(
														'Enable scroll effect',
														'maxi-blocks'
													)}
													selected={
														props[
															'shape-divider-bottom-effects-status'
														]
													}
													onChange={val =>
														onChange({
															'shape-divider-bottom-effects-status':
																val,
														})
													}
												/>
											</>
										</ResponsiveTabsControl>
									</>
								)}
							</>
						),
						extraIndicators: ['shape-divider-bottom-status'],
					},
				]}
			/>
		</div>
	);
};

export default ShapeDividerControl;
