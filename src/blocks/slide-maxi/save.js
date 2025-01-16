/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

/**
 * Save
 */
const save = props => {
	const name = 'maxi-blocks/slide-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
			aria-label={props.attributes.ariaLabels?.slide}
		/>
	);
};

export default save;
