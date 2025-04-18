/**
 * External dependencies
 */
import classnames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';

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
	autocomplete,
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

		if (textTimeOut.current) clearTimeout(textTimeOut.current);

		textTimeOut.current = setTimeout(() => {
			onChange(newValue);
		}, 300);
	};

	return (
		<input
			className={classes}
			type={type}
			value={inputValue}
			onChange={valueChange}
			{...(autocomplete === false ? { autoComplete: 'off' } : {})}
			{...props}
		/>
	);
}
