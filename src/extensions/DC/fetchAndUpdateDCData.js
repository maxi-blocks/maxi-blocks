/**
 * WordPress dependencies
 */
import { dispatch, select, resolveSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '@extensions/styles';
import getDCContent from './getDCContent';
import { getSimpleText, sanitizeDCContent } from './utils';
import getDCMedia from './getDCMedia';
import getDCNewLinkSettings from './getDCNewLinkSettings';
import getDCValues from './getDCValues';
import getValidatedDCAttributes from './validateDCAttributes';
import { getUpdatedImgSVG } from '@extensions/svg';
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

	if (!dynamicContent?.['dc-status'] && !contextLoop?.['cl-status']) return;

	const dynamicContentProps = getDCValues(dynamicContent, contextLoop);

	const { content, type, field, id, linkTarget, containsHTML } =
		dynamicContentProps;

	// Check if the type is a custom taxonomy and validate ID
	const customTaxonomies = select(
		'maxiBlocks/dynamic-content'
	).getCustomTaxonomies();

	if (customTaxonomies.includes(type) && id) {
		// Fetch valid terms for this taxonomy
		try {
			// Recursive function to fetch all terms
			const fetchAllTerms = async (page = 1, accumulator = []) => {
				const terms = await resolveSelect('core').getEntityRecords(
					'taxonomy',
					type,
					{
						per_page: 100,
						page,
						hide_empty: false,
					}
				);

				// If no terms or empty array, return accumulated results
				if (!terms || terms.length === 0) {
					return accumulator;
				}

				// Combine current results with accumulator
				const updatedResults = [...accumulator, ...terms];

				// If we received fewer terms than requested, we've reached the end
				if (terms.length < 100) {
					return updatedResults;
				}

				// Otherwise, fetch the next page
				return fetchAllTerms(page + 1, updatedResults);
			};

			// Get all terms
			const allTerms = await fetchAllTerms();

			// Check if the current ID exists in the taxonomy
			const validTerm = allTerms.find(term => term.id === Number(id));

			// If ID doesn't exist in this taxonomy, reset it
			if (!validTerm && allTerms.length > 0) {
				// Update with the first available term ID
				const newId = allTerms[0].id;
				onChange({
					'dc-id': newId,
				});

				// Update the dynamicContentProps with the new ID
				dynamicContentProps.id = newId;
			}
		} catch (error) {
			// Silent error handling
		}
	}

	if (
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
				clientId,
				contentType
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
					...(newLinkSettings !== null &&
						newLinkSettings?.url !== null && {
							linkSettings: newLinkSettings,
						}),
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
					...(newLinkSettings !== null &&
						newLinkSettings?.url !== null && {
							linkSettings: newLinkSettings,
						}),
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
						...(newLinkSettings !== null &&
							newLinkSettings?.url !== null && {
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
