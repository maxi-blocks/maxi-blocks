/**
 * WordPress dependencies
 */
import { select, resolveSelect } from '@wordpress/data';
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
import { copyPasteMapping } from './data';
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

	maxiBlockDidMount() {
		const { attributes, maxiSetAttributes } = this.props;
		const { 'map-marker-icon': mapMarkerIcon } = attributes;

		if (!mapMarkerIcon) {
			maxiSetAttributes({
				'map-marker-icon': renderToString(mapMarkerIcons.mapMarker1),
			});
		}
	}

	render() {
		const { attributes, isSelected } = this.props;
		const { uniqueID, 'map-provider': mapProvider } = attributes;

		const delayed_render = (async_fun, deps = []) => {
			const [output, setOutput] = useState();
			useEffect(async () => setOutput(await async_fun()), deps);
			return output === undefined ? null : output;
		};

		return delayed_render(async () => {
			const { receiveMaxiSettings } = resolveSelect('maxiBlocks');
			receiveMaxiSettings()
				.then(maxiSettings => {
					const googleApiKey = maxiSettings?.google_api_key;
					return [
						<Inspector
							key={`block-settings-${uniqueID}`}
							{...this.props}
							apiKey={googleApiKey}
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
								apiKey={googleApiKey}
								isFirstClick={this.state.isFirstClick}
								isGoogleMaps={mapProvider === 'googlemaps'}
								isSelected={isSelected}
							/>
						</MaxiBlock>,
					];
				})
				.catch(() =>
					console.error('Maxi Blocks: Could not load settings')
				);
		});
	}
}

export default withMaxiProps(edit);
