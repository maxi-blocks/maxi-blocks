/**
 * WordPress dependencies
 */
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';

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
	const {
		isLoop,
		isAutoplay,
		pauseOnHover,
		pauseOnInteraction,
		numberOfSlides,
		ariaLabels = {},
	} = attributes;

	const sliderTransition = attributes['slider-transition'];
	const sliderTransitionSpeed = attributes['slider-transition-speed'];
	const sliderAutoplaySpeed = attributes['slider-autoplay-speed'];

	const name = 'maxi-blocks/slider-maxi';

	const classes = classnames(
		// https://github.com/yeahcan/maxi-blocks/issues/3555 sometimes causes validation error,
		// remove next line once it is fixed.
		'wp-block-maxi-blocks-slider-maxi'
	);

	return (
		<MaxiBlock.save
			className={classes}
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={ariaLabels.slider}
			data-infinite-loop={isLoop}
			data-autoplay={isAutoplay}
			data-autoplay-speed={sliderAutoplaySpeed}
			data-hover-pause={pauseOnHover}
			data-interaction-pause={pauseOnInteraction}
			data-transition={sliderTransition}
			data-transition-speed={sliderTransitionSpeed}
		>
			<div className='maxi-slider-block__tracker'>
				<ul
					{...useInnerBlocksProps.save({
						className: 'maxi-slider-block__wrapper',
					})}
				/>
				<div className='maxi-slider-block__nav'>
					{attributes['navigation-arrow-first-icon-content'] && (
						<span
							className='maxi-slider-block__arrow maxi-slider-block__arrow--prev'
							aria-label={ariaLabels['first arrow']}
						>
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
						<span
							className='maxi-slider-block__arrow maxi-slider-block__arrow--next'
							aria-label={ariaLabels['second arrow']}
						>
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
						<div
							className='maxi-slider-block__dots'
							aria-label={ariaLabels['all dots']}
						>
							{Array.from(Array(numberOfSlides).keys()).map(i => {
								return (
									<span
										className={classnames(
											'maxi-slider-block__dot',
											`maxi-slider-block__dot--${i}`,
											i === 0 &&
												' maxi-slider-block__dot--active'
										)}
										aria-label={ariaLabels.dot}
										key={`maxi-slider-block__dot--${i}`}
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
							})}
						</div>
					)}
				</div>
			</div>
		</MaxiBlock.save>
	);
};

export default save;
