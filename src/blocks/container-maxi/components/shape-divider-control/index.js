/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	ColorControl,
	Dropdown,
	OpacityControl,
	ResponsiveTabsControl,
	SettingTabsControl,
	ToggleSwitch,
} from '../../../../components';
import {
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

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
} from '../../../../icons';

/**
 * Component
 */
const ShapeDividerControl = props => {
	const { onChangeInline, onChange, breakpoint } = props;
	const [
		shapeDividerTopShapeStyle,
		shapeDividerBottomShapeStyle,
		shapeDividerTopStatus,
		shapeDividerTopEffectsStatus,
		shapeDividerBottomStatus,
		shapeDividerBottomEffectsStatus,
	] = getAttributesValue({
		target: ['sdt_ss', 'sdb_ss', 'sdt.s', 'sdt_ef.s', 'sdb.s', 'sdb_ef.s'],
		props,
	});

	const shapeItemsTop = [
		{ label: __('None', 'max-block'), value: '' },
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
		{ label: __('None', 'max-block'), value: '' },
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
				? shapeDividerTopShapeStyle
				: shapeDividerBottomShapeStyle
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
				return __('Divider style', 'max-block');
		}
	};

	return (
		<div className='maxi-shape-divider-control'>
			<SettingTabsControl
				items={[
					{
						label: __('Top shape divider', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									className='shape-divider-top-status'
									label={__(
										'Enable top shape divider',
										'maxi-blocks'
									)}
									selected={shapeDividerTopStatus}
									onChange={val =>
										onChange({
											'sdt.s': val,
										})
									}
								/>
								{!!shapeDividerTopStatus && (
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
														shapeDividerTopShapeStyle
													}
													items={shapeItemsTop}
													onChange={shapeStyle => {
														onChange({
															sdt_ss: shapeStyle,
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
															target: 'sdt_o',
															breakpoint,
															attributes: props,
														}
													)}
													breakpoint={breakpoint}
													prefix='sdt-'
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
															target: 'sdt_cc',
															breakpoint,
															attributes: props,
														}
													)}
													prefix='sdt-'
													paletteColor={getLastBreakpointAttribute(
														{
															target: 'sdt_pc',
															breakpoint,
															attributes: props,
														}
													)}
													paletteStatus={getLastBreakpointAttribute(
														{
															target: 'sdt_ps',
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
													}) =>
														onChange({
															[getAttributeKey({
																key: '_cc',
																prefix: 'sdt-',
																breakpoint,
															})]: color,
															[getAttributeKey({
																key: '_pc',
																prefix: 'sdt-',
																breakpoint,
															})]: paletteColor,
															[getAttributeKey({
																key: '_ps',
																prefix: 'sdt-',
																breakpoint,
															})]: paletteStatus,
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
															target: 'sdt_h.u',
															breakpoint,
															attributes: props,
														}
													)}
													allowedUnits={['px']}
													onChangeUnit={val =>
														onChange({
															[`sdt_h.u-${breakpoint}`]:
																val,
														})
													}
													value={getLastBreakpointAttribute(
														{
															target: 'sdt_h',
															breakpoint,
															attributes: props,
														}
													)}
													onChangeValue={val =>
														onChange({
															[`sdt_h-${breakpoint}`]:
																val,
														})
													}
													onReset={() =>
														onChange({
															[`sdt_h-${breakpoint}`]:
																getDefaultAttribute(
																	[
																		`sdt_h-${breakpoint}`,
																	]
																),
															[`sdt_h.u-${breakpoint}`]:
																getDefaultAttribute(
																	[
																		`sdt_h.u-${breakpoint}`,
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
														shapeDividerTopEffectsStatus
													}
													onChange={val =>
														onChange({
															'sdt_ef.s': val,
														})
													}
												/>
											</>
										</ResponsiveTabsControl>
									</>
								)}
							</>
						),
						extraIndicators: ['sdt.s'],
					},
					{
						label: __('Bottom shape divider', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									className='shape-divider-bottom-status'
									label={__(
										'Enable bottom shape divider',
										'maxi-blocks'
									)}
									selected={shapeDividerBottomStatus}
									onChange={val =>
										onChange({
											'sdb.s': val,
										})
									}
								/>
								{!!shapeDividerBottomStatus && (
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
														shapeDividerBottomShapeStyle
													}
													items={shapeItemsBottom}
													onChange={shapeStyle => {
														onChange({
															sdb_ss: shapeStyle,
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
															target: 'sdb_o',
															breakpoint,
															attributes: props,
														}
													)}
													breakpoint={breakpoint}
													prefix='sdb-'
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
															target: 'sdb_cc',
															breakpoint,
															attributes: props,
														}
													)}
													prefix='sdb-'
													paletteColor={getLastBreakpointAttribute(
														{
															target: 'sdb_pc',
															breakpoint,
															attributes: props,
														}
													)}
													paletteStatus={getLastBreakpointAttribute(
														{
															target: 'sdb_ps',
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
													}) =>
														onChange({
															[getAttributeKey({
																key: '_cc',
																prefix: 'sdb-',
																breakpoint,
															})]: color,
															[getAttributeKey({
																key: '_pc',
																prefix: 'sdb-',
																breakpoint,
															})]: paletteColor,
															[getAttributeKey({
																key: '_ps',
																prefix: 'sdb-',
																breakpoint,
															})]: paletteStatus,
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
															target: 'sdb_h.u',
															breakpoint,
															attributes: props,
														}
													)}
													allowedUnits={['px']}
													onChangeUnit={val =>
														onChange({
															[`sdb_h.u-${breakpoint}`]:
																val,
														})
													}
													value={getLastBreakpointAttribute(
														{
															target: 'sdb_h',
															breakpoint,
															attributes: props,
														}
													)}
													onChangeValue={val =>
														onChange({
															[`sdb_h-${breakpoint}`]:
																val,
														})
													}
													onReset={() =>
														onChange({
															[`sdb_h-${breakpoint}`]:
																getDefaultAttribute(
																	[
																		`sdb_h-${breakpoint}`,
																	]
																),
															[`sdb_h.u-${breakpoint}`]:
																getDefaultAttribute(
																	[
																		`sdb_h.u-${breakpoint}`,
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
														shapeDividerBottomEffectsStatus
													}
													onChange={val =>
														onChange({
															'sdb_ef.s': val,
														})
													}
												/>
											</>
										</ResponsiveTabsControl>
									</>
								)}
							</>
						),
						extraIndicators: ['sdb.s'],
					},
				]}
			/>
		</div>
	);
};

export default ShapeDividerControl;
