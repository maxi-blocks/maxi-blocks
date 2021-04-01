/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import RangeSliderControl from '../range-slider-control';

/**
 * Component
 */
const SvgAnimationDurationControl = props => {
	const { animation, duration, onChange } = props;
	return (
		<Fragment>
			{{ animation } !== 'off' && (
				<RangeSliderControl
					label={__('Animation Duration', 'maxi-blocks')}
					value={duration}
					min={1.0}
					max={5.0}
					step={0.1}
					initialPosition={3.7}
					onChange={val => onChange(val)}
				/>
			)}
		</Fragment>
	);
};

export default SvgAnimationDurationControl;
