/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = (props, extendedAttributes = {}) => {
	const name = 'maxi-blocks/row-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
			{...extendedAttributes}
		/>
	);
};

export default save;
