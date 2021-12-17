/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import MaxiBlock, { getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const name = 'maxi-blocks/column-maxi';

	return (
		<MaxiBlock {...getMaxiBlockAttributes({ ...props, name })} isSave>
			<InnerBlocks.Content />
		</MaxiBlock>
	);
};

export default save;
