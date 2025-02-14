import { select } from '@wordpress/data';
import getTypographyFromSC from '../getTypographyFromSC';

const mockStyleCard = {
	value: {
		defaultStyleCard: {
			h1: {
				'font-family-general': 'Roboto',
				'font-size-general': '24px',
				'font-style-general': 'normal',
				'font-weight-general': '400',
				'line-height-general': '100%',
				'text-decoration-general': 'unset',
				'text-transform-general': 'unset',
			},
			h2: {
				'font-family-general': 'Roboto',
				'font-size-general': '16px',
				'font-style-general': 'normal',
				'font-weight-general': '400',
				'line-height-general': '100%',
				'text-decoration-general': 'unset',
				'text-transform-general': 'unset',
			},
			p: {
				'font-family-general': 'Oswald',
			},
			button: {
				'font-family-general': undefined,
				'font-size-general': '16px',
				'font-style-general': 'normal',
				'font-weight-general': '400',
				'line-height-general': '100%',
				'text-decoration-general': 'unset',
				'text-transform-general': 'unset',
			},
		},
		styleCard: {
			h1: {
				'font-family-general': 'Railway',
				'font-size-general': '24px',
				'font-style-general': undefined,
				'font-weight-general': '900',
				'line-height-general': undefined,
				'text-decoration-general': 'unset',
				'text-transform-general': 'unset',
			},
			h2: {
				'font-family-general': 'Railway',
				'font-size-general': undefined,
				'font-style-general': 'normal',
				'font-weight-general': '400',
				'line-height-general': '100%',
				'text-decoration-general': 'unset',
				'text-transform-general': 'unset',
			},
			p: {
				'font-family-general': 'Oswald',
			},
			button: {
				'font-family-general': undefined,
				'font-size-general': '16px',
				'font-style-general': 'normal',
				'font-weight-general': '400',
				'line-height-general': '100%',
				'text-decoration-general': 'unset',
				'text-transform-general': 'unset',
			},
		},
	},
};

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				receiveMaxiSelectedStyleCard: () => mockStyleCard,
				receiveMaxiDeviceType: () => 'general',
			};
		}),
	};
});
jest.mock('@extensions/styles/getLastBreakpointAttribute.js', () =>
	jest.fn(({ target, breakpoint, attributes }) => {
		return attributes[`${target}-${breakpoint}`];
	})
);

describe('getTypographyFromSC', () => {
	it('Should return the typography from the selected style card', () => {
		const result = getTypographyFromSC(null, 'h1');

		expect(result).toMatchSnapshot();
	});

	it('Should return the typography for specific style card', () => {
		const result = getTypographyFromSC(mockStyleCard.value, 'h1');
		expect(result).toMatchSnapshot();
	});

	it('Should return the typography for specific type', () => {
		const result = getTypographyFromSC(mockStyleCard.value, 'h2');
		expect(result).toMatchSnapshot();
	});

	it('For button type, font family should be the same as the p type if button font family is not defined', () => {
		const result = getTypographyFromSC(mockStyleCard.value, 'button');
		expect(result).toMatchSnapshot();
	});

	it('Should return an empty object if the style card is not found', () => {
		select.mockImplementation(
			jest.fn(() => ({
				receiveMaxiSelectedStyleCard: () => ({}),
			}))
		);
		const result = getTypographyFromSC(null, 'h1');
		expect(result).toMatchSnapshot();
	});
});
