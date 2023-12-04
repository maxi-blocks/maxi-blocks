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
import Dropdown from '../../../dropdown';
import ImageURLUpload from '../../../image-url-upload';
import { injectImgSVG } from '../../../../extensions/svg';

/**
 * External dependencies
 */
import DOMPurify from 'dompurify';
import { isEmpty, uniqueId } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const ALLOWED_BLOCKS = [
	'maxi-blocks/image-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/video-maxi',
];

const UploadButton = ({ onClick }) => (
	<Button
		className='toolbar-item__replace-image__button'
		type='button'
		onClick={onClick}
	>
		{__('Upload', 'maxi-blocks')}
	</Button>
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
				<Dropdown
					className='maxi-replace-image__settings-selector'
					contentClassName='maxi-replace-image__popover maxi-more-settings__popover'
					position='right bottom'
					popoverProps={{
						useShift: true,
					}}
					renderToggle={({ onToggle }) => (
						<UploadButton onClick={onToggle} />
					)}
					renderContent={args => (
						<div>
							<MediaUpload
								onSelect={media => {
									const alt =
										(altSelector === 'wordpress' &&
											media?.alt) ||
										(altSelector === 'title' &&
											media?.title) ||
										null;

									maxiSetAttributes({
										[`${prefix}mediaID`]: media.id,
										[`${prefix}mediaURL`]: media.url,
										[`${prefix}mediaWidth`]: media.width,
										[`${prefix}mediaHeight`]: media.height,
										[`${prefix}isImageUrl`]: false,
										...(altSelector === 'wordpress' &&
											!alt && {
												altSelector: 'title',
											}),
										[`${prefix}mediaAlt`]:
											altSelector === 'wordpress' && !alt
												? media.title
												: alt,
									});

									if (!isEmpty(attributes.SVGData)) {
										const cleanedContent =
											DOMPurify.sanitize(
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

										const resEl = injectImgSVG(
											svg,
											resData
										);
										maxiSetAttributes({
											SVGElement: resEl.outerHTML,
											SVGData: SVGValue,
										});
									}
								}}
								allowedTypes='image'
								value={mediaID}
								render={({ open }) => (
									<Button onClick={open}>
										{__(
											'Upload from media library',
											'maxi-blocks'
										)}
									</Button>
								)}
							/>
							<Dropdown
								className='toolbar-item__url-upload'
								contentClassName='maxi-dropdown__child-content maxi-dropdown__url-upload-content'
								position='bottom right'
								renderToggle={({ isOpen, onToggle }) => (
									<Button onClick={onToggle}>
										{__('Upload from URL', 'maxi-blocks')}
									</Button>
								)}
								renderContent={() => (
									<div className='maxi-dropdown__url-upload-content__inner'>
										<ImageURLUpload
											attributes={attributes}
											prefix={prefix}
											newStyle={false}
											onChange={maxiSetAttributes}
										/>
									</div>
								)}
							/>
						</div>
					)}
				/>
			)}
		</div>
	);
};

export default ToolbarMediaUpload;
