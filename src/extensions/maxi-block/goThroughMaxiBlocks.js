/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { createTemplatePartId } from '../fse';

const goThroughMaxiBlocks = (
	callback,
	blocks = select('core/block-editor').getBlocks()
) => {
	const goThroughBlocks = blocks =>
		blocks.reduce((acc, block) => {
			if (acc) {
				return acc;
			}

			if (block.name.startsWith('maxi-blocks/')) {
				const callbackResult = callback(block);
				if (callbackResult) {
					return callbackResult;
				}
			}

			let { innerBlocks } = block;
			if (block.name === 'core/template-part') {
				const { theme, slug } = block.attributes;
				const { blocks } = select('core').getEditedEntityRecord(
					'postType',
					'wp_template_part',
					createTemplatePartId(theme, slug)
				);

				if (blocks?.length) {
					innerBlocks = blocks;
				}
			}

			if (block.name === 'core/block') {
				const blocks = select('core/block-editor').getBlocks(
					block.clientId
				);

				if (blocks?.length) {
					innerBlocks = blocks;
				}
			}

			if (innerBlocks.length && goThroughBlocks(innerBlocks)) {
				return true;
			}

			return false;
		}, false);

	return goThroughBlocks(blocks);
};

export default goThroughMaxiBlocks;
