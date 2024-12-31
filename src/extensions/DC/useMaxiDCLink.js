/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '@extensions/styles';
import getDCNewLinkSettings from './getDCNewLinkSettings';
import getDCValues from './getDCValues';
import DC_LINK_BLOCKS from '@components/toolbar/components/link/dcLinkBlocks';

const useMaxiDCLink = (
	blockName,
	attributes,
	clientId,
	contextLoopContext,
	setAttributes
) => {
	const { 'dc-link-status': dcLinkStatus } = attributes;
	const contextLoop = contextLoopContext?.contextLoop;
	const shouldUpdateLink = dcLinkStatus && contextLoop;

	useEffect(() => {
		if (!DC_LINK_BLOCKS.includes(blockName) || !shouldUpdateLink) return;

		const dynamicContent = getGroupAttributes(attributes, 'dynamicContent');
		const dynamicContentProps = getDCValues(dynamicContent, contextLoop);

		const updateLinkSettings = async () => {
			try {
				const newLinkSettings = await getDCNewLinkSettings(
					attributes,
					dynamicContentProps,
					clientId
				);
				if (newLinkSettings) {
					dispatch(
						'core/block-editor'
					).__unstableMarkNextChangeAsNotPersistent();

					setAttributes({ linkSettings: newLinkSettings });
				}
			} catch (e) {
				console.error(e);
			}
		};

		updateLinkSettings();
	}, [
		blockName,
		attributes,
		clientId,
		contextLoop,
		shouldUpdateLink,
		setAttributes,
	]);
};

export default useMaxiDCLink;
