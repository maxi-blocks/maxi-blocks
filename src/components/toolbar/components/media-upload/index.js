/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { MediaUpload } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import { injectImgSVG } from '../../../../extensions/svg';

/**
 * External dependencies
 */
import DOMPurify from 'dompurify';
import { isEmpty, uniqueId } from 'lodash';

const ALLOWED_BLOCKS = [
	'maxi-blocks/image-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/video-maxi',
];

const UploadButton = ({ onClick }) => (
	<div className='toolbar-item toolbar-item__replace-image'>
		<Button className='components-button' type='button' onClick={onClick}>
			{__('Upload', 'maxi-blocks')}
		</Button>
	</div>
);

/**
 * Component
 */
const ToolbarMediaUpload = props => {
	const {
		blockName,
		attributes,
		maxiSetAttributes,
		prefix = '',
		onModalOpen,
	} = props;
	const {
		[`${prefix}mediaID`]: mediaID,
		[`${prefix}altSelector`]: altSelector,
		playerType,
		hideImage,
		uniqueID,
	} = attributes;

	if (
		!ALLOWED_BLOCKS.includes(blockName) ||
		playerType === 'video' ||
		hideImage
	)
		return null;

	const isIcon = blockName === 'maxi-blocks/svg-icon-maxi';

	return (
		<div className='toolbar-item toolbar-item__replace-image'>
			{isIcon && <UploadButton onClick={onModalOpen} />}
			{!isIcon && (
				<MediaUpload
					onSelect={media => {
						const alt =
							(altSelector === 'wordpress' && media?.alt) ||
							(altSelector === 'title' && media?.title) ||
							null;

						maxiSetAttributes({
							[`${prefix}mediaID`]: media.id,
							[`${prefix}mediaURL`]: media.url,
							[`${prefix}mediaWidth`]: media.width,
							[`${prefix}mediaHeight`]: media.height,
							[`${prefix}isImageUrl`]: false,
							...(altSelector === 'wordpress' &&
								!alt && { altSelector: 'title' }),
							[`${prefix}mediaAlt`]:
								altSelector === 'wordpress' && !alt
									? media.title
									: alt,
						});

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
					render={({ open }) => <UploadButton onClick={open} />}
				/>
			)}
		</div>
	);
};

export default ToolbarMediaUpload;
