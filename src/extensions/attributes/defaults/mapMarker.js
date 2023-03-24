import { svg } from './svg';
import attributesShorter from '../dictionary/attributesShorter';

const mapMarker = {
	...{
		...svg,
		'svg-width-general': {
			type: 'string',
			default: '20',
		},
	},
	'map-marker': {
		type: 'number',
		default: 1,
	},
	'map-marker-icon': {
		type: 'string',
	},
};

export default attributesShorter(mapMarker, 'mapMarker');
