/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Style
 */
import './editor.scss';

/**
 * Component
 */
const CheckBoxControl = props => {
	const {
		id = '',
		title = '',
		help = '',
		className,
		checked,
		label,
		onChange,
	} = props;

	const instanceId = useInstanceId(CheckBoxControl);
	const checkboxId = `maxi-checkbox-control__${instanceId}`;

	const classes = classnames('maxi-checkbox-control', className);

	return (
		<BaseControl
					__nextHasNoMarginBottom id={id} label={title} help={help} className={classes}>
			<label
				htmlFor={checkboxId}
				className='maxi-checkbox-control__label'
			>
				<input
					id={checkboxId}
					name={checkboxId}
					className='maxi-checkbox-control__input'
					type='checkbox'
					onChange={el => onChange(el.target.checked)}
					checked={checked}
				/>
				{label}
			</label>
		</BaseControl>
	);
};

export default CheckBoxControl;
