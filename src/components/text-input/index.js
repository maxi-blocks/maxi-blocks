/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
export default function TextInput({
	className,
	onChange,
	type = 'text',
	...props
}) {
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
			value={inputValue}
			onChange={valueChange}
			{...props}
		/>
	);
}
