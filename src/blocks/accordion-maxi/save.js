/**
 * Internal dependencies
 */
import MaxiBlock from '../../components/maxi-block';
import { getMaxiBlockAttributes } from '../../extensions/maxi-block';

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
