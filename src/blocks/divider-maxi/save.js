/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { getAttributesValue } from '../../extensions/attributes';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { lineOrientation } = attributes;

	const name = 'maxi-blocks/divider-maxi';

	const classes = classnames(
		lineOrientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal'
	);

	return (
		<MaxiBlock.save
			classes={classes}
			{...getMaxiBlockAttributes({ ...props, name })}
		>
			{getAttributesValue({ target: 'divider-border-style', props }) !==
				'none' && <hr className='maxi-divider-block__divider' />}
		</MaxiBlock.save>
	);
};

export default save;
