import { handleOnChangeLayer, normalizePositionForPicker } from '../utils';

jest.mock('@extensions/maxi-block', () => ({
	handleSetAttributes: jest.fn(({ obj, onChange }) => onChange(obj)),
}));

jest.mock('@extensions/styles', () => {
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	const getNormalAttributeKey = key => key.replace(/-hover/, '');
	const getBreakpointFromAttribute = rawTarget => {
		const target = getNormalAttributeKey(rawTarget);
		const lastDash = target.lastIndexOf('-');

		if (lastDash <= -1) return false;

		const breakpoint = target.slice(lastDash).replace('-', '');

		return breakpoints.includes(breakpoint) ? breakpoint : false;
	};

	return {
		getAttributeKey: (
			key,
			isHover = false,
			prefix = false,
			breakpoint = false
		) =>
			`${prefix || ''}${key}${breakpoint ? `-${breakpoint}` : ''}${
				isHover ? '-hover' : ''
			}`,
		getBreakpointFromAttribute,
		getHoverAttributeKey: key =>
			key.includes('-hover') ? key : `${key}-hover`,
		getIsHoverAttribute: key => key.includes('-hover'),
		getSimpleLabel: (key, breakpoint) =>
			getNormalAttributeKey(key).slice(0, -(breakpoint.length + 1)),
	};
});

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => undefined)
);

jest.mock('src/extensions/attributes/handleOnReset.js', () =>
	jest.fn(obj => obj)
);

jest.mock('@wordpress/data', () => ({
	select: jest.fn(store => {
		if (store === 'maxiBlocks') {
			return {
				receiveBaseBreakpoint: jest.fn(() => 's'),
				receiveMaxiDeviceType: jest.fn(() => 's'),
			};
		}

		if (store === 'maxiBlocks/styles') {
			return {
				getPrevSavedAttrs: jest.fn(() => ({
					prevSavedAttrsClientId: null,
					prevSavedAttrs: [],
				})),
			};
		}

		if (store === 'core/block-editor') {
			return {
				getBlockAttributes: jest.fn(() => null),
				getSelectedBlockClientId: jest.fn(() => null),
				getSelectedBlockClientIds: jest.fn(() => []),
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}

		return {};
	}),
	dispatch: jest.fn(() => ({
		savePrevSavedAttrs: jest.fn(),
	})),
	createReduxStore: jest.fn(),
	register: jest.fn(),
}));

describe('background control utils', () => {
	it('keeps numeric focal point values that are already normalized', () => {
		expect(normalizePositionForPicker(0)).toBe(0);
		expect(normalizePositionForPicker(0.5)).toBe(0.5);
		expect(normalizePositionForPicker(1)).toBe(1);
	});

	it('converts percentage values to focal point coordinates', () => {
		expect(normalizePositionForPicker('1%')).toBe(0.01);
		expect(normalizePositionForPicker(50)).toBe(0.5);
	});

	it('keeps hover layer edits out of normal focal position keys', () => {
		const currentLayer = {
			type: 'image',
			order: 1,
			isHover: false,
			'background-image-position-s': 'custom',
			'background-image-position-width-s': 91,
			'background-image-position-width-unit-s': '%',
			'background-image-position-height-s': 38,
			'background-image-position-height-unit-s': '%',
		};

		const result = handleOnChangeLayer(
			{
				'background-image-position-s': 'custom',
				'background-image-position-width-s': 100,
				'background-image-position-width-unit-s': '%',
			},
			currentLayer,
			true
		);

		expect(result).toMatchObject({
			'background-image-position-s-hover': 'custom',
			'background-image-position-width-s-hover': 100,
			'background-image-position-width-unit-s-hover': '%',
		});
		expect(result).not.toHaveProperty('background-image-position-s');
		expect(result).not.toHaveProperty('background-image-position-width-s');
		expect(result).not.toHaveProperty(
			'background-image-position-width-unit-s'
		);
	});
});
