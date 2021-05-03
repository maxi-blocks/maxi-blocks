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
	const {
		uniqueID,
		defaultBlockStyle,
		textLevel,
		isList,
		typeOfList,
		content,
	} = props.attributes;

	const classes = 'maxi-text-block';

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
			<RichText.Content
				className='maxi-text-block__content'
				value={content}
				tagName={isList ? typeOfList : textLevel}
				data-gx_initial_block_class={defaultBlockStyle}
			/>
		</MaxiBlock>
	);
};

export default save;
