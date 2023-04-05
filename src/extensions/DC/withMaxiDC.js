/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
} from '@wordpress/element';

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
import { getBlockData } from '../attributes';

/**
 * External dependencies
 */
import { isNil, isObject } from 'lodash';
import LoopContext from './LoopContext';
import getDCValues from './getDCValues';

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

			const dynamicContentProps = useMemo(
				() => getDCValues(dynamicContent, contextLoop),
				[
					Object.values(dynamicContent),
					isObject(contextLoop) ? Object.values(contextLoop) : [],
				]
			);

			const {
				status,
				content,
				type,
				field,
				id,
				customDate,
				linkStatus,
				postTaxonomyLinksStatus,
			} = dynamicContentProps;

			const contentType = useMemo(
				() => getBlockData(name)?.dcContentType,
				[]
			);

			const fetchDcData = useCallback(async dynamicContentProps => {
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
						const newContent = sanitizeDCContent(
							await getDCContent(dynamicContentProps)
						);

						if (newContent !== content) {
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

			useEffect(async () => {
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
					contentType,
					true
				);

				if (dcOptions?.newValues || validatedAttributes) {
					const {
						__unstableMarkNextChangeAsNotPersistent:
							markNextChangeAsNotPersistent,
					} = dispatch('core/block-editor');

					markNextChangeAsNotPersistent();
					setAttributes({
						...dcOptions?.newValues,
						...validatedAttributes,
					});
				}

				fetchDcData(
					getDCValues(
						{ ...dynamicContent, ...dcOptions?.newValues },
						contextLoop
					)
				).catch(console.error);
			}, [fetchDcData, Object.values(dynamicContentProps)]);

			return <WrappedComponent {...ownProps} />;
		}),
	'withMaxiDC'
);

export default withMaxiDC;
