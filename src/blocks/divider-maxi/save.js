/**
 * Internal dependencies
 */
import MaxiBlock, { getMaxiBlockAttributes } from '../../components/maxi-block';

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
		<MaxiBlock
			classes={classes}
			{...getMaxiBlockAttributes({ ...props, name })}
			isSave
		>
			{attributes['divider-border-style'] !== 'none' && (
				<hr className='maxi-divider-block__divider' />
			)}
		</MaxiBlock>
	);
};

export default save;
