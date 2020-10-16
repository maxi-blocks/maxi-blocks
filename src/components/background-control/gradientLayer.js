/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import GradientControl from '../gradient-control';
import __experimentalClipPath from '../clip-path-control';

/**
 * Component
 */
const GradientLayer = props => {
	const {
		colorOptions,
		defaultColorOptions,
		onChange,
		disableClipPath,
	} = props;

	return (
		<Fragment>
			<GradientControl
				label={__('Background', 'maxi-blocks')}
				gradient={colorOptions.gradient}
				gradientOpacity={colorOptions.gradientOpacity}
				defaultGradient={defaultColorOptions.gradientOpacity.opacity}
				onChange={val => {
					colorOptions.gradient = val;
					colorOptions.activeColor = val;

					onChange(colorOptions);
				}}
				onChangeOpacity={() => onChange(colorOptions)}
				gradientAboveBackground={colorOptions.gradientAboveBackground}
				onGradientAboveBackgroundChange={val => {
					colorOptions.gradientAboveBackground = val;

					onChange(colorOptions);
				}}
			/>
			{!disableClipPath && (
				<__experimentalClipPath
					clipPath={colorOptions.clipPath}
					onChange={val => {
						colorOptions.clipPath = val;

						onChange(colorOptions);
					}}
				/>
			)}
		</Fragment>
	);
};

export default GradientLayer;
