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

				const previewDictionary = {
					accordion: 'accordion_preview',
					button: 'button_preview',
					container: 'container_preview',
					row: 'row_preview',
					divider: 'divider_preview',
					group: 'group_preview',
					'svg-icon': 'icon_preview',
					image: 'image_preview',
					map: 'map_preview',
					'number-counter': 'nc_preview',
					search: 'search_preview',
					slider: 'slider_preview',
					library: 'library_preview',
					text: 'text_preview',
					video: 'video_preview',
					pane: 'pane_preview',
					slide: 'slide_preview',
				};

				return (
					<div>
						<img // eslint-disable-next-line no-undef
							src={previews[previewDictionary[blockName]]}
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
