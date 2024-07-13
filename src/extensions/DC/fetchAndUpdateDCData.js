/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';
import getDCContent from './getDCContent';
import { getSimpleText, sanitizeDCContent } from './utils';
import getDCMedia from './getDCMedia';
import getDCNewLinkSettings from './getDCNewLinkSettings';
import getDCValues from './getDCValues';
import getValidatedDCAttributes from './validateDCAttributes';
import { getUpdatedImgSVG } from '../svg';
import { inlineLinkFields } from './constants';

/**
 * External dependencies
 */
import { isEmpty, isEqual, isNil } from 'lodash';

const fetchAndUpdateDCData = async (
	attributes,
	onChange,
	contextLoop,
	contentType,
	clientId
) => {
	const dynamicContent = getGroupAttributes(attributes, 'dynamicContent');
	const dynamicContentProps = getDCValues(dynamicContent, contextLoop);

	const { status, content, type, field, id, linkTarget, containsHTML } =
		dynamicContentProps;

	if (
		status &&
		!isNil(type) &&
		!isNil(field) &&
		(!isNil(id) || ['settings', 'cart'].includes(type))
	) {
		const {
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = dispatch('core/block-editor');

		const synchronizedAttributes = await getValidatedDCAttributes(
			dynamicContentProps,
			contentType,
			contextLoop
		);
		let isSynchronizedAttributesUpdated = false;

		const lastDynamicContentProps = getDCValues(
			{ ...dynamicContent, ...synchronizedAttributes },
			contextLoop
		);
		const newLinkSettings = await getDCNewLinkSettings(
			attributes,
			lastDynamicContentProps,
			clientId
		);

		const updateAttributes = newAttributes => {
			isSynchronizedAttributesUpdated = true;
			markNextChangeAsNotPersistent();
			onChange(newAttributes);
		};

		if (contentType !== 'image') {
			let newContent = await getDCContent(
				lastDynamicContentProps,
				clientId
			);
			newContent = decodeEntities(newContent);

			const customTaxonomies = select(
				'maxiBlocks/dynamic-content'
			).getCustomTaxonomies();

			const newContainsHTML =
				linkTarget === field &&
				(inlineLinkFields.includes(field) ||
					customTaxonomies.includes(field)) &&
				!isNil(newContent);
			if (!newContainsHTML) {
				newContent = sanitizeDCContent(newContent);
			}

			if (newContent !== content) {
				updateAttributes({
					'dc-content': newContent,
					...(newLinkSettings && { linkSettings: newLinkSettings }),
					...synchronizedAttributes,
					...(newContainsHTML !== containsHTML && {
						'dc-contains-html': newContainsHTML,
					}),
				});
			} else if (
				newLinkSettings &&
				!isEqual(attributes.linkSettings, newLinkSettings)
			) {
				updateAttributes({
					linkSettings: newLinkSettings,
					...synchronizedAttributes,
				});
			}
		} else {
			const mediaContent = await getDCMedia(
				lastDynamicContentProps,
				clientId
			);
			if (isNil(mediaContent)) {
				updateAttributes({
					'dc-media-id': null,
					'dc-media-url': null,
					...(newLinkSettings && { linkSettings: newLinkSettings }),
					...synchronizedAttributes,
				});
			} else {
				const { id, url, caption } = mediaContent;
				if (!isNil(id) || !isNil(url)) {
					updateAttributes({
						'dc-media-id': id,
						'dc-media-url': url,
						...getUpdatedImgSVG(
							attributes.uniqueID,
							attributes.SVGData,
							attributes.SVGElement,
							mediaContent
						),
						...(caption && {
							'dc-media-caption': sanitizeDCContent(
								getSimpleText(caption)
							),
						}),
						...(newLinkSettings && {
							linkSettings: newLinkSettings,
						}),
						...synchronizedAttributes,
					});
				}
			}
		}

		if (
			!isSynchronizedAttributesUpdated &&
			!isEmpty(synchronizedAttributes)
		) {
			markNextChangeAsNotPersistent();
			onChange(synchronizedAttributes);
		}
	}
};

export default fetchAndUpdateDCData;
