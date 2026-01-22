/**
 * External dependencies
 */
import { debounce } from 'lodash';
import { useState, useMemo, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TextareaControl from '@components/textarea-control';

/**
 * Component
 */
export default function DebouncedTextareaControl( {
	value,
	onChange,
	delay = 300,
	...props
} ) {
	const [ internalValue, setInternalValue ] = useState( value );

	// Sync internal state with prop changes
	useEffect( () => {
		setInternalValue( value );
	}, [ value ] );

	const debouncedOnChange = useMemo(
		() => debounce( ( newValue ) => onChange( newValue ), delay ),
		[ onChange, delay ]
	);

	// Cleanup debounce on unmount
	useEffect( () => {
		return () => debouncedOnChange.cancel();
	}, [ debouncedOnChange ] );

	const handleChange = ( newValue ) => {
		setInternalValue( newValue );
		debouncedOnChange( newValue );
	};

	return (
		<TextareaControl
			{ ...props }
			value={ internalValue }
			onChange={ handleChange }
		/>
	);
}