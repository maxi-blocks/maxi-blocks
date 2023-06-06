/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useEffect, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../attributes';
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
				'dc.s': status,
				dc_c: content,
				dc_ty: type,
				dc_f: field,
				dc_id: id,
				dc_cd: isCustomDate,
				'dc_l.s': linkStatus,
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

					const newLinkSettings = ownProps.attributes._lse ?? {};
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
								dc_c: newContent,
								...(isCustomDate && {
									dc_cfo: getDCDateCustomFormat(newContent),
								}),
								...(updateLinkSettings && {
									_lse: newLinkSettings,
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
								dc_mid: null,
								dc_mur: null,
								...(updateLinkSettings && {
									_lse: newLinkSettings,
								}),
							});
						} else {
							const { id, url, caption } = mediaContent;

							if (!isNil(id) && !isNil(url)) {
								markNextChangeAsNotPersistent();
								setAttributes({
									dc_mid: id,
									dc_mur: url,
									dc_mc: sanitizeDCContent(
										getSimpleText(caption)
									),
									...(updateLinkSettings && {
										_lse: newLinkSettings,
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
