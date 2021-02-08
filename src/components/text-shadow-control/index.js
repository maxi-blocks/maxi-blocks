/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, useState } = wp.element;
const { RangeControl, Icon } = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import FancyRadioControl from '../fancy-radio-control';

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

/**
 * Component
 */
const TextShadow = props => {
	const { value, onChange, defaultColor } = props;

	const [currentColor, setCurrentColor] = useState('#A2A2A2');

	const valueDecomposed =
		!isEmpty(value) && value !== 'none'
			? value.split(' ')
			: `0px 0px 0px ${defaultColor}`.split(' ');
	const x = Number(valueDecomposed[0].match(/[-?0-9\d*]+|\D+/g)[0]);
	const y = Number(valueDecomposed[1].match(/[-?0-9\d*]+|\D+/g)[0]);
	const blur = Number(valueDecomposed[2].match(/[-?0-9\d*]+|\D+/g)[0]);
	const color = valueDecomposed[3];

	const onChangeValue = (i, val) => {
		setCurrentColor(i === 3 && valueDecomposed[3]);

		if (isNil(val)) valueDecomposed[i] = `${0}${i < 3 ? 'px' : ''}`;
		else valueDecomposed[i] = `${val}${i < 3 ? 'px' : ''}`;

		if (
			valueDecomposed[0] === '0px' &&
			valueDecomposed[1] === '0px' &&
			valueDecomposed[2] === '0px'
		)
			onChange('none');
		else onChange(valueDecomposed.join(' '));
	};

	const getActiveItem = prop => {
		if (isEmpty(value) && isEmpty(prop)) return true;
		if (isEmpty(prop)) return false;

		const decomposedProp = prop.split(' ');
		if (Number(decomposedProp[0].match(/[-?0-9\d*]+|\D+/g)[0]) !== x)
			return false;
		if (Number(decomposedProp[1].match(/[-?0-9\d*]+|\D+/g)[0]) !== y)
			return false;
		if (Number(decomposedProp[2].match(/[-?0-9\d*]+|\D+/g)[0]) !== blur)
			return false;

		return true;
	};

	return (
		<Fragment>
			<DefaultStylesControl
				items={[
					{
						activeItem: getActiveItem(''),
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => {
							onChange('');
							setCurrentColor(currentColor);
						},
					},
					{
						activeItem: getActiveItem(
							`0px 0px 5px ${currentColor}`
						),
						content: (
							<span className='maxi-textshadow-control__default maxi-textshadow-control__default__total'>
								{__('Maxi', 'maxi-blocks')}
							</span>
						),
						onChange: () => onChange(`0px 0px 5px ${currentColor}`),
					},
					{
						activeItem: getActiveItem(
							`5px 0px 3px ${currentColor}`
						),
						content: (
							<span className='maxi-textshadow-control__default maxi-textshadow-control__default__bottom'>
								{__('Maxi', 'maxi-blocks')}
							</span>
						),
						onChange: () => onChange(`5px 0px 3px ${currentColor}`),
					},
					{
						activeItem: getActiveItem(
							`2px 4px 0px ${currentColor}`
						),
						content: (
							<span className='maxi-textshadow-control__default maxi-textshadow-control__default__solid'>
								{__('Maxi', 'maxi-blocks')}
							</span>
						),
						onChange: () => onChange(`2px 4px 0px ${currentColor}`),
					},
				]}
			/>
			<ColorControl
				label={__('Color', 'maxi-blocks')}
				color={color}
				onChange={val => onChangeValue(3, val)}
				onReset={() => onChangeValue(3, defaultColor)}
				disableGradient
				disableGradientAboveBackground
			/>
			<RangeControl
				label={__('X', 'maxi-blocks')}
				value={Number(trim(x))}
				onChange={val => onChangeValue(0, val)}
				min={0}
				max={100}
				allowReset
			/>
			<RangeControl
				label={__('Y', 'maxi-blocks')}
				value={Number(trim(y))}
				onChange={val => onChangeValue(1, val)}
				min={0}
				max={100}
				allowReset
			/>
			<RangeControl
				label={__('Blur', 'maxi-blocks')}
				value={Number(trim(blur))}
				onChange={val => onChangeValue(2, val)}
				min={0}
				max={100}
				allowReset
			/>
		</Fragment>
	);
};

/**
 * Control
 */
const TextShadowControl = props => {
	const { textShadow, onChange, defaultColor, className } = props;

	const [showOptions, changeShowOptions] = useState(
		!isEmpty(textShadow) ? 1 : 0
	);
	const [lastValue, changeLastValue] = useState(textShadow);

	const classes = classnames('maxi-textshadow-control', className);

	return (
		<div className={classes}>
			<FancyRadioControl
				label={__('Text Shadow', 'maxi-blocks')}
				selected={Number(showOptions)}
				options={[
					{ label: __('No', 'maxi-blocks'), value: 0 },
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
				]}
				onChange={() => {
					changeShowOptions(!showOptions);
					if (showOptions) {
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
				/>
			)}
		</div>
	);
};

export default TextShadowControl;
