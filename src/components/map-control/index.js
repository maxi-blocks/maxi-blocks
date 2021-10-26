/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ColorControl from '../color-control';
import InfoBox from '../info-box';
import OpacityControl from '../opacity-control';
import ToggleSwitch from '../toggle-switch';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { uniqueId, isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import * as mapMarkers from '../../icons/map-icons';

/**
 * Component
 */
const MapControl = props => {
	const { className, onChange } = props;

	const classes = classnames('maxi-map-control', className);

	const { mapApiKey } = useSelect(select => {
		const { receiveMaxiSettings } = select('maxiBlocks');
		const maxiSettings = receiveMaxiSettings();
		const { google_api_key: apiKey } = maxiSettings;

		const mapApiKey = !isEmpty(apiKey) ? apiKey : false;

		return {
			mapApiKey,
		};
	});

	return (
		<div className={classes}>
			{!mapApiKey && (
				<InfoBox
					message={__(
						'You have not set your Google map API key, please navigate to the Maxi Block Options and set it',
						'maxi-blocks'
					)}
					links={[
						{
							title: __('Maxi Block Options', 'maxi-blocks'),
							href: '/wp-admin/admin.php?page=maxi-blocks.php',
						},
					]}
				/>
			)}
			<TextControl
				label={__('Latitude', 'maxi-blocks')}
				value={props['map-latitude']}
				onChange={val => onChange({ 'map-latitude': val })}
			/>
			<TextControl
				label={__('Longitude', 'maxi-blocks')}
				value={props['map-longitude']}
				onChange={val => onChange({ 'map-longitude': val })}
			/>
			<AdvancedNumberControl
				label={__('Zoom', 'maxi-blocks')}
				min={1}
				max={22}
				initial={1}
				step={1}
				value={props['map-zoom']}
				onChangeValue={val => onChange({ 'map-zoom': val })}
				onReset={() =>
					onChange({
						'map-zoom': getDefaultAttribute('map-zoom'),
					})
				}
			/>
			<div className='maxi-map-control__markers'>
				{Object.keys(mapMarkers).map((item, index) => (
					<div
						key={`map-marker-${uniqueId()}`}
						data-item={index + 1}
						onClick={e =>
							onChange({
								'map-marker': +e.currentTarget.dataset.item,
							})
						}
						className={`maxi-map-control__markers__item ${
							props['map-marker'] - 1 === index
								? 'maxi-map-control__markers__item--active'
								: null
						}`}
					>
						{mapMarkers[item]}
					</div>
				))}
			</div>
			<OpacityControl
				label={__('Marker Opacity', 'maxi-blocks')}
				opacity={props['map-marker-opacity']}
				onChange={val =>
					onChange({
						'map-marker-opacity': val,
					})
				}
			/>
			<AdvancedNumberControl
				label={__('Marker Scale', 'maxi-blocks')}
				min={1}
				max={10}
				initial={1}
				step={1}
				value={props['map-marker-scale']}
				onChangeValue={val => onChange({ 'map-marker-scale': val })}
				onReset={() =>
					onChange({
						'map-marker-scale':
							getDefaultAttribute('map-marker-scale'),
					})
				}
			/>
			<ToggleSwitch
				label={__('Custom Maker Colours', 'maxi-block')}
				selected={props['map-marker-custom-color-status']}
				onChange={val =>
					onChange({
						'map-marker-custom-color-status': val,
					})
				}
			/>
			{props['map-marker-custom-color-status'] && (
				<>
					<ColorControl
						label={__('Marker Fill', 'maxi-blocks')}
						disableOpacity
						color={props['map-marker-fill-color']}
						defaultColor={getDefaultAttribute(
							'map-marker-fill-color'
						)}
						onChange={({ color }) =>
							onChange({ 'map-marker-fill-color': color })
						}
						disablePalette
					/>
					<ColorControl
						label={__('Marker Stroke', 'maxi-blocks')}
						disableOpacity
						color={props['map-marker-stroke-color']}
						defaultColor={getDefaultAttribute(
							'map-marker-stroke-color'
						)}
						onChange={({ color }) =>
							onChange({ 'map-marker-stroke-color': color })
						}
						disablePalette
					/>
				</>
			)}

			<TextControl
				className='maxi-map-control__full-width-text'
				label={__('Marker Text', 'maxi-blocks')}
				value={props['map-marker-text']}
				onChange={val => onChange({ 'map-marker-text': val })}
			/>
			<ColorControl
				label={__('Marker Text', 'maxi-blocks')}
				color={props['map-marker-text-color']}
				defaultColor={getDefaultAttribute('map-marker-text-color')}
				paletteColor={props['map-marker-palette-text-color']}
				paletteStatus={props['map-marker-palette-text-color-status']}
				onChange={({ color, paletteColor, paletteStatus }) =>
					onChange({
						'map-marker-text-color': color,
						'map-marker-palette-text-color': paletteColor,
						'map-marker-palette-text-color-status': paletteStatus,
					})
				}
				disableOpacity
			/>
			<TextControl
				className='maxi-map-control__full-width-text'
				label={__('Marker Address', 'maxi-blocks')}
				value={props['map-marker-address']}
				onChange={val => onChange({ 'map-marker-address': val })}
			/>
			<ColorControl
				label={__('Marker Address', 'maxi-blocks')}
				color={props['map-marker-address-color']}
				defaultColor={getDefaultAttribute('map-marker-address-color')}
				paletteColor={props['map-marker-palette-address-color']}
				paletteStatus={props['map-marker-palette-address-color-status']}
				onChange={({ color, paletteColor, paletteStatus }) =>
					onChange({
						'map-marker-address-color': color,
						'map-marker-palette-address-color': paletteColor,
						'map-marker-palette-address-color-status':
							paletteStatus,
					})
				}
				disableOpacity
			/>
		</div>
	);
};

export default MapControl;
