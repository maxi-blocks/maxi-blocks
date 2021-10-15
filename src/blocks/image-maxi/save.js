/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

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
		isImageUrl,
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

	const motionData = () => {
		const response = {};
		const { attributes } = props;
		const motionSettings = [
			'speed',
			'direction',
			'offset-start',
			'offset-middle',
			'offset-top',
			'viewport-bottom',
			'viewport-middle',
			'viewport-top',
		];

		const dataMotionTypeValue = attributes['motion-status-vertical-general']
			? 'vertical'
			: '';
		response['data-motion-type'] = dataMotionTypeValue;

		motionSettings.map(setting => {
			const motionSettingValue =
				attributes[`motion-${setting}-vertical-general`];
			if (attributes[`motion-${setting}-vertical-general`])
				response[`data-motion-${setting}`] = motionSettingValue;

			return null;
		});

		return response;
	};

	return (
		<MaxiBlock
			tagName='figure'
			className={
				(fullWidth === 'full' && 'alignfull',
				attributes['motion-status-vertical-general'] &&
					'maxi-block-motion')
			}
			{...motionData()}
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
			{captionType !== 'none' && (
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
