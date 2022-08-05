/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { useState } from '@wordpress/element';
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

	const classes = classnames(
		'maxi-text-input',
		isFullwidth && ' maxi-text-input--fullwidth',
		className
	);

	const [inputValue, setInputValue] = useState('');
	const valueChange = e => {
		setInputValue(e.target.value);
		setTimeout(() => {
			onChange(e.target.value);
		}, 300);
	};

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
				value={inputValue || ''}
				onChange={valueChange}
				aria-describedby={help ? `${id}__help` : undefined}
				{...props}
			/>
		</BaseControl>
	);
}
