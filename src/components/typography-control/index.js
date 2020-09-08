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
	} = props;

	const value = !isObject(typography) ? JSON.parse(typography) : typography;

	const defaultValue = !isObject(defaultTypography)
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
		const fontOptions = Object.keys(value[breakpoint]['font-options']);
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
			return defaultValue[breakpoint][prop];

		return defaultTypographies[textLevel][breakpoint][prop];
	};

	return (
		<div className={classes}>
			<FontFamilySelector
				className='maxi-typography-control__font-family'
				font={getLastBreakpointValue(value, 'font-family', breakpoint)}
				onChange={font => {
					value[breakpoint]['font-family'] = font.value;
					value[breakpoint]['font-options'] = font.files;
					onChange(JSON.stringify(value));
				}}
			/>
			<ColorControl
				label={__('Font', 'maxi-blocks')}
				className='maxi-typography-control__color'
				color={getLastBreakpointValue(value, 'color', breakpoint)}
				defaultColor={getDefault('color')}
				onChange={val => {
					value[breakpoint].color = val;
					onChange(JSON.stringify(value));
				}}
				disableGradient
			/>
			{!hideAlignment && (
				<AlignmentControl
					className='maxi-typography-control__text-alignment'
					label={__('Alignment', 'maxi-blocks')}
					alignment={value.textAlign}
					onChange={val => {
						value.textAlign = JSON.parse(val);
						onChange(JSON.stringify(value));
					}}
				/>
			)}
			<SizeControl
				className='maxi-typography-control__size'
				label={__('Size', 'maxi-blocks')}
				unit={getLastBreakpointValue(
					value,
					'font-sizeUnit',
					breakpoint
				)}
				defaultUnit={getDefault('font-sizeUnit')}
				onChangeUnit={val => {
					value[breakpoint]['font-sizeUnit'] = val;
					onChange(JSON.stringify(value));
				}}
				value={trim(
					getLastBreakpointValue(value, 'font-size', breakpoint)
				)}
				defaultValue={getDefault('font-size')}
				onChangeValue={val => {
					value[breakpoint]['font-size'] = val;
					onChange(JSON.stringify(value));
				}}
				minMaxSettings={minMaxSettings}
			/>
			<SizeControl
				className='maxi-typography-control__line-height'
				label={__('Line Height', 'maxi-blocks')}
				unit={getLastBreakpointValue(
					value,
					'line-heightUnit',
					breakpoint
				)}
				defaultUnit={getDefault('line-heightUnit')}
				onChangeUnit={val => {
					value[breakpoint]['line-heightUnit'] = val;
					onChange(JSON.stringify(value));
				}}
				value={trim(
					getLastBreakpointValue(value, 'line-height', breakpoint)
				)}
				defaultValue={getDefault('line-height')}
				onChangeValue={val => {
					value[breakpoint]['line-height'] = val;
					onChange(JSON.stringify(value));
				}}
				minMaxSettings={minMaxSettings}
			/>
			<SizeControl
				className='maxi-typography-control__letter-spacing'
				label={__('Letter Spacing', 'maxi-blocks')}
				unit={getLastBreakpointValue(
					value,
					'letter-spacingUnit',
					breakpoint
				)}
				defaultUnit={getDefault('letter-spacingUnit')}
				onChangeUnit={val => {
					value[breakpoint]['letter-spacingUnit'] = val;
					onChange(JSON.stringify(value));
				}}
				value={trim(
					getLastBreakpointValue(value, 'letter-spacing', breakpoint)
				)}
				defaultValue={getDefault('letter-spacing')}
				onChangeValue={val => {
					value[breakpoint]['letter-spacing'] = val;
					onChange(JSON.stringify(value));
				}}
				minMaxSettings={minMaxSettings}
			/>
			<Divider />
			<SelectControl
				label={__('Weight', 'maxi-blocks')}
				className='maxi-typography-control__weight'
				value={getLastBreakpointValue(value, 'font-weight', breakpoint)}
				options={getWeightOptions()}
				onChange={val => {
					value[breakpoint]['font-weight'] = val;
					onChange(JSON.stringify(value));
				}}
			/>
			<SelectControl
				label={__('Transform', 'maxi-blocks')}
				className='maxi-typography-control__transform'
				value={getLastBreakpointValue(
					value,
					'text-transform',
					breakpoint
				)}
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
					value[breakpoint]['text-transform'] = val;
					onChange(JSON.stringify(value));
				}}
			/>
			<SelectControl
				label={__('Style', 'maxi-blocks')}
				className='maxi-typography-control__font-style'
				value={getLastBreakpointValue(value, 'font-style', breakpoint)}
				options={[
					{ label: __('Default', 'maxi-blocks'), value: 'normal' },
					{ label: __('Italic', 'maxi-blocks'), value: 'italic' },
					{ label: __('Oblique', 'maxi-blocks'), value: 'oblique' },
				]}
				onChange={val => {
					value[breakpoint]['font-style'] = val;
					onChange(JSON.stringify(value));
				}}
			/>
			<SelectControl
				label={__('Decoration', 'maxi-blocks')}
				className='maxi-typography-control__decoration'
				value={getLastBreakpointValue(
					value,
					'text-decoration',
					breakpoint
				)}
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
					value[breakpoint]['text-decoration'] = val;
					onChange(JSON.stringify(value));
				}}
			/>
			<TextShadowControl
				className='maxi-typography-control__text-shadow'
				textShadow={getLastBreakpointValue(
					value,
					'text-shadow',
					breakpoint
				)}
				onChange={val => {
					value[breakpoint]['text-shadow'] = val;
					onChange(JSON.stringify(value));
				}}
				defaultColor={getLastBreakpointValue(
					value,
					'color',
					breakpoint
				)}
			/>
		</div>
	);
};

export default TypographyControl;
