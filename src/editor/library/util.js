/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const placeholderImage = async () => {
	const ajaxurl = wp.ajax.settings.url;
	try {
		const response = await fetch(
			`${
				window.location.origin + ajaxurl
			}?action=maxi_upload_placeholder_image`
		);
		const data = await response.json();
		if (data.error === '404') {
			console.warn(
				__(
					"Can't upload the placeholder image, check directory's permissions",
					'maxi-blocks'
				)
			);
			return null;
		}
		return data;
	} catch (err) {
		console.error(
			__(`Error uploading the placeholder image: ${err}`, 'maxi-blocks')
		);
	}
	return null;
};

const imageUploader = async (imageSrc, usePlaceholderImage) => {
	const ajaxurl = wp.ajax.settings.url;
	try {
		if (usePlaceholderImage) return placeholderImage();

		const response = await fetch(
			`${
				window.location.origin + ajaxurl
			}?action=maxi_upload_pattern_image&maxi_image_to_upload=${imageSrc}`
		);

		if (!response.ok) {
			console.warn(
				__(
					'The Cloud server is down, using the placeholder image',
					'maxi-blocks'
				)
			);
			return placeholderImage();
		}

		const data = await response.json();
		if (data.error === '404') {
			console.warn(
				__(
					'The original image not found (404) on the Cloud Site, using the placeholder image',
					'maxi-blocks'
				)
			);
			return placeholderImage();
		}
		return data;
	} catch (err) {
		console.error(__(`Error uploading the image: ${err}`, 'maxi-blocks'));
	}
	return null;
};

export default imageUploader;
