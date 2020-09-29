/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { withSelect } = wp.data;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getBackgroundObject,
	getBoxShadowObject,
	getAlignmentFlexObject,
	getTransformObject,
	getAlignmentTextObject,
	setBackgroundStyles,
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

/**
 * Content
 */
class edit extends MaxiBlock {
	get getWrapperWidth() {
		const target = document.getElementById(`block-${this.props.clientId}`);
		if (!target) return;

		return target.getBoundingClientRect().width;
	}

	get getObject() {
		const { uniqueID, background, backgroundHover } = this.props.attributes;

		let response = {
			[uniqueID]: this.getNormalObject,
			[`${uniqueID}:hover`]: this.getHoverObject,
			[`${uniqueID}>img`]: this.getImageFrontendObject,
			[`${uniqueID} img:hover`]: this.getImageHoverObject,
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
			opacity,
			boxShadow,
			padding,
			margin,
			zIndex,
			position,
			display,
			transform,
		} = this.props.attributes;

		const response = {
			boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
			padding: { ...JSON.parse(padding) },
			margin: { ...JSON.parse(margin) },
			opacity: { ...JSON.parse(opacity) },
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
			background: { ...getBackgroundObject(background) },
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
		const { size } = this.props.attributes;

		const response = {
			imageSize: { ...JSON.parse(size) },
		};

		return response;
	}

	get getImageHoverObject() {
		const { borderHover } = this.props.attributes;

		const response = {
			borderHover: { ...JSON.parse(borderHover) },
			borderWidth: { ...JSON.parse(borderHover).borderWidth },
			borderRadius: { ...JSON.parse(borderHover).borderRadius },
		};

		return response;
	}

	get getImageBackendObject() {
		const { border, clipPath } = this.props.attributes;

		const response = {
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
				background,
				cropOptions,
				imageSize,
				mediaAlt,
				mediaURL,
				mediaWidth,
				mediaHeight,
				content,
			},
			imageData,
			setAttributes,
		} = this.props;

		const classes = classnames(
			'maxi-block maxi-icon-block',
			blockStyle,
			extraClassName,
			uniqueID,
			className,
			fullWidth === 'full' ? 'alignfull' : ''
		);

		const cropOptionsValue = !isObject(cropOptions)
			? JSON.parse(cropOptions)
			: cropOptions;

		const getImage = () => {
			if (
				imageSize === 'custom' &&
				!isEmpty(cropOptionsValue.image.source_url)
			)
				return cropOptionsValue.image;
			if (imageData && imageSize)
				return imageData.media_details.sizes[imageSize];
			if (imageData) return imageData.media_details.sizes.full;

			return undefined;
		};

		const image = getImage();
		if (image && imageData) {
			if (imageData.alt_text)
				setAttributes({ mediaAltWp: imageData.alt_text });

			if (mediaAlt) setAttributes({ mediaAlt });

			if (imageData.title.rendered)
				setAttributes({ mediaAltTitle: imageData.title.rendered });

			if (mediaURL !== image.source_url)
				setAttributes({ mediaURL: image.source_url });
			if (mediaWidth !== image.width)
				setAttributes({ mediaWidth: image.width });
			if (mediaHeight !== image.height)
				setAttributes({ mediaHeight: image.height });
		}

		return [
			<Inspector {...this.props} />,
			<__experimentalToolbar {...this.props} />,
			<div
				className={classes}
				data-maxi_initial_block_class={defaultBlockStyle}
				data-align={fullWidth}
			>
				<__experimentalBackgroundDisplayer background={background} />
				<Fragment>
					<div className='maxi-icon-block__icon'>
						<div className='maxi-icon-block__icon_content'>
							<HTMLEdit
								onChange={content => setAttributes({ content })}
								content={content}
							/>
						</div>
					</div>
				</Fragment>
			</div>,
		];
	}
}

export default withSelect((select, ownProps) => {
	const { mediaID } = ownProps.attributes;

	const imageData = select('core').getMedia(mediaID);
	let deviceType = select(
		'core/edit-post'
	).__experimentalGetPreviewDeviceType();
	deviceType = deviceType === 'Desktop' ? 'general' : deviceType;

	return {
		imageData,
		deviceType,
	};
})(edit);
