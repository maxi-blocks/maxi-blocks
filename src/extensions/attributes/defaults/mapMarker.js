import { svg } from './svg';

const mapMarker = {
	...{
		...svg,
		'svg-w-general': {
			type: 'string',
			default: '20',
			longLabel: 'svg-width-general',
		},
	},
	'm-ma': {
		type: 'number',
		default: 1,
		longLabel: 'map-marker',
	},
	'm-mi': {
		type: 'string',
		longLabel: 'map-marker-icon',
	},
};

export default mapMarker;
