/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, RawHTML } = wp.element;
const { withSelect } = wp.data;
const { Spinner, Button, Placeholder } = wp.components;
const { __experimentalBlock, MediaUpload } = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	BackgroundDisplayer,
	BlockResizer,
	MaxiBlock,
	MotionPreview,
	Toolbar,
} from '../../components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';

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
class edit extends MaxiBlock {
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
					]),
				}),
			},
		};
	}

	render() {
		const {
			className,
			attributes,
			imageData,
			setAttributes,
			deviceType,
		} = this.props;
		const {
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			blockStyleBackground,
			extraClassName,
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
		} = attributes;

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
			'maxi-block maxi-image-block',
			`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
			'maxi-block--backend',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
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
			<MotionPreview
				key={`motion-preview-${uniqueID}`}
				{...getGroupAttributes(attributes, 'motion')}
			>
				<__experimentalBlock.figure
					className={classes}
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
										{!attributes[
											'background-highlight'
										] && (
											<BackgroundDisplayer
												{...getGroupAttributes(
													attributes,
													[
														'background',
														'backgroundColor',
														'backgroundImage',
														'backgroundVideo',
														'backgroundGradient',
														'backgroundSVG',
														'backgroundHover',
														'backgroundColorHover',
														'backgroundImageHover',
														'backgroundVideoHover',
														'backgroundGradientHover',
														'backgroundSVGHover',
													]
												)}
												blockClassName={uniqueID}
											/>
										)}
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
												{attributes['hover-type'] !==
													'none' &&
													attributes['hover-type'] !==
														'basic' &&
													attributes[
														'hover-preview'
													] && (
														<div className='maxi-hover-details'>
															<div
																className={`maxi-hover-details__content maxi-hover-details__content--${attributes['hover-text-preset']}`}
															>
																{!isEmpty(
																	attributes[
																		'hover-title-typography-content'
																	]
																) && (
																	<h3>
																		{
																			attributes[
																				'hover-title-typography-content'
																			]
																		}
																	</h3>
																)}
																{!isEmpty(
																	attributes[
																		'hover-content-typography-content'
																	]
																) && (
																	<p>
																		{
																			attributes[
																				'hover-content-typography-content'
																			]
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
										</BlockResizer>
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
