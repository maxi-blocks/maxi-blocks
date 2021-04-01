/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { BaseControl } = wp.components;
import { useState } from '@wordpress/element';

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

	return (
		<BaseControl label={label} className={classes}>
			<input
				type={type === 'video-url' ? 'url' : 'text'}
				value={value || ''}
				onChange={e => {
					const textValue = e.target.value;
					if (type === 'video-url') {
						if (textValue && !videoUrlRegex.test(textValue)) {
							setValidationText(
								__('Invalid video URL', 'maxi-blocks')
							);
						} else {
							setValidationText(null);
						}
					}
					onChange(textValue);
				}}
				placeholder={placeholder}
			/>
			{type === 'video-url' && !!validationText && (
				<div className='maxi-input-control__validation-text'>
					{validationText}
				</div>
			)}
		</BaseControl>
	);
};

export default TextControl;
