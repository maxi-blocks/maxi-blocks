/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { ariaLabels = {} } = attributes;

	const name = 'maxi-blocks/divider-maxi';

	const orientation =
		attributes['line-orientation-general'] || 'horizontal';
	const classes = classnames(
		orientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal'
	);

	return (
		<MaxiBlock.save
			classes={classes}
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={ariaLabels.canvas}
		>
			{attributes['divider-border-style'] !== 'none' && (
				<hr
					className='maxi-divider-block__divider'
					aria-label={ariaLabels.divider}
				/>
			)}
		</MaxiBlock.save>
	);
};

export default save;
