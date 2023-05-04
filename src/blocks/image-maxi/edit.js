/* eslint-disable react/jsx-no-constructed-context-values */
/**
 * WordPress dependencies
 */
import { MediaUpload, RichText } from '@wordpress/block-editor';
import { createRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	BlockResizer,
	Button,
	HoverPreview,
	MaxiPopoverButton,
	Placeholder,
	RawHTML,
	Toolbar,
} from '../../components';
import { getMaxiBlockAttributes, MaxiBlock } from '../../components/maxi-block';
import CaptionToolbar from '../../components/toolbar/captionToolbar';
import {
	getAttributesValue,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import withMaxiDC from '../../extensions/DC/withMaxiDC';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { getIsOverflowHidden } from '../../extensions/styles';
import { injectImgSVG } from '../../extensions/svg';
import { onChangeRichText, textContext } from '../../extensions/text/formats';
import { copyPasteMapping } from './data';
import Inspector from './inspector';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import DOMPurify from 'dompurify';
import { isEmpty, isNil, isNumber, round, uniqueId } from 'lodash';

/**
 * Icons
 */
import { placeholderImage, toolbarReplaceImage } from '../../icons';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		const { isImageUrl } = this.props.attributes;

		this.state = {
			isExternalClass: isImageUrl,
			isUploaderOpen: false,
			formatValue: {},
			onChangeFormat: null,
		};

		this.textRef = createRef(null);
		this.resizableObject = createRef();
	}

	typingTimeoutFormatValue = 0;

	typingTimeoutContent = 0;

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { 'hover-type': hoverType, _uid: uniqueID } =
			this.props.attributes;
		const hoverStatus = hoverType !== 'none';

		return {
			...(hoverStatus && {
				hover_effects: {
					[uniqueID]: {
						...getGroupAttributes(this.props.attributes, 'hover'),
					},
				},
			}),
		};
	}

	maxiBlockDidMount() {
		const { attributes, maxiSetAttributes } = this.props;
		const {
			SVGData,
			SVGElement,
			_uid: uniqueID,
			mediaID,
			mediaURL,
		} = attributes;

		// to make upload popover button appear immediately after adding image maxi
		if (!mediaID) this.forceUpdate();

		if (
			!isEmpty(SVGData) &&
			Object.keys(SVGData)[0].split('__')[0] !== uniqueID
		) {
			const cleanedContent = DOMPurify.sanitize(SVGElement);

			const svg = document
				.createRange()
				.createContextualFragment(cleanedContent).firstElementChild;

			const resData = {
				[`${uniqueID}__${uniqueId()}`]: {
					color: '',
					imageID: mediaID,
					imageURL: mediaURL,
				},
			};

			const resEl = injectImgSVG(svg, resData, false, uniqueID);
			maxiSetAttributes({
				SVGElement: resEl.outerHTML,
				SVGData: resData,
			});
		}
	}

	render() {
		const { attributes, maxiSetAttributes, isSelected, deviceType } =
			this.props;
		const {
			captionContent,
			captionType,
			imgWidth,
			mediaAlt,
			altSelector,
			useInitSize,
			mediaHeight,
			mediaID,
			mediaURL,
			mediaWidth,
			SVGElement,
			_uid: uniqueID,
			captionPosition,
			fitParentSize,
			'dc-status': dcStatus,
			'dc-media-id': dcMediaId,
			'dc-media-url': dcMediaUrl,
			'dc-media-caption': dcMediaCaption,
		} = attributes;
		const { isExternalClass, isUploaderOpen } = this.state;
		const [
			hoverPreview,
			hoverType,
			hoverBasicEffectType,
			hoverTextEffectType,
		] = getAttributesValue({
			target: [
				'hover-preview',
				'hover-type',
				'hover-basic-effect-type',
				'hover-text-effect-type',
			],
			props: attributes,
		});

		const wrapperClassName = classnames(
			'maxi-image-block-wrapper',
			fitParentSize && 'maxi-image-block-wrapper--fit-parent-size'
		);

		const hoverClasses = classnames(
			hoverType === 'basic' &&
				hoverPreview &&
				`maxi-hover-effect-active maxi-hover-effect__${hoverType}__${hoverBasicEffectType}`,
			hoverType === 'text' &&
				hoverPreview &&
				`maxi-hover-effect-active maxi-hover-effect__${hoverType}__${hoverTextEffectType}`,
			hoverType !== 'none' &&
				`maxi-hover-effect__${hoverType === 'basic' ? 'basic' : 'text'}`
		);

		/**
		 * Prevents losing general link format when the link is affecting whole content
		 *
		 * In case we add a whole link format, Gutenberg doesn't keep it when creators write new content.
		 * This method fixes it
		 */
		const processContent = captionContent => {
			const isWholeLink =
				captionContent.split('</a>').length === 2 &&
				captionContent.startsWith('<a') &&
				captionContent.indexOf('</a>') === captionContent.length - 5;

			if (isWholeLink) {
				const newContent = captionContent.replace('</a>', '');
				maxiSetAttributes({ captionContent: `${newContent}</a>` });
			} else {
				if (this.typingTimeoutContent) {
					clearTimeout(this.typingTimeoutContent);
				}

				this.typingTimeoutContent = setTimeout(() => {
					maxiSetAttributes({ captionContent });
				}, 100);
			}
		};

		const getMaxWidth = () => {
			const maxWidth = getLastBreakpointAttribute({
				target: 'im_mw',
				breakpoint: deviceType,
				attributes,
			});

			if (useInitSize && !isNumber(maxWidth)) return `${mediaWidth}px`;

			const maxWidthUnit = getLastBreakpointAttribute({
				target: 'im_mw.u',
				breakpoint: deviceType,
				attributes,
			});

			if (
				(!useInitSize && maxWidth) ||
				(useInitSize && maxWidth > mediaWidth)
			)
				return `${maxWidth}${maxWidthUnit}`;

			return '100%';
		};

		const fullWidth = getLastBreakpointAttribute({
			target: 'im_fw',
			breakpoint: deviceType,
			attributes,
		});

		const dropShadow =
			(getLastBreakpointAttribute({
				target: '_cp',
				breakpoint: deviceType,
				attributes,
			}) &&
				getLastBreakpointAttribute({
					target: '_cp.s',
					breakpoint: deviceType,
					attributes,
				})) ||
			!isEmpty(attributes.SVGElement);

		const showImage =
			!isNil(mediaID) ||
			mediaURL ||
			(dcStatus && dcMediaId && dcMediaUrl);

		return [
			<textContext.Provider
				key={`maxi-text-block__context-${uniqueID}`}
				value={{
					formatValue: this.state.formatValue,
					onChangeTextFormat: newFormatValue => {
						this.state.onChangeFormat(newFormatValue);
						onChangeRichText({
							attributes,
							maxiSetAttributes,
							oldFormatValue: this.state.formatValue,
							onChange: newState => this.setState(newState),
							richTextValues: { value: newFormatValue },
						});
					},
				}}
			>
				<Inspector
					key={`block-settings-${uniqueID}`}
					resizableObject={this.resizableObject.current}
					getBlockRefBounds={() =>
						this.blockRef.current.getBoundingClientRect()
					}
					{...this.props}
				/>
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					{...this.props}
					copyPasteMapping={copyPasteMapping}
					prefix='im-'
					dropShadow={dropShadow}
				/>
				<MaxiPopoverButton
					key={`popover-${uniqueID}`}
					ref={this.blockRef}
					isOpen={isUploaderOpen}
					isEmptyContent={!mediaID}
					prefix='im-'
					{...this.props}
				>
					<MediaUpload
						onSelect={media => {
							const alt =
								(altSelector === 'wordpress' && media?.alt) ||
								(altSelector === 'title' && media?.title) ||
								null;

							maxiSetAttributes({
								mediaID: media.id,
								mediaURL: media.url,
								mediaWidth: media.width,
								mediaHeight: media.height,
								isImageUrl: false,
								...(altSelector === 'wordpress' &&
									!alt && { altSelector: 'title' }),
								mediaAlt:
									altSelector === 'wordpress' && !alt
										? media.title
										: alt,
							});

							this.setState({ isExternalClass: false });

							if (!isEmpty(attributes.SVGData)) {
								const cleanedContent = DOMPurify.sanitize(
									attributes.SVGElement
								);

								const svg = document
									.createRange()
									.createContextualFragment(
										cleanedContent
									).firstElementChild;

								const resData = {
									[`${uniqueID}__${uniqueId()}`]: {
										color: '',
										imageID: '',
										imageURL: '',
									},
								};

								const SVGValue = resData;
								const el = Object.keys(SVGValue)[0];

								SVGValue[el].imageID = media.id;
								SVGValue[el].imageURL = media.url;

								const resEl = injectImgSVG(svg, resData);
								maxiSetAttributes({
									SVGElement: resEl.outerHTML,
									SVGData: SVGValue,
								});
							}
						}}
						allowedTypes='image'
						value={mediaID}
						render={({ open }) => (
							<div className='maxi-image-block__settings maxi-settings-media-upload'>
								<Button
									className='maxi-image-block__settings__upload-button maxi-settings-media-upload__button'
									label={__(
										'Upload / Add from Media Library',
										'maxi-blocks'
									)}
									showTooltip='true'
									onClick={() => {
										open();
										this.setState({ isUploaderOpen: true });
									}}
									icon={toolbarReplaceImage}
								/>
							</div>
						)}
						onClose={() => this.setState({ isUploaderOpen: false })}
					/>
				</MaxiPopoverButton>
				<MaxiBlock
					key={`maxi-image--${uniqueID}`}
					ref={this.blockRef}
					tagName='figure'
					className='maxi-image-block'
					{...getMaxiBlockAttributes(this.props)}
				>
					{showImage ? (
						<BlockResizer
							key={uniqueID}
							className='maxi-block__resizer maxi-image-block__resizer'
							resizableObject={this.resizableObject}
							isOverflowHidden={getIsOverflowHidden(
								attributes,
								deviceType
							)}
							defaultSize={{
								width: `${
									fullWidth !== 'full' && !useInitSize
										? imgWidth
										: 100
								}%`,
							}}
							showHandle={
								isSelected &&
								fullWidth !== 'full' &&
								!useInitSize
							}
							maxWidth={getMaxWidth()}
							enable={{
								topRight: true,
								bottomRight: true,
								bottomLeft: true,
								topLeft: true,
							}}
							onResizeStop={(event, direction, elt, delta) =>
								maxiSetAttributes({
									imgWidth: +round(
										elt.style.width.replace(/[^0-9.]/g, ''),
										1
									),
								})
							}
						>
							{captionType !== 'none' &&
								captionPosition === 'top' && (
									<>
										<CaptionToolbar
											key={`caption-toolbar-${uniqueID}`}
											ref={this.textRef}
											{...this.props}
										/>
										{dcStatus ? (
											<figcaption className='maxi-image-block__caption'>
												{dcMediaCaption &&
												!isEmpty(dcMediaCaption)
													? dcMediaCaption
													: __(
															'No content found',
															'maxi-blocks'
													  )}
											</figcaption>
										) : (
											<RichText
												ref={this.textRef}
												className='maxi-image-block__caption'
												value={captionContent}
												onChange={processContent}
												tagName='figcaption'
												placeholder={__(
													'Set your Image Maxi caption here…',
													'maxi-blocks'
												)}
												__unstableEmbedURLOnPaste
												__unstableAllowPrefixTransformations
											>
												{richTextValues =>
													onChangeRichText({
														attributes,
														maxiSetAttributes,
														oldFormatValue:
															this.state
																.formatValue,
														onChange: newState => {
															if (
																this
																	.typingTimeoutFormatValue
															) {
																clearTimeout(
																	this
																		.typingTimeoutFormatValue
																);
															}

															this.typingTimeoutFormatValue =
																setTimeout(
																	() => {
																		this.setState(
																			newState
																		);
																	},
																	600
																);
														},
														richTextValues,
													})
												}
											</RichText>
										)}
									</>
								)}
							<HoverPreview
								key={`hover-preview-${uniqueID}`}
								wrapperClassName={wrapperClassName}
								hoverClassName={hoverClasses}
								isSVG={!!SVGElement}
								{...getGroupAttributes(attributes, [
									'hover',
									'hoverTitleTypography',
									'hoverContentTypography',
								])}
							>
								{!dcStatus && SVGElement ? (
									<RawHTML>{SVGElement}</RawHTML>
								) : (
									// eslint-disable-next-line jsx-a11y/alt-text
									<img
										className={
											isExternalClass && !dcStatus
												? 'maxi-image-block__image wp-image-external'
												: `maxi-image-block__image wp-image-${
														dcStatus
															? dcMediaId
															: mediaID
												  }`
										}
										src={dcStatus ? dcMediaUrl : mediaURL}
										{...(dcStatus && {
											width: mediaWidth,
											height: mediaHeight,
											alt: mediaAlt,
										})}
									/>
								)}
							</HoverPreview>
							{captionType !== 'none' &&
								captionPosition === 'bottom' && (
									<>
										<CaptionToolbar
											key={`caption-toolbar-${uniqueID}`}
											ref={this.textRef}
											{...this.props}
										/>
										{dcStatus ? (
											<figcaption className='maxi-image-block__caption'>
												{dcMediaCaption &&
												!isEmpty(dcMediaCaption)
													? dcMediaCaption
													: __(
															'No content found',
															'maxi-blocks'
													  )}
											</figcaption>
										) : (
											<RichText
												ref={this.textRef}
												className='maxi-image-block__caption'
												value={captionContent}
												onChange={processContent}
												tagName='figcaption'
												placeholder={__(
													'Set your Image Maxi caption here…',
													'maxi-blocks'
												)}
												__unstableEmbedURLOnPaste
												__unstableAllowPrefixTransformations
											>
												{richTextValues =>
													onChangeRichText({
														attributes,
														maxiSetAttributes,
														oldFormatValue:
															this.state
																.formatValue,
														onChange: newState => {
															if (
																this
																	.typingTimeoutFormatValue
															) {
																clearTimeout(
																	this
																		.typingTimeoutFormatValue
																);
															}

															this.typingTimeoutFormatValue =
																setTimeout(
																	() => {
																		this.setState(
																			newState
																		);
																	},
																	600
																);
														},
														richTextValues,
													})
												}
											</RichText>
										)}
									</>
								)}
						</BlockResizer>
					) : (
						<div className='maxi-image-block__placeholder'>
							<Placeholder
								icon={placeholderImage}
								instructions={
									dcStatus
										? __('No content found', 'maxi-blocks')
										: __('Placeholder image', 'maxi-blocks')
								}
							/>
						</div>
					)}
				</MaxiBlock>
			</textContext.Provider>,
		];
	}
}

export default withMaxiDC(withMaxiProps(edit));
