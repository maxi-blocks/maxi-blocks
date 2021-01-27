/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import defaultTypographies from '../../extensions/defaults/typography';
import getLastBreakpointValue from '../../extensions/styles/getLastBreakpointValue';
import AlignmentControl from '../alignment-control';
import ColorControl from '../color-control';
import FontFamilySelector from '../font-family-selector';
import SizeControl from '../size-control';
import TextShadowControl from '../text-shadow-control';
import { setFormat, getCustomFormatValue } from '../../extensions/text/formats';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';

/**
 * Component
 */
const TypographyControl = props => {
	const {
		className,
		textLevel = 'p',
		hideAlignment = false,
		onChange,
		breakpoint = 'general',
		formatValue,
		isList = false,
		isHover = false,
		originalFontOptions = [],
		disableColor = false,
	} = props;

	const typography = getGroupAttributes(props, [
		'typography',
		...(isHover && ['typographyHover']),
	]);

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
	};

	const getWeightOptions = () => {
		const fontOptions =
			!isHover || !typography[`font-options-${breakpoint}-hover`]
				? Object.keys(originalFontOptions)
				: Object.keys(typography[`font-options-${breakpoint}-hover`]);

		if (fontOptions.length === 0) {
			return [
				{ label: __('Thin (Hairline)', 'maxi-blocks'), value: 100 },
				{
					label: __('Extra Light (Ultra Light)', 'maxi-blocks'),
					value: 200,
				},
				{ label: __('Light', 'maxi-blocks'), value: 300 },
				{ label: __('Normal (Regular)', 'maxi-blocks'), value: 400 },
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
				weightOption.label = __(weightOptions[weight], 'maxi-blocks');
				weightOption.value = weight;
				response.push(weightOption);
			}
		});
		return response;
	};

	const getValue = prop => {
		const nonHoverValue = getCustomFormatValue({
			typography,
			formatValue,
			prop,
			breakpoint,
		});

		if (!isHover) return nonHoverValue;

		return (
			getCustomFormatValue({
				typography,
				formatValue,
				prop,
				breakpoint,
				isHover,
			}) || nonHoverValue
		);
	};

	const getDefault = prop => {
		const sameDefaultLevels = ['p', 'ul', 'ol'];
		if (
			sameDefaultLevels.some(level => {
				return level === textLevel;
			})
		)
			return getDefaultAttribute(
				`${prop}-${breakpoint}${isHover ? '-hover' : ''}`
			);

		return defaultTypographies[textLevel][breakpoint][prop];
	};

	const onChangeFormat = value => {
		const obj = setFormat({
			formatValue,
			isList,
			typography,
			value,
			breakpoint,
			isHover,
		});

		onChange(obj);
	};

	return (
		<div className={classes}>
			<FontFamilySelector
				className='maxi-typography-control__font-family'
				font={getValue('font-family')}
				onChange={font => {
					onChangeFormat({
						'font-family': font.value,
						'font-options': font.files,
					});
				}}
			/>
			{!disableColor && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-control__color'
					color={getValue('color')}
					defaultColor={getDefault('color')}
					onChange={val => {
						onChangeFormat({ color: val });
					}}
					disableGradient
				/>
			)}
			{/* {!hideAlignment && (
				<AlignmentControl
					className='maxi-typography-control__text-alignment'
					label={__('Alignment', 'maxi-blocks')}
					alignment={typography.textAlign}
					onChange={textAlign => {
						typography.textAlign = textAlign;
						onChange({
							typography,
						});
					}}
				/>
			)} */}
			<SizeControl
				className='maxi-typography-control__size'
				label={__('Size', 'maxi-blocks')}
				unit={getValue('font-size-unit')}
				defaultUnit={getDefault('font-size-unit')}
				onChangeUnit={val => {
					onChangeFormat({ 'font-size-unit': val });
				}}
				value={trim(getValue('font-size'))}
				defaultTypography={getDefault('font-size')}
				onChangeValue={val => {
					onChangeFormat({ 'font-size': val });
				}}
				minMaxSettings={minMaxSettings}
			/>
			<SizeControl
				className='maxi-typography-control__line-height'
				label={__('Line Height', 'maxi-blocks')}
				unit={getValue('line-height-unit')}
				defaultUnit={getDefault('line-height-unit')}
				onChangeUnit={val => {
					onChangeFormat({ 'line-height-unit': val });
				}}
				value={trim(getValue('line-height'))}
				defaultTypography={getDefault('line-height')}
				onChangeValue={val => {
					onChangeFormat({ 'line-height': val });
				}}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%', 'empty']}
			/>
			<SizeControl
				className='maxi-typography-control__letter-spacing'
				label={__('Letter Spacing', 'maxi-blocks')}
				unit={getValue('letter-spacing-unit')}
				defaultUnit={getDefault('letter-spacing-unit')}
				onChangeUnit={val => {
					onChangeFormat({ 'letter-spacing-unit': val });
				}}
				value={getValue('letter-spacing')}
				defaultTypography={getDefault('letter-spacing')}
				onChangeValue={val => {
					onChangeFormat({ 'letter-spacing': val });
				}}
				minMaxSettings={minMaxSettings}
			/>
			<Divider />
			<SelectControl
				label={__('Weight', 'maxi-blocks')}
				className='maxi-typography-control__weight'
				value={getValue('font-weight')}
				options={getWeightOptions()}
				onChange={val => {
					onChangeFormat({ 'font-weight': val });
				}}
			/>
			<SelectControl
				label={__('Transform', 'maxi-blocks')}
				className='maxi-typography-control__transform'
				value={getValue('text-transform')}
				options={[
					{ label: __('Default', 'maxi-blocks'), value: 'none' },
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
					onChangeFormat({ 'text-transform': val });
				}}
			/>
			<SelectControl
				label={__('Style', 'maxi-blocks')}
				className='maxi-typography-control__font-style'
				value={getValue('font-style')}
				options={[
					{ label: __('Default', 'maxi-blocks'), value: 'normal' },
					{ label: __('Italic', 'maxi-blocks'), value: 'italic' },
					{ label: __('Oblique', 'maxi-blocks'), value: 'oblique' },
				]}
				onChange={val => {
					onChangeFormat({ 'font-style': val });
				}}
			/>
			<SelectControl
				label={__('Decoration', 'maxi-blocks')}
				className='maxi-typography-control__decoration'
				value={getValue('text-decoration')}
				options={[
					{ label: __('Default', 'maxi-blocks'), value: 'none' },
					{ label: __('Overline', 'maxi-blocks'), value: 'overline' },
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
					onChangeFormat({ 'text-decoration': val });
				}}
			/>
			<TextShadowControl
				className='maxi-typography-control__text-shadow'
				textShadow={getValue('text-shadow')}
				onChange={val => {
					onChangeFormat({ 'text-shadow': val });
				}}
				defaultColor={getLastBreakpointValue(
					'color',
					breakpoint,
					typography
				)}
			/>
		</div>
	);
};

export default TypographyControl;
