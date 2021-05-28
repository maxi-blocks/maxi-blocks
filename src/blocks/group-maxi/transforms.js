/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const name = 'maxi-blocks/group-maxi';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['core/group'],
			transform(attributes, innerBlocks) {
				return createBlock(name, attributes, innerBlocks);
			},
		},
	],
};

export default transforms;
