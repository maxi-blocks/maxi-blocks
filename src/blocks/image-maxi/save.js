/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { HoverPreview, RawHTML } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import MaxiBlock from '../../components/maxi-block';
import { getMaxiBlockAttributes } from '../../extensions/maxi-block';

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
		imageRatio,
		fullWidth,
		'hover-type': hoverType,
		'hover-preview': hoverPreview,
		isImageUrl,
		captionPosition,
	} = attributes;

	const name = 'maxi-blocks/image-maxi';

	const wrapperClassName = classnames(
		'maxi-image-block-wrapper',
		'maxi-image-ratio',
		!SVGElement && `maxi-image-ratio__${imageRatio}`
	);

	const hoverClasses = classnames(
		hoverType === 'basic' &&
			hoverPreview &&
			`maxi-hover-effect__${hoverType}__${attributes['hover-basic-effect-type']}`,
		hoverType === 'text' &&
			hoverPreview &&
			`maxi-hover-effect__${hoverType}__${attributes['hover-text-effect-type']}`,
		hoverType !== 'none' &&
			`maxi-hover-effect__${hoverType === 'basic' ? 'basic' : 'text'}`
	);

	return (
		<MaxiBlock
			tagName='figure'
			className={fullWidth === 'full' && 'alignfull'}
			{...getMaxiBlockAttributes({ ...props, name })}
			isSave
		>
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
				hoverClassName={!SVGElement ? hoverClasses : null}
				isSVG={!!SVGElement}
				{...getGroupAttributes(attributes, [
					'hover',
					'hoverTitleTypography',
					'hoverContentTypography',
				])}
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
		</MaxiBlock>
	);
};

export default save;
