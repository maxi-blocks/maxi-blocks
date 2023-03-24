/**
 * Internal dependencies
 */
import { ArrowDisplayer } from '../../components';
import { getGroupAttributes } from '../../extensions/attributes';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;

	const name = 'maxi-blocks/group-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
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
