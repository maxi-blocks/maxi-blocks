/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { defaultTypography } from '../../extensions/text';
import AlignmentControl from '../alignment-control';
import ColorControl from '../color-control';
import FancyRadioControl from '../fancy-radio-control';
import FontFamilySelector from '../font-family-selector';
import SelectControl from '../select-control';
import SizeControl from '../size-control';
import TextShadowControl from '../text-shadow-control';
import {
	setFormat,
	getCustomFormatValue,
	withFormatValue,
} from '../../extensions/text/formats';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, trim } from 'lodash';
/**
 * Styles
 */
import './editor.scss';
import SettingTabsControl from '../setting-tabs-control';

/**
 * Component
 */
const breakpoints = ['XXL', 'XL', 'L', 'M', 'S', 'XS'];

const TextOptions = props => {
	const {
		getValue,
		getDefault,
		onChangeFormat,
		prefix,
		minMaxSettings,
		minMaxSettingsLetterSpacing,
		breakpoint,
	} = props;

	return (
		<>
			<SizeControl
				className='maxi-typography-control__size'
				label={__('Size', 'maxi-blocks')}
				unit={getValue(`${prefix}font-size-unit`, breakpoint)}
				defaultUnit={getDefault(`${prefix}font-size-unit`)}
				onChangeUnit={val => {
					onChangeFormat({
						[`${prefix}font-size-unit`]: val,
					});
				}}
				value={trim(getValue(`${prefix}font-size`, breakpoint))}
				defaultValue={getDefault(`${prefix}font-size`)}
				onChangeValue={val => {
					onChangeFormat({
						[`${prefix}font-size`]: val,
					});
				}}
				onReset={() =>
					onChangeFormat({
						[`${prefix}font-size-unit`]: getDefault(
							`${prefix}font-size-unit`
						),
						[`${prefix}font-size`]: getDefault(
							`${prefix}font-size`
						),
					})
				}
				minMaxSettings={minMaxSettings}
			/>
			<SizeControl
				className='maxi-typography-control__line-height'
				label={__('Line Height', 'maxi-blocks')}
				unit={getValue(`${prefix}line-height-unit`, breakpoint) || ''}
				defaultUnit={getDefault(`${prefix}line-height-unit`)}
				onChangeUnit={val => {
					onChangeFormat({
						[`${prefix}line-height-unit`]: val,
					});
				}}
				value={getValue(`${prefix}line-height`, breakpoint)}
				defaultValue={getDefault(`${prefix}line-height`)}
				onChangeValue={val => {
					onChangeFormat({
						[`${prefix}line-height`]: val,
					});
				}}
				onReset={() =>
					onChangeFormat({
						[`${prefix}line-height-unit`]: getDefault(
							`${prefix}line-height-unit`
						),
						[`${prefix}line-height`]: getDefault(
							`${prefix}line-height`
						),
					})
				}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%', 'empty']}
			/>
			<SizeControl
				className='maxi-typography-control__letter-spacing'
				label={__('Letter Spacing', 'maxi-blocks')}
				allowedUnits={['px', 'em', 'vw']}
				unit={getValue(`${prefix}letter-spacing-unit`, breakpoint)}
				defaultUnit={getDefault(`${prefix}letter-spacing-unit`)}
				onChangeUnit={val => {
					onChangeFormat({
						[`${prefix}letter-spacing-unit`]: val,
					});
				}}
				value={getValue(`${prefix}letter-spacing`, breakpoint)}
				defaultValue={getDefault(`${prefix}letter-spacing`)}
				onChangeValue={val => {
					onChangeFormat({
						[`${prefix}letter-spacing`]: val,
					});
				}}
				onReset={() =>
					onChangeFormat({
						[`${prefix}letter-spacing-unit`]: getDefault(
							`${prefix}letter-spacing-unit`
						),
						[`${prefix}letter-spacing`]: getDefault(
							`${prefix}letter-spacing`
						),
					})
				}
				minMaxSettings={minMaxSettingsLetterSpacing}
				step={0.1}
			/>
		</>
	);
};

const TypographyControl = withFormatValue(props => {
	const {
		className,
		textLevel = 'p',
		hideAlignment = false,
		onChange,
		breakpoint = 'general',
		formatValue,
		isList = false,
		isHover = false,
		disableColor = false,
		prefix = '',
		disableFormats = false,
		disableCustomFormats = false,
		hideTextShadow = false,
		styleCards = false,
		disablePalette = false,
		clientId,
		blockStyle = 'maxi-light', // temporary
	} = props;

	const typography =
		props.typography ||
		getGroupAttributes(props, [
			'typography',
			...(isHover ? ['typographyHover'] : []),
		]);

	const [showTextOptions, changeShowTextOptions] = useState(false);

	const classes = classnames('maxi-typography-control', className);

	const Divider = () => <hr style={{ margin: '15px 0' }} />;

	const minMaxSettings = {
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
		empty: {
			min: 0,
			max: 999,
		},
	};

	const minMaxSettingsLetterSpacing = {
		px: {
			min: -3,
			max: 30,
		},
		em: {
			min: -1,
			max: 10,
		},
		vw: {
			min: -1,
			max: 10,
		},
	};

	const getValue = (prop, customBreakpoint) => {
		const currentBreakpoint = customBreakpoint || breakpoint;

		if (disableFormats) return typography[`${prop}-${currentBreakpoint}`];

		const nonHoverValue = getCustomFormatValue({
			typography,
			formatValue,
			prop,
			breakpoint: currentBreakpoint,
			blockStyle,
		});

		if (!isHover) return nonHoverValue;

		return (
			getCustomFormatValue({
				typography,
				formatValue,
				prop,
				breakpoint: currentBreakpoint,
				isHover,
				blockStyle,
			}) || nonHoverValue
		);
	};

	const getWeightOptions = () => {
		const { getFont } = select('maxiBlocks/text');

		if (!isNil(getValue(`${prefix}font-family`))) {
			const fontFiles = getFont(getValue(`${prefix}font-family`))?.files;
			const fontOptions = fontFiles
				? Object.keys(fontFiles).map(key => key)
				: [];

			if (fontOptions.length === 0) {
				return [
					{ label: __('Thin (Hairline)', 'maxi-blocks'), value: 100 },
					{
						label: __('Extra Light (Ultra Light)', 'maxi-blocks'),
						value: 200,
					},
					{ label: __('Light', 'maxi-blocks'), value: 300 },
					{
						label: __('Normal (Regular)', 'maxi-blocks'),
						value: 400,
					},
					{ label: __('Medium', 'maxi-blocks'), value: 500 },
					{
						label: __('Semi Bold (Semi Bold)', 'maxi-blocks'),
						value: 600,
					},
					{ label: __('Bold', 'maxi-blocks'), value: 700 },
					{
						label: __('Extra Bold (Ultra Bold)', 'maxi-blocks'),
						value: 800,
					},
					{ label: __('Black (Heavy)', 'maxi-blocks'), value: 900 },
					{
						label: __('Extra Black (Ultra Black)', 'maxi-blocks'),
						value: 950,
					},
				];
			}
			const weightOptions = {
				100: 'Thin (Hairline)',
				200: 'Extra Light (Ultra Light)',
				300: 'Light',
				400: 'Normal (Regular)',
				500: 'Medium',
				600: 'Semi Bold (Semi Bold)',
				700: 'Bold',
				800: 'Extra Bold (Ultra Bold)',
				900: 'Black (Heavy)',
				950: 'Extra Black (Ultra Black)',
			};
			const response = [];
			if (!fontOptions.includes('900')) {
				fontOptions.push('900');
			}
			fontOptions.forEach(weight => {
				const weightOption = {};
				if (weightOptions[weight]) {
					weightOption.label = __(
						weightOptions[weight],
						'maxi-blocks'
					);
					weightOption.value = weight;
					response.push(weightOption);
				}
			});
			return response;
		}
		return null;
	};

	const getDefault = prop => {
		const sameDefaultLevels = ['p', 'ul', 'ol'];
		if (
			sameDefaultLevels.some(level => {
				return level === textLevel;
			})
		)
			return defaultTypography.p[
				`${prop}-${breakpoint}${isHover ? '-hover' : ''}`
			];

		return defaultTypography[textLevel][
			`${prop}-${breakpoint}${isHover ? '-hover' : ''}`
		];
	};

	const onChangeFormat = value => {
		const obj = setFormat({
			formatValue,
			isList,
			typography,
			value,
			breakpoint,
			isHover,
			textLevel,
			disableCustomFormats,
		});

		onChange(obj);
	};

	// Temporary
	const showNotification = breakpoint => {
		const breakpoints = select('maxiBlocks').receiveMaxiBreakpoints();
		const winWidth = window.innerWidth;

		let response;

		Object.entries(breakpoints).forEach(([key, value]) => {
			if (value <= winWidth) response = key;
		});

		return response.toLowerCase() === breakpoint.toLowerCase();
	};

	return (
		<div className={classes}>
			{(!styleCards || breakpoint === 'general') && (
				<>
					<FontFamilySelector
						className='maxi-typography-control__font-family'
						font={getValue(`${prefix}font-family`)}
						onChange={font => {
							onChangeFormat({
								[`${prefix}font-family`]: font.value,
								[`${prefix}font-options`]: font.files,
							});
						}}
					/>
					{!disableColor && !styleCards && (
						<ColorControl
							label={__('Font', 'maxi-blocks')}
							className='maxi-typography-control__color'
							color={getValue(`${prefix}color`)}
							defaultColor={getDefault(`${prefix}color`)}
							onChange={val =>
								onChangeFormat({ [`${prefix}color`]: val })
							}
							disableGradient
							textLevel={textLevel}
							showPalette
							disablePalette={disablePalette}
							isHover={isHover}
							palette={{
								...getGroupAttributes(props, 'palette'),
							}}
							colorPaletteType='typography'
							onChangePalette={val => onChange(val)}
							deviceType={breakpoint}
							clientId={clientId}
						/>
					)}
				</>
			)}
			{!hideAlignment && (
				<AlignmentControl
					{...getGroupAttributes(props, 'textAlignment')}
					className='maxi-typography-control__text-alignment'
					label={__('Alignment', 'maxi-blocks')}
					onChange={obj => onChange(obj)}
					breakpoint={breakpoint}
					type='text'
				/>
			)}
			{styleCards && breakpoint !== 'general' && (
				<TextOptions
					getValue={getValue}
					getDefault={getDefault}
					onChangeFormat={onChangeFormat}
					prefix={prefix}
					minMaxSettings={minMaxSettings}
					minMaxSettingsLetterSpacing={minMaxSettingsLetterSpacing}
					breakpoint={breakpoint}
				/>
			)}
			{!styleCards && (
				<>
					<FancyRadioControl
						label={__('Text Advanced Options', 'maxi-blocks')}
						selected={showTextOptions}
						options={[
							{ label: __('No', 'maxi-blocks'), value: 0 },
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
						]}
						onChange={() => {
							changeShowTextOptions(!showTextOptions);
						}}
					/>
					{showTextOptions && (
						<SettingTabsControl
							items={breakpoints.map(breakpoint => {
								return {
									label: breakpoint,
									content: (
										<TextOptions
											getValue={getValue}
											getDefault={getDefault}
											onChangeFormat={onChangeFormat}
											prefix={prefix}
											minMaxSettings={minMaxSettings}
											minMaxSettingsLetterSpacing={
												minMaxSettingsLetterSpacing
											}
											breakpoint={breakpoint.toLowerCase()}
										/>
									),
									showNotification:
										showNotification(breakpoint),
								};
							})}
						/>
					)}
				</>
			)}
			{(!styleCards || breakpoint === 'general') && (
				<>
					<Divider />
					<SelectControl
						label={__('Weight', 'maxi-blocks')}
						className='maxi-typography-control__weight'
						value={getValue(`${prefix}font-weight`)}
						options={getWeightOptions()}
						onChange={val => {
							onChangeFormat({ [`${prefix}font-weight`]: val });
						}}
					/>
					<SelectControl
						label={__('Transform', 'maxi-blocks')}
						className='maxi-typography-control__transform'
						value={getValue(`${prefix}text-transform`)}
						options={[
							{
								label: __('Default', 'maxi-blocks'),
								value: 'none',
							},
							{
								label: __('Capitalize', 'maxi-blocks'),
								value: 'capitalize',
							},
							{
								label: __('Uppercase', 'maxi-blocks'),
								value: 'uppercase',
							},
							{
								label: __('Lowercase', 'maxi-blocks'),
								value: 'lowercase',
							},
						]}
						onChange={val => {
							onChangeFormat({
								[`${prefix}text-transform`]: val,
							});
						}}
					/>
					<SelectControl
						label={__('Style', 'maxi-blocks')}
						className='maxi-typography-control__font-style'
						value={getValue(`${prefix}font-style`)}
						options={[
							{
								label: __('Default', 'maxi-blocks'),
								value: 'normal',
							},
							{
								label: __('Italic', 'maxi-blocks'),
								value: 'italic',
							},
							{
								label: __('Oblique', 'maxi-blocks'),
								value: 'oblique',
							},
						]}
						onChange={val => {
							onChangeFormat({ [`${prefix}font-style`]: val });
						}}
					/>
					<SelectControl
						label={__('Decoration', 'maxi-blocks')}
						className='maxi-typography-control__decoration'
						value={getValue(`${prefix}text-decoration`)}
						options={[
							{
								label: __('Default', 'maxi-blocks'),
								value: 'none',
							},
							{
								label: __('Overline', 'maxi-blocks'),
								value: 'overline',
							},
							{
								label: __('Line Through', 'maxi-blocks'),
								value: 'line-through',
							},
							{
								label: __('Underline', 'maxi-blocks'),
								value: 'underline',
							},
							{
								label: __('Underline Overline', 'maxi-blocks'),
								value: 'underline overline',
							},
						]}
						onChange={val => {
							onChangeFormat({
								[`${prefix}text-decoration`]: val,
							});
						}}
					/>
					{!hideTextShadow && (
						<TextShadowControl
							className='maxi-typography-control__text-shadow'
							textShadow={getValue(`${prefix}text-shadow`)}
							onChange={val => {
								onChangeFormat({
									[`${prefix}text-shadow`]: val,
								});
							}}
							defaultColor={getLastBreakpointAttribute(
								'color',
								breakpoint,
								typography
							)}
						/>
					)}
					<>
						<FancyRadioControl
							label={__('Text Advanced Options', 'maxi-blocks')}
							selected={showTextOptions}
							options={[
								{ label: __('No', 'maxi-blocks'), value: 0 },
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
							]}
							onChange={() => {
								changeShowTextOptions(!showTextOptions);
							}}
						/>
						{showTextOptions && (
							<SettingTabsControl
								items={breakpoints.map(breakpoint => {
									return {
										label: breakpoint,
										content: (
											<TextOptions
												getValue={getValue}
												getDefault={getDefault}
												onChangeFormat={onChangeFormat}
												prefix={prefix}
												minMaxSettings={minMaxSettings}
												minMaxSettingsLetterSpacing={
													minMaxSettingsLetterSpacing
												}
												breakpoint={breakpoint.toLowerCase()}
											/>
										),
										showNotification:
											showNotification(breakpoint),
									};
								})}
							/>
						)}
					</>
				</>
			)}
		</div>
	);
});

export default TypographyControl;
