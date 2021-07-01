/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { ArrowDisplayer } from '../../components';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { parentBlockStyle } = attributes;

	const name = 'maxi-blocks/group-maxi';

	const paletteClasses = getPaletteClasses(attributes, parentBlockStyle);

	return (
		<MaxiBlock
			paletteClasses={paletteClasses}
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
			<ArrowDisplayer {...getGroupAttributes(attributes, 'arrow')} />
			<div className='maxi-group-block__group'>
				<InnerBlocks.Content />
			</div>
		</MaxiBlock>
	);
};

export default save;
