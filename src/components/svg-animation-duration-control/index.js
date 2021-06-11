/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import {} from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';

/**
 * Component
 */
const SvgAnimationDurationControl = props => {
	const { animation, duration, onChange } = props;
	return (
		<>
			{{ animation } !== 'off' && (
				<AdvancedNumberControl
					label={__('Animation Duration', 'maxi-blocks')}
					placeholder=''
					disableUnit
					value={duration}
					onChangeValue={val => {
						onChange(val !== undefined && val !== '' ? val : '');
					}}
					min={1.0}
					max={5.0}
					step={0.1}
					onReset={() => onChange(3.7)}
					initialPosition={3.7}
				/>
			)}
		</>
	);
};

export default SvgAnimationDurationControl;
