/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { Fragment, useState } = wp.element;
const { Icon } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';
import { getLastBreakpointValue } from '../../utils';
import ColorControl from '../color-control';
import FontIconPicker from '../font-icon-picker';
import AxisControl from '../axis-control';
import BorderControl from '../border-control';
import BackgroundControl from '../background-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';
import presetsStyles from './presets';
import * as attributesData from '../../extensions/styles/defaults';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	backgroundColor,
	solid,
	backgroundGradient,
	fontIconSettings,
	PresetSeven,
	PresetEight,
	PresetNine,
} from '../../icons';

/**
 * Component
 */
const FontIconControl = props => {
	const {
		className,
		icon,
		onChange,
		breakpoint,
		disableSpacing = false,
		disablePosition = false,
		disablePadding = false,
		disableBackground = false,
		disableBorder = false,
		disablePresets = false,
		padding,
		onChangePadding,
		border,
		onChangeBorder,
		background,
		onChangeBackground,
	} = props;

	const [activeOption, setActiveOption] = useState('iconColor');

	const value = !isObject(icon) ? JSON.parse(icon) : icon;

	const backgroundValue =
		!disableBackground && !isObject(background)
			? JSON.parse(background)
			: background;

	const getOptions = () => {
		const options = [
			...[
				{
					label: <Icon icon={fontIconSettings} />,
					value: 'iconColor',
				},
			],
			...(!disableBackground && [
				{
					label: <Icon icon={backgroundColor} />,
					value: 'backgroundColor',
				},
			]),
			...(!disableBackground && [
				{
					label: <Icon icon={backgroundGradient()} />,
					value: 'backgroundGradient',
				},
			]),
			...(!disableBorder && [
				{
					label: <Icon icon={solid} />,
					value: 'border',
				},
			]),
		];

		return options;
	};

	const classes = classnames('maxi-font-icon-control', className);

	const onChangePreset = presetNumber => {
		const paddingValue = !isObject(padding) ? JSON.parse(padding) : padding;

		const backgroundValue = !isObject(background)
			? JSON.parse(background)
			: background;

		const borderValue = !isObject(border) ? JSON.parse(border) : border;

		// Set Icon Settings
		value.icon = presetsStyles[presetNumber].icon;
		value.position = presetsStyles[presetNumber].position;
		value.general.spacing = presetsStyles[presetNumber].spacing;

		onChange(JSON.stringify(value));

		// Set Icon Background
		backgroundValue.activeMedia = 'color';

		backgroundValue.colorOptions.activeColor =
			presetsStyles[presetNumber].background;
		backgroundValue.colorOptions.color =
			presetsStyles[presetNumber].background;

		onChangeBackground(JSON.stringify(backgroundValue));

		// Set Icon padding
		paddingValue.general.unit = 'px';
		paddingValue.general['padding-top'] =
			presetsStyles[presetNumber].padding;
		paddingValue.general['padding-right'] =
			presetsStyles[presetNumber].padding;
		paddingValue.general['padding-bottom'] =
			presetsStyles[presetNumber].padding;
		paddingValue.general['padding-left'] =
			presetsStyles[presetNumber].padding;
		onChangePadding(JSON.stringify(paddingValue));

		// Icon border
		borderValue.general['border-style'] = 'solid';
		borderValue.general['border-color'] =
			presetsStyles[presetNumber].borderColor;
		borderValue.borderWidth.general['border-bottom-width'] =
			presetsStyles[presetNumber].borderWidth;
		borderValue.borderWidth.general['border-top-width'] =
			presetsStyles[presetNumber].borderWidth;
		borderValue.borderWidth.general['border-right-width'] =
			presetsStyles[presetNumber].borderWidth;
		borderValue.borderWidth.general['border-left-width'] =
			presetsStyles[presetNumber].borderWidth;
		borderValue.borderWidth.unit = 'px';

		console.log(borderValue);

		onChangeBorder(JSON.stringify(borderValue));
	};

	return (
		<div className={classes}>
			<FontIconPicker
				iconClassName={value.icon}
				onChange={iconClassName => {
					value.icon = iconClassName;
					onChange(JSON.stringify(value));
				}}
			/>
			{value.icon && (
				<Fragment>
					{!disablePresets && (
						<div className='maxi-font-icon-control__presets'>
							<span
								className='maxi-font-icon-control__icon'
								onClick={() => onChangePreset(1)}
							>
								<PresetSeven />
							</span>
							<span
								className='maxi-font-icon-control__icon'
								onClick={() => onChangePreset(2)}
							>
								<PresetEight />
							</span>
							<span
								className='maxi-font-icon-control__icon'
								onClick={() => onChangePreset(3)}
							>
								<PresetNine />
							</span>
						</div>
					)}
					<SizeControl
						label={__('Size', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'font-sizeUnit',
							breakpoint
						)}
						defaultUnit='px'
						onChangeUnit={val => {
							value[breakpoint]['font-sizeUnit'] = val;
							onChange(JSON.stringify(value));
						}}
						defaultValue=''
						value={getLastBreakpointValue(
							value,
							'font-size',
							breakpoint
						)}
						onChangeValue={val => {
							value[breakpoint]['font-size'] = val;
							onChange(JSON.stringify(value));
						}}
						minMaxSettings={{
							px: {
								min: 0,
								max: 99,
							},
							em: {
								min: 0,
								max: 99,
							},
							vw: {
								min: 0,
								max: 99,
							},
							'%': {
								min: 0,
								max: 100,
							},
						}}
					/>
					{!disableSpacing && (
						<SizeControl
							label={__('Spacing', 'maxi-blocks')}
							unit={getLastBreakpointValue(
								value,
								'spacing',
								breakpoint
							)}
							disableUnit
							defaultValue=''
							value={getLastBreakpointValue(
								value,
								'spacing',
								breakpoint
							)}
							onChangeValue={val => {
								value[breakpoint].spacing = val;
								onChange(JSON.stringify(value));
							}}
							min={0}
							max={99}
						/>
					)}

					{!disablePosition && (
						<SelectControl
							label={__('Position', 'maxi-blocks')}
							value={value.position}
							options={[
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
								value.position = val;
								onChange(JSON.stringify(value));
							}}
						/>
					)}

					{getOptions().length > 1 && (
						<__experimentalFancyRadioControl
							label={__('Colour', 'maxi-blocks')}
							selected={activeOption}
							options={getOptions()}
							onChange={item => {
								if (item === 'iconColor')
									setActiveOption('iconColor');
								if (item === 'backgroundColor') {
									backgroundValue.activeMedia = 'color';
									onChangeBackground(
										JSON.stringify(backgroundValue)
									);
									setActiveOption('backgroundColor');
								}
								if (item === 'backgroundGradient') {
									backgroundValue.activeMedia = 'gradient';
									onChangeBackground(
										JSON.stringify(backgroundValue)
									);
									setActiveOption('backgroundGradient');
								}
								if (item === 'border')
									setActiveOption('border');

								onChange(JSON.stringify(value));
							}}
						/>
					)}

					{activeOption === 'iconColor' && (
						<ColorControl
							label={__('Icon', 'maxi-blocks')}
							color={getLastBreakpointValue(
								value,
								'color',
								breakpoint
							)}
							defaultColor='#fff'
							onChange={val => {
								value[breakpoint].color = val;
								onChange(JSON.stringify(value));
							}}
						/>
					)}

					{!disableBorder && activeOption === 'border' && (
						<BorderControl
							border={border}
							defaultBorder={attributesData.border}
							onChange={border => onChangeBorder(border)}
							breakpoint={breakpoint}
						/>
					)}

					{!disableBackground &&
						activeOption === 'backgroundColor' && (
							<BackgroundControl
								background={background}
								defaultBackground={attributesData.background}
								onChange={background =>
									onChangeBackground(background)
								}
								disableImage
								disableVideo
								disableClipPath
								disableSVG
								disableGradient
								disableNoneStyle
							/>
						)}

					{!disableBackground &&
						activeOption === 'backgroundGradient' && (
							<BackgroundControl
								background={background}
								defaultBackground={attributesData.background}
								onChange={background =>
									onChangeBackground(background)
								}
								disableImage
								disableVideo
								disableClipPath
								disableSVG
								disableColor
								disableNoneStyle
							/>
						)}

					{!disablePadding && (
						<__experimentalFancyRadioControl
							label={__('Use Custom Padding', 'maxi-blocks')}
							selected={value.customPadding}
							options={[
								{
									label: __('No', 'maxi-blocks'),
									value: '0',
								},
								{
									label: __('Yes', 'maxi-blocks'),
									value: '1',
								},
							]}
							onChange={customPadding => {
								value.customPadding = customPadding;
								onChange(JSON.stringify(value));
								if (!Number(customPadding))
									onChangePadding(
										JSON.stringify(attributesData.padding)
									);
							}}
						/>
					)}
					{!disablePadding && !!Number(value.customPadding) && (
						<AxisControl
							values={padding}
							defaultValues={attributesData.padding}
							onChange={padding => onChangePadding(padding)}
							breakpoint={breakpoint}
							disableAuto
						/>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default FontIconControl;
