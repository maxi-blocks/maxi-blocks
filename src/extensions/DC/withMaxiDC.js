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
} from './utils';
import getDCOptions from './getDCOptions';
import getDCMedia from './getDCMedia';
import getDCLink from './getDCLink';

/**
 * External dependencies
 */
import { isNil, isObject } from 'lodash';
import loopContext from './loopContext';
import getDCValues from './getDCValues';

const withMaxiDC = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { setAttributes, attributes } = ownProps;

			const contextLoop = useContext(loopContext)?.contextLoop;

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

			const { status, content, type, field, id, customDate, linkStatus } =
				dynamicContentProps;

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
					'text'
				);

				if (dcOptions?.newValues) {
					const {
						__unstableMarkNextChangeAsNotPersistent:
							markNextChangeAsNotPersistent,
					} = dispatch('core/block-editor');

					markNextChangeAsNotPersistent();
					setAttributes(dcOptions.newValues);
				}

				fetchDcData().catch(console.error);
			}, [fetchDcData, Object.values(dynamicContentProps)]);

			return <WrappedComponent {...ownProps} />;
		}),
	'withMaxiDC'
);

export default withMaxiDC;
