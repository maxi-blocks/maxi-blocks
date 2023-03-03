/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';

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

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import getDCMedia from './getDCMedia';

const withMaxiDC = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { maxiSetAttributes, attributes } = ownProps;

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
			} = dynamicContentProps;

			useEffect(async () => {
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

					if (!isImageMaxi) {
						const newContent = sanitizeDCContent(
							await getDCContent(dynamicContentProps)
						);

						if (newContent !== content) {
							markNextChangeAsNotPersistent();
							maxiSetAttributes({
								'dc-content': newContent,
								...(isCustomDate && {
									'dc-custom-format':
										getDCDateCustomFormat(newContent),
								}),
							});
						}
					} else {
						const mediaContent = await getDCMedia(
							dynamicContentProps
						);

						if (isNil(mediaContent)) {
							markNextChangeAsNotPersistent();
							maxiSetAttributes({
								'dc-media-id': null,
								'dc-media-url': null,
							});
						} else {
							const { id, url, caption } = mediaContent;

							if (!isNil(id) && !isNil(url)) {
								markNextChangeAsNotPersistent();
								maxiSetAttributes({
									'dc-media-id': id,
									'dc-media-url': url,
									'dc-media-caption': sanitizeDCContent(
										getSimpleText(caption)
									),
								});
							}
						}
					}
				}
			});

			return <WrappedComponent {...ownProps} />;
		}),
	'withMaxiDC'
);

export default withMaxiDC;
