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
	const { className, setEditView, isEditView } = props;
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
		</div>
	);
};

export default SliderControl;
