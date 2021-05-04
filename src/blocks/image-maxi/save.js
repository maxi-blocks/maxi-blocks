/**
 * Internal dependencies
 */
import { HoverPreview } from '../../components';
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

	const classes = 'maxi-image-block';

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
		<MaxiBlock
			className={classes}
			id={uniqueID}
			tagName='figure'
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
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
					alt={imageAlt()}
				/>
				{captionType !== 'none' && (
					<figcaption className='maxi-image-block__caption'>
						{captionContent}
					</figcaption>
				)}
			</div>
		</MaxiBlock>
	);
};

export default save;
