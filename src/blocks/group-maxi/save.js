/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { ArrowDisplayer } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { uniqueID } = attributes;

	const classes = 'maxi-group-block';

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			tagName='section'
			{...getMaxiBlockBlockAttributes(props)}
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
