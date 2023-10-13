/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useCallback, useContext, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';
import getDCContent from './getDCContent';
import {
	getDCDateCustomFormat,
	getSimpleText,
	sanitizeDCContent,
	validateRelations,
	validationsValues,
} from './utils';
import getDCOptions from './getDCOptions';
import getDCMedia from './getDCMedia';
import getDCLink from './getDCLink';
import getDCValues from './getDCValues';
import LoopContext from './loopContext';
import { linkFields } from './constants';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const withMaxiDC = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { attributes, name, setAttributes, clientId } = ownProps;

			const contextLoop = useContext(LoopContext)?.contextLoop;

			const isImageMaxi = ownProps.name === 'maxi-blocks/image-maxi';

			const dynamicContent = getGroupAttributes(
				attributes,
				'dynamicContent'
			);

			const dynamicContentProps = getDCValues(
				dynamicContent,
				contextLoop
			);

			const {
				relation,
				status,
				source,
				content,
				type,
				field,
				id,
				customDate,
				linkStatus,
				postTaxonomyLinksStatus,
				containsHTML,
			} = dynamicContentProps;

			const contentType = name
				.replace(/maxi-blocks\//, '')
				.replace(/-maxi/, '');

			/**
			 * Synchronize attributes between context loop and dynamic content.
			 */
			const getSynchronizedDCAttributes = useCallback(async () => {
				const dcOptions = await getDCOptions(
					dynamicContentProps,
					dynamicContentProps.id,
					contentType,
					false,
					contextLoop
				);
				const validatedAttributes = validationsValues(
					type,
					field,
					relation,
					contentType,
					source
				);
				const validatedRelations = validateRelations(type, relation);

				if (
					dcOptions?.newValues ||
					validatedAttributes ||
					validatedRelations
				) {
					const newAttributes = {
						...dcOptions?.newValues,
						...validatedAttributes,
						...validatedRelations,
					};

					const {
						__unstableMarkNextChangeAsNotPersistent:
							markNextChangeAsNotPersistent,
					} = dispatch('core/block-editor');

					markNextChangeAsNotPersistent();
					setAttributes(newAttributes);

					return newAttributes;
				}

				return null;
			}, [dynamicContentProps, contextLoop]);

			const fetchAndUpdateDCData = useCallback(async () => {
				if (
					status &&
					!isNil(type) &&
					!isNil(field) &&
					(!isNil(id) || ['settings', 'cart'].includes(type)) // id is not necessary for site settings
				) {
					const {
						__unstableMarkNextChangeAsNotPersistent:
							markNextChangeAsNotPersistent,
					} = dispatch('core/block-editor');

					const synchronizedAttributes =
						getSynchronizedDCAttributes();
					let isSynchronizedAttributesUpdated = false;

					const lastDynamicContentProps = getDCValues(
						{
							...dynamicContent,
							...synchronizedAttributes,
						},
						contextLoop
					);

					const newLinkSettings =
						ownProps.attributes.linkSettings ?? {};
					let updateLinkSettings = false;
					const dcLink = await getDCLink(
						lastDynamicContentProps,
						clientId
					);
					const isSameLink = dcLink === newLinkSettings.url;

					if (
						postTaxonomyLinksStatus !== !!newLinkSettings.disabled
					) {
						newLinkSettings.disabled = postTaxonomyLinksStatus;

						updateLinkSettings = true;
					}
					if (!isSameLink && linkStatus && !isNil(dcLink)) {
						newLinkSettings.url = dcLink;
						newLinkSettings.title = dcLink;

						updateLinkSettings = true;
					} else if (isSameLink && !linkStatus) {
						newLinkSettings.url = null;
						newLinkSettings.title = null;

						updateLinkSettings = true;
					}

					if (!isImageMaxi) {
						let newContent = await getDCContent(
							lastDynamicContentProps,
							clientId
						);
						const newContainsHTML =
							postTaxonomyLinksStatus &&
							['posts', 'products'].includes(type) &&
							linkFields.includes(field);

						if (!newContainsHTML) {
							newContent = sanitizeDCContent(newContent);
						}

						if (newContent !== content) {
							isSynchronizedAttributesUpdated = true;

							markNextChangeAsNotPersistent();
							setAttributes({
								'dc-content': newContent,
								...(customDate && {
									'dc-custom-format':
										getDCDateCustomFormat(newContent),
								}),
								...(updateLinkSettings && {
									linkSettings: newLinkSettings,
								}),
								...synchronizedAttributes,
								...(newContainsHTML !== containsHTML && {
									'dc-contains-html': newContainsHTML,
								}),
							});
						}
					} else {
						const mediaContent = await getDCMedia(
							lastDynamicContentProps,
							clientId
						);

						if (isNil(mediaContent)) {
							isSynchronizedAttributesUpdated = true;

							markNextChangeAsNotPersistent();
							setAttributes({
								'dc-media-id': null,
								'dc-media-url': null,
								...(updateLinkSettings && {
									linkSettings: newLinkSettings,
								}),
								...synchronizedAttributes,
							});
						} else {
							const { id, url, caption } = mediaContent;

							if (!isNil(id) && !isNil(url)) {
								isSynchronizedAttributesUpdated = true;

								markNextChangeAsNotPersistent();
								setAttributes({
									'dc-media-id': id,
									'dc-media-url': url,
									...(caption && {
										'dc-media-caption': sanitizeDCContent(
											getSimpleText(caption)
										),
									}),
									...(updateLinkSettings && {
										linkSettings: newLinkSettings,
									}),
									...synchronizedAttributes,
								});
							}
						}
					}

					if (
						!isSynchronizedAttributesUpdated &&
						synchronizedAttributes
					) {
						markNextChangeAsNotPersistent();
						setAttributes(synchronizedAttributes);
					}
				}
			});

			useEffect(() => {
				fetchAndUpdateDCData().catch(console.error);
			}, [fetchAndUpdateDCData, dynamicContentProps]);

			return <WrappedComponent {...ownProps} />;
		}),
	'withMaxiDC'
);

export default withMaxiDC;
