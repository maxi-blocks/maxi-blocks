/**
 * Internal dependencies
 */
import { BackgroundDisplayer, HoverPreview } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { className, attributes } = props;
	const {
		uniqueID,
		blockStyle,
		fullWidth,
		extraClassName,
		captionType,
		captionContent,
		mediaID,
		mediaURL,
		imgWidth,
		mediaWidth,
		mediaHeight,
		mediaAlt,
		mediaAltWp,
		mediaAltTitle,
		altSelector,
		SVGElement,
		imageRatio,
	} = attributes;

	const hoverPreviewClasses = classnames(
		'maxi-image-ratio',
		`maxi-image-ratio__${imageRatio}`
	);

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
		'maxi-motion-effect',
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
		<figure className={classes} id={uniqueID}>
			{!attributes['background-highlight'] && (
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
				/>
			)}
			<div style={{ width: `${imgWidth}%` }} className={hoverClasses}>
				<HoverPreview
					className={!SVGElement ? hoverPreviewClasses : null}
					key={`hover-preview-${uniqueID}`}
					{...getGroupAttributes(attributes, [
						'hover',
						'hoverTitleTypography',
						'hoverContentTypography',
					])}
					SVGElement={SVGElement}
					mediaID={mediaID}
					src={mediaURL}
					width={mediaWidth}
					height={mediaHeight}
					alt={mediaAlt}
				/>
				{captionType !== 'none' && (
					<figcaption className='maxi-image-block__caption'>
						{captionContent}
					</figcaption>
				)}
			</div>
		</figure>
	);
};

export default save;
