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
	const { fullWidth } = attributes;

	const name = 'maxi-blocks/row-maxi';

	const classes = classnames(fullWidth === 'full' ? 'alignfull' : null);

	return (
		<MaxiBlock
			className={classes}
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
			<InnerBlocks.Content />
		</MaxiBlock>
	);
};

export default save;
