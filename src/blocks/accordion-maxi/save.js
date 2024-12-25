/**
 * Internal dependencies
 */
import { getMaxiBlockAttributes, MaxiBlock } from '@components/maxi-block';

/**
 * Save
 */
const save = props => {
	const name = 'maxi-blocks/accordion-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
			aria-label={props.attributes?.ariaLabels?.accordion}
		/>
	);
};

export default save;
