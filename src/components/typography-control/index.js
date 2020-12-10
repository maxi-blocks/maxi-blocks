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
	} = props;

	const typography = { ...props.typography };
	const defaultTypography = { ...props.defaultTypography };

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
		const fontOptions = Object.keys(typography[breakpoint]['font-options']);
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
			return defaultTypography[breakpoint][prop];

		return defaultTypographies[textLevel][breakpoint][prop];
	};

	const onChangeFormat = value => {
		const {
			typography: newTypography,
			content: newContent,
		} = __experimentalSetFormat({
			formatValue,
			isList,
			typography,
			value,
			breakpoint,
			isHover,
		});
		onChange({
			typography: newTypography,
			...(newContent && { content: newContent }),
		});
	};

	return (
		<div className={classes}>
			<FontFamilySelector
				className='maxi-typography-control__font-family'
				font={__experimentalGetCustomFormatValue({
					typography,
					formatValue,
					prop: 'font-family',
					breakpoint,
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
					typography,
					formatValue,
					prop: 'color',
					breakpoint,
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
					alignment={typography.textAlign}
					onChange={textAlign => {
						typography.textAlign = textAlign;
						onChange({
							typography,
						});
					}}
				/>
			)}
			<SizeControl
				className='maxi-typography-control__size'
				label={__('Size', 'maxi-blocks')}
				unit={__experimentalGetCustomFormatValue({
					typography,
					formatValue,
					prop: 'font-sizeUnit',
					breakpoint,
				})}
				defaultUnit={getDefault('font-sizeUnit')}
				onChangeUnit={val => {
					onChangeFormat({ 'font-sizeUnit': val });
				}}
				value={trim(
					__experimentalGetCustomFormatValue({
						typography,
						formatValue,
						prop: 'font-size',
						breakpoint,
						isHover,
					})
				)}
				defaultTypography={getDefault('font-size')}
				onChangeValue={val => {
					onChangeFormat({ 'font-size': val });
				}}
				minMaxSettings={minMaxSettings}
			/>
			<SizeControl
				className='maxi-typography-control__line-height'
				label={__('Line Height', 'maxi-blocks')}
				unit={__experimentalGetCustomFormatValue({
					typography,
					formatValue,
					prop: 'line-heightUnit',
					breakpoint,
				})}
				defaultUnit={getDefault('line-heightUnit')}
				onChangeUnit={val => {
					onChangeFormat({ 'line-heightUnit': val });
				}}
				value={trim(
					__experimentalGetCustomFormatValue({
						typography,
						formatValue,
						prop: 'line-height',
						breakpoint,
						isHover,
					})
				)}
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
				unit={__experimentalGetCustomFormatValue({
					typography,
					formatValue,
					prop: 'letter-spacingUnit',
					breakpoint,
				})}
				defaultUnit={getDefault('letter-spacingUnit')}
				onChangeUnit={val => {
					onChangeFormat({ 'letter-spacingUnit': val });
				}}
				value={trim(
					__experimentalGetCustomFormatValue({
						typography,
						formatValue,
						prop: 'letter-spacing',
						breakpoint,
						isHover,
					})
				)}
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
				value={__experimentalGetCustomFormatValue({
					typography,
					formatValue,
					prop: 'font-weight',
					breakpoint,
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
					typography,
					formatValue,
					prop: 'text-transform',
					breakpoint,
				})}
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
				value={__experimentalGetCustomFormatValue({
					typography,
					formatValue,
					prop: 'font-style',
					breakpoint,
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
					typography,
					formatValue,
					prop: 'text-decoration',
					breakpoint,
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
					typography,
					formatValue,
					prop: 'text-shadow',
					breakpoint,
				})}
				onChange={val => {
					onChangeFormat({ 'text-shadow': val });
				}}
				defaultColor={getLastBreakpointValue(
					typography,
					'color',
					breakpoint
				)}
			/>
		</div>
	);
};

export default TypographyControl;
