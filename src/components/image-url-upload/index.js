/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TextControl from '@components/text-control';
import { getLastBreakpointAttribute } from '@extensions/styles';

/**
 * Styles
 */
import './editor.scss';

const ImageUrlUpload = ({
	attributes,
	prefix = '',
	mediaPrefix = 'media',
	newStyle = true,
	breakpoint,
	onChange,
}) => {
	const [error, setError] = useState(
		!!getLastBreakpointAttribute({
			target: `${prefix}isImageUrlInvalid`,
			breakpoint,
			attributes,
		})
	);

	return (
		<div className='maxi-image-url-upload'>
			<TextControl
				label={newStyle && __('URL', 'maxi-blocks')}
				value={
					getLastBreakpointAttribute({
						target: `${prefix}isImageUrl`,
						breakpoint,
						attributes,
					}) &&
					getLastBreakpointAttribute({
						target: `${prefix}${mediaPrefix}URL`,
						breakpoint,
						attributes,
					})
				}
				placeholder={__('Enter URL', 'maxi-blocks')}
				newStyle={newStyle}
				autoComplete='off'
				onChange={value => {
					const trimmedValue = value.trim();

					const setMediaAttributes = ({
						url,
						width,
						height,
						isInvalid = false,
					}) =>
						onChange({
							id: undefined,
							url,
							width,
							height,
							isImageUrl: true,
							isImageUrlInvalid: isInvalid,
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
							isInvalid: true,
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
