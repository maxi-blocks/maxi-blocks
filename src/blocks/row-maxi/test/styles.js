jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.requireActual('@extensions/styles/getGroupAttributes')
		.default,
	styleProcessor: jest.fn(styles => styles),
	createIconTransitions: jest.fn(() => ({})),
}));

let mockActiveStyleCard;
let mockStyleCards;

jest.mock('@wordpress/data', () => ({
	select: jest.fn(store => {
		if (store === 'core/block-editor') {
			return {
				getBlockAttributes: jest.fn(() => null),
				getSelectedBlockClientId: jest.fn(() => null),
				getSelectedBlockClientIds: jest.fn(() => []),
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}
		if (store === 'maxiBlocks') {
			return {
				receiveBaseBreakpoint: jest.fn(() => 'xl'),
				receiveMaxiDeviceType: jest.fn(() => 'xl'),
			};
		}
		if (store === 'maxiBlocks/style-cards') {
			return {
				receiveMaxiStyleCards: jest.fn(() => mockStyleCards),
			};
		}

		return {};
	}),
}));

jest.mock('@extensions/relations', () => ({
	getCanvasSettings: jest.fn(() => ({})),
	getAdvancedSettings: jest.fn(() => ({})),
}));

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => 0)
);

jest.mock('src/extensions/style-cards/getActiveStyleCard.js', () =>
	jest.fn(() => ({
		value: mockActiveStyleCard,
	}))
);

import getStyles from '../styles';
import { getBlockDefaultKey } from '@extensions/style-cards/blockDefaults';

const getBaseStyleCard = () => ({
	name: 'Maxi (Default)',
	status: 'active',
	light: {
		styleCard: {
			blockDefaults: {},
		},
		defaultStyleCard: {
			blockDefaults: {},
		},
	},
	dark: {
		styleCard: {
			blockDefaults: {},
		},
		defaultStyleCard: {
			blockDefaults: {},
		},
	},
});

describe('row-maxi styles', () => {
	beforeEach(() => {
		mockActiveStyleCard = getBaseStyleCard();
		mockStyleCards = {
			sc_maxi: mockActiveStyleCard,
		};
	});

	it('uses Style Card block default variables in generated row layout styles', () => {
		const uniqueID = 'row-maxi-sc-layout-test-u';

		mockActiveStyleCard.light.styleCard.blockDefaults = {
			[getBlockDefaultKey('row-maxi', 'padding-top-xl')]: '80',
			[getBlockDefaultKey('row-maxi', 'padding-top-unit-xl')]: 'px',
			[getBlockDefaultKey('row-maxi', 'row-gap-general')]: '30',
			[getBlockDefaultKey('row-maxi', 'row-gap-unit-general')]: 'px',
		};

		const result = getStyles({
			uniqueID,
			blockStyle: 'light',
			'padding-top-general': '150',
			'padding-top-unit-general': 'px',
			'padding-top-xxl': '200',
			'padding-top-unit-xxl': 'px',
			'padding-top-xl': '150',
			'padding-top-unit-xl': 'px',
			'padding-top-s': '0',
			'padding-top-unit-s': 'px',
			'row-gap-general': 20,
			'row-gap-unit-general': 'px',
			'row-gap-xs': 10,
			'row-gap-unit-xs': 'px',
		});

		expect(result[uniqueID][''].padding.xl['padding-top']).toBe(
			'var(--maxi-light-block-default-row-maxi-padding-top-xl, 80px)'
		);
		expect(result[uniqueID][''].flex.general['row-gap']).toBe(
			'var(--maxi-light-block-default-row-maxi-row-gap-general, 30px)'
		);
	});
});
