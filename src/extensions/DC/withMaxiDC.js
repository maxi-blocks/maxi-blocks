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
	validationsValues,
} from './utils';
import getDCOptions from './getDCOptions';
import getDCMedia from './getDCMedia';
import getDCLink from './getDCLink';
import getDCValues from './getDCValues';
import LoopContext from './loopContext';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const withMaxiDC = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { attributes, name, setAttributes } = ownProps;

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
					contentType
				);

				if (dcOptions?.newValues || validatedAttributes) {
					const newAttributes = {
						...dcOptions?.newValues,
						...validatedAttributes,
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
					(!isNil(id) || type === 'settings') // id is not necessary for site settings
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
					const dcLink = await getDCLink(lastDynamicContentProps);
					const isSameLink = dcLink === newLinkSettings.url;

					if (
						postTaxonomyLinksStatus !== !!newLinkSettings.disabled
					) {
						newLinkSettings.disabled = postTaxonomyLinksStatus;

						updateLinkSettings = true;
					}
					if (!isSameLink && linkStatus && !isNil(dcLink)) {
						newLinkSettings.url = dcLink;

						updateLinkSettings = true;
					} else if (isSameLink && !linkStatus) {
						newLinkSettings.url = null;

						updateLinkSettings = true;
					}

					if (!isImageMaxi) {
						let newContent = await getDCContent(
							lastDynamicContentProps
						);
						const newContainsHTML =
							postTaxonomyLinksStatus &&
							type === 'posts' &&
							['categories', 'tags'].includes(field);

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
							lastDynamicContentProps
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
									'dc-media-caption': sanitizeDCContent(
										getSimpleText(caption)
									),
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
