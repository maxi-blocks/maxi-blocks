/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AlignmentControl from '../alignment-control';
import ColorControl from '../color-control';
import FontFamilySelector from '../font-family-selector';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import AdvancedNumberControl from '../advanced-number-control';
import TextShadowControl from '../text-shadow-control';
import {
	setFormat,
	getCustomFormatValue,
	withFormatValue,
} from '../../extensions/text/formats';
import {
	getBlockStyle,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, inRange, isEmpty, isBoolean, isNumber } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

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
		avoidXXL,
	} = props;

	return (
		<>
			<AdvancedNumberControl
				className='maxi-typography-control__size'
				label={__('Size', 'maxi-blocks')}
				enableUnit
				unit={getValue(`${prefix}font-size-unit`, breakpoint, avoidXXL)}
				defaultUnit={getDefault(`${prefix}font-size-unit`, breakpoint)}
				onChangeUnit={val => {
					onChangeFormat(
						{
							[`${prefix}font-size-unit`]: val,
						},
						breakpoint
					);
				}}
				value={getValue(`${prefix}font-size`, breakpoint, avoidXXL)}
				defaultValue={getDefault(`${prefix}font-size`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat(
						{
							[`${prefix}font-size`]: val,
						},
						breakpoint
					);
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}font-size-unit`]: getDefault(
								`${prefix}font-size-unit`
							),
							[`${prefix}font-size`]: getDefault(
								`${prefix}font-size`
							),
						},
						breakpoint
					)
				}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%']}
			/>
			<AdvancedNumberControl
				className='maxi-typography-control__line-height'
				label={__('Line Height', 'maxi-blocks')}
				enableUnit
				unit={
					getValue(
						`${prefix}line-height-unit`,
						breakpoint,
						avoidXXL
					) || ''
				}
				defaultUnit={getDefault(
					`${prefix}line-height-unit`,
					breakpoint
				)}
				onChangeUnit={val => {
					onChangeFormat(
						{
							[`${prefix}line-height-unit`]: val,
						},
						breakpoint
					);
				}}
				value={getValue(`${prefix}line-height`, breakpoint, avoidXXL)}
				defaultValue={getDefault(`${prefix}line-height`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat(
						{
							[`${prefix}line-height`]: val,
						},
						breakpoint
					);
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}line-height-unit`]: getDefault(
								`${prefix}line-height-unit`
							),
							[`${prefix}line-height`]: getDefault(
								`${prefix}line-height`
							),
						},
						breakpoint
					)
				}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%', '-']}
			/>
			<AdvancedNumberControl
				className='maxi-typography-control__letter-spacing'
				label={__('Letter Spacing', 'maxi-blocks')}
				enableUnit
				allowedUnits={['px', 'em', 'vw']}
				unit={getValue(
					`${prefix}letter-spacing-unit`,
					breakpoint,
					avoidXXL
				)}
				defaultUnit={getDefault(
					`${prefix}letter-spacing-unit`,
					breakpoint
				)}
				onChangeUnit={val => {
					onChangeFormat(
						{
							[`${prefix}letter-spacing-unit`]: val,
						},
						breakpoint
					);
				}}
				value={getValue(
					`${prefix}letter-spacing`,
					breakpoint,
					avoidXXL
				)}
				defaultValue={getDefault(`${prefix}letter-spacing`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat(
						{
							[`${prefix}letter-spacing`]: val,
						},
						breakpoint
					);
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}letter-spacing-unit`]: getDefault(
								`${prefix}letter-spacing-unit`
							),
							[`${prefix}letter-spacing`]: '',
						},
						breakpoint
					)
				}
				minMaxSettings={minMaxSettingsLetterSpacing}
				step={0.1}
			/>
		</>
	);
};

const LinkOptions = props => {
	const {
		getValue,
		getDefault,
		onChangeFormat,
		prefix,
		breakpoint,
		textLevel,
		clientId,
	} = props;

	return (
		<>
			<ColorControl
				label={__('Link', 'maxi-blocks')}
				className='maxi-typography-control__color'
				color={getValue(`${prefix}link-color`)}
				defaultColor={getDefault(`${prefix}link-color`)}
				paletteStatus={getValue(`${prefix}link-palette-color-status`)}
				paletteColor={getValue(`${prefix}link-palette-color`)}
				paletteOpacity={getValue(`${prefix}link-palette-opacity`)}
				onChange={({
					paletteColor,
					paletteStatus,
					paletteOpacity,
					color,
				}) =>
					onChangeFormat({
						[`${prefix}link-palette-color-status`]: paletteStatus,
						[`${prefix}link-palette-color`]: paletteColor,
						[`${prefix}link-palette-opacity`]: paletteOpacity,
						[`${prefix}link-color`]: color,
					})
				}
				showPalette
				textLevel={textLevel}
				deviceType={breakpoint}
				clientId={clientId}
				disableGradient
				globalProps={{ target: 'link-color-global', type: 'link' }}
			/>
			<ColorControl
				label={__('Link Hover', 'maxi-blocks')}
				className='maxi-typography-control__color'
				color={getValue(`${prefix}link-hover-color`)}
				defaultColor={getDefault(`${prefix}link-hover-color`)}
				paletteStatus={getValue(
					`${prefix}link-hover-palette-color-status`
				)}
				paletteColor={getValue(`${prefix}link-hover-palette-color`)}
				paletteOpacity={getValue(`${prefix}link-hover-palette-opacity`)}
				onChange={({
					paletteColor,
					paletteStatus,
					paletteOpacity,
					color,
				}) =>
					onChangeFormat({
						[`${prefix}link-hover-palette-color-status`]:
							paletteStatus,
						[`${prefix}link-hover-palette-color`]: paletteColor,
						[`${prefix}link-hover-palette-opacity`]: paletteOpacity,
						[`${prefix}link-hover-color`]: color,
					})
				}
				showPalette
				textLevel={textLevel}
				deviceType={breakpoint}
				clientId={clientId}
				disableGradient
				globalProps={{ target: 'hover-color-global', type: 'link' }}
			/>
			<ColorControl
				label={__('Link Active', 'maxi-blocks')}
				className='maxi-typography-control__color'
				color={getValue(`${prefix}link-active-color`)}
				defaultColor={getDefault(`${prefix}link-active-color`)}
				paletteStatus={getValue(
					`${prefix}link-active-palette-color-status`
				)}
				paletteColor={getValue(`${prefix}link-active-palette-color`)}
				paletteOpacity={getValue(
					`${prefix}link-active-palette-opacity`
				)}
				onChange={({
					paletteColor,
					paletteStatus,
					paletteOpacity,
					color,
				}) =>
					onChangeFormat({
						[`${prefix}link-active-palette-color-status`]:
							paletteStatus,
						[`${prefix}link-active-palette-color`]: paletteColor,
						[`${prefix}link-active-palette-opacity`]:
							paletteOpacity,
						[`${prefix}link-active-color`]: color,
					})
				}
				showPalette
				textLevel={textLevel}
				deviceType={breakpoint}
				clientId={clientId}
				disableGradient
				globalProps={{ target: 'active-color-global', type: 'link' }}
			/>
			<ColorControl
				label={__('Link Visited', 'maxi-blocks')}
				className='maxi-typography-control__color'
				color={getValue(`${prefix}link-visited-color`)}
				defaultColor={getDefault(`${prefix}link-visited-color`)}
				paletteStatus={getValue(
					`${prefix}link-visited-palette-color-status`
				)}
				paletteColor={getValue(`${prefix}link-visited-palette-color`)}
				paletteOpacity={getValue(
					`${prefix}link-visited-palette-opacity`
				)}
				onChange={({
					paletteColor,
					paletteStatus,
					paletteOpacity,
					color,
				}) =>
					onChangeFormat({
						[`${prefix}link-visited-palette-color-status`]:
							paletteStatus,
						[`${prefix}link-visited-palette-color`]: paletteColor,
						[`${prefix}link-visited-palette-opacity`]:
							paletteOpacity,
						[`${prefix}link-visited-color`]: color,
					})
				}
				showPalette
				textLevel={textLevel}
				deviceType={breakpoint}
				clientId={clientId}
				disableGradient
				globalProps={{ target: 'visited-color-global', type: 'link' }}
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
		disableFontFamily = false,
		clientId,
		styleCardPrefix,
		allowLink = false,
		hoverEffect = false,
	} = props;

	const typography =
		(hoverEffect ? props.hoverTitleTypography : props.typography) ||
		getGroupAttributes(props, [
			hoverEffect ? 'hoverTitleTypography' : 'typography',
			...(allowLink ? ['link'] : []),
			...(isHover ? ['typographyHover'] : []),
		]);

	const { styleCard, winWidth, maxiBreakpoints } = useSelect(select => {
		const { receiveMaxiSelectedStyleCard } = select(
			'maxiBlocks/style-cards'
		);
		const { receiveMaxiSettings, receiveMaxiBreakpoints } =
			select('maxiBlocks');

		const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

		const winWidth = receiveMaxiSettings().window?.width || null;

		const maxiBreakpoints = receiveMaxiBreakpoints();

		return {
			styleCard,
			winWidth,
			maxiBreakpoints,
		};
	});

	const { setMaxiDeviceType } = useDispatch('maxiBlocks');

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
		'-': {
			min: 0,
			max: 16,
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

	const getValue = (prop, customBreakpoint, avoidXXL) => {
		const currentBreakpoint = customBreakpoint || breakpoint;

		if (disableFormats)
			return getLastBreakpointAttribute(
				prop,
				currentBreakpoint,
				typography,
				isHover,
				false,
				avoidXXL
			);

		const blockStyle = getBlockStyle(clientId);

		const nonHoverValue = getCustomFormatValue({
			typography,
			formatValue,
			prop,
			breakpoint: currentBreakpoint,
			blockStyle,
			textLevel,
			styleCard,
			styleCardPrefix,
			avoidXXL,
		});

		if (!isHover) return nonHoverValue;

		const hoverValue = getCustomFormatValue({
			typography,
			formatValue,
			prop,
			breakpoint: currentBreakpoint,
			isHover,
			blockStyle,
			textLevel,
			styleCard,
			styleCardPrefix,
		});

		if (hoverValue || isBoolean(hoverValue) || isNumber(hoverValue))
			return hoverValue;

		return nonHoverValue;
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

	const getDefault = (prop, customBreakpoint) => {
		const currentBreakpoint = customBreakpoint || breakpoint;
		const defaultAttribute = getDefaultAttribute(
			`${prop}-${currentBreakpoint}`,
			clientId
		);

		return defaultAttribute;
	};

	const onChangeFormat = (value, customBreakpoint) => {
		const obj = setFormat({
			formatValue,
			isList,
			typography,
			value,
			breakpoint: customBreakpoint || breakpoint,
			isHover,
			textLevel,
			disableCustomFormats,
			styleCardPrefix,
		});

		onChange(obj);
	};

	const getWinBreakpoint = () => {
		if (!maxiBreakpoints || isEmpty(maxiBreakpoints)) return null;

		if (winWidth > maxiBreakpoints.xl) return 'xxl';

		const response = Object.entries(maxiBreakpoints).reduce(
			([prevKey, prevValue], [currKey, currValue]) => {
				if (!prevValue) return [prevKey];
				if (inRange(winWidth, prevValue, currValue + 1))
					return [currKey];

				return [prevKey, prevValue];
			}
		)[0];

		return response.toLowerCase();
	};

	const showNotification = customBreakpoint => {
		if (breakpoint !== 'general')
			return breakpoint === customBreakpoint.toLowerCase();

		return getWinBreakpoint() === customBreakpoint.toLowerCase();
	};

	const getTextOptionsTab = () => {
		if (breakpoint !== 'general')
			return breakpoints.indexOf(breakpoint.toUpperCase());

		const userBreakpoint = getWinBreakpoint();

		if (!userBreakpoint) return null;

		return breakpoints.indexOf(userBreakpoint.toUpperCase());
	};

	return (
		<div className={classes}>
			{!disableFontFamily && (
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
			)}
			{!disableColor && !styleCards && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-control__color'
					color={getValue(`${prefix}color`)}
					defaultColor={getDefault(`${prefix}color`)}
					paletteColor={getValue(`${prefix}palette-color`)}
					paletteOpacity={getValue(`${prefix}palette-opacity`)}
					paletteStatus={getValue(`${prefix}palette-color-status`)}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) =>
						onChangeFormat({
							[`${prefix}color`]: color,
							[`${prefix}palette-color`]: paletteColor,
							[`${prefix}palette-color-status`]: paletteStatus,
							[`${prefix}palette-opacity`]: paletteOpacity,
						})
					}
					showPalette
					globalProps={{
						target: `${isHover ? 'hover-' : ''}color-global`,
						type:
							select('core/block-editor').getBlockName(
								clientId
							) === 'maxi-blocks/button-maxi'
								? 'button'
								: textLevel,
					}}
					textLevel={textLevel}
					isHover={isHover}
					deviceType={breakpoint}
					clientId={clientId}
					disableGradient
					disablePalette={disablePalette}
				/>
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
			<SettingTabsControl
				className='maxi-typography-control__text-options-tabs'
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
								avoidXXL={!styleCards}
							/>
						),
						showNotification: showNotification(breakpoint),
						callback: () =>
							styleCards
								? setMaxiDeviceType(breakpoint.toLowerCase())
								: null,
					};
				})}
				forceTab={getTextOptionsTab()}
			/>
			<hr />
			{!disableFontFamily &&
				!disableColor &&
				!styleCards &&
				!hideAlignment && <Divider />}
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
					onChangeFormat({
						[`${prefix}font-style`]: val,
					});
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
			<hr />
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
			{allowLink && (
				<LinkOptions
					getValue={getValue}
					getDefault={getDefault}
					onChangeFormat={onChangeFormat}
					prefix={prefix}
					breakpoint={breakpoint}
					textLevel={textLevel}
					isHover={isHover}
					clientId={clientId}
				/>
			)}
		</div>
	);
});

export default TypographyControl;
