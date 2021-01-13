/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, RawHTML } = wp.element;
const { withSelect } = wp.data;
const { Spinner, Button, ResizableBox, Placeholder } = wp.components;
const { __experimentalBlock, MediaUpload } = wp.blockEditor;

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
import { isEmpty, isNil, isNumber } from 'lodash';

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
			setBackgroundStyles({
				target: uniqueID,
				background,
				backgroundHover,
			})
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
			padding,
			margin,
			zIndex,
			alignment: { ...getAlignmentFlexObject(alignment) },
			position,
			positionOptions: position.options,
			display,
			transform: getTransformObject(transform),
		};

		return response;
	}

	get getHoverEffectDetailsBoxObject() {
		const { hover } = this.props.attributes;

		const { background, border, padding, margin } = hover;

		const response = {
			background: getColorBackgroundObject(background.colorOptions),
			border,
			padding,
			margin,
		};

		return response;
	}

	get getHoverEffectTitleTextObject() {
		const { hover } = this.props.attributes;

		const { titleTypography } = hover;

		const response = {
			typography: { ...titleTypography },
		};

		return response;
	}

	get getHoverEffectContentTextObject() {
		const { hover } = this.props.attributes;

		const { contentTypography } = hover;

		const response = {
			typography: { ...contentTypography },
		};

		return response;
	}

	get getHoverObject() {
		const { boxShadowHover } = this.props.attributes;

		const response = {};

		if (!isNil(boxShadowHover) && !!boxShadowHover.status) {
			response.boxShadowHover = getBoxShadowObject(boxShadowHover);
		}

		return response;
	}

	get getImageFrontendObject() {
		const { boxShadow, size, opacity } = this.props.attributes;

		const response = {
			boxShadow: getBoxShadowObject(boxShadow),
			imageSize: size,
			opacity,
		};

		return response;
	}

	get getImageHoverObject() {
		const { boxShadowHover, borderHover } = this.props.attributes;
		const response = {
			borderWidth: borderHover.borderWidth,
			borderRadius: borderHover.borderRadius,
		};

		if (!isNil(boxShadowHover) && !!boxShadowHover.status) {
			response.boxShadowHover = {
				...getBoxShadowObject(boxShadowHover),
			};
		}

		if (!isNil(borderHover) && !!borderHover.status) {
			response.borderHover = {
				...borderHover,
			};
		}

		return response;
	}

	get getImageBackendObject() {
		const { boxShadow, opacity, border, clipPath } = this.props.attributes;

		const response = {
			boxShadow: getBoxShadowObject(boxShadow),
			opacity,
			border,
			borderWidth: border.borderWidth,
			borderRadius: border.borderRadius,
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
			captionTypography,
			alignmentTypography: {
				...getAlignmentTextObject(captionTypography.textAlign),
			},
		};

		return response;
	}

	get getCustomData() {
		const { uniqueID, motion } = this.props.attributes;

		const motionStatus =
			!!motion.interaction.interactionStatus || !!motion.parallax.status;

		return {
			[uniqueID]: {
				...(motionStatus && { motion }),
			},
		};
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

		const size = { ...this.props.attributes.size };

		const hoverClasses = classnames(
			'maxi-block-hover-wrapper',
			hover.type === 'basic' &&
				!!hover.preview &&
				`maxi-hover-effect__${hover.type}__${hover.basicEffectType}`,
			hover.type === 'text' &&
				!!hover.preview &&
				`maxi-hover-effect__${hover.type}__${hover.textEffectType}`,
			hover.type !== 'none' &&
				`maxi-hover-effect__${
					hover.type === 'basic' ? 'basic' : 'text'
				}`
		);

		const classes = classnames(
			'maxi-block maxi-image-block',
			`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
			'maxi-block--backend',
			getLastBreakpointValue(display, 'display', deviceType) === 'none' &&
				'maxi-block-display-none',
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			uniqueID,
			className,
			fullWidth === 'full' && 'alignfull'
		);

		const getImage = () => {
			if (
				imageSize === 'custom' &&
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
			<Inspector {...this.props} />,
			<Toolbar {...this.props} />,
			<MotionPreview motion={motion}>
				<__experimentalBlock.figure
					className={classes}
					data-maxi_initial_block_class={defaultBlockStyle}
					data-align={fullWidth}
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
							<Fragment>
								{(!isNil(mediaID) && imageData) || mediaURL ? (
									<Fragment>
										<BackgroundDisplayer
											background={background}
										/>
										<ResizableBox
											className='maxi-block__resizer maxi-image-block__resizer'
											size={{
												width: `${
													!isNumber(
														size.general.width
													)
														? imageData &&
														  imageData
																.media_details
																.width
														: size.general.width
												}px`,
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
												size.general.width = parseInt(
													size.general.width +
														delta.width,
													10
												);

												setAttributes({
													size,
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
														src={mediaURL}
														width={mediaWidth}
														height={mediaHeight}
														alt={mediaAlt}
													/>
												)) || (
													<RawHTML>
														{SVGElement}
													</RawHTML>
												)}
												{hover.type !== 'none' &&
													hover.type !== 'basic' &&
													!!hover.preview && (
														<div className='maxi-hover-details'>
															<div
																className={`maxi-hover-details__content maxi-hover-details__content--${hover.textPreset}`}
															>
																{!isEmpty(
																	hover.titleText
																) && (
																	<h3>
																		{
																			hover.titleText
																		}
																	</h3>
																)}
																{!isEmpty(
																	hover.contentText
																) && (
																	<p>
																		{
																			hover.contentText
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
