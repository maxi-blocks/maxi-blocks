/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '../toggle-switch';

/**
 * External dependencies
 */
import classnames from 'classnames';

const SliderControl = props => {
	const { className, onChange, isEditView, setEditView, isLoop } = props;

	const classes = classnames('maxi-slider-control', className);

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Edit view', 'maxi-blocks')}
				selected={isEditView}
				onChange={val => {
					setEditView(val);
				}}
			/>
			<ToggleSwitch
				label={__('Infinite loop', 'maxi-blocks')}
				selected={isLoop}
				onChange={val => {
					onChange({ isLoop: val });
				}}
			/>
		</div>
	);
};

export default SliderControl;
