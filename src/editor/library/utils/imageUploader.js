/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, resolveSelect } from '@wordpress/data';
import { uploadMedia } from '@wordpress/media-utils';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

export const placeholderUploader = async () => {
	try {
		const { getEntityRecords } = resolveSelect('core');

		// Check if it already exist
		const media = await getEntityRecords('postType', 'attachment', {
			post_status: 'inherit',
			posts_per_page: 1,
			search: 'maxi-pattern-placeholder',
		});

		if (!isEmpty(media))
			return {
				id: media[0].id,
				url: media[0].media_details.sizes.full.source_url,
			};

		// In case the image is not found, let's fetch it from the Cloud server
		const placeholderBlob = await fetch(
			'/wp-content/plugins/maxi-blocks/img/patterns-placeholder.jpeg'
		)
			.then(res => res.blob())
			.catch(err => {
				console.warn(
					__(
						`The Cloud server is down, using the placeholder image. Error: ${err}`,
						'maxi-blocks'
					)
				);

				return false;
			});

		let response = false;

		const maxiTerms = await getEntityRecords('taxonomy', 'maxi-image-type');
		const maxiTermId = maxiTerms[0].id;

		await uploadMedia({
			filesList: [
				new File([placeholderBlob], 'maxi-pattern-placeholder.jpg', {
					type: 'image/jpeg',
				}),
			],
			onFileChange: data => {
				[response] = data;
			},
			onError: err =>
				console.warn(
					__(
						`Can't upload the placeholder image, check directory's permissions. Error: ${err}`,
						'maxi-blocks'
					)
				),
		});

		// Add maxi-image-type taxonomy
		dispatch('core').saveEntityRecord(
			'postType',
			'attachment',
			{ ...response, 'maxi-image-type': maxiTermId },
			{ throwOnError: true }
		);

		return response;
	} catch (err) {
		console.error(
			__(`Error uploading the placeholder image: ${err}`, 'maxi-blocks')
		);
	}
	return null;
};

const getImageInfo = url => {
	// Get the file name from the URL
	const fileName = url.substring(url.lastIndexOf('/') + 1);

	// Get the file extension from the file name
	const fileExtension = fileName.split('.').pop();

	// Define an object that maps file extensions to mime types
	const mimeTypes = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		// Add more mime types as needed
	};

	// Get the mime type from the extension
	const mimeType = mimeTypes[fileExtension.toLowerCase()];

	// Return an object with the file name and mime type
	return {
		title: fileName.replace(`.${fileExtension}`, ''),
		fileName,
		mimeType,
	};
};

const imageUploader = async (imageSrc, usePlaceholderImage) => {
	if (usePlaceholderImage) return placeholderUploader();

	const { getEntityRecords } = resolveSelect('core');

	const { title, fileName, mimeType } = getImageInfo(imageSrc);

	// Check if it already exist
	const media = await getEntityRecords('postType', 'attachment', {
		post_status: 'inherit',
		posts_per_page: 1,
		search: title,
	});

	if (!isEmpty(media))
		return {
			id: media[0].id,
			url: media[0].media_details.sizes.full.source_url,
		};

	// In case the image is not found, let's fetch it from the Cloud server
	const imageBlob = await fetch(imageSrc)
		.then(res => res.blob())
		.catch(err => {
			console.warn(
				__(
					`The Cloud server is down, using the placeholder image. Error: ${err}`,
					'maxi-blocks'
				)
			);

			return false;
		});

	if (!imageBlob) return placeholderUploader();

	let response = false;

	const maxiTerms = await getEntityRecords('taxonomy', 'maxi-image-type');
	const maxiTermId = maxiTerms[0].id;

	await uploadMedia({
		filesList: [
			new File([imageBlob], fileName, {
				type: mimeType,
			}),
		],
		onFileChange: data => {
			[response] = data;
		},
		onError: err =>
			console.warn(
				__(
					`The original image not found (404) on the Cloud Site, using the placeholder image. Error: ${err}`,
					'maxi-blocks'
				)
			),
	});

	// Add maxi-image-type taxonomy
	dispatch('core').saveEntityRecord(
		'postType',
		'attachment',
		{ ...response, 'maxi-image-type': maxiTermId },
		{ throwOnError: true }
	);

	return response;
};

export default imageUploader;
