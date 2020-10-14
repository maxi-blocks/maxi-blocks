/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { withSelect } = wp.data;
const { Spinner, IconButton, ResizableBox } = wp.components;
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
	__experimentalToolbar,
	__experimentalBackgroundDisplayer,
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil, isObject } from 'lodash';
import { Power2, TimelineLite } from 'gsap';

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
			[`${uniqueID} img`]: this.getImageBackendObject,
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
			boxShadow,
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
			background: { ...getColorBackgroundObject(background) },
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

		const response = {
			boxShadowHover: {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			},
		};

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
			boxShadowHover: {
				...getBoxShadowObject(JSON.parse(boxShadowHover)),
			},
			borderHover: { ...JSON.parse(borderHover) },
			borderWidth: { ...JSON.parse(borderHover).borderWidth },
			borderRadius: { ...JSON.parse(borderHover).borderRadius },
		};

		return response;
	}

	get getImageBackendObject() {
		const {
			boxShadow,
			opacity,
			border,
			clipPath,
			size,
		} = this.props.attributes;

		const response = {
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			opacity: { ...JSON.parse(opacity) },
			size: { ...JSON.parse(size) },
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
			},
			imageData,
			setAttributes,
			deviceType,
		} = this.props;

		const displayValue = !isObject(display) ? JSON.parse(display) : display;

		const classes = classnames(
			'maxi-block maxi-image-block',
			`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
			getLastBreakpointValue(displayValue, 'display', deviceType) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
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

		const {
			settings: hoverSettings,
			titleText: hoverTitleText,
			contentText: hoverContentText,
			textPreset: hoverTextPreset,
		} = JSON.parse(hover);

		const hoverClasses = classnames(
			'maxi-block-hover-wrapper',
			`maxi-hover-effect__${hoverSettings.type}__${hoverSettings.effectType}`,
			`maxi-hover-effect__${
				hoverSettings.type === 'basic' ? 'basic' : 'text'
			}`
		);

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<__experimentalBlock.figure
				className={classes}
				data-maxi_initial_block_class={defaultBlockStyle}
				data-align={fullWidth}
			>
				{!!SVGElement && (
					<Fragment>
						<__experimentalBackgroundDisplayer
							background={background}
						/>
						<ResizableBox
							className='maxi-block__resizer maxi-svg-block__resizer'
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
							onResizeStop={(event, direction, elt, delta) => {
								const newScale = Number(
									(
										(elt.getBoundingClientRect().width /
											this.getWrapperWidth) *
										100
									).toFixed()
								);
								sizeValue.general.width = newScale;
								setAttributes({
									size: JSON.stringify(sizeValue),
								});
							}}
						>
							<RawHTML>{SVGElement}</RawHTML>
						</ResizableBox>
					</Fragment>
				)}
				<MediaUpload
					onSelect={media => setAttributes({ mediaID: media.id })}
					allowedTypes='image'
					value={mediaID}
					render={({ open }) => (
						<Fragment>
							{!isNil(mediaID) && imageData ? (
								<Fragment>
									<__experimentalBackgroundDisplayer
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
														this.getWrapperWidth) *
													100
												).toFixed()
											);
											sizeValue.general.width = newScale;
											setAttributes({
												size: JSON.stringify(sizeValue),
											});
										}}
									>
										<div className='maxi-image-block__settings'>
											<IconButton
												className='maxi-image-block__settings__upload-button'
												showTooltip='true'
												onClick={open}
												icon={toolbarReplaceImage}
											/>
										</div>
										<div className={hoverClasses}>
											<img
												style={{
													transitionDuration: `${hoverSettings.duration}s`,
												}}
												className={`maxi-image-block__image wp-image-${mediaID}`}
												src={image.source_url}
												width={mediaWidth}
												height={mediaHeight}
												alt={mediaAlt}
											/>
											{hoverSettings.type !== 'none' && (
												<div className='maxi-hover-details'>
													<div
														style={{
															transitionDuration: `${hoverSettings.duration}s`,
														}}
														className={`maxi-hover-details__content maxi-hover-details__content--${hoverTextPreset}`}
													>
														{!isEmpty(
															hoverTitleText
														) && (
															<h3>
																{hoverTitleText}
															</h3>
														)}
														{!isEmpty(
															hoverContentText
														) && (
															<p>
																{
																	hoverContentText
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
								<IconButton
									className='maxi-imageupload-button'
									showTooltip='true'
									onClick={open}
									icon={placeholderImage}
								/>
							)}
						</Fragment>
					)}
				/>
			</__experimentalBlock.figure>,
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
