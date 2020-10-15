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

	const youtubeVimeoRegex = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/;

	const directLinkRegex = /^(http(s)?:\/\/|www\.).*(\.mp4|\.mkv)$/;

	// Validate Input on blur
	const validateInput = target => {
		const text = target.value;

		// video-url type validation
		if (type === 'video-url') {
			if (!text.match(youtubeVimeoRegex)) {
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
			if (
				value.match(youtubeVimeoRegex) ||
				value.match(directLinkRegex)
			) {
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
