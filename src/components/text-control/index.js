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

	const validateInput = target => {
		const text = target.value;
		if (type === 'video-url') {
			const videoUrlRegex = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/;
			if (!text.match(videoUrlRegex)) {
				setValidationText('Video Url is not valid');
			} else {
				setValidationText(null);
			}
		}
	};

	const onChangeValue = value => {
		if (type === 'video-url') {
			const videoUrlRegex = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/;
			if (value.match(videoUrlRegex)) {
				setValidationText(null);
			}
		}
	};

	return (
		<BaseControl label={label} className={classes}>
			<input
				type='text'
				value={value}
				onChange={e => {
					onChange(e.target.value);
					onChangeValue(e.target.value);
				}}
				onBlur={value => validateInput(value.target)}
				placeholder={placeholder}
			/>
			{!!validationText && validationText}
		</BaseControl>
	);
};

export default TextControl;
