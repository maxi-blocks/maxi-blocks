/**
 * Internal dependencies
 */
import { ArrowDisplayer } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import MaxiBlock from '../../components/maxi-block';
import { getMaxiBlockAttributes } from '../../extensions/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;

	const name = 'maxi-blocks/group-maxi';

	return (
		<MaxiBlock
			{...getMaxiBlockAttributes({ ...props, name })}
			isSave
			hasInnerBlocks
		>
			<ArrowDisplayer
				key={`maxi-arrow-displayer__${attributes.uniqueID}`}
				{...getGroupAttributes(
					attributes,
					['blockBackground', 'arrow', 'border'],
					true
				)}
			/>
		</MaxiBlock>
	);
};

export default save;
