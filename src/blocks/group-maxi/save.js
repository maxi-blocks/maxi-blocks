/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { ArrowDisplayer } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;

	const name = 'maxi-blocks/group-maxi';

	return (
		<MaxiBlock {...getMaxiBlockBlockAttributes({ ...props, name })} isSave>
			<ArrowDisplayer
				{...getGroupAttributes(
					attributes,
					['blockBackground', 'arrow', 'border'],
					true
				)}
			/>
			<div className='maxi-group-block__group'>
				<InnerBlocks.Content />
			</div>
		</MaxiBlock>
	);
};

export default save;
