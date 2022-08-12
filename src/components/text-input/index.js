/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { useState } from '@wordpress/element';

/**
 * Component
 */
export default function TextInput({
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

	const [inputValue, setInputValue] = useState('');
	const valueChange = e => {
		setInputValue(e.target.value);
		setTimeout(() => {
			onChange(e.target.value);
		}, 300);
	};

	return (
		<input
			className='maxi-text-input__input'
			type={type}
			id={id}
			value={inputValue || ''}
			onChange={valueChange}
			aria-describedby={help ? `${id}__help` : undefined}
			{...props}
		/>
	);
}
