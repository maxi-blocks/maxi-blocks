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
import ToolbarPopover from '../toolbar-popover';
import { generateDataObject, injectImgSVG } from '../../../../extensions/svg';

/**
 * External dependencies
 */
import DOMPurify from 'dompurify';
import { isEmpty } from 'lodash';

/**
 * Component
 */
const ToolbarMediaUpload = props => {
	const { blockName, attributes, setAttributes } = props;

	if (blockName !== 'maxi-blocks/image-maxi') return null;

	return (
		<div className='toolbar-item toolbar-item__replace-image'>
			<ToolbarPopover
				tooltip={__('Replace', 'maxi-blocks')}
				text={__('Replace', 'maxi-blocks')}
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
							setAttributes({
								SVGElement: resEl.outerHTML,
								SVGData: SVGValue,
							});
						}
					}}
					allowedTypes='image'
					value='image'
					render={({ open }) => (
						<div className='toolbar-item toolbar-item__replace-image'>
							<Button
								className='components-button'
								type='button'
								onClick={open}
							>
								{__('Upload', 'maxi-blocks')}
							</Button>
						</div>
					)}
				/>
			</ToolbarPopover>
		</div>
	);
};

export default ToolbarMediaUpload;
