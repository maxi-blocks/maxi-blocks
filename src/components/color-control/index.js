/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { BaseControl, Button } = wp.components;
const { useState, useEffect } = wp.element;

/**
 * Internal dependencies
 */
import RangeSliderControl from '../range-slider-control';

/**
 * External dependencies
 */
import ChromePicker from 'react-color';
import { isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { reset } from '../../icons';

/**
 * Component
 */
const ColorControl = props => {
	const { label, className, color, defaultColor = '', onChange } = props;

	const classes = classnames('maxi-color-control', className);

	const getRGB = colorString => {
		if (!colorString) return { rgb: { r: 1, g: 1, b: 1, a: 1 } };

		const rgbKeys = ['r', 'g', 'b', 'a'];
		const output = {};

		if (colorString.charAt(0) === '#') {
			const aRgbHex = colorString.replace('#', '').match(/.{1,2}/g);

			rgbKeys.forEach((item, i) => {
				output[rgbKeys[i]] = parseInt(aRgbHex[i], 16) || 1;
			});
		} else {
			const color = colorString
				.replace(/^rgba?\(|\s+|\)$/g, '')
				.split(',');

			rgbKeys.forEach((item, i) => {
				output[rgbKeys[i]] = color[i] || 1;
			});
		}

		return { rgb: { ...output } };
	};

	const [colorAlpha, setColorAlpha] = useState(getRGB(color).rgb.a * 100);
	const [currentColor, setCurrentColor] = useState(color);

	const returnColor = (val, alpha) => {
		return !isEmpty(val)
			? `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${+alpha / 100})`
			: '';
	};

	const onReset = () => {
		onChange(defaultColor);
		setColorAlpha(100);
		setCurrentColor(defaultColor);
		if (!isEmpty(defaultColor)) {
			setCurrentColor(returnColor(getRGB(defaultColor), 100));
			onChange(returnColor(getRGB(defaultColor), 100));
		}
	};

	useEffect(() => {
		if (color !== currentColor) {
			setCurrentColor(color);
			setColorAlpha(
				getRGB(color).rgb.a === 1 || getRGB(color).rgb.a === 100
					? 100
					: colorAlpha
			);
		}
	}, [color, currentColor, setCurrentColor, setColorAlpha, getRGB]);

	return (
		<div className={classes}>
			<BaseControl
				className='maxi-color-control__display'
				label={`${label} ${__('Colour', 'maxi-blocks')}`}
			>
				<div className='maxi-color-control__display__color'>
					<span
						style={{
							background: color,
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => onReset()}
						aria-label={sprintf(
							/* translators: %s: a textual label  */
							__('Reset %s settings', 'maxi-blocks'),
							'font size'
						)}
						type='reset'
					>
						{reset}
					</Button>
				</div>
			</BaseControl>
			<RangeSliderControl
				label={__('Colour Opacity', 'maxi-blocks')}
				className='maxi-color-control__opacity'
				value={+colorAlpha}
				onChange={val => {
					if (!isEmpty(color)) {
						onChange(returnColor(getRGB(color), val));
						setCurrentColor(returnColor(getRGB(color), val));
					}

					setColorAlpha(val);
				}}
				min={0}
				max={100}
				initialPosition={100}
			/>
			<div className='maxi-color-control__color'>
				<ChromePicker
					color={currentColor}
					onChangeComplete={val => {
						onChange(returnColor(val, colorAlpha));
						setCurrentColor(returnColor(val, colorAlpha));
					}}
					disableAlpha
				/>
			</div>
		</div>
	);
};

export default ColorControl;
