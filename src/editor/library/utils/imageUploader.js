/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, resolveSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const validateCommentStatus = status => {
	const validStatuses = ['open', 'closed'];
	return validStatuses.includes(status) ? status : 'closed';
};

/**
 * Custom media uploader that properly sets Content-Disposition headers
 * @param {File} file - File object to upload
 * @returns {Promise<Object>} - Upload response
 */
const customMediaUpload = async file => {
	// Create FormData with proper Content-Disposition
	const formData = new FormData();
	formData.append('file', file);

	try {
		// Use WordPress apiFetch to make the request
		const response = await apiFetch({
			path: '/wp/v2/media',
			method: 'POST',
			body: formData,
			// This is crucial - we let the browser set the Content-Type and boundaries
			headers: {
				// Explicitly omitting Content-Type to let browser set it with boundary
			},
		});

		return response;
	} catch (error) {
		console.error('Media upload failed:', error);
		throw error;
	}
};

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

		const { placeholder_url: placeholderURL } = await resolveSelect(
			'maxiBlocks'
		).receiveMaxiSettings();

		// In case the image is not found, let's fetch it from the Cloud server
		const placeholderResponse = await fetch(placeholderURL).catch(err => {
			console.warn(
				__(
					`The Cloud server is down, using the placeholder image. Error: ${err}`,
					'maxi-blocks'
				)
			);
			return false;
		});

		if (!placeholderResponse || !placeholderResponse.ok) return null;

		// Get the blob data
		const placeholderBlob = await placeholderResponse.blob();
		if (!placeholderBlob) return null;

		const maxiTerms = await getEntityRecords('taxonomy', 'maxi-image-type');
		const maxiTermId = maxiTerms[0].id;

		// Create file object
		const fileName = 'maxi-pattern-placeholder.jpg';
		const file = new File([placeholderBlob], fileName, {
			type: 'image/jpeg',
		});

		// Use custom media upload function instead of WordPress uploadMedia
		let response;
		try {
			response = await customMediaUpload(file);
		} catch (error) {
			console.error(
				__(
					`Can't upload the placeholder image, check directory's permissions. Error: ${error}`,
					'maxi-blocks'
				)
			);
			return null;
		}

		if (!response) return null;

		// Check if comment_status is empty and set it to 'closed' if needed
		const updatedCommentStatus = response?.comment_status ?? 'closed';

		// Validate comment_status before saving
		const validatedCommentStatus =
			validateCommentStatus(updatedCommentStatus);

		await dispatch('core').saveEntityRecord(
			'postType',
			'attachment',
			{
				...response,
				'maxi-image-type': maxiTermId,
				comment_status: validatedCommentStatus,
			},
			{ throwOnError: true }
		);

		return {
			id: response.id,
			url: response?.source_url || response?.guid?.rendered,
		};
	} catch (err) {
		console.error(
			__(`Error uploading the placeholder image: ${err}`, 'maxi-blocks'),
			err
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
		webp: 'image/webp',
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
		search: title,
		exact: true,
	});

	if (!isEmpty(media)) {
		let mediaEl;

		if (media.length === 0) return placeholderUploader();
		if (media.length === 1) [mediaEl] = media;
		else {
			const mediaElIndex = media.findIndex(
				({ title: { raw: rawTitle } }) =>
					rawTitle === title || rawTitle === `${title}-1`
			);

			if (mediaElIndex === -1) return placeholderUploader();

			mediaEl = media[mediaElIndex];
		}

		return {
			id: mediaEl.id,
			url:
				mediaEl?.media_details?.sizes?.full?.source_url ??
				mediaEl.guid?.rendered,
		};
	}

	// In case the image is not found, let's fetch it from the Cloud server
	const imageResponse = await fetch(imageSrc).catch(err => {
		console.warn(
			__(
				`The Cloud server is down, using the placeholder image. Error: ${err}`,
				'maxi-blocks'
			)
		);
		return false;
	});

	if (!imageResponse || !imageResponse.ok) return placeholderUploader();

	// Get the blob data
	const imageBlob = await imageResponse.blob();
	if (!imageBlob) return placeholderUploader();

	const maxiTerms = await getEntityRecords('taxonomy', 'maxi-image-type');
	const maxiTermId = maxiTerms[0].id;

	// Create file object
	const file = new File([imageBlob], fileName, {
		type: mimeType || 'image/jpeg',
	});

	// Use custom upload function
	let response;
	try {
		response = await customMediaUpload(file);
	} catch (error) {
		console.warn(
			__(
				`The original image not found (404) on the Cloud Site, using the placeholder image. Error: ${error.code}, ${error.message}`,
				'maxi-blocks'
			)
		);
		return placeholderUploader();
	}

	if (!response) return placeholderUploader();

	const validatedCommentStatus = validateCommentStatus(
		response?.comment_status
	);

	await dispatch('core').saveEntityRecord(
		'postType',
		'attachment',
		{
			...response,
			'maxi-image-type': maxiTermId,
			comment_status: validatedCommentStatus,
		},
		{ throwOnError: true }
	);

	return {
		id: response.id,
		url:
			response?.source_url ||
			response?.media_details?.sizes?.full?.source_url ||
			response.guid?.rendered,
	};
};

export default imageUploader;
