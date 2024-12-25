/**
 * Internal dependencies
 */

import { ArrowDisplayer } from '@components';
import { getGroupAttributes } from '@extensions/styles';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { uniqueID, ariaLabels = {} } = attributes;

	const name = 'maxi-blocks/group-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
			aria-label={ariaLabels.group}
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
