/**
 * WordPress dependencies
 */
import { useInnerBlocksProps } from '@wordpress/block-editor';

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

	const name = 'maxi-blocks/slider-maxi';

	const classes = classnames(fullWidth === 'full' ? 'alignfull' : null);

	return (
		<MaxiBlock.save
			className={classes}
			{...getMaxiBlockAttributes({ ...props, name })}
		>
			<div className='maxi-slider-block__tracker'>
				<ul
					{...useInnerBlocksProps.save({
						className: 'maxi-slider-block__wrapper',
					})}
				/>
				<div className='maxi-slider-block__nav'>
					<span className='maxi-slider-block__arrow maxi-slider-block__arrow--next'>
						+
					</span>
					<span className='maxi-slider-block__arrow maxi-slider-block__arrow--prev'>
						-
					</span>
				</div>
			</div>
		</MaxiBlock.save>
	);
};

export default save;
