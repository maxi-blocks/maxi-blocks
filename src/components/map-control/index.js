/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ColorControl from '../color-control';
import OpacityControl from '../opacity-control';
import FancyRadioControl from '../fancy-radio-control';
import {
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { uniqueId } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import * as mapMarkers from '../../icons/map-icons';

/**
 * Component
 */
const MapControl = props => {
	const { className, onChange, clientId } = props;

	const classes = classnames('maxi-map-control', className);

	return (
		<div className={classes}>
			<TextControl
				className='maxi-map-control__full-width-text'
				label={__('API Key', 'maxi-blocks')}
				value={props['map-api-key']}
				onChange={val => onChange({ 'map-api-key': val })}
			/>
			<p className='maxi-map-control__help'>
				{__('Please create your own API key on the ', 'maxi-blocks')}
				<a
					href='https://console.developers.google.com'
					target='_blank'
					rel='noreferrer'
				>
					{__('Google Console ', 'maxi-blocks')}
				</a>
				{__('This is a requirement enforced by Google.', 'maxi-blocks')}
			</p>
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
				max={999}
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
			<FancyRadioControl
				label={__('Custom Maker Colours', 'maxi-block')}
				selected={props['map-marker-custom-color-status']}
				options={[
					{ label: __('Yes', 'maxi-block'), value: 1 },
					{ label: __('No', 'maxi-block'), value: 0 },
				]}
				onChange={val =>
					onChange({ 'map-marker-custom-color-status': val })
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
						onChange={val =>
							onChange({ 'map-marker-fill-color': val })
						}
					/>
					<ColorControl
						label={__('Marker Stroke', 'maxi-blocks')}
						disableOpacity
						color={props['map-marker-stroke-color']}
						defaultColor={getDefaultAttribute(
							'map-marker-stroke-color'
						)}
						onChange={val =>
							onChange({ 'map-marker-stroke-color': val })
						}
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
				disableOpacity
				color={props['map-marker-text-color']}
				defaultColor={getDefaultAttribute('map-marker-text-color')}
				onChange={val => onChange({ 'map-marker-text-color': val })}
				showPalette
				palette={{ ...getGroupAttributes(props, 'palette') }}
				isHover={false}
				colorPaletteType='marker-title'
				onChangePalette={val => onChange(val)}
				clientId={clientId}
			/>
			<TextControl
				className='maxi-map-control__full-width-text'
				label={__('Marker Address', 'maxi-blocks')}
				value={props['map-marker-address']}
				onChange={val => onChange({ 'map-marker-address': val })}
			/>
			<ColorControl
				label={__('Marker Address', 'maxi-blocks')}
				disableOpacity
				color={props['map-marker-address-color']}
				defaultColor={getDefaultAttribute('map-marker-address-color')}
				onChange={val => onChange({ 'map-marker-address-color': val })}
				showPalette
				palette={{ ...getGroupAttributes(props, 'palette') }}
				isHover={false}
				colorPaletteType='marker-address'
				onChangePalette={val => onChange(val)}
				clientId={clientId}
			/>
		</div>
	);
};

export default MapControl;
