/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';

/**
 * External dependencies
 */
import classnames from 'classnames';

const SliderControl = props => {
	const { className, onChange, numberOfSlides, isEditView } = props;
	const classes = classnames('maxi-slider-control', className);

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Edit view', 'maxi-blocks')}
				selected={isEditView}
				onChange={val => {
					onChange({ isEditView: val });
				}}
			/>
			<AdvancedNumberControl
				label='Number of slides'
				value={numberOfSlides}
				onChangeValue={val => onChange({ numberOfSlides: val })}
				onReset={() => onChange({ numberOfSlides: 6 })}
				min={0}
				max={10}
				className={classes}
			/>
		</div>
	);
};

export default SliderControl;
