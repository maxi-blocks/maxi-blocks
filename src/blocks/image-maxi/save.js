/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { HoverPreview, RawHTML } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

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
		SVGElement,
		'hover-type': hoverType,
		isImageUrl,
		captionPosition,
		fitParentSize,
		'dc-status': dcStatus,
	} = attributes;

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

	return (
		<MaxiBlock.save
			tagName='figure'
			{...getMaxiBlockAttributes({ ...props, name })}
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
					{...getGroupAttributes(attributes, [
						'hover',
						'hoverTitleTypography',
						'hoverContentTypography',
					])}
					isSave
				>
					{SVGElement && !dcStatus ? (
						<RawHTML>{SVGElement}</RawHTML>
					) : (
						// eslint-disable-next-line jsx-a11y/alt-text
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
