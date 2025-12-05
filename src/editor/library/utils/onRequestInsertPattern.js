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

/**
 * Strips custom styling attributes from block content to use SC defaults
 *
 * @param {string}  content     - The gutenberg block content as string
 * @param {boolean} useSCStyles - Whether to strip custom styles
 * @returns {string} Modified content with custom styles removed
 */
const stripCustomStyles = (content, useSCStyles) => {
	if (!useSCStyles) return content;

	// eslint-disable-next-line no-console
	console.log(
		JSON.stringify({
			message: 'Stripping custom styles to use SC defaults',
			useSCStyles,
		})
	);

	// Debug: Search for custom format spans in both formats
	if (content.includes('maxi-text-block--has-custom-format')) {
		const spanIndex = content.indexOf('maxi-text-block--has-custom-format');
		const contextStart = Math.max(0, spanIndex - 200);
		const contextEnd = Math.min(content.length, spanIndex + 300);
		const context = content.substring(contextStart, contextEnd);

		// eslint-disable-next-line no-console
		console.log(
			JSON.stringify({
				message: 'BEFORE: Found unescaped custom format span',
				context,
			})
		);
	}

	// Also check for Unicode-escaped version
	if (content.includes('maxi-text-block\\u002d\\u002dhas-custom-format')) {
		const spanIndex = content.indexOf(
			'maxi-text-block\\u002d\\u002dhas-custom-format'
		);
		const contextStart = Math.max(0, spanIndex - 200);
		const contextEnd = Math.min(content.length, spanIndex + 300);
		const context = content.substring(contextStart, contextEnd);

		// eslint-disable-next-line no-console
		console.log(
			JSON.stringify({
				message: 'BEFORE: Found Unicode-escaped custom format span',
				context,
			})
		);
	}

	// Pattern to match JSON values: strings, numbers, booleans, null, but not objects/arrays
	// This ensures we don't break nested structures
	const jsonValue =
		'(?:"(?:[^"\\\\]|\\\\.)*?"|true|false|null|-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)';

	// SC (Style Cards) only control typography and colors for text elements (h1-h6, p, button, link, etc.)
	// We should ONLY strip attributes that SC provides defaults for:
	// - Typography attributes (font-*, line-height, letter-spacing, text-*, word-spacing, etc.)
	// - Color attributes (palette-color, color)
	// - Text spacing (bottom-gap)
	//
	// We should NOT strip layout/container styles that SC doesn't control:
	// - Margins/padding on containers
	// - Borders, shadows, opacity
	// - Width/height/size
	// - Backgrounds (already preserved)
	// - Custom formats (structural - tied to content HTML with format classes)
	const styleAttributePatterns = [
		// Typography - SC provides defaults for these
		new RegExp(`"(font-family[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(font-size[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(font-weight[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(font-style[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(line-height[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(letter-spacing[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(text-decoration[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(text-transform[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(text-indent[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(text-shadow[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(word-spacing[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(white-space[^"]*?)":${jsonValue},`, 'g'),

		// Colors - SC provides palette colors
		new RegExp(`"(palette-color[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(palette-opacity[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(list-color[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(list-palette-color[^"]*?)":${jsonValue},`, 'g'),
		new RegExp(`"(list-palette-opacity[^"]*?)":${jsonValue},`, 'g'),

		// Text spacing - SC provides bottom-gap for text elements
		new RegExp(`"(bottom-gap[^"]*?)":${jsonValue},`, 'g'),
	];

	let modifiedContent = content;

	// Apply each pattern to strip the attributes
	styleAttributePatterns.forEach(pattern => {
		modifiedContent = modifiedContent.replace(pattern, '');
	});

	// Remove custom-formats attributes (and hover variants)
	// These store the custom format styling data that is tied to the HTML spans
	// We need to handle nested objects properly, so we match everything until we find
	// the closing brace that matches the opening brace after "custom-formats"
	const customFormatsPattern =
		/"custom-formats(?:-hover)?":(\{(?:[^{}]|\{[^{}]*\})*\}),?/g;

	// Log what we're finding and removing
	const customFormatsMatches = modifiedContent.match(customFormatsPattern);
	if (customFormatsMatches) {
		// eslint-disable-next-line no-console
		console.log(
			JSON.stringify({
				message: 'Found custom-formats attributes',
				count: customFormatsMatches.length,
				matches: customFormatsMatches,
			})
		);
	}

	modifiedContent = modifiedContent.replace(customFormatsPattern, match => {
		// eslint-disable-next-line no-console
		console.log(
			JSON.stringify({
				message: 'Removing custom-formats attribute',
				removed: match,
			})
		);
		return '';
	});

	// Clean up any double commas or trailing commas that might result
	modifiedContent = modifiedContent.replace(/,\s*,/g, ',');
	modifiedContent = modifiedContent.replace(/,\s*\}/g, '}');
	modifiedContent = modifiedContent.replace(/\{\s*,/g, '{');
	modifiedContent = modifiedContent.replace(/,\s*]/g, ']');

	// Debug: Check if content field still has custom format spans AFTER replacements
	const contentFieldPatternAfter = /"content":"([^"\\]|\\.)*"/g;
	const contentMatchesAfter = modifiedContent.match(contentFieldPatternAfter);
	if (contentMatchesAfter) {
		contentMatchesAfter.forEach(contentMatch => {
			if (contentMatch.includes('maxi-text-block--has-custom-format')) {
				// eslint-disable-next-line no-console
				console.log(
					JSON.stringify({
						message:
							'WARNING: content field still contains custom format span',
						content: contentMatch.substring(0, 500),
					})
				);
			}
		});
	}

	// Unwrap text inside spans with maxi-text-block--has-custom-format class
	// In Gutenberg serialized format within JSON attributes, special chars are Unicode-escaped
	// Use a simpler pattern that matches more broadly
	const unicodePattern =
		/\\u003cspan[^>]*maxi-text-block\\u002d\\u002dhas-custom-format[^>]*\\u003e(.*?)\\u003c\/span\\u003e/gi;
	let unicodeMatchCount = 0;

	modifiedContent = modifiedContent.replace(
		unicodePattern,
		(match, textContent) => {
			unicodeMatchCount += 1;
			// eslint-disable-next-line no-console
			console.log(
				JSON.stringify({
					message: `Unwrapping custom format span (Unicode escaped) - match ${unicodeMatchCount}`,
					originalSpan: match.substring(0, 200),
					extractedText: textContent,
				})
			);
			return textContent;
		}
	);

	if (unicodeMatchCount === 0) {
		// eslint-disable-next-line no-console
		console.log(
			JSON.stringify({
				message: 'WARNING: Unicode pattern did not match any spans',
			})
		);
	}

	// Also handle regular HTML spans (unescaped) in case they appear elsewhere
	modifiedContent = modifiedContent.replace(
		/<span\s+class="[^"]*maxi-text-block--has-custom-format[^"]*"[^>]*>(.*?)<\/span>/gi,
		(match, textContent) => {
			// eslint-disable-next-line no-console
			console.log(
				JSON.stringify({
					message: 'Unwrapping custom format span (unescaped HTML)',
					originalSpan: match,
					extractedText: textContent,
				})
			);
			return textContent;
		}
	);

	// eslint-disable-next-line no-console
	console.log(
		JSON.stringify({
			message: 'Custom styles stripped successfully',
			originalLength: content.length,
			modifiedLength: modifiedContent.length,
		})
	);

	return modifiedContent;
};

const onRequestInsertPattern = async (
	parsedContent,
	usePlaceholderImage,
	useSCStyles,
	clientId
) => {
	const isValid = await resolveSelect('core/block-editor').isValidTemplate(
		parsedContent
	);

	if (isValid) {
		// Strip custom styles if requested to use SC defaults
		const contentWithSCStyles = stripCustomStyles(
			parsedContent,
			useSCStyles
		);

		// Replace all occurrences of \\u002d with - in a new variable
		const modifiedContent = contentWithSCStyles.replace(/\\u002d/g, '-');

		// Check and replace cl-relation value
		const contentWithUpdatedRelation = modifiedContent.replace(
			/"cl-relation":"by-category"/g,
			'"cl-relation":"by-date"'
		);

		const cleanedContent = contentWithUpdatedRelation
			.replace(/,"dc-media-id":\d+,"dc-media-url":"[^"]+"/g, '')
			.replace(
				/"dc-field":"author_avatar","dc-media-url":"[^"]+"/g,
				'"dc-field":"author_avatar"'
			)
			.replace(/"cl-author":\d+,/g, '')
			.replace(/"dc-content":"No content found",/g, '');

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
