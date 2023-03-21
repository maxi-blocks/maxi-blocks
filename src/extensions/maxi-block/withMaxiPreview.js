/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent, pure } from '@wordpress/compose';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

const withMaxiPreview = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { attributes } = ownProps;

			if (attributes.preview) {
				const blockName = ownProps.name
					.replace('maxi-blocks/', '')
					.replace('-maxi', '');

				return (
					<div>
						<img // eslint-disable-next-line no-undef
							src={previews.group_preview}
							alt={__(
								`${capitalize(blockName)} block preview`,
								'maxi-blocks'
							)}
						/>
					</div>
				);
			}

			return <WrappedComponent {...ownProps} />;
		}),
	'withMaxiPreview'
);

export default withMaxiPreview;
