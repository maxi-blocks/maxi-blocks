/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const name = 'maxi-blocks/button-maxi';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['core/buttons'],
			transform(attributes, innerBlocks) {
				return createBlock(name, {
					buttonContent: innerBlocks[0].attributes.text,
				});
			},
		},
	],
};

export default transforms;
