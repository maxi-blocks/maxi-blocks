/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon } = wp.components;

/**
 * Internal dependencies
 */
import __experimentalFancyRadioControl from '../fancy-radio-control';
import ColorControl from '../color-control';
import GradientControl from '../gradient-control';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * Styles and icons
 */
import { styleNone, backgroundColor, backgroundGradient } from '../../icons';

/**
 * Component
 */
const OverlayControl = props => {
	const { className, onChange } = props;

	const overlay = { ...props.overlay };
	const defaultOverlay = { ...props.defaultOverlay };

	const classes = classnames('overlay-control', className);

	return (
		<div className={classes}>
			<__experimentalFancyRadioControl
				label={__('Overlay Type', 'maxi-blocks')}
				selected={overlay.overlayOptions.overlay}
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
					overlay.overlayOptions.overlay = item;
					onChange(overlay);
					if (isEmpty(item)) overlay.overlayOptions.activeColor = '';
					if (item === 'color')
						overlay.overlayOptions.activeColor =
							overlay.overlayOptions.color;
					if (item === 'gradient')
						overlay.overlayOptions.activeColor =
							overlay.overlayOptions.gradient;
					onChange(overlay);
				}}
			/>
			{overlay.overlayOptions.overlay === 'gradient' && (
				<GradientControl
					label={__('Overlay Gradient', 'maxi-blocks')}
					gradient={overlay.overlayOptions.gradient}
					gradientOpacity={overlay.overlayOptions.gradientOpacity}
					defaultGradient={
						defaultOverlay.overlayOptions.gradientOpacity.opacity
					}
					onChange={val => {
						overlay.overlayOptions.gradient = val;
						overlay.overlayOptions.activeColor = val;
						onChange(overlay);
					}}
					onChangeOpacity={() => onChange(overlay)}
					gradientAboveBackground={
						overlay.overlayOptions.gradientAboveBackground
					}
					onGradientAboveBackgroundChange={val => {
						overlay.overlayOptions.gradientAboveBackground = val;
						onChange(overlay);
					}}
				/>
			)}
			{overlay.overlayOptions.overlay === 'color' && (
				<ColorControl
					label={__('Overlay Background', 'maxi-blocks')}
					color={overlay.overlayOptions.color}
					defaultColor={overlay.overlayOptions.color}
					onChange={val => {
						overlay.overlayOptions.color = val;
						overlay.overlayOptions.activeColor = val;
						onChange(overlay);
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
