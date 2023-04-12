/**
 * WordPress dependencies
 */
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';

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
	const {
		isLoop,
		isAutoplay,
		pauseOnHover,
		pauseOnInteraction,
		numberOfSlides,
	} = attributes;
	const [
		sliderTransition,
		sliderTransitionSpeed,
		sliderAutoplaySpeed,
		navigationArrowFirstIconContent,
		navigationArrowSecondIconContent,
		navigationDotIconContent,
	] = getAttributesValue({
		target: [
			'slider-transition',
			'slider-transition-speed',
			'slider-autoplay-speed',
			'navigation-arrow-first-icon-content',
			'navigation-arrow-second-icon-content',
			'navigation-dot-icon-content',
		],
		props: attributes,
	});

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
					{getAttributesValue({
						target: 'navigation-arrow-first-icon-content',
						attributes,
					}) && (
						<span className='maxi-slider-block__arrow maxi-slider-block__arrow--prev'>
							<RawHTML>{navigationArrowFirstIconContent}</RawHTML>
						</span>
					)}
					{getAttributesValue({
						target: 'navigation-arrow-second-icon-content',
					}) && (
						<span className='maxi-slider-block__arrow maxi-slider-block__arrow--next'>
							<RawHTML>
								{navigationArrowSecondIconContent}
							</RawHTML>
						</span>
					)}
					{getAttributesValue({
						target: 'navigation-dot-icon-content',
						attributes,
					}) && (
						<div className='maxi-slider-block__dots'>
							{Array.from(Array(numberOfSlides).keys()).map(i => {
								return (
									<span
										className={classnames(
											'maxi-slider-block__dot',
											`maxi-slider-block__dot--${i}`,
											i === 0 &&
												' maxi-slider-block__dot--active'
										)}
										key={`maxi-slider-block__dot--${i}`}
									>
										<RawHTML className='maxi-navigation-dot-icon-block__icon'>
											{navigationDotIconContent}
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
