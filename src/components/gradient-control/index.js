/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { BaseControl, Button, __experimentalGradientPicker } = wp.components;

/**
 * Internal dependencies
 */
import OpacityControl from '../opacity-control';

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
		gradientOpacity,
		onChangeOpacity,
		defaultOpacity = 1,
	} = props;

	const classes = classnames('maxi-gradient-control', className);

	const onReset = () => {
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
			<OpacityControl
				label={__('Gradient Opacity', 'maxi-blocks')}
				fullWidthMode
				opacity={gradientOpacity}
				defaultOpacity={defaultOpacity}
				onChange={val => onChangeOpacity(val)}
			/>
			<div className='maxi-gradient-control__gradient'>
				<__experimentalGradientPicker
					value={gradient}
					onChange={gradient => onChange(gradient)}
				/>
			</div>
		</div>
	);
};

export default GradientControl;
