/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useEffect, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';
import getDCContent from './getDCContent';
import {
	getDCDateCustomFormat,
	getSimpleText,
	sanitizeDCContent,
} from './utils';
import getDCMedia from './getDCMedia';
import getDCLink from './getDCLink';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const withMaxiDC = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { setAttributes, attributes } = ownProps;

			const isImageMaxi = ownProps.name === 'maxi-blocks/image-maxi';

			const dynamicContentProps = getGroupAttributes(
				attributes,
				'dynamicContent'
			);

			const {
				'dc-status': status,
				'dc-content': content,
				'dc-type': type,
				'dc-field': field,
				'dc-id': id,
				'dc-custom-date': isCustomDate,
				'dc-link-status': linkStatus,
				'dc-post-taxonomy-links-status': postTaxonomyLinksStatus,
				'dc-contains-html': containsHTML,
			} = dynamicContentProps;

			const fetchDcData = useCallback(async () => {
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

					const newLinkSettings =
						ownProps.attributes.linkSettings ?? {};
					let updateLinkSettings = false;
					const dcLink = await getDCLink(dynamicContentProps);
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
							dynamicContentProps
						);
						const newContainsHTML =
							postTaxonomyLinksStatus &&
							type === 'posts' &&
							['categories', 'tags'].includes(field);

						if (!newContainsHTML) {
							newContent = sanitizeDCContent(newContent);
						}

						if (newContent !== content) {
							markNextChangeAsNotPersistent();
							setAttributes({
								'dc-content': newContent,
								...(isCustomDate && {
									'dc-custom-format':
										getDCDateCustomFormat(newContent),
								}),
								...(updateLinkSettings && {
									linkSettings: newLinkSettings,
								}),
								...(newContainsHTML !== containsHTML && {
									'dc-contains-html': newContainsHTML,
								}),
							});
						}
					} else {
						const mediaContent = await getDCMedia(
							dynamicContentProps
						);

						if (isNil(mediaContent)) {
							markNextChangeAsNotPersistent();
							setAttributes({
								'dc-media-id': null,
								'dc-media-url': null,
								...(updateLinkSettings && {
									linkSettings: newLinkSettings,
								}),
							});
						} else {
							const { id, url, caption } = mediaContent;

							if (!isNil(id) && !isNil(url)) {
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
								});
							}
						}
					}
				}
			});

			useEffect(() => {
				fetchDcData().catch(console.error);
			}, [fetchDcData]);

			return <WrappedComponent {...ownProps} />;
		}),
	'withMaxiDC'
);

export default withMaxiDC;
