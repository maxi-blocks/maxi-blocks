/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import ToggleSwitch from '../toggle-switch';
import AdvancedNumberControl from '../advanced-number-control';
import Icon from '../icon';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty, trim } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleNone } from '../../icons';
import { getColorRGBAString, getColorRGBAParts } from '../../extensions/styles';

/**
 * Component
 */
const TextShadow = props => {
	const { value, onChange, defaultColor, blockStyle: rawBlockStyle } = props;

	const blockStyle = rawBlockStyle.replace('maxi-', '');

	const valueDecomposed =
		!isEmpty(value) && value !== 'none'
			? value.split(' ')
			: `0px 0px 0px ${defaultColor || ''}`.split(' ');
	const x = +valueDecomposed[0].match(/[-?0-9\d*]+|\D+/g)[0];
	const y = +valueDecomposed[1].match(/[-?0-9\d*]+|\D+/g)[0];
	const blur = +valueDecomposed[2].match(/[-?0-9\d*]+|\D+/g)[0];
	const { color, opacity } = getColorRGBAParts(valueDecomposed[3]);

	const [isPaletteActive, setIsPaletteActive] = useState(
		isEmpty(color) || color.toString().length === 1
	);
	const [currentPaletteColor, setCurrentPaletteColor] = useState(
		isEmpty(color) || !isPaletteActive ? 8 : +color
	);
	const [currentPaletteOpacity, setCurrentPaletteOpacity] = useState(
		!isNil(opacity) ? +opacity * 100 : 100
	);
	const [currentColor, setCurrentColor] = useState(
		!isPaletteActive ? color : undefined
	);

	const getCurrentColor = ({
		paletteStatus,
		paletteColor,
		paletteOpacity,
		color,
	} = {}) =>
		paletteStatus || isPaletteActive
			? getColorRGBAString({
					firstVar: `color-${paletteColor ?? currentPaletteColor}`,
					blockStyle,
					opacity: paletteOpacity || currentPaletteOpacity,
			  })
			: `rgba(${color ?? currentColor},${
					(paletteOpacity || currentPaletteOpacity) / 100
			  })`;

	const getDefaultValue = ({ data, color }) =>
		`${data} ${getCurrentColor(color)}`;

	const onChangeValue = (i, val) => {
		if (i === 3) {
			const { paletteStatus, paletteColor, paletteOpacity, color } = val;

			setIsPaletteActive(paletteStatus);
			setCurrentPaletteColor(paletteColor);
			setCurrentPaletteOpacity(paletteOpacity);
			const { color: newColor } = getColorRGBAParts(color);
			setCurrentColor(newColor);

			valueDecomposed[i] = getCurrentColor({ ...val, color: newColor });
		} else if (isNil(val)) valueDecomposed[i] = '0px';
		else valueDecomposed[i] = `${val}px`;

		if (valueDecomposed.length > 4) delete valueDecomposed[4];

		if (
			valueDecomposed[0] === '0px' &&
			valueDecomposed[1] === '0px' &&
			valueDecomposed[2] === '0px'
		)
			onChange('none');
		else onChange(valueDecomposed.join(' '));
	};

	const onChangeDefault = val => {
		if (val === 'none') {
			onChange(val);
		} else {
			const { data, color } = val;
			const { paletteOpacity } = color;

			setCurrentPaletteOpacity(paletteOpacity);

			onChange(getDefaultValue({ data, color }));
		}
	};

	const getActiveItem = val => {
		if (
			isNil(val) ||
			(val === 'none' &&
				(isNil(value) || isEmpty(value) || value === 'none'))
		)
			return true;
		if (val === 'none') return false;

		const decomposedProp = val.split(' ');
		const { opacity: decomposedOpacity } = getColorRGBAParts(
			decomposedProp[3]
		);

		const opacityCoincide = decomposedOpacity === opacity;
		const dataCoincide = decomposedProp
			.slice(0, 3)
			.every(
				(prop, i) =>
					+prop.match(/[-?0-9\d*]+|\D+/g)[0] === [x, y, blur][i]
			);

		return opacityCoincide && dataCoincide;
	};

	const defaults = [
		'none',
		{
			light: {
				data: '2px 4px 3px',
				color: { paletteOpacity: 30 },
			},
			dark: {
				data: '2px 2px 2px',
				color: { paletteOpacity: 30 },
			},
		},
		{
			light: {
				data: '2px 4px 3px',
				color: { paletteOpacity: 50 },
			},
			dark: {
				data: '2px 4px 3px',
				color: { paletteOpacity: 50 },
			},
		},
		{
			light: {
				data: '4px 4px 0px',
				color: { paletteOpacity: 21 },
			},
			dark: {
				data: '2px 2px 0px',
				color: { paletteOpacity: 77 },
			},
		},
	];

	return (
		<>
			<DefaultStylesControl
				items={[
					{
						activeItem: getActiveItem(defaults[0]),
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChangeDefault(defaults[0]),
					},
					{
						activeItem: getActiveItem(
							getDefaultValue(defaults[1][blockStyle])
						),
						content: (
							<span className='maxi-textshadow-control__default maxi-textshadow-control__default__total'>
								{__('Maxi', 'maxi-blocks')}
							</span>
						),
						onChange: () =>
							onChangeDefault(defaults[1][blockStyle]),
					},
					{
						activeItem: getActiveItem(
							getDefaultValue(defaults[2][blockStyle])
						),
						content: (
							<span className='maxi-textshadow-control__default maxi-textshadow-control__default__bottom'>
								{__('Maxi', 'maxi-blocks')}
							</span>
						),
						onChange: () =>
							onChangeDefault(defaults[2][blockStyle]),
					},
					{
						activeItem: getActiveItem(
							getDefaultValue(defaults[3][blockStyle])
						),
						content: (
							<span className='maxi-textshadow-control__default maxi-textshadow-control__default__solid'>
								{__('Maxi', 'maxi-blocks')}
							</span>
						),
						onChange: () =>
							onChangeDefault(defaults[3][blockStyle]),
					},
				]}
			/>
			{value !== 'none' && !isEmpty(value) && (
				<>
					<ColorControl
						label={__('Text shadow', 'maxi-blocks')}
						paletteStatus={isPaletteActive}
						paletteColor={currentPaletteColor}
						paletteOpacity={currentPaletteOpacity}
						color={!isPaletteActive ? getCurrentColor() : ''}
						onChange={value => {
							onChangeValue(3, value);
						}}
						onReset={() => onChangeValue(3, defaultColor)}
						disableGradient
						disableGradientAboveBackground
					/>
					<AdvancedNumberControl
						label={__('X', 'maxi-blocks')}
						value={+trim(x)}
						onChangeValue={val => {
							onChangeValue(
								0,
								val !== undefined && val !== '' ? val : ''
							);
						}}
						min={0}
						max={100}
						onReset={() => onChangeValue(0, 0)}
					/>
					<AdvancedNumberControl
						label={__('Y', 'maxi-blocks')}
						value={+trim(y)}
						onChangeValue={val => {
							onChangeValue(
								1,
								val !== undefined && val !== '' ? val : ''
							);
						}}
						min={0}
						max={100}
						onReset={() => onChangeValue(1, 0)}
					/>
					<AdvancedNumberControl
						label={__('Blur', 'maxi-blocks')}
						value={+trim(blur)}
						onChangeValue={val => {
							onChangeValue(
								2,
								val !== undefined && val !== '' ? val : ''
							);
						}}
						min={0}
						max={100}
						onReset={() => onChangeValue(2, 0)}
					/>
				</>
			)}
		</>
	);
};

/**
 * Control
 */
const TextShadowControl = props => {
	const { textShadow, onChange, defaultColor, className, blockStyle } = props;

	const [showOptions, changeShowOptions] = useState(
		!isEmpty(textShadow) ? 1 : 0
	);
	const [lastValue, changeLastValue] = useState(textShadow);

	const classes = classnames('maxi-textshadow-control', className);

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Add text shadow', 'maxi-blocks')}
				selected={showOptions}
				onChange={val => {
					changeShowOptions(val);
					if (val) {
						changeLastValue(textShadow);
						onChange('');
					} else onChange(lastValue);
				}}
			/>
			{!!showOptions && (
				<TextShadow
					value={lastValue}
					onChange={val => {
						changeLastValue(val);
						onChange(val);
					}}
					defaultColor={defaultColor}
					blockStyle={blockStyle}
				/>
			)}
		</div>
	);
};

export default TextShadowControl;
