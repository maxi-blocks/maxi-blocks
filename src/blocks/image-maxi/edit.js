/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { MediaUpload } from '@wordpress/block-editor';
import { createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import getStyles from './styles';
import Inspector from './inspector';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import {
	BlockResizer,
	Button,
	HoverPreview,
	MaxiBlockComponent,
	Toolbar,
	Spinner,
	Placeholder,
	RawHTML,
} from '../../components';
import * as SVGShapes from '../../icons/shape-icons';
import { generateDataObject, injectImgSVG } from '../../extensions/svg/utils';

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

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.imgRef = createRef();
		this.setImgRef = ref => {
			this.imgRef.current = ref;
			this.forceUpdate();
		};
	}

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
			parentBlockStyle,
			'hover-type': hoverType,
			'hover-preview': hoverPreview,
		} = attributes;

		const classes = classnames(
			'maxi-image-block',
			fullWidth === 'full' && 'alignfull'
		);

		const wrapperClassName = classnames(
			'maxi-image-block-wrapper',
			'maxi-image-ratio',
			`maxi-image-ratio__${imageRatio}`
		);

		const paletteClasses = getPaletteClasses(
			attributes,
			[
				'background',
				'background-hover',
				'hover-background',
				'svg-background',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
				'typography',
				'typography-hover',
			],
			'maxi-blocks/image-maxi',
			parentBlockStyle
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
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
			/>,
			<MaxiBlock
				key={`maxi-image--${uniqueID}`}
				ref={this.blockRef}
				tagName='figure'
				className={classes}
				paletteClasses={paletteClasses}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<MediaUpload
					onSelect={media => {
						setAttributes({
							mediaID: media.id,
							mediaURL: media.url,
							mediaWidth: media.width,
							mediaHeight: media.height,
						});

						if (!isEmpty(attributes.SVGData)) {
							const currentElem =
								SVGShapes[
									Object.keys(SVGShapes)[
										attributes.SVGCurrentElement
									]
								];

							const cleanedContent =
								DOMPurify.sanitize(currentElem);
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
								SVGCurrentElement: attributes.SVGCurrentElement,
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
												showTooltip='true'
												onClick={open}
												icon={toolbarReplaceImage}
											/>
										</div>
										<HoverPreview
											key={`hover-preview-${uniqueID}`}
											target={this.imgRef?.current}
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
												<RawHTML ref={this.setImgRef}>
													{SVGElement}
												</RawHTML>
											) : (
												<img
													ref={this.setImgRef}
													className={`maxi-image-block__image wp-image-${mediaID}`}
													src={mediaURL}
													width={mediaWidth}
													height={mediaHeight}
													alt={mediaAlt}
												/>
											)}
										</HoverPreview>
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
