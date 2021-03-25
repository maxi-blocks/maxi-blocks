/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { useState } = wp.element;
const { select } = wp.data;

/**
 * Internal dependencies
 */
import AlignmentControl from '../alignment-control';
import ColorControl from '../color-control';
import FontFamilySelector from '../font-family-selector';
import SizeControl from '../size-control';
import TextShadowControl from '../text-shadow-control';
import { setFormat, getCustomFormatValue } from '../../extensions/text/formats';
import { defaultTypography } from '../../extensions/text';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

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
		disableColor = false,
		prefix = '',
	} = props;

	const [typography, setTypography] = useState(
		props.typography ||
			getGroupAttributes(props, [
				'typography',
				...(isHover && ['typographyHover']),
			])
	);

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

	const getWeightOptions = () => {
		const { getFont } = select('maxiBlocks/fonts');

		const fontFiles = getFont(getValue(`${prefix}font-family`)).files;
		const fontOptions = Object.keys(fontFiles).map(key => key);

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
		});

		setTypography(obj);

		onChange(obj);
	};

	return (
		<div className={classes}>
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
			{!disableColor && (
				<ColorControl
					label={__('Font', 'maxi-blocks')}
					className='maxi-typography-control__color'
					color={getValue(`${prefix}color`)}
					defaultColor={getDefault(`${prefix}color`)}
					onChange={val => {
						onChangeFormat({ [`${prefix}color`]: val });
					}}
					disableGradient
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
			<SizeControl
				className='maxi-typography-control__size'
				label={__('Size', 'maxi-blocks')}
				unit={getValue(`${prefix}font-size-unit`)}
				defaultUnit={getDefault(`${prefix}font-size-unit`)}
				onChangeUnit={val => {
					onChangeFormat({ [`${prefix}font-size-unit`]: val });
				}}
				value={trim(getValue(`${prefix}font-size`))}
				defaultValue={getDefault(`${prefix}font-size`)}
				onChangeValue={val => {
					onChangeFormat({ [`${prefix}font-size`]: val });
				}}
				minMaxSettings={minMaxSettings}
			/>
			<SizeControl
				className='maxi-typography-control__line-height'
				label={__('Line Height', 'maxi-blocks')}
				unit={getValue(`${prefix}line-height-unit`)}
				defaultUnit={getDefault(`${prefix}line-height-unit`)}
				onChangeUnit={val => {
					onChangeFormat({ [`${prefix}line-height-unit`]: val });
				}}
				value={getValue(`${prefix}line-height`)}
				defaultValue={getDefault(`${prefix}line-height`)}
				onChangeValue={val => {
					onChangeFormat({ [`${prefix}line-height`]: val });
				}}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%', 'empty']}
			/>
			<SizeControl
				className='maxi-typography-control__letter-spacing'
				label={__('Letter Spacing', 'maxi-blocks')}
				allowedUnits={['px', 'em', 'vw']}
				unit={getValue(`${prefix}letter-spacing-unit`)}
				defaultUnit={getDefault(`${prefix}letter-spacing-unit`)}
				onChangeUnit={val => {
					onChangeFormat({ [`${prefix}letter-spacing-unit`]: val });
				}}
				value={getValue(`${prefix}letter-spacing`)}
				defaultValue={getDefault(`${prefix}letter-spacing`)}
				onChangeValue={val => {
					onChangeFormat({ [`${prefix}letter-spacing`]: val });
				}}
				minMaxSettings={minMaxSettingsLetterSpacing}
				step={0.1}
			/>
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
					onChangeFormat({ [`${prefix}text-transform`]: val });
				}}
			/>
			<SelectControl
				label={__('Style', 'maxi-blocks')}
				className='maxi-typography-control__font-style'
				value={getValue(`${prefix}font-style`)}
				options={[
					{ label: __('Default', 'maxi-blocks'), value: 'normal' },
					{ label: __('Italic', 'maxi-blocks'), value: 'italic' },
					{ label: __('Oblique', 'maxi-blocks'), value: 'oblique' },
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
					onChangeFormat({ [`${prefix}text-decoration`]: val });
				}}
			/>
			<TextShadowControl
				className='maxi-typography-control__text-shadow'
				textShadow={getValue(`${prefix}text-shadow`)}
				onChange={val => {
					onChangeFormat({ [`${prefix}text-shadow`]: val });
				}}
				defaultColor={getLastBreakpointAttribute(
					'color',
					breakpoint,
					typography
				)}
			/>
		</div>
	);
};

export default TypographyControl;
