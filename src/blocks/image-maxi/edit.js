/* eslint-disable react/jsx-no-constructed-context-values */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { MediaUpload, RichText } from '@wordpress/block-editor';
import { createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import getStyles from './styles';
import Inspector from './inspector';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import {
	BlockResizer,
	Button,
	HoverPreview,
	Toolbar,
	Placeholder,
	RawHTML,
	MaxiPopoverButton,
} from '../../components';
import { generateDataObject, injectImgSVG } from '../../extensions/svg';
import copyPasteMapping from './copy-paste-mapping';
import { textContext, onChangeRichText } from '../../extensions/text/formats';
import CaptionToolbar from '../../components/toolbar/captionToolbar';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil, round, isNumber } from 'lodash';
import DOMPurify from 'dompurify';

/**
 * Icons
 */
import { toolbarReplaceImage, placeholderImage } from '../../icons';

/**
 * Content
 */
export const transitionObj = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: ' .maxi-image-block-wrapper img',
			property: 'border',
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-image-block-wrapper img',
			property: 'box-shadow',
		},
	},
};
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
		return getStyles(this.props.attributes, transitionObj);
	}

	get getMaxiCustomData() {
		const { 'hover-type': hoverType, uniqueID } = this.props.attributes;
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

	render() {
		const { attributes, maxiSetAttributes, isSelected, deviceType } =
			this.props;
		const {
			'hover-preview': hoverPreview,
			'hover-type': hoverType,
			blockFullWidth,
			captionContent,
			captionType,
			fullWidth,
			imgWidth,
			mediaAlt,
			altSelector,
			useInitSize,
			mediaHeight,
			mediaID,
			mediaURL,
			mediaWidth,
			SVGElement,
			uniqueID,
			captionPosition,
		} = attributes;
		const { isExternalClass, isUploaderOpen } = this.state;

		const classes = classnames(
			'maxi-image-block',
			fullWidth === 'full' && 'alignfull'
		);

		const wrapperClassName = classnames('maxi-image-block-wrapper');

		const hoverClasses = classnames(
			hoverType === 'basic' &&
				hoverPreview &&
				`maxi-hover-effect-active maxi-hover-effect__${hoverType}__${attributes['hover-basic-effect-type']}`,
			hoverType === 'text' &&
				hoverPreview &&
				`maxi-hover-effect-active maxi-hover-effect__${hoverType}__${attributes['hover-text-effect-type']}`,
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

		const getIsOverflowHidden = () =>
			getLastBreakpointAttribute({
				target: 'overflow-y',
				breakpoint: deviceType,
				attributes,
			}) === 'hidden' &&
			getLastBreakpointAttribute({
				target: 'overflow-x',
				breakpoint: deviceType,
				attributes,
			}) === 'hidden';

		const getMaxWidth = () => {
			const maxWidth = getLastBreakpointAttribute({
				target: 'image-max-width',
				breakpoint: deviceType,
				attributes,
			});

			if (useInitSize && !isNumber(maxWidth)) return `${mediaWidth}px`;

			const maxWidthUnit = getLastBreakpointAttribute({
				target: 'image-max-width-unit',
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
					{...this.props}
				/>
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					{...this.props}
					copyPasteMapping={copyPasteMapping}
					prefix='image-'
				/>
				<MaxiPopoverButton
					key={`popover-${uniqueID}`}
					ref={this.blockRef}
					isOpen={isUploaderOpen}
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
								const cleanedContent =
									DOMPurify.sanitize(SVGElement);

								const svg = document
									.createRange()
									.createContextualFragment(
										cleanedContent
									).firstElementChild;

								const resData = generateDataObject('', svg);

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
							<div className='maxi-image-block__settings'>
								<Button
									className='maxi-image-block__settings__upload-button'
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
					blockFullWidth={blockFullWidth}
					className={classes}
					{...getMaxiBlockAttributes(this.props)}
				>
					{!isNil(mediaID) || mediaURL ? (
						<BlockResizer
							key={uniqueID}
							className='maxi-block__resizer maxi-image-block__resizer'
							resizableObject={this.resizableObject}
							isOverflowHidden={getIsOverflowHidden()}
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
														this.state.formatValue,
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
															setTimeout(() => {
																this.setState(
																	newState
																);
															}, 10);
													},
													richTextValues,
												})
											}
										</RichText>
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
								{SVGElement ? (
									<RawHTML>{SVGElement}</RawHTML>
								) : (
									<img
										className={
											isExternalClass
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
							{captionType !== 'none' &&
								captionPosition === 'bottom' && (
									<>
										<CaptionToolbar
											key={`caption-toolbar-${uniqueID}`}
											ref={this.textRef}
											{...this.props}
										/>
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
														this.state.formatValue,
													onChange: newState =>
														this.setState(newState),
													richTextValues,
												})
											}
										</RichText>
									</>
								)}
						</BlockResizer>
					) : (
						<div className='maxi-image-block__placeholder'>
							<Placeholder icon={placeholderImage} label='' />
						</div>
					)}
				</MaxiBlock>
			</textContext.Provider>,
		];
	}
}

export default withMaxiProps(edit);
