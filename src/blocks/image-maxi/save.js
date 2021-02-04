/**
 * WordPress dependencies
 */
const { RawHTML } = wp.element;

/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { className, attributes } = props;
	const {
		uniqueID,
		blockStyle,
		defaultBlockStyle,
		fullWidth,
		extraClassName,
		captionType,
		captionContent,
		mediaID,
		mediaURL,
		mediaWidth,
		mediaHeight,
		mediaAlt,
		mediaAltWp,
		mediaAltTitle,
		altSelector,
		SVGElement,
	} = attributes;

	const hoverClasses = classnames(
		'maxi-block-hover-wrapper',
		attributes['hover-type'] === 'basic'
			? `maxi-hover-effect__${attributes['hover-type']}__${attributes['hover-basic-effect-type']}`
			: `maxi-hover-effect__${attributes['hover-type']}__${attributes['hover-text-effect-type']}`,
		`maxi-hover-effect__${
			attributes['hover-type'] === 'basic' ? 'basic' : 'text'
		}`
	);

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-image-block',
		fullWidth === 'full' ? 'alignfull' : null,
		uniqueID,
		blockStyle,
		extraClassName,
		className
	);

	const imageAlt = () => {
		switch (altSelector) {
			case 'wordpress':
				return mediaAltWp;
			case 'title':
				return mediaAltTitle;
			case 'custom':
				return mediaAlt;
			default:
				return '';
		}
	};

	return (
		<figure
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion-id={uniqueID}
		>
			<BackgroundDisplayer
				{...getGroupAttributes(attributes, [
					'background',
					'backgroundColor',
					'backgroundImage',
					'backgroundVideo',
					'backgroundGradient',
					'backgroundSVG',
					'backgroundHover',
					'backgroundColorHover',
					'backgroundImageHover',
					'backgroundVideoHover',
					'backgroundGradientHover',
					'backgroundSVGHover',
				])}
				blockClassName={uniqueID}
			/>{' '}
			<div className={hoverClasses}>
				{(!SVGElement && (
					<img
						className={`wp-image-${mediaID}`}
						src={mediaURL}
						width={mediaWidth}
						height={mediaHeight}
						alt={imageAlt()}
					/>
				)) || <RawHTML>{SVGElement}</RawHTML>}
				{captionType !== 'none' && (
					<figcaption className='maxi-image-block__caption'>
						{captionContent}
					</figcaption>
				)}
				{attributes['hover-type'] === 'text' &&
					attributes['hover-text-effect-type'] !== 'none' && (
						<div className='maxi-hover-details'>
							<div
								className={`maxi-hover-details__content maxi-hover-details__content--${attributes['hover-text-preset']}`}
							>
								{!isEmpty(
									attributes['hover-title-typography-content']
								) && (
									<h3>
										{
											attributes[
												'hover-title-typography-content'
											]
										}
									</h3>
								)}
								{!isEmpty(
									attributes[
										'hover-content-typography-content'
									]
								) && (
									<p>
										{
											attributes[
												'hover-content-typography-content'
											]
										}
									</p>
								)}
							</div>
						</div>
					)}
			</div>
		</figure>
	);
};

export default save;
