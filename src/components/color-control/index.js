/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import AdvancedNumberControl from '../advanced-number-control';
import ColorPaletteControl from './paletteControl';

/**
 * External dependencies
 */
import ChromePicker from 'react-color';
import { isEmpty, isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const ColorControl = props => {
	const {
		label,
		className,
		color,
		defaultColor = '',
		disableColorDisplay = false,
		disableOpacity = false,
		paletteColor,
		paletteStatus,
		onChange,
		isHover,
		disablePalette,
		textLevel,
		showPalette = false,
		deviceType,
		clientId,
	} = props;

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

	const onChangeValue = obj => {
		onChange({
			color,
			paletteColor,
			paletteStatus,
			...obj,
		});
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
		<>
			{!disablePalette && showPalette && (
				<ColorPaletteControl
					label={label}
					value={paletteColor}
					status={paletteStatus}
					textLevel={textLevel}
					isHover={isHover}
					onChange={obj => onChangeValue(obj)}
					deviceType={deviceType}
					clientId={clientId}
				/>
			)}
			{!showPalette || !paletteStatus || disablePalette ? (
				<div className={classes}>
					{!disableColorDisplay && (
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
							</div>
						</BaseControl>
					)}
					{!disableOpacity && (
						<AdvancedNumberControl
							label={__('Colour Opacity', 'maxi-blocks')}
							value={+colorAlpha}
							onChangeValue={val => {
								const value = !isNil(val) ? +val : 0;

								if (!isEmpty(color)) {
									onChangeValue({
										color: returnColor(
											getRGB(color),
											value
										),
									});
									setCurrentColor(
										returnColor(getRGB(color), value)
									);
								}

								setColorAlpha(value);
							}}
							min={0}
							max={100}
							disableReset={showPalette}
							initialPosition={100}
							onReset={() => onReset()}
						/>
					)}
					<div className='maxi-color-control__color'>
						<ChromePicker
							color={currentColor}
							onChangeComplete={val => {
								onChangeValue({
									color: returnColor(val, colorAlpha),
								});
								setCurrentColor(returnColor(val, colorAlpha));
							}}
							disableAlpha
						/>
					</div>
				</div>
			) : null}
		</>
	);
};

export default ColorControl;
