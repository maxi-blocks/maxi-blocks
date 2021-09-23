/**
 * External dependencies
 */
import classnames from 'classnames';
import { uniqueId } from 'lodash';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const ToggleSwitch = ({ className, selected = false, onChange, label }) => {
	const classes = classnames('maxi-toggle-switch', className);
	const labelId = uniqueId('maxi-toggle-switch');

	return (
		<div className={classes}>
			{label && (
				<span className='maxi-toggle-switch__label'>{label}</span>
			)}
			<div className='maxi-toggle-switch__toggle'>
				<input
					onChange={val => onChange(val)}
					checked={selected}
					type='checkbox'
					id={labelId}
				/>
				<label htmlFor={labelId} />
			</div>
		</div>
	);
};

export default ToggleSwitch;
