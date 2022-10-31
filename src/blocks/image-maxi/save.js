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
				{captionType !== 'none' &&
					!isEmpty(captionContent) &&
					captionPosition === 'top' && (
						<RichText.Content
							className='maxi-image-block__caption'
							value={captionContent}
							tagName='figcaption'
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
					{SVGElement ? (
						<RawHTML>{SVGElement}</RawHTML>
					) : (
						<img
							className={
								isImageUrl
									? 'maxi-image-block__image wp-image-external'
									: `maxi-image-block__image wp-image-${mediaID}`
							}
							src={mediaURL}
							width={mediaWidth}
							height={mediaHeight}
							alt={mediaAlt}
						/>
					)}
				</HoverPreview>
				{captionType !== 'none' &&
					!isEmpty(captionContent) &&
					captionPosition === 'bottom' && (
						<RichText.Content
							className='maxi-image-block__caption'
							value={captionContent}
							tagName='figcaption'
						/>
					)}
			</>
		</MaxiBlock.save>
	);
};

export default save;
