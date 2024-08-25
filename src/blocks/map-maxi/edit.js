/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { renderToString } from '@wordpress/element';

/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const Inspector = loadable(() => import('./inspector'));
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import { MapContent } from './components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import { getBreakpoints } from '../../extensions/styles/helpers';
import getStyles from './styles';
import { copyPasteMapping } from './data';
import * as mapMarkerIcons from '../../icons/map-icons/markers';
import withMaxiDC from '../../extensions/DC/withMaxiDC';

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
		const { uniqueID } = attributes;

		return {
			[uniqueID]: {
				...getGroupAttributes(attributes, [
					'map',
					'mapInteraction',
					'mapMarker',
					'mapPopup',
					'mapPopupText',
				]),
				breakpoints: { ...getBreakpoints(attributes) },
				ariaLabels: attributes?.ariaLabels || {},
			},
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
			.catch(() => console.error('MaxiBlocks: Could not load settings'));
	}

	render() {
		const { attributes, isSelected } = this.props;
		const { uniqueID, 'map-provider': mapProvider } = attributes;

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				apiKey={this.state.googleApiKey}
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
					apiKey={this.state.googleApiKey}
					isFirstClick={this.state.isFirstClick}
					isGoogleMaps={mapProvider === 'googlemaps'}
					isSelected={isSelected}
				/>
			</MaxiBlock>,
		];
	}
}

export default withMaxiDC(withMaxiProps(edit));
