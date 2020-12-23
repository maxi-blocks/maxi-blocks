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
import { MaxiBlock, Toolbar, BackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

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
			boxShadow: getBoxShadowObject(boxShadow),
			padding,
			margin,
			opacity,
			zIndex,
			alignment: getAlignmentFlexObject(alignment),

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
			background: getBackgroundObject(background),
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
			typography: titleTypography,
		};

		return response;
	}

	get getHoverEffectContentTextObject() {
		const { hover } = this.props.attributes;
		const { contentTypography } = hover;

		const response = {
			typography: contentTypography,
		};

		return response;
	}

	get getHoverObject() {
		const { boxShadowHover } = this.props.attributes;

		const response = {};

		if (!isNil(boxShadowHover) && !!boxShadowHover.status) {
			response.boxShadowHover = {
				...getBoxShadowObject(boxShadowHover),
			};
		}

		return response;
	}

	get getImageFrontendObject() {
		const { size } = this.props.attributes;

		const response = {
			imageSize: size,
		};

		return response;
	}

	get getImageHoverObject() {
		const { borderHover } = this.props.attributes;

		const response = {
			borderWidth: borderHover.borderWidth,
			borderRadius: borderHover.borderRadius,
		};

		if (!isNil(borderHover) && !!borderHover.status) {
			response.borderHover = {
				...borderHover,
			};
		}

		return response;
	}

	get getImageBackendObject() {
		const { border, clipPath } = this.props.attributes;

		const response = {
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
			alignmentTypography: getAlignmentTextObject(
				captionTypography.textAlign
			),
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
			'maxi-block',
			'maxi-block--backend',
			'maxi-icon-block',
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			extraClassName,
			uniqueID,
			className,
			fullWidth === 'full' ? 'alignfull' : ''
		);

		const getImage = () => {
			if (
				imageSize === 'custom' &&
				!isEmpty(cropOptions.image.source_url)
			)
				return cropOptions.image;
			if (imageData && imageSize)
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

			if (mediaURL !== image.source_url)
				setAttributes({ mediaURL: image.source_url });
			if (mediaWidth !== image.width)
				setAttributes({ mediaWidth: image.width });
			if (mediaHeight !== image.height)
				setAttributes({ mediaHeight: image.height });
		}

		return [
			<Inspector {...this.props} />,
			<Toolbar {...this.props} />,
			<div
				className={classes}
				data-maxi_initial_block_class={defaultBlockStyle}
				data-align={fullWidth}
			>
				<BackgroundDisplayer background={background} />
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
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		imageData,
		deviceType,
	};
})(edit);
