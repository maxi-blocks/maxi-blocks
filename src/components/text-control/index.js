/**
 * WordPress dependencies
 */
const { BaseControl } = wp.components;
const { useState } = wp.element;

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
const TextControl = props => {
	const {
		label = '',
		className = '',
		value,
		onChange,
		type,
		placeholder,
	} = props;
	const [validationText, setValidationText] = useState(null);

	const classes = classnames('maxi-input-control', className);

	const videoUrlRegex = /(https?:\/\/)www.(youtube.com\/watch[?]v=([a-zA-Z0-9_-]{11}))|https?:\/\/(www.)?vimeo.com\/([0-9]{9})|https?:\/\/.*\.(?:mp4|webm|ogg)$/g;

	// Validate Input on blur
	const validateInput = target => {
		const text = target.value;

		// video-url type validation
		if (type === 'video-url') {
			if (!videoUrlRegex.test(text)) {
				setValidationText('Invalid video url');
			} else {
				setValidationText(null);
			}
		}

		if (value === '') {
			setValidationText(null);
		}
	};

	// Validate Input onChange
	const onChangeValue = value => {
		if (type === 'video-url') {
			if (videoUrlRegex.test(value)) {
				setValidationText(null);
			}
		}

		if (value === '') {
			setValidationText(null);
		}
	};

	return (
		<BaseControl label={label} className={classes}>
			<input
				type='text'
				value={value}
				onChange={e => {
					e.preventDefault();
					onChange(e.target.value);
					onChangeValue(e.target.value);
				}}
				onBlur={value => validateInput(value.target)}
				placeholder={placeholder}
			/>
			{!!validationText && (
				<div className='maxi-input-control__validation-text'>
					{validationText}
				</div>
			)}
		</BaseControl>
	);
};

export default TextControl;
