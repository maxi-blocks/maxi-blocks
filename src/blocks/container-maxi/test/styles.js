jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.requireActual('@extensions/styles/getGroupAttributes')
		.default,
	styleProcessor: jest.fn(styles => styles),
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
	dispatch: jest.fn(() => ({
		updateStyles: jest.fn(),
	})),
}));

jest.mock('@extensions/relations', () => ({
	getCanvasSettings: jest.fn(() => ({})),
	getAdvancedSettings: jest.fn(() => ({})),
}));

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => 0)
);

jest.mock('src/extensions/style-cards/getActiveStyleCard.js', () => {
	return jest.fn(() => ({
		value: mockActiveStyleCard,
	}));
});

import getStyles from '../styles';
import { getBlockDefaultKey } from '@extensions/style-cards/blockDefaults';
import frontendStyleGenerator from '@extensions/styles/frontendStyleGenerator';
import styleGenerator from '@extensions/styles/styleGenerator';
import styleResolver from '@extensions/styles/styleResolver';

const getBaseStyleCard = () => ({
	name: 'Maxi (Default)',
	status: 'active',
	light: {
		styleCard: {
			blockDefaults: {},
		},
		defaultStyleCard: {
			blockDefaults: {},
			color: {
				1: '255,255,255',
				2: '242,249,253',
				3: '155,155,155',
				4: '255,74,23',
				5: '0,0,0',
				6: '201,52,10',
				7: '8,18,25',
				8: '150,176,203',
			},
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

const breakpoints = {
	xxl: 1920,
	xl: 1920,
	l: 1366,
	m: 1024,
	s: 767,
	xs: 480,
};

describe('container-maxi styles', () => {
	beforeEach(() => {
		mockActiveStyleCard = getBaseStyleCard();
		mockStyleCards = {
			sc_maxi: mockActiveStyleCard,
		};
	});

	it('passes background transition settings to callout arrow color elements', () => {
		const uniqueID = 'container-maxi-arrow-transition-test-u';
		const result = getStyles({
			uniqueID,
			blockStyle: 'light',
			'arrow-status-general': true,
			'arrow-side-general': 'bottom',
			'arrow-position-general': 50,
			'arrow-width-general': 24,
			'block-background-status-hover': true,
			'background-layers': [
				{
					type: 'color',
					'display-general': 'block',
					'background-palette-status-general': false,
					'background-color-general': 'rgba(150,200,90)',
					'background-palette-status-general-hover': false,
					'background-color-general-hover': 'rgba(61,133,209)',
					order: 0,
				},
			],
			transition: {
				canvas: {
					'background / layer': {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
					},
				},
			},
		});

		expect(
			result[uniqueID][' .maxi-container-arrow:before'].transition
				.general.transition
		).toBe('background-color 0.3s 0s ease');
		expect(
			result[uniqueID][
				' .maxi-container-arrow .maxi-container-arrow--content:after'
			].transition.general.transition
		).toBe('background-color 0.3s 0s ease');
	});

	it('uses Style Card block default variables in generated library container padding styles', () => {
		const uniqueID = 'container-maxi-sc-padding-test-u';

		mockActiveStyleCard.light.styleCard.blockDefaults = {
			[getBlockDefaultKey('container-maxi', 'padding-top-xl')]: '90',
			[getBlockDefaultKey('container-maxi', 'padding-top-unit-xl')]:
				'px',
		};

		const result = getStyles({
			uniqueID,
			blockStyle: 'light',
			'padding-top-general': '100',
			'padding-top-unit-general': 'px',
			'padding-top-xxl': '150',
			'padding-top-unit-xxl': 'px',
			'padding-top-xl': '100',
			'padding-top-unit-xl': 'px',
		});

		expect(result[uniqueID][''].padding.xl['padding-top']).toBe(
			'var(--maxi-light-block-default-container-maxi-padding-top-xl, 90px)'
		);
	});

	it('generates container padding styles from Style Card defaults when the block has no explicit padding', () => {
		const uniqueID = 'container-maxi-sc-new-padding-test-u';

		mockActiveStyleCard.light.styleCard.blockDefaults = {
			[getBlockDefaultKey('container-maxi', 'padding-top-xl')]: '120',
			[getBlockDefaultKey('container-maxi', 'padding-top-unit-xl')]:
				'px',
		};

		const result = getStyles({
			uniqueID,
			blockStyle: 'light',
		});

		expect(result[uniqueID][''].padding.xl['padding-top']).toBe(
			'var(--maxi-light-block-default-container-maxi-padding-top-xl, 120px)'
		);
	});

	it('renders frontend CSS with Style Card block default padding variables', () => {
		const uniqueID = 'container-maxi-sc-frontend-padding-test-u';

		mockActiveStyleCard.light.styleCard.blockDefaults = {
			[getBlockDefaultKey('container-maxi', 'padding-top-xl')]: '200',
			[getBlockDefaultKey('container-maxi', 'padding-top-unit-xl')]:
				'px',
		};

		const resolvedStyles = styleResolver({
			styles: getStyles({
				uniqueID,
				blockStyle: 'light',
				'padding-top-general': '100',
				'padding-top-unit-general': 'px',
				'padding-top-xxl': '150',
				'padding-top-unit-xxl': 'px',
				'padding-top-xl': '100',
				'padding-top-unit-xl': 'px',
			}),
			breakpoints,
			uniqueID,
		});

		const frontendCss = frontendStyleGenerator(
			Object.entries(resolvedStyles)[0]
		);

		expect(frontendCss).toContain(
			`@media only screen and (max-width:1920px){body.maxi-blocks--active #${uniqueID}{min-width:initial;padding-top:var(--maxi-light-block-default-container-maxi-padding-top-xl, 200px);}}`
		);
	});

	it('renders editor and frontend CSS with XL Style Card padding over a 150px library container', () => {
		const uniqueID = 'container-maxi-sc-editor-xl-padding-test-u';

		mockActiveStyleCard.light.styleCard.blockDefaults = {
			[getBlockDefaultKey('container-maxi', 'padding-top-xl')]: '20',
			[getBlockDefaultKey('container-maxi', 'padding-top-unit-xl')]:
				'px',
			[getBlockDefaultKey('container-maxi', 'padding-bottom-xl')]: '20',
			[getBlockDefaultKey('container-maxi', 'padding-bottom-unit-xl')]:
				'px',
		};

		const resolvedStyles = styleResolver({
			styles: getStyles({
				uniqueID,
				blockStyle: 'light',
				'padding-top-general': '150',
				'padding-top-unit-general': 'px',
				'padding-top-xxl': '200',
				'padding-top-unit-xxl': 'px',
				'padding-top-xl': '150',
				'padding-top-unit-xl': 'px',
				'padding-bottom-general': '150',
				'padding-bottom-unit-general': 'px',
				'padding-bottom-xxl': '200',
				'padding-bottom-unit-xxl': 'px',
				'padding-bottom-xl': '150',
				'padding-bottom-unit-xl': 'px',
			}),
			breakpoints,
			uniqueID,
		});

		const frontendCss = frontendStyleGenerator(
			Object.entries(resolvedStyles)[0]
		);
		const editorCss = styleGenerator(resolvedStyles, true, false, 'xl');

		expect(frontendCss).toContain(
			`padding-top:var(--maxi-light-block-default-container-maxi-padding-top-xl, 20px);padding-bottom:var(--maxi-light-block-default-container-maxi-padding-bottom-xl, 20px);`
		);
		expect(editorCss).toContain(
			`padding-top: var(--maxi-light-block-default-container-maxi-padding-top-xl, 20px); padding-bottom: var(--maxi-light-block-default-container-maxi-padding-bottom-xl, 20px);`
		);
		expect(editorCss).not.toContain('maxi-block-indicators');
	});
});
