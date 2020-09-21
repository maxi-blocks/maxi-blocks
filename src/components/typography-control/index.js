/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import defaultTypographies from '../../extensions/defaults/typography';
import { getLastBreakpointValue } from '../../utils';
import AlignmentControl from '../alignment-control';
import ColorControl from '../color-control';
import FontFamilySelector from '../font-family-selector';
import SizeControl from '../size-control';
import TextShadowControl from '../text-shadow-control';
import {
	__experimentalSetFormat,
	__experimentalGetCustomFormatValue,
} from '../../extensions/text/formats';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, trim } from 'lodash';

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
		typography,
		defaultTypography,
		textLevel = 'p',
		hideAlignment = false,
		onChange,
		breakpoint = 'general',
		formatValue,
		isList,
		isHover = false,
	} = props;

	const typographyValue = !isObject(typography)
		? JSON.parse(typography)
		: typography;

	const defaultTypographyValue = !isObject(defaultTypography)
		? JSON.parse(defaultTypography)
		: defaultTypography;

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
		const fontOptions = Object.keys(
			typographyValue[breakpoint]['font-options']
		);
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
					label: __('Semi Bold (Demi Bold)', 'maxi-blocks'),
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
			600: 'Semi Bold (Demi Bold)',
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
			return defaultTypographyValue[breakpoint][prop];

		return defaultTypographies[textLevel][breakpoint][prop];
	};

	const onChangeFormat = value => {
		const {
			typography: newTypography,
			content: newContent,
		} = __experimentalSetFormat({
			formatValue,
			// isActive,
			isList,
			typography: typographyValue,
			value,
			breakpoint,
			// isHover,
		});

		onChange({
			typography: JSON.stringify(newTypography),
			...(newContent && { content: newContent }),
		});
	};

	return (
		<div className={classes}>
			<FontFamilySelector
				className='maxi-typography-control__font-family'
				font={__experimentalGetCustomFormatValue({
					typography: typographyValue,
					formatValue,
					prop: 'font-family',
					breakpoint,
					isHover,
				})}
				onChange={font => {
					onChangeFormat({
						'font-family': font.value,
						'font-options': font.files,
					});
				}}
			/>
			<ColorControl
				label={__('Font', 'maxi-blocks')}
				className='maxi-typography-control__color'
				color={__experimentalGetCustomFormatValue({
					typography: typographyValue,
					formatValue,
					prop: 'color',
					breakpoint,
					isHover,
				})}
				defaultColor={getDefault('color')}
				onChange={val => {
					onChangeFormat({ color: val });
				}}
				disableGradient
			/>
			{!hideAlignment && (
				<AlignmentControl
					className='maxi-typography-control__text-alignment'
					label={__('Alignment', 'maxi-blocks')}
					alignment={typographyValue.textAlign}
					onChange={val => {
						typographyValue.textAlign = JSON.parse(val);
						onChange(JSON.stringify(typographyValue));
					}}
				/>
			)}
			<SizeControl
				className='maxi-typography-control__size'
				label={__('Size', 'maxi-blocks')}
				unit={__experimentalGetCustomFormatValue({
					typography: typographyValue,
					formatValue,
					prop: 'font-sizeUnit',
					breakpoint,
					isHover,
				})}
				defaultUnit={getDefault('font-sizeUnit')}
				onChangeUnit={val => {
					onChangeFormat({ 'font-sizeUnit': val });
				}}
				value={trim(
					__experimentalGetCustomFormatValue({
						typography: typographyValue,
						formatValue,
						prop: 'font-size',
						breakpoint,
						isHover,
					})
				)}
				defaultTypographyValue={getDefault('font-size')}
				onChangeValue={val => {
					onChangeFormat({ 'font-size': val });
				}}
				minMaxSettings={minMaxSettings}
			/>
			<SizeControl
				className='maxi-typography-control__line-height'
				label={__('Line Height', 'maxi-blocks')}
				unit={__experimentalGetCustomFormatValue({
					typography: typographyValue,
					formatValue,
					prop: 'line-heightUnit',
					breakpoint,
					isHover,
				})}
				defaultUnit={getDefault('line-heightUnit')}
				onChangeUnit={val => {
					onChangeFormat({ 'line-heightUnit': val });
				}}
				value={trim(
					__experimentalGetCustomFormatValue({
						typography: typographyValue,
						formatValue,
						prop: 'line-height',
						breakpoint,
						isHover,
					})
				)}
				defaultTypographyValue={getDefault('line-height')}
				onChangeValue={val => {
					onChangeFormat({ 'line-height': val });
				}}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%', 'empty']}
			/>
			<SizeControl
				className='maxi-typography-control__letter-spacing'
				label={__('Letter Spacing', 'maxi-blocks')}
				unit={__experimentalGetCustomFormatValue({
					typography: typographyValue,
					formatValue,
					prop: 'letter-spacingUnit',
					breakpoint,
					isHover,
				})}
				defaultUnit={getDefault('letter-spacingUnit')}
				onChangeUnit={val => {
					onChangeFormat({ 'letter-spacingUnit': val });
				}}
				value={trim(
					__experimentalGetCustomFormatValue({
						typography: typographyValue,
						formatValue,
						prop: 'letter-spacing',
						breakpoint,
						isHover,
					})
				)}
				defaultTypographyValue={getDefault('letter-spacing')}
				onChangeValue={val => {
					onChangeFormat({ 'letter-spacing': val });
				}}
				minMaxSettings={minMaxSettings}
			/>
			<Divider />
			<SelectControl
				label={__('Weight', 'maxi-blocks')}
				className='maxi-typography-control__weight'
				value={__experimentalGetCustomFormatValue({
					typography: typographyValue,
					formatValue,
					prop: 'font-weight',
					breakpoint,
					isHover,
				})}
				options={getWeightOptions()}
				onChange={val => {
					onChangeFormat({ 'font-weight': val });
				}}
			/>
			<SelectControl
				label={__('Transform', 'maxi-blocks')}
				className='maxi-typography-control__transform'
				value={__experimentalGetCustomFormatValue({
					typography: typographyValue,
					formatValue,
					prop: 'text-transform',
					breakpoint,
					isHover,
				})}
				options={[
					{ label: __('Default', 'maxi-blocks'), value: 'none' },
					{
						label: __('Capitilize', 'maxi-blocks'),
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
				value={__experimentalGetCustomFormatValue({
					typography: typographyValue,
					formatValue,
					prop: 'font-style',
					breakpoint,
					isHover,
				})}
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
				value={__experimentalGetCustomFormatValue({
					typography: typographyValue,
					formatValue,
					prop: 'text-decoration',
					breakpoint,
					isHover,
				})}
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
				textShadow={__experimentalGetCustomFormatValue({
					typography: typographyValue,
					formatValue,
					prop: 'text-shadow',
					breakpoint,
					isHover,
				})}
				onChange={val => {
					onChangeFormat({ 'text-shadow': val });
				}}
				defaultColor={getLastBreakpointValue(
					typographyValue,
					'color',
					breakpoint
				)}
			/>
		</div>
	);
};

export default TypographyControl;
