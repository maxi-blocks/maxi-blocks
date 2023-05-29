import { svg } from './svg';

const mapMarker = {
	...{
		...svg,
		's_w-g': {
			type: 'string',
			default: '20',
			longLabel: 'svg-width-general',
		},
	},
	m_ma: {
		type: 'number',
		default: 1,
		longLabel: 'map-marker',
	},
	m_mic: {
		type: 'string',
		longLabel: 'map-marker-icon',
	},
};

export default mapMarker;
