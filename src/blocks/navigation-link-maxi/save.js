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
			<RichText.Content value={label} tagName='a' />
		</MaxiBlock.save>
	);
};

export default save;
