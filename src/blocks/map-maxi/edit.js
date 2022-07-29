/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { renderToString } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import { MapContent } from './components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';
import copyPasteMapping from './copy-paste-mapping';
import * as mapMarkerIcons from '../../icons/map-icons/markers';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;

		return {
			map: [
				{
					uniqueID: attributes.uniqueID,
					...getGroupAttributes(attributes, [
						'map',
						'mapInteraction',
						'mapMarker',
						'mapPopup',
						'mapPopupText',
					]),
				},
			],
		};
	}

	render() {
		const { attributes, maxiSetAttributes, isSelected } = this.props;
		const {
			uniqueID,
			'map-provider': mapProvider,
			'map-marker-icon': mapMarkerIcon,
		} = attributes;

		const getApiKey = () => {
			const { receiveMaxiSettings } = select('maxiBlocks');

			const maxiSettings = receiveMaxiSettings();

			const key = maxiSettings?.google_api_key;

			if (key) return key;
			return false;
		};

		if (!mapMarkerIcon) {
			maxiSetAttributes({
				'map-marker-icon': renderToString(mapMarkerIcons.mapMarker1),
			});

			return null;
		}

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				apiKey={getApiKey()}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-map--${uniqueID}`}
				ref={this.blockRef}
				className='maxi-map-block'
				{...getMaxiBlockAttributes(this.props)}
			>
				<MapContent
					{...this.props}
					apiKey={getApiKey()}
					isFirstClick={this.state.isFirstClick}
					isGoogleMaps={mapProvider === 'googlemaps'}
					isSelected={isSelected}
				/>
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
