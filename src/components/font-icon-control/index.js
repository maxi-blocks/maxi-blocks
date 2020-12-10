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
import { merge } from 'lodash';

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';
import ColorControl from '../color-control';
import FontIconPicker from '../font-icon-picker';
import AxisControl from '../axis-control';
import BorderControl from '../border-control';
import BackgroundControl from '../background-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';
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
	const { className, onChange, breakpoint, simpleMode = false } = props;

	const [activeOption, setActiveOption] = useState('iconColor');

	const classes = classnames('maxi-font-icon-control', className);

	const icon = { ...props.icon };
	const iconBackground = { ...props.iconBackground };
	const iconPadding = { ...props.iconPadding };
	const iconBorder = { ...props.iconBorder };

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
			icon,
			iconBackground,
			iconPadding,
			iconBorder,
		};

		const result = merge(response, defaultPresets[`preset${number}`]);

		Object.entries(result).forEach(([key, value]) => {
			result[key] = value;
		});

		onChange(result);
	};

	return (
		<div className={classes}>
			<FontIconPicker
				iconClassName={icon.icon}
				onChange={iconClassName => {
					icon.icon = iconClassName;
					onChange({ icon });
				}}
			/>
			{icon.icon && (
				<Fragment>
					<SizeControl
						label={__('Size', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							icon,
							'font-sizeUnit',
							breakpoint
						)}
						defaultUnit='px'
						onChangeUnit={val => {
							icon[breakpoint]['font-sizeUnit'] = val;
							onChange({ icon });
						}}
						defaultValue=''
						value={getLastBreakpointValue(
							icon,
							'font-size',
							breakpoint
						)}
						onChangeValue={val => {
							icon[breakpoint]['font-size'] = val;
							onChange({ icon });
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
									icon,
									'spacing',
									breakpoint
								)}
								disableUnit
								defaultValue=''
								value={getLastBreakpointValue(
									icon,
									'spacing',
									breakpoint
								)}
								onChangeValue={val => {
									icon[breakpoint].spacing = val;
									onChange({
										icon,
									});
								}}
								min={0}
								max={99}
							/>

							<__experimentalFancyRadioControl
								label={__('Icon Position', 'maxi-blocks')}
								selected={icon.position}
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
									icon.position = val;
									onChange({
										icon,
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
						<__experimentalFancyRadioControl
							label=''
							selected={activeOption}
							options={getOptions()}
							fullWidthMode
							onChange={item => {
								if (item === 'iconColor')
									setActiveOption('iconColor');
								if (item === 'backgroundColor') {
									iconBackground.activeMedia = 'color';
									onChange({
										iconBackground,
									});
									setActiveOption('backgroundColor');
								}
								if (item === 'backgroundGradient') {
									iconBackground.activeMedia = 'gradient';
									onChange({
										iconBackground,
									});
									setActiveOption('backgroundGradient');
								}
								if (item === 'border')
									setActiveOption('border');

								onChange({ icon });
							}}
						/>
					)}

					{activeOption === 'iconColor' && (
						<ColorControl
							label={__('Icon', 'maxi-blocks')}
							color={getLastBreakpointValue(
								icon,
								'color',
								breakpoint
							)}
							defaultColor='#fff'
							onChange={val => {
								icon[breakpoint].color = val;
								onChange({ icon });
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
						<__experimentalFancyRadioControl
							label={__('Use Custom Padding', 'maxi-blocks')}
							selected={icon.customPadding}
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
								icon.customPadding = customPadding;
								onChange({ icon });
								if (!Number(customPadding))
									onChange({
										iconPadding: getDefaultProp(
											null,
											'iconPadding'
										),
									});
							}}
						/>
					)}
					{!simpleMode && !!Number(icon.customPadding) && (
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
