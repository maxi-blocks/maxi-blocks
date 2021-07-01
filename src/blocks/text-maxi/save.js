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

/**
 * Save
 */
const save = props => {
	const { textLevel, isList, typeOfList, content, listReversed, listStart } =
		props.attributes;

	const name = 'maxi-blocks/text-maxi';

	return (
		<MaxiBlock
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
