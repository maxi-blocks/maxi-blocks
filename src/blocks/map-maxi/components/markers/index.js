/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { Button } from '../../../../components';
import { getAttributesValue } from '../../../../extensions/attributes';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const Markers = props => {
	const { attributes, maxiSetAttributes, setIsDraggingMarker } = props;
	const [mapMarkerHeadingLevel, mapMarkerIcon, mapMarkers] =
		getAttributesValue({
			target: ['m_mhl', 'm_mic', 'm_mar'],
			props: attributes,
		});

	if (isEmpty(mapMarkers)) return null;

	const markerIcon = L.divIcon({
		html: mapMarkerIcon,
		iconSize: [null, null],
	});

	const handleRemoveMarker = (event, index) => {
		event.stopPropagation();

		const updatedMarkers = [...mapMarkers];
		updatedMarkers.splice(index, 1);
		maxiSetAttributes({
			m_mar: updatedMarkers,
		});
	};

	const updateMarkers = updatedMarkers => {
		maxiSetAttributes({
			m_mar: updatedMarkers,
		});
	};

	return mapMarkers.map((marker, index) => {
		const { id, latitude, longitude } = marker;

		return (
			<Marker
				position={[latitude, longitude]}
				key={id}
				icon={markerIcon}
				draggable
				eventHandlers={{
					dragstart: () => {
						setIsDraggingMarker(true);
					},
					dragend: event => {
						const { lat, lng } = event.target._latlng;

						const updatedMarkers = [...mapMarkers];
						updatedMarkers[index] = {
							...updatedMarkers[index],
							latitude: lat,
							longitude: lng,
						};

						updateMarkers(updatedMarkers);
						setIsDraggingMarker(false);
					},
					mouseover: () => {
						setIsDraggingMarker(true);
					},
				}}
			>
				<Popup closeIcon='trash'>
					<div className='maxi-map-block__popup'>
						<div className='maxi-map-block__popup__content'>
							<RichText
								className='maxi-map-block__popup__content__title'
								value={marker.heading}
								tagName={mapMarkerHeadingLevel}
								onChange={content => {
									const updatedMarkers = [...mapMarkers];
									updatedMarkers[index].heading = content;

									updateMarkers(updatedMarkers);
								}}
								placeholder={__('Title', 'maxi-blocks')}
								withoutInteractiveFormatting
							/>
							<RichText
								className='maxi-map-block__popup__content__description'
								value={marker.description}
								onChange={content => {
									const updatedMarkers = [...mapMarkers];
									updatedMarkers[index].description = content;

									updateMarkers(updatedMarkers);
								}}
								placeholder={__('Description', 'maxi-blocks')}
								withoutInteractiveFormatting
								tagName='p'
							/>
							<div className='maxi-map-block__popup__content__marker-remove'>
								<Button
									icon='trash'
									label={__(
										'Remove this marker',
										'maxi-blocks'
									)}
									onClick={event =>
										handleRemoveMarker(event, index)
									}
									showTooltip
								/>
							</div>
						</div>
					</div>
				</Popup>
			</Marker>
		);
	});
};

export default Markers;
