/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { ColorPicker, RangeControl, BaseControl, Button } = wp.components;

/**
 * External dependencies
 */
import { isEmpty, round } from 'lodash';
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
	const {
		label,
		className,
		color,
		opacity = 1,
		defaultColor = '',
		onChange,
		onChangeOpacity,
	} = props;

	const classes = classnames('maxi-color-control', className);

	const getRGB = color => {
		var match = color.match(
			/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/
		);
		return match
			? {
					rgb: {
						r: match[1],
						g: match[2],
						b: match[3],
					},
			  }
			: {};
	};

	const returnColor = (val, alpha) => {
		return !isEmpty(val)
			? `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${alpha})`
			: '';
	};

	const onReset = () => {
		onChange(defaultColor);
		onChangeOpacity(100);
	};

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
				value={round(opacity * 100)}
				onChange={val => {
					let opacityVal = Number(val / 100);
					onChange(returnColor(getRGB(color), opacityVal));
					onChangeOpacity(opacityVal);
				}}
				min={0}
				max={100}
				initialPosition={100}
			/>
			<div className='maxi-color-control__color'>
				<ColorPicker
					color={color}
					onChangeComplete={val =>
						onChange(returnColor(val, opacity))
					}
					disableAlpha
				/>
			</div>
		</div>
	);
};

export default ColorControl;
