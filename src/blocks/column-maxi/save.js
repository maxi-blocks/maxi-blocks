/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getPaletteClasses } from '../../extensions/styles';

/**
 * Save
 */
const save = props => {
	const { parentBlockStyle } = props.attributes;

	const name = 'maxi-blocks/column-maxi';

	const paletteClasses = getPaletteClasses(
		props.attributes,
		[
			'background',
			'background-hover',
			'border',
			'border-hover',
			'box-shadow',
			'box-shadow-hover',
		],
		name,
		parentBlockStyle
	);

	return (
		<MaxiBlock
			paletteClasses={paletteClasses}
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
			<InnerBlocks.Content />
		</MaxiBlock>
	);
};

export default save;
