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

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Save
 */
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

const save = props => {
	const { attributes } = props;
	const {
		uniqueID,
		captionType,
		captionContent,
		mediaID,
		mediaURL,
		mediaWidth,
		mediaHeight,
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
						// To avoid block validation issue return img tag if SVGElement is old
						(mediaURL
							? !SVGElement.includes(mediaURL)
							: SVGElement.includes('href="'))) ? (
						<RawHTML>
							{dcStatus
								? getDCImgSVG(uniqueID, SVGData, SVGElement)
								: SVGElement}
						</RawHTML>
					) : (
						<img
							className={
								isImageUrl
									? 'maxi-image-block__image wp-image-external'
									: `maxi-image-block__image wp-image-${
											dcStatus
												? '$media-id-to-replace'
												: mediaID
									  }`
							}
							src={dcStatus ? '$media-url-to-replace' : mediaURL}
							alt={dcStatus ? '$media-alt-to-replace' : mediaAlt}
							aria-label={ariaLabels.image}
							{...(!dcStatus && {
								width: mediaWidth,
								height: mediaHeight,
							})}
						/>
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

export default save;
