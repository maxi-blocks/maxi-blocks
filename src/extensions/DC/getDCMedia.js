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

const getAvatar = user => {
	const { avatar_urls: avatarUrls } = user;

	if (!avatarUrls) return null;

	const sizes = Object.keys(avatarUrls);

	// Get the largest size
	const size = Math.max(...sizes.map(Number));

	return {
		url: avatarUrls[size],
	};
};

const getDCMedia = async (dataRequest, clientId) => {
	const data = await getDCEntity(dataRequest, clientId);

	const { field, source, type } = dataRequest;
	let id;

	if (source === 'acf') {
		const contentValue = await getACFFieldContent(field, data.id);

		return contentValue;
	}

	if (field === 'avatar' && type === 'users') {
		return getAvatar(data);
	}

	if (['posts', 'pages'].includes(type) && field === 'author_avatar') {
		const { author: authorId } = data;
		const { getUser } = resolveSelect('core');

		const author = await getUser(authorId);

		return getAvatar(author);
	}

	if (type === 'products') {
		id = await getProductsContent(dataRequest, data);
	} else {
		id = data?.[field];
	}

	if (isNil(id)) return null;

	const { getMedia } = resolveSelect('core');

	let media;
	try {
		media = await getMedia(id);
	} catch {
		if (type === 'products') {
			console.error(
				__(
					'Error fetching media, try to add Featured Image to the product you want to show',
					'maxi-blocks'
				)
			);
			return null;
		}
		if (type === 'media') {
			console.error(
				__(
					'Error fetching media, check if it exists in the Media Library',
					'maxi-blocks'
				)
			);
			return null;
		}
		console.error(
			__(
				'Error fetching media, try to add Featured Image to the post you want to show',
				'maxi-blocks'
			)
		);
		return null;
	}

	if (isNil(media)) return null;

	return {
		id,
		url: media.source_url,
		caption: media.caption?.rendered,
	};
};

export default getDCMedia;
