/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { renderToString } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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
import { copyPasteMapping } from './data';
import * as mapMarkerIcons from '../../icons/map-icons/markers';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.state.googleApiKey = '';
	}

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

	maxiBlockDidMount() {
		const { attributes, maxiSetAttributes } = this.props;
		const { 'map-marker-icon': mapMarkerIcon } = attributes;

		if (!mapMarkerIcon) {
			maxiSetAttributes({
				'map-marker-icon': renderToString(mapMarkerIcons.mapMarker1),
			});
		}

		const { receiveMaxiSettings } = resolveSelect('maxiBlocks');
		receiveMaxiSettings()
			.then(maxiSettings => {
				const googleApiKey = maxiSettings?.google_api_key;
				this.setState({ googleApiKey });
			})
			.catch(() => console.error('Maxi Blocks: Could not load settings'));
	}

	render() {
		const { attributes, isSelected } = this.props;
		const { googleApiKey } = this.state;
		const { uniqueID, 'map-provider': mapProvider } = attributes;

		const getApiKey = () => {
			if (!googleApiKey) {
				this.setState({ googleApiKey });
			}

			return this.state.googleApiKey;
		};

		if (attributes.preview)
			return (
				<MaxiBlock
					key={`maxi-map--${uniqueID}`}
					ref={this.blockRef}
					{...getMaxiBlockAttributes(this.props)}
				>
					<img // eslint-disable-next-line no-undef
						src={previews.map_preview}
						alt={__('Map block preview', 'maxi-blocks')}
					/>
				</MaxiBlock>
			);

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
