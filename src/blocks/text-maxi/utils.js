/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/*
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const formatsLib = loadable.lib(() => import('../../extensions/text/formats'));

export const onMerge = (props, forward) => {
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
			formatsLib
				.load()
				.then(
					({ fromListToText, fromTextToList, getFormatsOnMerge }) => {
						const nextBlockAttributes =
							getBlockAttributes(nextBlockClientId);
						const {
							content: nextBlockContent,
							isList: nextBlockIsList,
							'custom-formats': nextBlockCustomFormats,
						} = nextBlockAttributes;

						const nextBlockContentNeedsTransform =
							isList !== nextBlockIsList;
						const newNextBlockContent =
							nextBlockContentNeedsTransform
								? nextBlockIsList
									? fromListToText(nextBlockContent)
									: fromTextToList(nextBlockContent)
								: nextBlockContent;

						const {
							content: newContent,
							'custom-formats': newCustomFormats,
						} = getFormatsOnMerge(
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
				);
		}
	} else {
		const previousBlockClientId = getPreviousBlockClientId(clientId);
		const blockName = getBlock(previousBlockClientId)?.name;

		if (!previousBlockClientId || blockName !== 'maxi-blocks/text-maxi') {
			// Basically removes the block when pressing backspace and there's not block before
			// Commented as is something we might want to come back in future
			// removeBlock(clientId);
		} else {
			formatsLib.load().then(({ fromListToText, getFormatsOnMerge }) => {
				const previousBlockAttributes = getBlockAttributes(
					previousBlockClientId
				);
				const {
					content: previousBlockContent,
					'custom-formats': previousBlockCustomFormats,
				} = previousBlockAttributes;

				const {
					content: newContent,
					'custom-formats': newCustomFormats,
				} = getFormatsOnMerge(
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
			});
		}
	}
};

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
