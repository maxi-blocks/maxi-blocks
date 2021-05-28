/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const name = 'maxi-blocks/divider-maxi';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['core/separator'],
			transform() {
				return createBlock(name, {});
			},
		},
	],
};

export default transforms;
