/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const name = 'maxi-blocks/navigation-menu-maxi';

	return <MaxiBlock.save {...getMaxiBlockAttributes({ ...props, name })} />;
};

export default save;
