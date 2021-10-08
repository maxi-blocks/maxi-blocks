/**
 * Wordpress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Styles and Icons
 */
import './editor.scss';

/**
 * Component
 */
const RadioControl = ({
	label,
	className,
	selected,
	help,
	onChange,
	options = [],
	...props
}) => {
	const instanceId = useInstanceId(RadioControl);
	const id = `inspector-radio-control-${instanceId}`;
	const onChangeValue = event => onChange(event.target.value);

	return (
		!isEmpty(options) && (
			<BaseControl
				label={label}
				id={id}
				help={help}
				className={classnames(className, 'maxi-radio-control')}
			>
				{options.map((option, index) => (
					<div
						key={`${id}-${index}`}
						className={`maxi-radio-control__option${
							option.hidden ? ' hidden' : ''
						}`}
					>
						<input
							id={`${id}-${index}`}
							className='maxi-radio-control__input'
							type='radio'
							name={id}
							value={option.value}
							onChange={onChangeValue}
							checked={option.value === selected}
							aria-describedby={help ? `${id}__help` : undefined}
							{...props}
						/>
						<label htmlFor={`${id}-${index}`}>{option.label}</label>
					</div>
				))}
			</BaseControl>
		)
	);
};

export default RadioControl;
