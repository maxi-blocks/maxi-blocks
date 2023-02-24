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
import { getDCDateCustomFormat, sanitizeDCContent } from './utils';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const withMaxiDC = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { maxiSetAttributes, attributes } = ownProps;

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
					const newContent = sanitizeDCContent(
						await getDCContent(dynamicContentProps)
					);

					if (newContent !== content) {
						const {
							__unstableMarkNextChangeAsNotPersistent:
								markNextChangeAsNotPersistent,
						} = dispatch('core/block-editor');

						markNextChangeAsNotPersistent();
						maxiSetAttributes({
							'dc-content': newContent,
							...(isCustomDate && {
								'dc-custom-format':
									getDCDateCustomFormat(newContent),
							}),
						});
					}
				}
			});

			return <WrappedComponent {...ownProps} />;
		}),
	'withMaxiDC'
);

export default withMaxiDC;
