/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	fromListToText,
	fromTextToList,
	getFormatsOnMerge,
} from '../../extensions/text/formats';

const onMerge = (props, forward) => {
	const { attributes, clientId, maxiSetAttributes } = props;
	const { isList, content, 'custom-formats': customFormats } = attributes;

	const {
		getNextBlockClientId,
		getPreviousBlockClientId,
		getBlockAttributes,
		getBlock,
	} = select('core/block-editor');

	const { removeBlock, updateBlockAttributes } =
		dispatch('core/block-editor');

	if (forward) {
		const nextBlockClientId = getNextBlockClientId(clientId);
		const blockName = getBlock(nextBlockClientId)?.name;

		if (nextBlockClientId && blockName === 'maxi-blocks/text-maxi') {
			const nextBlockAttributes = getBlockAttributes(nextBlockClientId);
			const {
				content: nextBlockContent,
				isList: nextBlockIsList,
				'custom-formats': nextBlockCustomFormats,
			} = nextBlockAttributes;

			const nextBlockContentNeedsTransform = isList !== nextBlockIsList;
			const newNextBlockContent = nextBlockContentNeedsTransform
				? nextBlockIsList
					? fromListToText(nextBlockContent)
					: fromTextToList(nextBlockContent)
				: nextBlockContent;

			const { content: newContent, 'custom-formats': newCustomFormats } =
				getFormatsOnMerge(
					{ content, 'custom-formats': customFormats },
					{
						content: newNextBlockContent,
						'custom-formats': nextBlockCustomFormats,
					}
				);

			maxiSetAttributes({
				content: newContent,
				'custom-formats': newCustomFormats,
			});

			removeBlock(nextBlockClientId);
		}
	} else {
		const previousBlockClientId = getPreviousBlockClientId(clientId);
		const blockName = getBlock(previousBlockClientId)?.name;

		if (!previousBlockClientId || blockName !== 'maxi-blocks/text-maxi') {
			// Basically removes the block when pressing backspace and there's not block before
			// Commented as is something we might want to come back in future
			// removeBlock(clientId);
		} else {
			const previousBlockAttributes = getBlockAttributes(
				previousBlockClientId
			);
			const {
				content: previousBlockContent,
				'custom-formats': previousBlockCustomFormats,
			} = previousBlockAttributes;

			const { content: newContent, 'custom-formats': newCustomFormats } =
				getFormatsOnMerge(
					{
						content: previousBlockContent,
						'custom-formats': previousBlockCustomFormats,
					},
					{
						content: attributes.isList
							? fromListToText(content)
							: content,
						'custom-formats': customFormats,
					}
				);

			updateBlockAttributes(previousBlockClientId, {
				content: newContent,
				'custom-formats': newCustomFormats,
			});

			removeBlock(clientId);
		}
	}
};

export default onMerge;

export const getSVGListStyle = svg => {
	if (!svg) return '';

	let cleanedSVG = svg
		.replace(/"/g, "'")
		.replace(/>\s{1,}</g, '><')
		.replace(/\s{2,}/g, ' ')
		.replace("width='1em'", '')
		.replace("height='1em'", '');

	if (cleanedSVG.indexOf('http://www.w3.org/2000/svg') < 0) {
		cleanedSVG = cleanedSVG.replace(
			/<svg/g,
			"<svg xmlns='http://www.w3.org/2000/svg'"
		);
	}

	return cleanedSVG.replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
};

/**
 * Calculates the width of the given text using a canvas.
 *
 * @param {string} providedContent    - The text content to measure.
 * @param {string} providedFontSize   - Font size of the text. Default is '1em'.
 * @param {string} providedFontFamily - Font family of the text. Defaults to body's font family.
 * @param {string} providedFontWeight - Font weight of the text. Default is '400'.
 * @returns {number} The calculated width of the text.
 */
export const calculateTextWidth = (
	providedContent,
	providedFontSize,
	providedFontFamily,
	providedFontWeight
) => {
	if (providedFontSize === '0px') return 0;

	// Define default values
	const defaultFontSize = '1em';
	const defaultFontWeight = '400';
	const defaultContent = '1';

	const fontSize = providedFontSize || defaultFontSize;
	const fontWeight = providedFontWeight || defaultFontWeight;
	const content = providedContent || defaultContent;

	let activeFontFamily =
		providedFontFamily || window.getComputedStyle(document.body).fontFamily;

	if (typeof document.fonts !== 'undefined') {
		const fontIsLoaded =
			!activeFontFamily ||
			document.fonts.check(
				`normal ${fontWeight} ${fontSize} ${activeFontFamily}`
			);

		if (!fontIsLoaded) {
			activeFontFamily = window.getComputedStyle(
				document.body
			).fontFamily;
		}
	}

	// Reuse the same canvas for performance improvement
	const canvas =
		calculateTextWidth.canvas ||
		(calculateTextWidth.canvas = document.createElement('canvas'));
	const ctx = canvas.getContext('2d');
	ctx.font = `normal ${fontWeight} ${fontSize} ${activeFontFamily}`;

	const textWidth = ctx.measureText(content).width;

	return textWidth;
};
