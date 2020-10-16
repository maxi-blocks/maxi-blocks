/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import __experimentalClipPath from '../clip-path-control';

/**
 * Component
 */
const colorLayer = props => {
	const {
		colorOptions,
		defaultColorOptions,
		onChange,
		disableClipPath,
	} = props;

	return (
		<Fragment>
			<ColorControl
				label={__('Background', 'maxi-blocks')}
				color={colorOptions.color}
				defaultColor={defaultColorOptions.color}
				onChange={val => {
					colorOptions.color = val;
					colorOptions.activeColor = val;

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

export default colorLayer;
