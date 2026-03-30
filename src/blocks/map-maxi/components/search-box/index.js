/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getNewMarker, getUpdatedMarkers } from '@blocks/map-maxi/utils';
import { Button, TextInput } from '@components';

/**
 * External dependencies
 */
import { useMap } from 'react-leaflet';

const SearchBox = ({ mapMarkers, maxiSetAttributes }) => {
	const map = useMap();

	const [keywords, setKeywords] = useState('');
	const [searchResults, setSearchResults] = useState();

	const findMarkers = async keywords => {
		if (keywords && keywords.length > 2) {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?q=${keywords}&format=json`
			);

			if (response.status !== 200) {
				return;
			}

			const data = await response.json();

			setSearchResults(data);
		}
	};

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			findMarkers(keywords);
		}
	};

	const clearSearchBox = () => {
		setSearchResults([]);
		setKeywords('');
	};

	const handleButtonClick = () => {
		if (searchResults && searchResults.length) {
			clearSearchBox();
		} else {
			findMarkers(keywords);
		}
	};

	const handleAddMarker = index => {
		const { lat, lon } = searchResults[index];

		// Nominatim returns lat/lon as strings – parse to numbers so Leaflet
		// receives the exact same value that gets stored in the marker attribute.
		const latitude = parseFloat(lat);
		const longitude = parseFloat(lon);

		const newMarker = getNewMarker([latitude, longitude], mapMarkers);

		// Use setView (no animation) instead of flyTo so the editor does not
		// trigger a multi-second fly animation.  This also makes e2e tests
		// deterministic – flyTo caused timing issues when tests tried to click
		// the newly placed marker before the animation had finished.
		map.setView([latitude, longitude], map.getZoom(), { animate: false });

		maxiSetAttributes({
			'map-markers': getUpdatedMarkers(mapMarkers, newMarker),
		});

		clearSearchBox();
	};

	const renderResultsList = () => {
		return searchResults.map((item, index) => {
			const { display_name: displayName, place_id: placeId } = item;

			return (
				<Button
					className='maxi-map-block__search-box-results__button'
					key={placeId}
					onClick={() => handleAddMarker(index)}
				>
					{displayName}
				</Button>
			);
		});
	};

	return (
		<>
			<div className='maxi-map-block__search-box'>
				<TextInput
					value={keywords}
					onChange={keyWords => setKeywords(keyWords)}
					onKeyDown={event => handleKeyDown(event)}
					placeholder={__('Enter your keywords…', 'maxi-blocks')}
				/>
				<Button
					className='maxi-map-block__search-box__button'
					onClick={() => handleButtonClick()}
					icon={
						searchResults && searchResults.length > 0
							? 'no'
							: 'search'
					}
					showTooltip
					label={
						searchResults && searchResults.length > 0
							? __('Clear results', 'maxi-blocks')
							: __('Find locations', 'maxi-blocks')
					}
					disabled={
						!((keywords && keywords.length > 2) || searchResults)
					}
				/>
			</div>
			{searchResults && searchResults.length ? (
				<div className='maxi-map-block__search-box-results'>
					{renderResultsList()}
				</div>
			) : null}
		</>
	);
};

export default SearchBox;
