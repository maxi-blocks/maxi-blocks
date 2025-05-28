/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import getDCEntity from './getDCEntity';
import { getACFFieldContent } from './getACFData';
import { getProductsContent } from './getWCContent';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getAvatar = (user, size) => {
	const { avatar_urls: avatarUrls } = user;
	if (!avatarUrls) return null;

	const url = Object.values(avatarUrls).pop();
	return { url: url.replace(/(\?|&)s=\d+/, `$1s=${size}`) };
};

const getMediaById = async (id, type) => {
	const { getMedia } = resolveSelect('core');

	try {
		const media = await getMedia(id);
		if (isNil(media)) return null;

		return {
			id,
			url: media.source_url,
			caption: media.caption?.rendered,
		};
	} catch {
		console.error(
			__(
				`Error fetching media. ${
					type === 'products'
						? 'Try adding a Featured Image to the product you want to show.'
						: type === 'media'
						? 'Check if it exists in the Media Library.'
						: 'Try adding a Featured Image to the post you want to show.'
				}`,
				'maxi-blocks'
			)
		);
		return null;
	}
};

// Exporting for testing purposes
export const cache = {};
const MAX_CACHE_SIZE = 200;

const getDCMedia = async (dataRequest, clientId) => {
	const filteredDataRequest = { ...dataRequest };
	const keysToRemove = [
		'content',
		'customDelimiterStatus',
		'customFormat',
		'linkTarget',
		'linkUrl',
		'linkStatus',
		'field',
	];
	keysToRemove.forEach(key => delete filteredDataRequest[key]);

	const cacheKey = JSON.stringify(filteredDataRequest);
	let data;

	if (cache[cacheKey]) {
		data = cache[cacheKey];
	} else {
		data = await getDCEntity(dataRequest, clientId);

		// Check if the cache size exceeds the maximum limit
		if (Object.keys(cache).length >= MAX_CACHE_SIZE) {
			// Remove the oldest entry from the cache
			const oldestKey = Object.keys(cache)[0];
			delete cache[oldestKey];
		}
		cache[cacheKey] = data;
	}
	if (!data) return null;

	const { field, source, type, mediaSize } = dataRequest;

	if (field === 'avatar' && type === 'users') {
		return getAvatar(data, mediaSize);
	}

	if (['posts', 'pages'].includes(type) && field === 'author_avatar') {
		const { author: authorId } = data;
		const { getUser } = resolveSelect('core');
		const author = await getUser(authorId);
		return getAvatar(author, mediaSize);
	}

	if (source === 'acf') {
		const image = await getACFFieldContent(field, data.id);
		if (!image) return null;

		if (image.return_format === 'url') {
			return { url: image.value };
		}
		if (image.return_format === 'id') {
			return getMediaById(image.value, type);
		}
		return image.value;
	}

	let id;
	if (type === 'products') {
		id = await getProductsContent(dataRequest, data);
	} else {
		id = data?.[field];
	}

	if (isNil(id)) return null;

	return getMediaById(id, type);
};

export default getDCMedia;
