/**
 * Internal dependencies
 */
import { getMaxiBlockAttributes, MaxiBlock } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props })}
			useInnerBlocks
		/>
	);
};

export default save;
