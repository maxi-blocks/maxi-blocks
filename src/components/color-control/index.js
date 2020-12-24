/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { ColorPicker, RangeControl, BaseControl, Button } = wp.components;
const { useState, useEffect } = wp.element;

/**
 * External dependencies
 */
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
		const color = colorString.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

		for (const i in rgbKeys) output[rgbKeys[i]] = color[i] || 1;

		return { rgb: { ...output } };
	};

	const [colorAlpha, setColorAlpha] = useState(getRGB(color).rgb.a * 100);
	const [currentColor, setCurrentColor] = useState(color);

	const returnColor = (val, alpha) => {
		return !isEmpty(val)
			? `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${alpha})`
			: '';
	};

	const onReset = () => {
		onChange(defaultColor);
		setColorAlpha(100);
		if (!isEmpty(defaultColor))
			onChange(returnColor(getRGB(defaultColor), 1));
	};

	useEffect(() => {
		if (color !== currentColor) {
			setCurrentColor(color);
			setColorAlpha(getRGB(color).rgb.a);
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
			<RangeControl
				label={__('Colour Opacity', 'maxi-blocks')}
				className='maxi-color-control__opacity'
				value={Number(colorAlpha)}
				onChange={val => {
					if (!isEmpty(color)) {
						onChange(returnColor(getRGB(color), Number(val / 100)));
						setCurrentColor(
							returnColor(getRGB(color), Number(val / 100))
						);
					}
					setColorAlpha(val);
				}}
				min={0}
				max={100}
				initialPosition={100}
			/>
			<div className='maxi-color-control__color'>
				<ColorPicker
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
