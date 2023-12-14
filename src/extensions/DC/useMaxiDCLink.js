/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';
import getDCNewLinkSettings from './getDCNewLinkSettings';
import getDCValues from './getDCValues';

const useMaxiDCLink = (
	attributes,
	clientId,
	contextLoopContext,
	setAttributes
) => {
	const { 'dc-link-status': dcLinkStatus } = attributes;
	const contextLoop = contextLoopContext?.contextLoop;
	const shouldUpdateLink = dcLinkStatus && contextLoop;

	useEffect(() => {
		if (!shouldUpdateLink) return;

		const dynamicContent = getGroupAttributes(attributes, 'dynamicContent');
		const dynamicContentProps = getDCValues(dynamicContent, contextLoop);

		const updateLinkSettings = async () => {
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
		};

		updateLinkSettings();
	}, [attributes, clientId, contextLoop, shouldUpdateLink, setAttributes]);
};

export default useMaxiDCLink;
