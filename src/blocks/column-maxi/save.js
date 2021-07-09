/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const name = 'maxi-blocks/column-maxi';

	return (
		<MaxiBlock {...getMaxiBlockBlockAttributes({ ...props, name })} isSave>
			<InnerBlocks.Content />
		</MaxiBlock>
	);
};

export default save;
