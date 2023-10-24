/**
 * WordPress dependencies
 */
import { useState, useRef, useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
	value,
	...props
}) {
	const [inputValue, setInputValue] = useState(value);
	const textTimeOut = useRef(null);

	useEffect(() => {
		if (value !== inputValue) setInputValue(value);
	}, [value]);

	const classes = classnames('maxi-text-input', className);

	const valueChange = e => {
		const newValue = e.target.value;
		setInputValue(newValue);
		onChange(newValue);
	};

	return (
		<input
			className={classes}
			type={type}
			value={inputValue}
			onChange={valueChange}
			{...props}
		/>
	);
}
