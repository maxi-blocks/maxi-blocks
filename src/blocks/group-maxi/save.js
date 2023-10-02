/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const ArrowDisplayer = loadable(() =>
	import('../../components/arrow-displayer')
);
const MaxiBlock = loadable(() =>
	import('../../components/maxi-block/maxiBlock')
);
import { getGroupAttributes } from '../../extensions/styles';
import { getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { uniqueID } = attributes;

	const name = 'maxi-blocks/group-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
		>
			<ArrowDisplayer
				key={`maxi-arrow-displayer__${uniqueID}`}
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
