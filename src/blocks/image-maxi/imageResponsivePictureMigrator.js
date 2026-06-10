/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { HoverPreview, RawHTML } from '@components';
import { getGroupAttributes, getLastBreakpointAttribute } from '@extensions/styles';
import { getDCImgSVG } from '@extensions/DC';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import { getResponsiveImageFallback } from './utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

const NAME = 'Image responsive picture';

const responsiveImageSourceBreakpoints = ['xs', 's', 'm', 'l', 'xl', 'xxl'];

const getResponsiveImageBreakpoints = attributes => ({
	xxl: attributes['breakpoints-xl'] || 1920,
	xl: attributes['breakpoints-xl'] || 1920,
	l: attributes['breakpoints-l'] || 1366,
	m: attributes['breakpoints-m'] || 1024,
	s: attributes['breakpoints-s'] || 767,
	xs: attributes['breakpoints-xs'] || 480,
});

const getResponsiveImageMedia = (breakpoint, attributes) => {
	const breakpoints = getResponsiveImageBreakpoints(attributes);

	if (breakpoint === 'xxl')
		return `(min-width:${breakpoints.xl + 1}px)`;

	return `(max-width:${breakpoints[breakpoint]}px)`;
};

const getResponsiveImageSourcesWithOptions = (
	attributes,
	{ includeExplicitFallbackSources = false } = {}
) => {
	const { mediaURL: fallbackURL } = getResponsiveImageFallback(attributes);

	return responsiveImageSourceBreakpoints
		.map(breakpoint => {
			const mediaURL = attributes[`mediaURL-${breakpoint}`];
			const hasExplicitImageSize =
				attributes[`imageSize-${breakpoint}`] !== undefined &&
				attributes[`imageSize-${breakpoint}`] !== null;

			if (
				!mediaURL ||
				(mediaURL === fallbackURL &&
					(!includeExplicitFallbackSources || !hasExplicitImageSize))
			)
				return null;

			return {
				breakpoint,
				media: getResponsiveImageMedia(breakpoint, attributes),
				srcSet: mediaURL,
			};
		})
		.filter(Boolean);
};

export const getResponsiveImageSources = attributes =>
	getResponsiveImageSourcesWithOptions(attributes);

export const getResponsiveImageSourcesWithExplicitFallbacks = attributes =>
	getResponsiveImageSourcesWithOptions(attributes, {
		includeExplicitFallbackSources: true,
	});

const FigCaption = props => {
	const { captionType, captionContent, dcStatus } = props;

	const showDCCaption = dcStatus && captionType === 'custom';
	const showNormalCaption =
		!dcStatus && captionType !== 'none' && !isEmpty(captionContent);
	const showCaption = showDCCaption || showNormalCaption;

	if (!showCaption) return null;

	return dcStatus ? (
		<figcaption className='maxi-image-block__caption'>
			$media-caption-to-replace
		</figcaption>
	) : (
		<RichText.Content
			className='maxi-image-block__caption'
			value={captionContent}
			tagName='figcaption'
		/>
	);
};

const save = (props, getSources) => {
	const { attributes } = props;
	const sourceGetter =
		typeof getSources === 'function' ? getSources : getResponsiveImageSources;
	const {
		uniqueID,
		captionType,
		captionContent,
		mediaID,
		mediaURL,
		mediaAlt,
		SVGData,
		SVGElement,
		'hover-type': hoverType,
		isImageUrl,
		captionPosition,
		fitParentSize,
		'dc-status': dcStatus,
		ariaLabels = {},
	} = attributes;
	const hoverPreview = getLastBreakpointAttribute({
		target: 'hover-preview',
		breakpoint: 'general',
		attributes,
	});

	const name = 'maxi-blocks/image-maxi';

	const wrapperClassName = classnames(
		'maxi-image-block-wrapper',
		fitParentSize && 'maxi-image-block-wrapper--fit-parent-size'
	);

	const hoverClasses = classnames(
		hoverType === 'basic' &&
			`maxi-hover-effect-active maxi-hover-effect__${hoverType}__${attributes['hover-basic-effect-type']}`,
		hoverType === 'text' &&
			`maxi-hover-effect-active maxi-hover-effect__${hoverType}__${attributes['hover-text-effect-type']}`,
		hoverType !== 'none' &&
			`maxi-hover-effect__${hoverType === 'basic' ? 'basic' : 'text'}`
	);

	const hoverPreviewAttributes = {
		...getGroupAttributes(attributes, [
			'hover',
			'hoverTitleTypography',
			'hoverContentTypography',
		]),
		'hover-preview': hoverPreview,
	};
	const {
		mediaURL: fallbackMediaURL,
		mediaWidth: fallbackMediaWidth,
		mediaHeight: fallbackMediaHeight,
	} = getResponsiveImageFallback(attributes);
	const responsiveImageSources = sourceGetter(attributes);
	const imageClassName = isImageUrl
		? 'maxi-image-block__image wp-image-external'
		: `maxi-image-block__image wp-image-${
				dcStatus ? '$media-id-to-replace' : mediaID
		  }`;
	const image = (
		<img
			className={imageClassName}
			src={dcStatus ? '$media-url-to-replace' : fallbackMediaURL}
			alt={dcStatus ? '$media-alt-to-replace' : mediaAlt}
			aria-label={ariaLabels.image}
			{...(!dcStatus && {
				width: fallbackMediaWidth,
				height: fallbackMediaHeight,
			})}
		/>
	);
	const responsiveImage =
		!dcStatus && responsiveImageSources.length ? (
			<picture>
				{responsiveImageSources.map(({ breakpoint, media, srcSet }) => (
					<source
						key={breakpoint}
						media={media}
						srcSet={srcSet}
					/>
				))}
				{image}
			</picture>
		) : (
			image
		);

	return (
		<MaxiBlock.save
			tagName='figure'
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={ariaLabels.canvas}
		>
			<>
				{captionPosition === 'top' && (
					<FigCaption
						captionType={captionType}
						captionContent={captionContent}
						dcStatus={dcStatus}
					/>
				)}
				<HoverPreview
					key={`hover-preview-${uniqueID}`}
					wrapperClassName={wrapperClassName}
					hoverClassName={hoverClasses}
					isSVG={!!SVGElement}
					{...hoverPreviewAttributes}
					isSave
				>
					{SVGElement &&
					(!dcStatus ||
						(mediaURL
							? !SVGElement.includes(mediaURL)
							: SVGElement.includes('href="'))) ? (
						<RawHTML>
							{dcStatus
								? getDCImgSVG(uniqueID, SVGData, SVGElement)
								: SVGElement}
						</RawHTML>
					) : (
						responsiveImage
					)}
				</HoverPreview>
				{captionPosition === 'bottom' && (
					<FigCaption
						captionType={captionType}
						captionContent={captionContent}
						dcStatus={dcStatus}
					/>
				)}
			</>
		</MaxiBlock.save>
	);
};

const migrate = attributes => attributes;

export default {
	name: NAME,
	migrate,
	save,
};

export const imageResponsivePictureExplicitFallbackMigrator = {
	name: `${NAME} explicit fallback`,
	migrate,
	save: props => save(props, getResponsiveImageSourcesWithExplicitFallbacks),
};
