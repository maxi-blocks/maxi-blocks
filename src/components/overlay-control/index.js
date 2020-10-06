/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon } = wp.components;

/**
 * Internal dependencies
 */
import __experimentalOpacityControl from '../opacity-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';
import ColorControl from '../color-control';
import GradientControl from '../gradient-control';

/**
 * External dependencies
 */
import { isObject, isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import { styleNone, backgroundColor, backgroundGradient } from '../../icons';

/**
 * Component
 */
const OverlayControl = props => {
	const { overlay, defaultOverlay, className, onChange } = props;

	const value = !isObject(overlay) ? JSON.parse(overlay) : overlay;

	const defaultValue = !isObject(defaultOverlay)
		? JSON.parse(defaultOverlay)
		: defaultOverlay;

	const classes = classnames('overlay-control', className);

	return (
		<div className={classes}>
			<__experimentalFancyRadioControl
				label={__('Overlay Type', 'maxi-blocks')}
				selected={value.overlayOptions.overlay}
				options={[
					{ label: <Icon icon={styleNone} />, value: '' },
					{
						label: <Icon icon={backgroundColor} />,
						value: 'color',
					},
					{
						label: <Icon icon={backgroundGradient} />,
						value: 'gradient',
					},
				]}
				onChange={item => {
					value.overlayOptions.overlay = item;
					onChange(JSON.stringify(value));
					if (isEmpty(item)) value.overlayOptions.activeColor = '';
					if (item === 'color')
						value.overlayOptions.activeColor =
							value.overlayOptions.color;
					if (item === 'gradient')
						value.overlayOptions.activeColor =
							value.overlayOptions.gradient;
					onChange(JSON.stringify(value));
				}}
			/>
			{(value.overlayOptions.overlay === 'gradient' ||
				value.overlayOptions.overlay === 'color') && (
				<__experimentalOpacityControl
					opacity={value.overlayOptions.opacity}
					defaultOpacity={defaultValue.overlayOptions.opacity}
					onChange={val => {
						value.overlayOptions.opacity = JSON.parse(val);
						onChange(JSON.stringify(value));
					}}
				/>
			)}
			{value.overlayOptions.overlay === 'gradient' && (
				<GradientControl
					label={__('Overlay Gradient', 'maxi-blocks')}
					gradient={value.overlayOptions.gradient}
					gradientOpacity={value.overlayOptions.gradientOpacity}
					defaultGradient={
						defaultValue.overlayOptions.gradientOpacity.opacity
					}
					onChange={val => {
						value.overlayOptions.gradient = val;
						value.overlayOptions.activeColor = val;
						onChange(JSON.stringify(value));
					}}
					onChangeOpacity={() => onChange(JSON.stringify(value))}
					gradientAboveBackground={
						value.overlayOptions.gradientAboveBackground
					}
					onGradientAboveBackgroundChange={val => {
						value.overlayOptions.gradientAboveBackground = val;
						onChange(JSON.stringify(value));
					}}
				/>
			)}
			{value.overlayOptions.overlay === 'color' && (
				<ColorControl
					label={__('Overlay Background', 'maxi-blocks')}
					color={value.overlayOptions.color}
					defaultColor={value.overlayOptions.color}
					onChange={val => {
						value.overlayOptions.color = val;
						value.overlayOptions.activeColor = val;
						onChange(JSON.stringify(value));
					}}
					disableImage
					disableVideo
					disableGradient
					disableGradientAboveBackground
				/>
			)}
		</div>
	);
};

export default OverlayControl;
