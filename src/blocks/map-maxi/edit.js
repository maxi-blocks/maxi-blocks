/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { Toolbar } from '@components';
import { MapContent } from './components';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import { getGroupAttributes } from '@extensions/styles';
import { getBreakpoints } from '@extensions/styles/helpers';
import getStyles from './styles';
import { copyPasteMapping } from './data';
import * as mapMarkerIcons from '@maxi-icons/map-icons/markers';
import withMaxiDC from '@extensions/DC/withMaxiDC';

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.state = {
			...this.state,
			googleApiKey: '',
			isApiKeyLoading: true,
		};
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

		// Use injected settings instead of API call
		const googleApiKey =
			typeof window !== 'undefined'
				? window.maxiSettings?.google_api_key || ''
				: '';
		const provider = attributes?.['map-provider'];
		this.setState({
			googleApiKey,
			// Initialize as false to let MapContent handle error state
			isApiKeyLoading: false,
		});
	}

	render() {
		const { attributes, isSelected } = this.props;
		const { uniqueID, 'map-provider': mapProvider } = attributes;
		const { googleApiKey, isApiKeyLoading } = this.state;

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				apiKey={googleApiKey}
				setShowLoader={value => this.setState({ showLoader: value })}
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
				showLoader={this.state.showLoader || isApiKeyLoading}
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
	}
}

export default withMaxiDC(withMaxiProps(edit));
