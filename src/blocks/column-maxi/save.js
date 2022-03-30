/**
 * Internal dependencies
 */
import MaxiBlock from '../../components/maxi-block';
import { getMaxiBlockAttributes } from '../../extensions/maxi-block';

/**
 * Save
 */
const save = props => {
	const name = 'maxi-blocks/column-maxi';

	return (
		<MaxiBlock
			{...getMaxiBlockAttributes({ ...props, name })}
			isSave
			useInnerBlocks
		/>
	);
};

export default save;
