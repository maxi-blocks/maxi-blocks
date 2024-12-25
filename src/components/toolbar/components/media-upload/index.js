/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { MediaUpload } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Dropdown from '@components/dropdown';
import ImageUrlUpload from '@components/image-url-upload';
import { getUpdatedImgSVG } from '@extensions/svg';

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
		{__('Insert', 'maxi-blocks')}
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
		'dc-status': dcStatus,
	} = attributes;
	const isIcon = blockName === 'maxi-blocks/svg-icon-maxi';

	if (
		!ALLOWED_BLOCKS.includes(blockName) ||
		(dcStatus && !isIcon) ||
		playerType === 'video' ||
		hideImage
	)
		return null;

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
								isImageUrl={attributes[`${prefix}isImageUrl`]}
								onSelect={media => {
									args.onClose();

									const alt =
										(altSelector === 'wordpress' &&
											media?.alt) ||
										(altSelector === 'title' &&
											media?.title) ||
										null;

									const updatedSVGAttributes =
										getUpdatedImgSVG(
											uniqueID,
											attributes.SVGData,
											attributes.SVGElement,
											media
										);

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
										...updatedSVGAttributes,
									});
								}}
								allowedTypes='image'
								value={mediaID}
								render={({ open }) => (
									<Button onClick={open}>
										{__(
											'From media library',
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
										{__('From URL', 'maxi-blocks')}
									</Button>
								)}
								renderContent={() => (
									<div className='maxi-dropdown__url-upload-content__inner'>
										<ImageUrlUpload
											attributes={attributes}
											prefix={prefix}
											newStyle={false}
											onChange={imageData =>
												maxiSetAttributes({
													[`${prefix}mediaID`]:
														imageData.id,
													[`${prefix}mediaURL`]:
														imageData.url,
													[`${prefix}mediaWidth`]:
														imageData.width,
													[`${prefix}mediaHeight`]:
														imageData.height,
													[`${prefix}isImageUrl`]: true,
													[`${prefix}isImageUrlInvalid`]:
														!!imageData.isImageUrlInvalid,
												})
											}
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
