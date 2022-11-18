/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const name = 'maxi-blocks/navigation-menu-maxi';

	// TODO: frontend needs to be generated on server side (we can't get selected menu here).
	return (
		<MaxiBlock.save
			tagName='nav'
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
		/>
	);
};

export default save;
