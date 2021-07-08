/**
 * Internal dependencies
 */
import { HoverPreview, RawHTML } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

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
	} = attributes;

	const name = 'maxi-blocks/image-maxi';

	const wrapperClassName = classnames(
		'maxi-image-block-wrapper',
		'maxi-image-ratio',
		`maxi-image-ratio__${imageRatio}`
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
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
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
						className={`maxi-image-block__image wp-image-${mediaID}`}
						src={mediaURL}
						width={mediaWidth}
						height={mediaHeight}
						alt={mediaAlt}
					/>
				)}
			</HoverPreview>
			{captionType !== 'none' && (
				<figcaption className='maxi-image-block__caption'>
					{captionContent}
				</figcaption>
			)}
		</MaxiBlock>
	);
};

export default save;
