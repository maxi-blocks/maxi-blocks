/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ColorControl from '@components/color-control';
import DefaultStylesControl from '@components/default-styles-control';
import ToggleSwitch from '@components/toggle-switch';
import AdvancedNumberControl from '@components/advanced-number-control';
import Icon from '@components/icon';
import { getColorRGBAString, getColorRGBAParts } from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty, trim } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleNone } from '@maxi-icons';

/**
 * Component
 */
const TextShadow = props => {
	const { value, onChangeInline, onChange, defaultColor, blockStyle } = props;

	const decomposeValue = rawVal => {
		const val = rawVal ?? value;

		const valueDecomposed =
			!isEmpty(val) && val !== 'none'
				? val.split(' ')
				: `0px 0px 0px ${defaultColor || ''}`.split(' ');
		const x = +valueDecomposed[0].match(/[-?0-9\d*]+|\D+/g)[0];
		const y = +valueDecomposed[1].match(/[-?0-9\d*]+|\D+/g)[0];
		const blur = +valueDecomposed[2].match(/[-?0-9\d*]+|\D+/g)[0];
		const { color, opacity } = getColorRGBAParts(
			val && val.includes('--var')
				? val
						.replace(`${x}px `, '')
						.replace(`${y}px `, '')
						.replace(`${blur}px `, '')
				: valueDecomposed[3]
		);

		return {
			valueDecomposed,
			x,
			y,
			blur,
			color,
			opacity,
		};
	};

	const defaultPaletteColor = 8;

	const { valueDecomposed, x, y, blur, color, opacity } = decomposeValue();

	const [isPaletteActive, setIsPaletteActive] = useState(
		isEmpty(color) || color.toString().length === 1
	);
	const [currentPaletteColor, setCurrentPaletteColor] = useState(
		isEmpty(color) || !isPaletteActive ? defaultPaletteColor : +color
	);
	const [currentPaletteOpacity, setCurrentPaletteOpacity] = useState(
		!isNil(opacity) ? +opacity : 1
	);
	const [currentColor, setCurrentColor] = useState(
		!isPaletteActive ? color : undefined
	);

	useEffect(() => {
		const { color, opacity } = decomposeValue();

		if (color) {
			setIsPaletteActive(color.toString().length === 1);
			setCurrentPaletteColor(isPaletteActive ? color : undefined);
		}
		setCurrentPaletteOpacity(!isNil(opacity) ? +opacity : 1);
		setCurrentColor(!isPaletteActive ? color : undefined);
	}, [value]);

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
					paletteOpacity || currentPaletteOpacity
			  })`;

	const getDefaultValue = ({ data, color }) =>
		`${data} ${getCurrentColor(color)}`;

	const getValue = (i, val) => {
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
			return 'none';

		const newValue = `${valueDecomposed[0]} ${valueDecomposed[1]} ${valueDecomposed[2]} ${valueDecomposed[3]}`;
		return newValue;
	};

	const onChangeValue = (i, val) => {
		const newValue = getValue(i, val);
		onChange(newValue);
	};

	const onChangeInlineValue = (i, val) => {
		const newValue = getValue(i, val);
		onChangeInline(newValue);
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
				color: { paletteOpacity: 0.3 },
			},
			dark: {
				data: '2px 2px 2px',
				color: { paletteOpacity: 0.3 },
			},
		},
		{
			light: {
				data: '2px 4px 3px',
				color: { paletteOpacity: 0.5 },
			},
			dark: {
				data: '2px 4px 3px',
				color: { paletteOpacity: 0.5 },
			},
		},
		{
			light: {
				data: '4px 4px 0px',
				color: { paletteOpacity: 0.21 },
			},
			dark: {
				data: '2px 2px 0px',
				color: { paletteOpacity: 0.77 },
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
						onChangeInline={value => onChangeInlineValue(3, value)}
						onChange={value => {
							onChangeValue(3, value);
						}}
						defaultColorAttributes={{
							paletteStatus: isPaletteActive,
							paletteColor: defaultPaletteColor,
							paletteOpacity: 1,
							color: !isPaletteActive
								? `rgba(${getCurrentColor()},1)`
								: '',
						}}
						disableGradient
						disableGradientAboveBackground
					/>
					{[
						{ label: __('X', 'maxi-blocks'), value: +trim(x) },
						{ label: __('Y', 'maxi-blocks'), value: +trim(y) },
						{
							label: __('Blur', 'maxi-blocks'),
							value: +trim(blur),
						},
					].map(({ label, value }, index) => (
						<AdvancedNumberControl
							key={`maxi-text-shadow-control__${label.toLocaleLowerCase()}`}
							label={label}
							value={value}
							onChangeValue={(val, meta) => {
								onChangeValue(
									index,
									val !== undefined && val !== '' ? val : ''
								);
							}}
							min={0}
							max={100}
							onReset={() => onChange(getValue(index, 0))}
						/>
					))}
				</>
			)}
		</>
	);
};

/**
 * Control
 */
const TextShadowControl = props => {
	const {
		textShadow,
		onChangeInline,
		onChange,
		defaultColor,
		className,
		blockStyle,
		breakpoint,
	} = props;

	const [showOptions, changeShowOptions] = useState(!isEmpty(textShadow));
	const [lastValue, changeLastValue] = useState(textShadow);

	useEffect(() => {
		changeLastValue(textShadow);
	}, [breakpoint]);

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
						onChange(lastValue);
					} else onChange('');
				}}
			/>
			{showOptions && (
				<TextShadow
					value={lastValue}
					onChangeInline={val => {
						changeLastValue(val);
						onChangeInline(val);
					}}
					onChange={val => {
						changeLastValue(val);
						onChange(val);
					}}
					defaultColor={defaultColor}
					blockStyle={blockStyle}
					breakpoint={breakpoint}
				/>
			)}
		</div>
	);
};

export default TextShadowControl;
