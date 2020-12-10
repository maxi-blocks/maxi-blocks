/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { BaseControl, Button, __experimentalGradientPicker } = wp.components;

/**
 * Internal dependencies
 */
import CheckBoxControl from '../checkbox-control';
import __experimentalOpacityControl from '../opacity-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { reset } from '../../icons';

/**
 * Component
 */
const GradientControl = props => {
	const {
		label,
		className,
		gradient,
		defaultGradient = '',
		onChange,
		disableGradientAboveBackground = false,
		gradientAboveBackground,
		onGradientAboveBackgroundChange,
		onChangeOpacity,
	} = props;

	const gradientOpacity = { ...props.gradientOpacity };

	const classes = classnames('maxi-gradient-control', className);

	const onReset = () => {
		if (!disableGradientAboveBackground)
			onGradientAboveBackgroundChange(false);

		onChange(defaultGradient);
	};

	return (
		<div className={classes}>
			<BaseControl
				className='maxi-gradient-control__display'
				label={`${label} ${__('Colour', 'maxi-blocks')}`}
			>
				<div className='maxi-gradient-control__display__color'>
					<span style={{ background: gradient }} />
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
			<__experimentalOpacityControl
				label={__('Gradient Opacity', 'maxi-blocks')}
				fullWidthMode
				opacity={gradientOpacity.opacity}
				defaultOpacity={defaultGradient}
				onChange={opacity => {
					gradientOpacity.opacity = opacity;
					onChangeOpacity(gradientOpacity);
				}}
			/>
			<div className='maxi-gradient-control__gradient'>
				<__experimentalGradientPicker
					value={gradient}
					onChange={gradient => onChange(gradient)}
				/>
				{disableGradientAboveBackground && (
					<CheckBoxControl
						label={__('Above Background Image', 'maxi-blocks')}
						checked={gradientAboveBackground}
						onChange={val => onGradientAboveBackgroundChange(val)}
					/>
				)}
			</div>
		</div>
	);
};

export default GradientControl;
