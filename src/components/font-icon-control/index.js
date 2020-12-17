/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, useState } = wp.element;
const { Icon } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, merge } from 'lodash';

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';
import ColorControl from '../color-control';
import FontIconPicker from '../font-icon-picker';
import AxisControl from '../axis-control';
import BorderControl from '../border-control';
import BackgroundControl from '../background-control';
import FancyRadioControl from '../fancy-radio-control';
import { getLastBreakpointValue, getDefaultProp } from '../../utils';
import * as defaultPresets from './defaults';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	backgroundColor,
	solid,
	backgroundGradient,
	fontIconSettings,
	presetThree,
	presetSeven,
	presetEight,
} from '../../icons';
import DefaultStylesControl from '../default-styles-control';

/**
 * Component
 */
const FontIconControl = props => {
	const {
		className,
		icon,
		onChange,
		breakpoint,
		iconPadding,
		iconBorder,
		iconBackground,
		simpleMode = false,
		disableColor = false,
	} = props;

	const [activeOption, setActiveOption] = useState('iconColor');

	const classes = classnames('maxi-font-icon-control', className);

	const iconValue = !isObject(icon) ? JSON.parse(icon) : icon;
	const backgroundValue =
		!simpleMode && !isObject(iconBackground)
			? JSON.parse(iconBackground)
			: iconBackground;
	const iconPaddingValue =
		!simpleMode && !isObject(iconPadding)
			? JSON.parse(iconPadding)
			: iconPadding;
	const iconBorderValue =
		!simpleMode && !isObject(iconBorder)
			? JSON.parse(iconBorder)
			: iconBorder;

	const getOptions = () => {
		const options = [
			...[
				{
					label: <Icon icon={fontIconSettings} />,
					value: 'iconColor',
				},
			],
			...(!simpleMode && [
				{
					label: <Icon icon={backgroundColor} />,
					value: 'backgroundColor',
				},
			]),
			...(!simpleMode && [
				{
					label: <Icon icon={backgroundGradient()} />,
					value: 'backgroundGradient',
				},
			]),
			...(!simpleMode && [
				{
					label: <Icon icon={solid} />,
					value: 'border',
				},
			]),
		];

		return options;
	};

	const onChangePreset = number => {
		const response = {
			icon: iconValue,
			iconBackground: backgroundValue,
			iconPadding: iconPaddingValue,
			iconBorder: iconBorderValue,
		};

		const result = merge(response, defaultPresets[`preset${number}`]);

		Object.entries(result).forEach(([key, value]) => {
			result[key] = JSON.stringify(value);
		});

		onChange(result);
	};

	return (
		<div className={classes}>
			<FontIconPicker
				iconClassName={iconValue.icon}
				onChange={iconClassName => {
					iconValue.icon = iconClassName;
					onChange({ icon: JSON.stringify(iconValue) });
				}}
			/>
			{iconValue.icon && (
				<Fragment>
					<SizeControl
						label={__('Size', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							iconValue,
							'font-sizeUnit',
							breakpoint
						)}
						defaultUnit='px'
						onChangeUnit={val => {
							iconValue[breakpoint]['font-sizeUnit'] = val;
							onChange({ icon: JSON.stringify(iconValue) });
						}}
						defaultValue=''
						value={getLastBreakpointValue(
							iconValue,
							'font-size',
							breakpoint
						)}
						onChangeValue={val => {
							iconValue[breakpoint]['font-size'] = val;
							onChange({ icon: JSON.stringify(iconValue) });
						}}
						minMaxSettings={{
							px: {
								min: 0,
								max: 300,
							},
							em: {
								min: 0,
								max: 300,
							},
							vw: {
								min: 0,
								max: 100,
							},
							'%': {
								min: 0,
								max: 100,
							},
						}}
					/>
					{!simpleMode && (
						<Fragment>
							<SizeControl
								label={__('Spacing', 'maxi-blocks')}
								unit={getLastBreakpointValue(
									iconValue,
									'spacing',
									breakpoint
								)}
								disableUnit
								defaultValue=''
								value={getLastBreakpointValue(
									iconValue,
									'spacing',
									breakpoint
								)}
								onChangeValue={val => {
									iconValue[breakpoint].spacing = val;
									onChange({
										icon: JSON.stringify(iconValue),
									});
								}}
								min={0}
								max={99}
							/>

							<FancyRadioControl
								label={__('Icon Position', 'maxi-blocks')}
								selected={iconValue.position}
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
									iconValue.position = val;
									onChange({
										icon: JSON.stringify(iconValue),
									});
								}}
							/>
						</Fragment>
					)}
					{!simpleMode && (
						<DefaultStylesControl
							className='maxi-icon-default-styles'
							items={[
								{
									activeItem: false,
									content: <Icon icon={presetSeven} />,
									onChange: () => onChangePreset(1),
								},
								{
									activeItem: false,
									content: <Icon icon={presetThree} />,
									onChange: () => onChangePreset(2),
								},
								{
									activeItem: false,
									content: <Icon icon={presetEight} />,
									onChange: () => onChangePreset(3),
								},
							]}
						/>
					)}
					{getOptions().length > 1 && (
						<FancyRadioControl
							label=''
							selected={activeOption}
							options={getOptions()}
							fullWidthMode
							onChange={item => {
								if (item === 'iconColor')
									setActiveOption('iconColor');
								if (item === 'backgroundColor') {
									backgroundValue.activeMedia = 'color';
									onChange({
										iconBackground: JSON.stringify(
											backgroundValue
										),
									});
									setActiveOption('backgroundColor');
								}
								if (item === 'backgroundGradient') {
									backgroundValue.activeMedia = 'gradient';
									onChange({
										iconBackground: JSON.stringify(
											backgroundValue
										),
									});
									setActiveOption('backgroundGradient');
								}
								if (item === 'border')
									setActiveOption('border');

								onChange({ icon: JSON.stringify(iconValue) });
							}}
						/>
					)}

					{activeOption === 'iconColor' && !disableColor && (
						<ColorControl
							label={__('Icon', 'maxi-blocks')}
							color={getLastBreakpointValue(
								iconValue,
								'color',
								breakpoint
							)}
							defaultColor='#fff'
							onChange={val => {
								iconValue[breakpoint].color = val;
								onChange({
									icon: JSON.stringify(iconValue),
								});
							}}
						/>
					)}

					{!simpleMode && activeOption === 'border' && (
						<BorderControl
							border={iconBorder}
							defaultBorder={getDefaultProp(null, 'iconBorder')}
							onChange={border =>
								onChange({ iconBorder: border })
							}
							breakpoint={breakpoint}
						/>
					)}

					{!simpleMode && activeOption === 'backgroundColor' && (
						<BackgroundControl
							background={iconBackground}
							defaultBackground={getDefaultProp(
								null,
								'iconBackground'
							)}
							onChange={background =>
								onChange({ iconBackground: background })
							}
							disableImage
							disableVideo
							disableClipPath
							disableSVG
							disableGradient
							disableNoneStyle
						/>
					)}

					{!simpleMode && activeOption === 'backgroundGradient' && (
						<BackgroundControl
							background={iconBackground}
							defaultBackground={getDefaultProp(
								null,
								'iconBackground'
							)}
							onChange={background =>
								onChange({ iconBackground: background })
							}
							disableImage
							disableVideo
							disableClipPath
							disableSVG
							disableColor
							disableNoneStyle
						/>
					)}

					{!simpleMode && (
						<FancyRadioControl
							label={__('Use Custom Padding', 'maxi-blocks')}
							selected={iconValue.customPadding}
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
								iconValue.customPadding = customPadding;
								onChange({ icon: JSON.stringify(iconValue) });
								if (!Number(customPadding))
									onChange({
										iconPadding: JSON.stringify(
											getDefaultProp(null, 'iconPadding')
										),
									});
							}}
						/>
					)}
					{!simpleMode && !!Number(iconValue.customPadding) && (
						<AxisControl
							values={iconPadding}
							defaultValues={getDefaultProp(null, 'iconPadding')}
							onChange={padding =>
								onChange({ iconPadding: padding })
							}
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
