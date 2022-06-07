/**
 * Internal dependencies
 */
import { getMaxiBlockAttributes, MaxiBlock } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const name = 'maxi-blocks/accordion-maxi';
	const { attributes } = props;
	const { accordionLayout } = attributes;
	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			className={`maxi-accordion-block--${accordionLayout}-layout`}
			useInnerBlocks
		/>
	);
};

export default save;
