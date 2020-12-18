/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { withSelect } = wp.data;
const { Spinner, Button, ResizableBox, Placeholder } = wp.components;
const { __experimentalBlock, MediaUpload } = wp.blockEditor;
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getColorBackgroundObject,
	getBoxShadowObject,
	getAlignmentFlexObject,
	getTransformObject,
	getAlignmentTextObject,
	setBackgroundStyles,
	getLastBreakpointValue,
} from '../../utils';
import {
	MaxiBlock,
	Toolbar,
	BackgroundDisplayer,
	MotionPreview,
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil, isObject } from 'lodash';

/**
 * Icons
 */
import { toolbarReplaceImage, placeholderImage } from '../../icons';

/**
 * Content
 */
class edit extends MaxiBlock {
	get getWrapperWidth() {
		const target = document.getElementById(`block-${this.props.clientId}`);
		if (target) return target.getBoundingClientRect().width;

		return false;
	}

	get getObject() {
		const { uniqueID, background, backgroundHover } = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
			[`${uniqueID} .maxi-block-hover-wrapper`]: this
				.getImageFrontendObject,
			[`${uniqueID}:hover .maxi-block-hover-wrapper`]: this
				.getImageHoverObject,
			[`${uniqueID} .maxi-block-hover-wrapper img`]: this
				.getImageBackendObject,
			[`${uniqueID} .maxi-block-hover-wrapper svg`]: this
				.getImageBackendObject,
			[`${uniqueID} figcaption`]: this.getFigcaptionObject,
			[`${uniqueID} .maxi-hover-details .maxi-hover-details__content h3`]: this
				.getHoverEffectTitleTextObject,
			[`${uniqueID} .maxi-hover-details .maxi-hover-details__content p`]: this
				.getHoverEffectContentTextObject,
			[`${uniqueID} .maxi-hover-details`]: this
				.getHoverEffectDetailsBoxObject,
		};

		response = Object.assign(
			response,
			setBackgroundStyles(uniqueID, background, backgroundHover)
		);

		return response;
	}

	get getNormalObject() {
		const {
			alignment,
			padding,
			margin,
			zIndex,
			position,
			display,
			transform,
		} = this.props.attributes;

		const response = {
			padding: { ...JSON.parse(padding) },
			margin: { ...JSON.parse(margin) },
			zIndex: { ...JSON.parse(zIndex) },
			alignment: { ...getAlignmentFlexObject(JSON.parse(alignment)) },
			position: { ...JSON.parse(position) },
			positionOptions: { ...JSON.parse(position).options },
			display: { ...JSON.parse(display) },
			transform: { ...getTransformObject(JSON.parse(transform)) },
		};

		return response;
	}

	get getHoverEffectDetailsBoxObject() {
		const { hover } = this.props.attributes;

		const background = !isObject(JSON.parse(hover).background)
			? JSON.parse(JSON.parse(hover).background)
			: JSON.parse(hover).background;

		const border = !isObject(JSON.parse(hover).border)
			? JSON.parse(JSON.parse(hover).border)
			: JSON.parse(hover).border;

		const padding = !isObject(JSON.parse(hover).padding)
			? JSON.parse(JSON.parse(hover).padding)
			: JSON.parse(hover).padding;

		const margin = !isObject(JSON.parse(hover).margin)
			? JSON.parse(JSON.parse(hover).margin)
			: JSON.parse(hover).margin;

		const response = {
			background: {
				...getColorBackgroundObject(background.colorOptions),
			},
			border: { ...border },
			padding: { ...padding },
			margin: { ...margin },
		};

		return response;
	}

	get getHoverEffectTitleTextObject() {
		const { hover } = this.props.attributes;

		const titleTypography = !isObject(JSON.parse(hover).titleTypography)
			? JSON.parse(JSON.parse(hover).titleTypography)
			: JSON.parse(hover).titleTypography;

		const response = {
			typography: { ...titleTypography },
		};

		return response;
	}

	get getHoverEffectContentTextObject() {
		const { hover } = this.props.attributes;

		const contentTypography = !isObject(JSON.parse(hover).contentTypography)
			? JSON.parse(JSON.parse(hover).contentTypography)
			: JSON.parse(hover).contentTypography;

		const response = {
			typography: { ...contentTypography },
		};

		return response;
	}

	get getHoverObject() {
		const { boxShadowHover } = this.props.attributes;

		const response = {};

		if (!isNil(boxShadowHover) && !!JSON.parse(boxShadowHover).status) {
			response.boxShadowHover = {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			};
		}

		return response;
	}

	get getImageFrontendObject() {
		const { boxShadow, size, opacity } = this.props.attributes;

		const response = {
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			imageSize: { ...JSON.parse(size) },
			opacity: { ...JSON.parse(opacity) },
		};

		return response;
	}

	get getImageHoverObject() {
		const { boxShadowHover, borderHover } = this.props.attributes;
		const response = {
			borderWidth: { ...JSON.parse(borderHover).borderWidth },
			borderRadius: { ...JSON.parse(borderHover).borderRadius },
		};

		if (!isNil(boxShadowHover) && !!JSON.parse(boxShadowHover).status) {
			response.boxShadowHover = {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			};
		}

		if (!isNil(borderHover) && !!JSON.parse(borderHover).status) {
			response.borderHover = {
				...JSON.parse(borderHover),
			};
		}

		return response;
	}

	get getImageBackendObject() {
		const { boxShadow, opacity, border, clipPath } = this.props.attributes;

		const response = {
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			opacity: { ...JSON.parse(opacity) },
			border: { ...JSON.parse(border) },
			borderWidth: { ...JSON.parse(border).borderWidth },
			borderRadius: { ...JSON.parse(border).borderRadius },
			image: {
				label: 'Image settings',
				general: {},
			},
		};

		if (!isNil(clipPath)) response.image.general['clip-path'] = clipPath;

		return response;
	}

	get getFigcaptionObject() {
		const { captionTypography } = this.props.attributes;

		const response = {
			captionTypography: { ...JSON.parse(captionTypography) },
			alignmentTypography: {
				...getAlignmentTextObject(
					JSON.parse(captionTypography).textAlign
				),
			},
		};

		return response;
	}

	render() {
		const {
			className,
			attributes: {
				uniqueID,
				blockStyle,
				defaultBlockStyle,
				blockStyleBackground,
				extraClassName,
				fullWidth,
				size,
				background,
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
				display,
				hover,
				motion,
			},
			imageData,
			setAttributes,
			deviceType,
		} = this.props;

		const displayValue = !isObject(display) ? JSON.parse(display) : display;

		const hoverValue = !isObject(hover) ? JSON.parse(hover) : hover;

		const hoverClasses = classnames(
			'maxi-block-hover-wrapper',
			hoverValue.type === 'basic' &&
				!!hoverValue.preview &&
				`maxi-hover-effect__${hoverValue.type}__${hoverValue.basicEffectType}`,
			hoverValue.type === 'text' &&
				!!hoverValue.preview &&
				`maxi-hover-effect__${hoverValue.type}__${hoverValue.textEffectType}`,
			hoverValue.type !== 'none' &&
				`maxi-hover-effect__${
					hoverValue.type === 'basic' ? 'basic' : 'text'
				}`
		);

		const classes = classnames(
			'maxi-block maxi-image-block',
			`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
			'maxi-block--backend',
			getLastBreakpointValue(displayValue, 'display', deviceType) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			uniqueID,
			className,
			fullWidth === 'full' ? 'alignfull' : ''
		);
		const cropOptionsValue = !isObject(cropOptions)
			? JSON.parse(cropOptions)
			: cropOptions;

		const sizeValue = !isObject(size) ? JSON.parse(size) : size;

		const getImage = () => {
			if (
				imageSize === 'custom' &&
				!isEmpty(cropOptionsValue.image.source_url)
			)
				return cropOptionsValue.image;
			if (imageData && imageSize && imageSize !== 'custom')
				return imageData.media_details.sizes[imageSize];
			if (imageData) return imageData.media_details.sizes.full;

			return false;
		};

		const image = getImage();
		if (image && imageData) {
			if (imageData.alt_text)
				setAttributes({ mediaAltWp: imageData.alt_text });

			if (mediaAlt) setAttributes({ mediaAlt });

			if (imageData.title.rendered)
				setAttributes({ mediaAltTitle: imageData.title.rendered });

			if (
				mediaURL !== image.source_url ||
				mediaWidth !== image.width ||
				mediaHeight !== image.height
			)
				setAttributes({
					mediaURL: image.source_url,
					mediaHeight: image.height,
					mediaWidth: image.width,
				});
		}

		return [
			<Inspector {...this.props} />,
			<Toolbar {...this.props} />,
			<MotionPreview motion={motion}>
				<__experimentalBlock.figure
					className={classes}
					data-maxi_initial_block_class={defaultBlockStyle}
					data-align={fullWidth}
				>
					<MediaUpload
						onSelect={media => setAttributes({ mediaID: media.id })}
						allowedTypes='image'
						value={mediaID}
						render={({ open }) => (
							<Fragment>
								{(!isNil(mediaID) && imageData) || mediaURL ? (
									<Fragment>
										<BackgroundDisplayer
											background={background}
										/>
										<ResizableBox
											className='maxi-block__resizer maxi-image-block__resizer'
											size={{
												width: `${sizeValue.general.width}%`,
												height: '100%',
											}}
											maxWidth='100%'
											enable={{
												top: false,
												right: false,
												bottom: false,
												left: false,
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
												const newScale = Number(
													(
														(elt.getBoundingClientRect()
															.width /
															this
																.getWrapperWidth) *
														100
													).toFixed()
												);
												sizeValue.general.width = newScale;
												setAttributes({
													size: JSON.stringify(
														sizeValue
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
												{(!SVGElement && (
													<img
														className={`maxi-image-block__image wp-image-${mediaID}`}
														src={image.source_url}
														width={mediaWidth}
														height={mediaHeight}
														alt={mediaAlt}
													/>
												)) || (
													<RawHTML>
														{SVGElement}
													</RawHTML>
												)}
												{hoverValue.type !== 'none' &&
													hoverValue.type !==
														'basic' &&
													!!hoverValue.preview && (
														<div className='maxi-hover-details'>
															<div
																className={`maxi-hover-details__content maxi-hover-details__content--${hoverValue.textPreset}`}
															>
																{!isEmpty(
																	hoverValue.titleText
																) && (
																	<h3>
																		{
																			hoverValue.titleText
																		}
																	</h3>
																)}
																{!isEmpty(
																	hoverValue.contentText
																) && (
																	<p>
																		{
																			hoverValue.contentText
																		}
																	</p>
																)}
															</div>
														</div>
													)}
											</div>
											{captionType !== 'none' && (
												<figcaption className='maxi-image-block__caption'>
													{captionContent}
												</figcaption>
											)}
										</ResizableBox>
									</Fragment>
								) : mediaID ? (
									<Fragment>
										<Spinner />
										<p>{__('Loading…', 'maxi-blocks')}</p>
									</Fragment>
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
							</Fragment>
						)}
					/>
				</__experimentalBlock.figure>
			</MotionPreview>,
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
