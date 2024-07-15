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

	const size = Math.max(...Object.keys(avatarUrls).map(Number));
	return { url: avatarUrls[size] };
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

const getDCMedia = async (dataRequest, clientId) => {
	const data = await getDCEntity(dataRequest, clientId);
	if (!data) return null;

	const { field, source, type } = dataRequest;

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

	if (field === 'avatar' && type === 'users') {
		return getAvatar(data);
	}

	if (['posts', 'pages'].includes(type) && field === 'author_avatar') {
		const { author: authorId } = data;
		const { getUser } = resolveSelect('core');
		const author = await getUser(authorId);
		return getAvatar(author);
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
