/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { __experimentalGradientPicker } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import OpacityControl from '../opacity-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const GradientControl = props => {
	const {
		label,
		className,
		gradient,
		onChange,
		gradientOpacity,
		onChangeOpacity,
	} = props;

	const [currentGradient, setCurrentGradient] = useState(
		'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)'
	);

	console.log(gradient);

	const classes = classnames('maxi-gradient-control', className);

	return (
		<div className={classes}>
			<BaseControl
				className='maxi-gradient-control__display'
				label={`${label} ${__('colour', 'maxi-blocks')}`}
			>
				<div className='maxi-gradient-control__display__color'>
					<span style={{ background: currentGradient }} />
				</div>
			</BaseControl>
			<OpacityControl
				label={__('Gradient opacity', 'maxi-blocks')}
				opacity={gradientOpacity}
				onChange={val => onChangeOpacity(val)}
			/>
			<div className='maxi-gradient-control__gradient'>
				<__experimentalGradientPicker
					value={currentGradient}
					onChange={gradient => {
						setCurrentGradient(gradient);
						onChange(gradient);
					}}
				/>
			</div>
		</div>
	);
};

export default GradientControl;
