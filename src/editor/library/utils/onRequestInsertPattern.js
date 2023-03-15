/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { rawHandler } from '@wordpress/blocks';
import { dispatch, resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import imageUploader, { placeholderUploader } from './imageUploader';

/**
 * External dependencies
 */
import { isEmpty, uniq } from 'lodash';

const insertCode = async (content, clientId) => {
	const { replaceBlock } = dispatch('core/block-editor');

	const parsedContent = rawHandler({
		HTML: content,
		mode: 'BLOCKS',
	});

	replaceBlock(clientId, parsedContent);
};

const onRequestInsertPattern = async (
	parsedContent,
	usePlaceholderImage,
	clientId
) => {
	const isValid = await resolveSelect('core/block-editor').isValidTemplate(
		parsedContent
	);

	if (isValid) {
		const imagesLinks = [];
		const imagesIds = [];

		const allImagesRegexp = /(mediaID|imageID)":(.*)",/g;

		const allImagesLinks = parsedContent.match(allImagesRegexp);

		allImagesLinks?.forEach(image => {
			const parsed = image.replace(/\\/g, '');

			const idRegexp = /(mediaID|imageID)":(\d+),/g;
			const id = parsed
				?.match(idRegexp)
				?.map(item => item.match(/\d+/)[0]);
			if (!isEmpty(id)) imagesIds.push(...id);

			const urlRegexp = /(mediaURL|imageURL)":"([^"]+)"/g;
			const url = parsed
				?.match(urlRegexp)
				?.map(item => item.split(/:(.+)/, 2)[1].replace(/"/g, ''));
			if (!isEmpty(url)) imagesLinks.push(...url);
		});

		if (!isEmpty(imagesLinks) && !isEmpty(imagesIds)) {
			let tempContent = parsedContent;
			const imagesLinksUniq = uniq(imagesLinks);
			const imagesIdsUniq = uniq(imagesIds);
			const counter = imagesLinksUniq.length;
			const checkCounter = imagesIdsUniq.length;

			if (counter !== checkCounter) {
				console.error(
					__(
						"Error processing images' links and ids - counts do not match",
						'maxi-blocks'
					)
				);

				insertCode(parsedContent, clientId);

				return;
			}

			const imagesUniq = imagesIdsUniq.reduce(
				(o, k, i) => ({ ...o, [k]: imagesLinksUniq[i] }),
				{}
			);

			// In case creator want placeholder, call it just once and use it for all images
			let data = usePlaceholderImage ? await placeholderUploader() : null;

			const imagesReplacer = await Promise.all(
				Object.entries(imagesUniq).map(async ([id, url]) => {
					data = usePlaceholderImage
						? data
						: await imageUploader(url, usePlaceholderImage);

					return {
						id: data?.id,
						oldId: id,
						url: data?.url,
						oldUrl: url,
					};
				})
			);

			imagesReplacer.forEach(({ id, oldId, url, oldUrl }) => {
				tempContent = tempContent.replaceAll(oldUrl, url);
				tempContent = tempContent.replaceAll(oldId, id);
			});

			await insertCode(tempContent, clientId);
		} else {
			// no images to process
			insertCode(parsedContent, clientId);
		}
	} else {
		// not valid gutenberg code
		// TODO: show a human-readable error here
		console.error(__('The Code is not valid', 'maxi-blocks'));
	}
};

export default onRequestInsertPattern;
