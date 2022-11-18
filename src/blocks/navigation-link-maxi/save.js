/**
 * Internal dependencies
 */
import { RichText } from '@wordpress/block-editor';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { label } = props.attributes;

	const name = 'maxi-blocks/navigation-link-maxi';

	return (
		<MaxiBlock.save {...getMaxiBlockAttributes({ ...props, name })}>
			{/* TODO: add html attributes to the link that are on edit (rel, title, href). They might need to be added on server side rendering not here */}
			<RichText.Content value={label} tagName='a' />
		</MaxiBlock.save>
	);
};

export default save;
