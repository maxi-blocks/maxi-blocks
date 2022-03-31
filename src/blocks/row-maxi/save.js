/**
 * Internal dependencies
 */
import MaxiBlock from '../../components/maxi-block';
import { getMaxiBlockAttributes } from '../../extensions/maxi-block';

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
		<MaxiBlock.save
			className={classes}
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
		/>
	);
};

export default save;
