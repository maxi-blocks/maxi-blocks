import { svg } from './svg';

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

export default mapMarker;
