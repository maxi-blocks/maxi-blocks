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

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { uniqueID, fullWidth } = attributes;

	const classes = classnames(
		'maxi-row-block',
		fullWidth === 'full' ? 'alignfull' : null
	);

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			tagName='figure'
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
			<InnerBlocks.Content />
		</MaxiBlock>
	);
};

export default save;
