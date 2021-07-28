/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSelect, dispatch } from '@wordpress/data';
import { MediaUpload, RichText } from '@wordpress/block-editor';
import { isURL } from '@wordpress/url';
import { createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import getStyles from './styles';
import Inspector from './inspector';
import { getGroupAttributes } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import {
	BlockResizer,
	Button,
	HoverPreview,
	MaxiBlockComponent,
	Toolbar,
	Placeholder,
	RawHTML,
	ImageURL,
} from '../../components';
import { generateDataObject, injectImgSVG } from '../../extensions/svg/utils';
import {
	getHasNativeFormat,
	setCustomFormatsWhenPaste,
} from '../../extensions/text/formats';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil, round } from 'lodash';
import DOMPurify from 'dompurify';

/**
 * Icons
 */
import { toolbarReplaceImage, placeholderImage } from '../../icons';
import CaptionToolbar from '../../components/toolbar/captionToolbar';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		const { isImageUrl } = this.props.attributes;
		this.state = {
			isExternalClass: isImageUrl,
		};

		this.textRef = createRef(null);
	}

	propsToAvoidRendering = ['formatValue'];

	typingTimeoutFormatValue = 0;

	typingTimeoutContent = 0;

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
		const { attributes, imageData, setAttributes, clientId } = this.props;
		const {
			uniqueID,
			fullWidth,
			captionType,
			captionContent,
			mediaID,
			mediaAlt,
			mediaURL,
			mediaWidth,
			mediaHeight,
			SVGElement,
			imgWidth,
			imageRatio,
			'hover-type': hoverType,
			'hover-preview': hoverPreview,
			externalUrl,
		} = attributes;
		const { isExternalClass } = this.state;

		const classes = classnames(
			'maxi-image-block',
			fullWidth === 'full' && 'alignfull'
		);

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

		const onChangeRichText = ({ value: formatValue }) => {
			/**
			 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
			 * and add some coding manually
			 * This next script will check if there is any format directly related with
			 * any native format and if it's so, will format it in Maxi Blocks way
			 */
			const hasNativeFormat = getHasNativeFormat(formatValue);

			if (hasNativeFormat) {
				const { captionContent: content } = attributes;

				const cleanCustomProps = setCustomFormatsWhenPaste({
					formatValue,
					typography: getGroupAttributes(attributes, 'typography'),
					isList: false,
					content,
					textLevel: 'p',
				});

				delete cleanCustomProps.formatValue;

				setAttributes(cleanCustomProps);
			}

			if (this.typingTimeoutFormatValue) {
				clearTimeout(this.typingTimeoutFormatValue);
			}

			this.typingTimeoutFormatValue = setTimeout(() => {
				dispatch('maxiBlocks/text').sendFormatValue(
					formatValue,
					clientId
				);
			}, 100);
		};

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
				setAttributes({ captionContent: `${newContent}</a>` });
			} else {
				if (this.typingTimeoutContent) {
					clearTimeout(this.typingTimeoutContent);
				}

				this.typingTimeoutContent = setTimeout(() => {
					setAttributes({ captionContent });
				}, 100);
			}
		};

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...(imageData && {
					altOptions: {
						wpAlt: imageData.alt_text,
						titleAlt: imageData.title.rendered,
					},
				})}
				{...this.props}
				propsToAvoid={['captionContent', 'formatValue']}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				propsToAvoid={['captionContent', 'formatValue']}
			/>,
			<MaxiBlock
				key={`maxi-image--${uniqueID}`}
				ref={this.blockRef}
				tagName='figure'
				className={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<MediaUpload
					onSelect={media => {
						setAttributes({
							mediaID: media.id,
							mediaURL: media.url,
							mediaWidth: media.width,
							mediaHeight: media.height,
							isImageUrl: false,
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

							const resData = generateDataObject('', svg);

							const SVGValue = resData;
							const el = Object.keys(SVGValue)[0];

							SVGValue[el].imageID = media.id;
							SVGValue[el].imageURL = media.url;

							const resEl = injectImgSVG(svg, resData);
							setAttributes({
								SVGElement: resEl.outerHTML,
								SVGMediaID: null,
								SVGMediaURL: null,
								SVGData: SVGValue,
							});
						}
					}}
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
												label={__(
													'Upload / Add from Media Library',
													'maxi-blocks'
												)}
												showTooltip='true'
												onClick={open}
												icon={toolbarReplaceImage}
											/>
											<ImageURL
												url={externalUrl}
												onChange={url => {
													setAttributes({
														externalUrl: url,
													});
												}}
												onSubmit={url => {
													if (isURL(url)) {
														setAttributes({
															isImageUrl: true,
															externalUrl: url,
															mediaURL: url,
														});
														this.setState({
															isExternalClass: true,
														});
													}
												}}
											/>
										</div>
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
										{captionType !== 'none' && (
											<>
												<CaptionToolbar
													key={`caption-toolbar-${uniqueID}`}
													ref={this.textRef}
													{...this.props}
													propsToAvoid={[
														'captionContent',
														'formatValue',
													]}
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
													keepPlaceholderOnFocus
													__unstableEmbedURLOnPaste
													__unstableAllowPrefixTransformations
												>
													{onChangeRichText}
												</RichText>
											</>
										)}
									</BlockResizer>
								</>
							) : (
								<div className='maxi-image-block__placeholder'>
									<Placeholder
										icon={placeholderImage}
										label=''
									/>
									<Button
										className='maxi-image-block__settings__upload-button'
										label={__(
											'Upload / Add from Media Library',
											'maxi-blocks'
										)}
										showTooltip='true'
										onClick={open}
										icon={toolbarReplaceImage}
									/>
									<ImageURL
										url={externalUrl}
										onChange={url => {
											setAttributes({
												externalUrl: url,
											});
										}}
										onSubmit={url => {
											if (isURL(url)) {
												// TODO: fetch url and check for the code and type
												setAttributes({
													isImageUrl: true,
													externalUrl: url,
													mediaURL: url,
												});
												this.setState({
													isExternalClass: true,
												});
											}
										}}
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
