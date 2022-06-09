/**
 * Internal dependencies
 */
import { ArrowDisplayer } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = (props, extendedAttributes = {}) => {
	const { attributes } = props;
	console.log(attributes);

	const name = 'maxi-blocks/group-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
			{...extendedAttributes}
		>
			<ArrowDisplayer
				key={`maxi-arrow-displayer__${attributes.uniqueID}`}
				{...getGroupAttributes(
					attributes,
					['blockBackground', 'arrow', 'border'],
					true
				)}
			/>
		</MaxiBlock.save>
	);
};

export default save;
