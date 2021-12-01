/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalGradientPicker as GradientPicker } from '@wordpress/components';
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

	const [currentGradient, setCurrentGradient] = useState(gradient);

	const classes = classnames('maxi-gradient-control', className);

	return (
		<div className={classes}>
			<BaseControl
				className='maxi-gradient-control__display'
				label={`${label} ${__('colour', 'maxi-blocks')}`}
			>
				<div className='maxi-gradient-control__display__color'>
					<span style={{ background: gradient }} />
				</div>
			</BaseControl>
			<OpacityControl
				label={__('Gradient opacity', 'maxi-blocks')}
				opacity={gradientOpacity}
				onChange={val => onChangeOpacity(val)}
			/>
			<div className='maxi-gradient-control__gradient'>
				<GradientPicker
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
