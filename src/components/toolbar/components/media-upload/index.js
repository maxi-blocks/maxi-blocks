/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { MediaUpload } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import DOMPurify from 'dompurify';
// import Icon from '../../../icon';
import { generateDataObject, injectImgSVG } from '../../../../extensions/svg';
import { isEmpty } from 'lodash';

/**
 * Icons
 */
// import { toolbarDelete } from '../../../../icons';

/**
 * Delete
 */
const ToolbarMediaUpload = props => {
	const { blockName, attributes, setAttributes } = props;

	if (blockName !== 'maxi-blocks/image-maxi') return null;

	// const { removeBlock } = useDispatch('core/block-editor');

	return (
		<MediaUpload
			onSelect={media => {
				setAttributes({
					mediaID: media.id,
					mediaURL: media.url,
					mediaWidth: media.width,
					mediaHeight: media.height,
					isImageUrl: false,
				});

				const newLocal = this;
				newLocal.setState({
					isExternalClass: false,
				});

				if (!isEmpty(attributes.SVGData)) {
					const cleanedContent = DOMPurify.sanitize(SVGElement);

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
				<Button type='button' onClick={open}>
					Replace
				</Button>
			)}
		/>
	);
};

export default ToolbarMediaUpload;
