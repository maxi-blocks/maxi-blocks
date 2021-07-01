/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

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
	const {
		textLevel,
		isList,
		typeOfList,
		content,
		parentBlockStyle,
		listReversed,
		listStart,
	} = props.attributes;

	const name = 'maxi-blocks/text-maxi';

	const paletteClasses = getPaletteClasses(
		props.attributes,
		parentBlockStyle
	);

	return (
		<MaxiBlock
			paletteClasses={paletteClasses}
			classes={`${isList ? 'maxi-list-block' : ''}`}
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
			<RichText.Content
				className='maxi-text-block__content'
				value={content}
				tagName={isList ? typeOfList : textLevel}
				reversed={!!listReversed}
				start={listStart}
			/>
		</MaxiBlock>
	);
};

export default save;
