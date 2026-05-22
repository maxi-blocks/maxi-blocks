jest.mock('@wordpress/data', () => ({
	createReduxStore: jest.fn((name, config) => ({ name, ...config })),
	dispatch: jest.fn(() => ({})),
	register: jest.fn(),
	select: jest.fn(store => {
		if (store === 'core/block-editor') {
			return {
				getBlockAttributes: jest.fn(() => ({})),
				getBlockName: jest.fn(() => 'maxi-blocks/video-maxi'),
				getSelectedBlockClientId: jest.fn(() => 'client-id'),
				getSelectedBlockClientIds: jest.fn(() => ['client-id']),
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}

		if (store === 'maxiBlocks') {
			return {
				receiveBaseBreakpoint: jest.fn(() => 'xxl'),
				receiveMaxiDeviceType: jest.fn(() => 'general'),
			};
		}

		return {};
	}),
}));

jest.mock('@wordpress/blocks', () => ({
	getBlockAttributes: jest.fn(() => ({})),
}));
jest.mock('@components/block-inserter', () => jest.fn());
jest.mock('@components/custom-css-control/utils', () => ({
	getSelectorsCss: jest.fn(() => ({})),
}));
jest.mock('@components/transform-control/utils', () => ({
	getTransformSelectors: jest.fn(() => ({})),
}));
jest.mock('@extensions/attributes', () => ({
	getBlockData: jest.fn(() => ({})),
}));
jest.mock('@extensions/maxi-block', () => ({
	goThroughMaxiBlocks: jest.fn(),
}));
jest.mock('@extensions/relations', () => ({
	getAdvancedSettings: jest.fn(() => ({})),
	getCanvasSettings: jest.fn(() => ({})),
}));

import getStyles from '../styles';

describe('Video Maxi styles', () => {
	it('adds object-position styles for the popup overlay image', () => {
		const uniqueID = 'video-maxi-test';
		const styles = getStyles({
			uniqueID,
			blockStyle: 'light',
			playerType: 'popup',
			'overlay-media-width-general': '100',
			'overlay-media-width-unit-general': '%',
			'overlay-media-height-general': '100',
			'overlay-media-height-unit-general': '%',
			'overlay-media-object-position-horizontal-general': 25,
			'overlay-media-object-position-vertical-general': 75,
		});

		expect(
			styles[uniqueID][' .maxi-video-block__overlay-image']
				.objectPosition.general
		).toEqual({
			'object-position': '25% 75%',
		});
	});
});
