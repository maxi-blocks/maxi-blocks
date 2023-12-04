/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TextControl from '../text-control';

/**
 * Styles
 */
import './editor.scss';

const ImageUrlUpload = ({
	attributes,
	prefix = '',
	newStyle = true,
	onChange,
}) => {
	const [error, setError] = useState(false);

	return (
		<div className='maxi-image-url-upload'>
			<TextControl
				label={newStyle && __('URL', 'maxi-blocks')}
				value={
					attributes[`${prefix}isImageUrl`] &&
					attributes[`${prefix}mediaURL`]
				}
				placeholder={__('Enter URL', 'maxi-blocks')}
				newStyle={newStyle}
				onChange={value => {
					const trimmedValue = value.trim();

					const setMediaAttributes = ({
						url,
						width,
						height,
						isValid = true,
					}) =>
						onChange({
							[`${prefix}mediaID`]: undefined,
							[`${prefix}mediaURL`]: url,
							[`${prefix}mediaWidth`]: width,
							[`${prefix}mediaHeight`]: height,
							[`${prefix}isImageUrl`]: true,
							[`${prefix}isImageUrlValid`]: isValid,
						});

					if (!trimmedValue) {
						setError(false);
						setMediaAttributes({ url: trimmedValue });
						return;
					}

					const media = new Image();
					media.src = trimmedValue;
					media.onload = () => {
						setError(false);
						setMediaAttributes({
							url: trimmedValue,
							width: media.width,
							height: media.height,
						});
					};
					media.onerror = () => {
						setError(true);
						setMediaAttributes({
							url: trimmedValue,
							isValid: false,
						});
					};
				}}
			/>
			{error && (
				<p className='maxi-image-url-upload__error'>
					{__(
						'Please input a valid URL to an image that exists',
						'maxi-blocks'
					)}
				</p>
			)}
		</div>
	);
};

export default ImageUrlUpload;
