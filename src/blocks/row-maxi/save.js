/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

/**
 * Save
 */
const save = props => {
	const name = 'maxi-blocks/row-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
			aria-label={props.attributes.ariaLabels?.row}
		/>
	);
};

export default save;
