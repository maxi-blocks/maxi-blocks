/**
 * WordPress dependencies
 */
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { isLoop } = attributes;
	const { fullWidth } = attributes;

	const name = 'maxi-blocks/slider-maxi';

	const classes = classnames(
		'wp-block-maxi-blocks-slider-maxi',
		fullWidth === 'full' ? 'alignfull' : null
	);

	const innerBlockCount = 6;

	return (
		<MaxiBlock.save
			className={classes}
			{...getMaxiBlockAttributes({ ...props, name })}
			data-infinite-loop={isLoop}
		>
			<div className='maxi-slider-block__tracker'>
				<ul
					{...useInnerBlocksProps.save({
						className: 'maxi-slider-block__wrapper',
					})}
				/>
				{(attributes['navigation-arrow-first-icon-content'] ||
					attributes['navigation-arrow-first-icon-content'] ||
					attributes['navigation-dot-icon-content']) && (
					<div className='maxi-slider-block__nav'>
						{attributes['navigation-arrow-first-icon-content'] && (
							<span className='maxi-slider-block__arrow maxi-slider-block__arrow--prev'>
								<RawHTML>
									{
										attributes[
											'navigation-arrow-first-icon-content'
										]
									}
								</RawHTML>
							</span>
						)}
						{attributes['navigation-arrow-second-icon-content'] && (
							<span className='maxi-slider-block__arrow maxi-slider-block__arrow--next'>
								<RawHTML>
									{
										attributes[
											'navigation-arrow-second-icon-content'
										]
									}
								</RawHTML>
							</span>
						)}
						{attributes['navigation-dot-icon-content'] && (
							<div className='maxi-slider-block__dots'>
								{Array.from(Array(innerBlockCount).keys()).map(
									i => {
										return (
											<span
												className={`maxi-slider-block__dot maxi-slider-block__dot--${i}`}
											>
												<RawHTML className='maxi-navigation-dot-icon-block__icon'>
													{
														attributes[
															'navigation-dot-icon-content'
														]
													}
												</RawHTML>
											</span>
										);
									}
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</MaxiBlock.save>
	);
};

export default save;
