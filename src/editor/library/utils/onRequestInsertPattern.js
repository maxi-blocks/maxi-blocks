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
import uniqueIDGenerator from '@extensions/attributes/uniqueIDGenerator';
import { getBlockNameFromUniqueID } from '@extensions/attributes';

/**
 * External dependencies
 */
import { isEmpty, uniq } from 'lodash';

const insertCode = async (content, clientId) => {
	const { replaceBlock } = dispatch('core/block-editor');

	// Extract uniqueID values that don't end with '-u' from block content
	const uniqueIDPattern = /"uniqueID":"((?!-u")[^"]+)"/g;
	const uniqueIDMatches = content.match(uniqueIDPattern) || [];

	// Generate new unique IDs and replace them in the content string
	const updatedContent = uniqueIDMatches.reduce((acc, match) => {
		const [, uniqueID] = match.match(/"uniqueID":"((?!-u")[^"]+)"/);
		const blockName = getBlockNameFromUniqueID(uniqueID);
		const newUniqueID = uniqueIDGenerator({ blockName, clientId });
		return acc.replace(new RegExp(uniqueID, 'g'), newUniqueID);
	}, content);

	const parsedContent = rawHandler({
		HTML: updatedContent,
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
		// Replace all occurrences of \\u002d with - in a new variable
		const modifiedContent = parsedContent.replace(/\\u002d/g, '-');

		// Check and replace cl-relation value
		const contentWithUpdatedRelation = modifiedContent.replace(
			/"cl-relation":"by-category"/g,
			'"cl-relation":"by-date"'
		);

		console.log(contentWithUpdatedRelation);

		// Remove dc-media-id, dc-media-url, cl-id, cl-author, specific dc-content entries, and maxiblocks demo URLs/titles
		const cleanedContent = contentWithUpdatedRelation
			.replace(/,"dc-media-id":\d+,"dc-media-url":"[^"]+"/g, '')
			.replace(/"cl-author":\d+,/g, '')
			.replace(/"dc-content":"No content found",/g, '')
			.replace(/"dc-status":true,"dc-field":"categories","dc-content":"[^"]+"/g, '"dc-status":true,"dc-field":"categories","dc-content":""')
			.replace(/"dc-status":true,"dc-field":"tags","dc-content":"[^"]+"/g, '"dc-status":true,"dc-field":"tags","dc-content":""')
			.replace(/"dc-status":true,"dc-field":"categories","dc-content":"\\u003cspan\\u003e\\u003ca[^"]+\\u003e\\u003cspan\\u003e[^<]+\\u003c\/span\\u003e\\u003c\/a\\u003e\\u003c\/span\\u003e"/g, '"dc-status":true,"dc-field":"categories","dc-content":""')
			.replace(/"dc-status":true,"dc-field":"tags","dc-content":"\\u003cspan\\u003e\\u003ca[^"]+\\u003e\\u003cspan\\u003e[^<]+\\u003c\/span\\u003e\\u003c\/a\\u003e\\u003c\/span\\u003e"/g, '"dc-status":true,"dc-field":"tags","dc-content":""')
			.replace(/"dc-status":true,"dc-field":"title","dc-content":"[^"]+"/g, '"dc-status":true,"dc-field":"title","dc-content":""')
			.replace(/"dc-status":true,"dc-field":"author","dc-content":"[^"]+"/g, '"dc-status":true,"dc-field":"author","dc-content":""')
			.replace(/"dc-status":true,"dc-field":"content","dc-content":"[^"]+"/g, '"dc-status":true,"dc-field":"content","dc-content":""')
			.replace(/"dc-field":"date","dc-format":"[^"]+","dc-content":"[^"]+"/g, (match) => {
				const formatMatch = match.match(/"dc-format":"([^"]+)"/);
				return `"dc-field":"date","dc-format":"${formatMatch[1]}","dc-content":""`;
			});
		const imagesLinks = [];
		const imagesIds = [];

		const allImagesRegexp = /(mediaID|imageID)":(.*)",/g;

		const allImagesLinks = cleanedContent.match(allImagesRegexp);

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
			let tempContent = cleanedContent;
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
			insertCode(cleanedContent, clientId);
		}
	} else {
		// not valid gutenberg code
		// TODO: show a human-readable error here
		console.error(__('The Code is not valid', 'maxi-blocks'));
	}
};

export default onRequestInsertPattern;
