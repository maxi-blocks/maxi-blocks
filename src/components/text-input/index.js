/**
 * WordPress dependencies
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

/**
 * Component
 */
export default function TextInput({
	label,
	hideLabelFromVision,
	value,
	help,
	className,
	onChange,
	type = 'text',
	validationText,
	isFullwidth,
	...props
}) {
	const instanceId = useInstanceId(TextInput);
	const id = `inspector-text-input-${instanceId}`;
	const onChangeValue = event => onChange(event.target.value);

	const classes = classnames(
		'maxi-text-input',
		isFullwidth && ' maxi-text-input--fullwidth',
		className
	);

	return (
		<BaseControl
			label={label}
			hideLabelFromVision={hideLabelFromVision}
			id={id}
			help={help}
			className={classes}
		>
			<input
				className='maxi-text-input__input'
				type={type}
				id={id}
				value={value || ''}
				onChange={onChangeValue}
				aria-describedby={help ? `${id}__help` : undefined}
				{...props}
			/>
		</BaseControl>
	);
}
