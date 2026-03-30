/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { createTemplatePartId } from '@extensions/fse';

const goThroughMaxiBlocks = (
	callback,
	goThroughAllBlocks = false,
	blocks = select('core/block-editor').getBlocks(),
	skipTemplateParts = false
) => {
	const goThroughBlocks = blocks =>
		blocks.reduce((acc, block) => {
			if (acc) {
				return acc;
			}

			if (goThroughAllBlocks || block.name.startsWith('maxi-blocks/')) {
				const callbackResult = callback(block);
				if (callbackResult) {
					return callbackResult;
				}
			}

			let { innerBlocks } = block;
			if (block.name === 'core/template-part') {
				if (!skipTemplateParts) {
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
			}

			if (block.name === 'core/post-content') {
				if (select('core/edit-site') !== undefined) {
					const postType = select('core/editor').getCurrentPostType();
					const postId = select('core/editor').getCurrentPostId();

					// In FSE template editing, getCurrentPostType() returns
					// 'wp_template' or 'wp_template_part'. Fetching that entity
					// record would return the template's own blocks (which contain
					// core/post-content again), causing infinite recursion.
					const templateTypes = ['wp_template', 'wp_template_part'];
					if (!templateTypes.includes(postType)) {
						const { blocks } = select('core').getEditedEntityRecord(
							'postType',
							postType,
							postId
						);
						if (blocks?.length) {
							innerBlocks = blocks;
						}
					} else {
						// In FSE template editing, core/post-content's innerBlocks
						// contain preview/placeholder post blocks whose styles are
						// not registered in the store. Traversing them causes
						// getAllStylesAreSaved to return false permanently, keeping
						// the save button locked.
						innerBlocks = [];
					}
				} else {
					const blocks = select('core/block-editor').getBlocks(
						block.clientId
					);
					if (blocks?.length) {
						innerBlocks = blocks;
					}
				}
			}

			if (block.name === 'core/block' || block.name === 'core/group') {
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
