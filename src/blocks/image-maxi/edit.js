/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { Spinner, Placeholder } from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';
import Inspector from './inspector';
import {
	BlockResizer,
	Button,
	HoverPreview,
	MaxiBlockComponent,
	Toolbar,
} from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil, round } from 'lodash';

/**
 * Icons
 */
import { toolbarReplaceImage, placeholderImage } from '../../icons';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	get getWrapperWidth() {
		const target = document.getElementById(`block-${this.props.clientId}`);
		if (target) return target.getBoundingClientRect().width;

		return false;
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus =
			!!this.props.attributes['motion-status'] ||
			!isEmpty(this.props.attributes['entrance-type']);

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, [
						'motion',
						'entrance',
						'hover',
					]),
				}),
			},
		};
	}

	render() {
		const { attributes, imageData, setAttributes } = this.props;
		const {
			uniqueID,
			fullWidth,
			cropOptions,
			captionType,
			captionContent,
			imageSize,
			mediaID,
			mediaAlt,
			mediaURL,
			mediaWidth,
			mediaHeight,
			SVGElement,
			imgWidth,
			imageRatio,
		} = attributes;

		const hoverPreviewClasses = classnames(
			'maxi-image-ratio',
			`maxi-image-ratio__${imageRatio}`
		);

		const hoverClasses = classnames(
			'maxi-block-hover-wrapper',
			attributes['hover-type'] === 'basic' &&
				attributes['hover-preview'] &&
				`maxi-hover-effect__${attributes['hover-type']}__${attributes['hover-basic-effect-type']}`,
			attributes['hover-type'] === 'text' &&
				attributes['hover-preview'] &&
				`maxi-hover-effect__${attributes['hover-type']}__${attributes['hover-text-effect-type']}`,
			attributes['hover-type'] !== 'none' &&
				`maxi-hover-effect__${
					attributes['hover-type'] === 'basic' ? 'basic' : 'text'
				}`
		);

		const classes = classnames(
			'maxi-image-block',
			fullWidth === 'full' && 'alignfull'
		);

		const getImage = () => {
			if (
				imageSize === 'custom' &&
				!!cropOptions &&
				!isEmpty(cropOptions.image.source_url)
			)
				return { ...cropOptions.image };
			if (imageData && imageSize && imageSize !== 'custom')
				return { ...imageData.media_details.sizes[imageSize] };
			if (imageData) return { ...imageData.media_details.sizes.full };

			return false;
		};

		const image = getImage();
		if (image && imageData) {
			if (imageData.alt_text)
				setAttributes({ mediaAltWp: imageData.alt_text });

			if (mediaAlt) setAttributes({ mediaAlt });

			if (imageData.title.rendered)
				setAttributes({ mediaAltTitle: imageData.title.rendered });
		}

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<MaxiBlock
				key={`maxi-image--${uniqueID}`}
				tagName='figure'
				className={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<MediaUpload
					onSelect={media =>
						setAttributes({
							mediaID: media.id,
							mediaURL: media.url,
							mediaWidth: media.width,
							mediaHeight: media.height,
						})
					}
					allowedTypes='image'
					value={mediaID}
					render={({ open }) => (
						<>
							{(!isNil(mediaID) && imageData) || mediaURL ? (
								<>
									<BlockResizer
										key={uniqueID}
										className='maxi-block__resizer maxi-image-block__resizer'
										size={{ width: `${imgWidth}%` }}
										showHandle
										maxWidth='100%'
										enable={{
											topRight: true,
											bottomRight: true,
											bottomLeft: true,
											topLeft: true,
										}}
										onResizeStop={(
											event,
											direction,
											elt,
											delta
										) => {
											setAttributes({
												imgWidth: +round(
													elt.style.width.replace(
														/[^0-9.]/g,
														''
													),
													1
												),
											});
										}}
									>
										<div className='maxi-image-block__settings'>
											<Button
												className='maxi-image-block__settings__upload-button'
												showTooltip='true'
												onClick={open}
												icon={toolbarReplaceImage}
											/>
										</div>
										<div className={hoverClasses}>
											<HoverPreview
												className={
													!SVGElement
														? hoverPreviewClasses
														: null
												}
												key={`hover-preview-${uniqueID}`}
												{...getGroupAttributes(
													attributes,
													[
														'hover',
														'hoverTitleTypography',
														'hoverContentTypography',
													]
												)}
												SVGElement={SVGElement}
												mediaID={mediaID}
												src={mediaURL}
												width={mediaWidth}
												height={mediaHeight}
												alt={mediaAlt}
											/>
										</div>
										{captionType !== 'none' && (
											<figcaption className='maxi-image-block__caption'>
												{captionContent}
											</figcaption>
										)}
									</BlockResizer>
								</>
							) : mediaID ? (
								<>
									<Spinner />
									<p>{__('Loading…', 'maxi-blocks')}</p>
								</>
							) : (
								<div className='maxi-image-block__placeholder'>
									<Placeholder
										icon={placeholderImage}
										label=''
									/>
									<Button
										className='maxi-image-block__settings__upload-button'
										showTooltip='true'
										onClick={open}
										icon={toolbarReplaceImage}
									/>
								</div>
							)}
						</>
					)}
				/>
			</MaxiBlock>,
		];
	}
}

export default withSelect((select, ownProps) => {
	const { mediaID } = ownProps.attributes;
	const imageData = select('core').getMedia(mediaID);
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		imageData,
		deviceType,
	};
})(edit);
