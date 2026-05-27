import {
	canToggleCanvasLink,
	getLinkElementFromCanvasToggle,
	getLinkSettingsWithDefaultLinkElement,
	hasCanvasSettings,
} from '../utils';

describe('toolbar link utils', () => {
	it('detects block canvas settings', () => {
		expect(hasCanvasSettings({ settings: { canvas: {} } })).toBe(true);
		expect(hasCanvasSettings({ canvas: [] })).toBe(true);
		expect(hasCanvasSettings({ settings: { block: {} } })).toBe(false);
	});

	it('allows the canvas link toggle for blocks with canvas settings', () => {
		expect(
			canToggleCanvasLink({
				settings: { canvas: {} },
				linkElements: ['button', 'canvas'],
			})
		).toBe(true);
		expect(
			canToggleCanvasLink({
				canvas: [],
			})
		).toBe(true);
		expect(
			canToggleCanvasLink({
				settings: { block: {} },
				linkElements: ['button', 'canvas'],
			})
		).toBe(false);
	});

	it('detects canvas settings from the exported block data shape', () => {
		expect(
			canToggleCanvasLink({
				interactionBuilderSettings: {
					canvas: {
						Background: {},
					},
				},
				linkElements: ['button', 'canvas'],
			})
		).toBe(true);
		expect(
			canToggleCanvasLink({
				interactionBuilderSettings: {
					block: {
						Background: {},
					},
				},
			})
		).toBe(true);
		expect(
			hasCanvasSettings({
				copyPasteMapping: {
					canvas: {
						Background: {},
					},
				},
			})
		).toBe(true);
	});

	it('maps the canvas toggle to the stored link element', () => {
		const linkElements = ['button', 'canvas'];

		expect(getLinkElementFromCanvasToggle(true, linkElements)).toBe(
			'canvas'
		);
		expect(getLinkElementFromCanvasToggle(false, linkElements)).toBe(
			'button'
		);
		expect(getLinkElementFromCanvasToggle(false)).toBeUndefined();
	});

	it('normalizes links without an explicit element to the default non-canvas target', () => {
		const linkSettings = { url: '#coffee-shop-video' };
		const linkElements = ['svg', 'canvas'];

		expect(
			getLinkSettingsWithDefaultLinkElement(linkSettings, linkElements)
		).toEqual({
			url: '#coffee-shop-video',
			linkElement: 'svg',
		});
		expect(
			getLinkSettingsWithDefaultLinkElement(
				{ ...linkSettings, linkElement: 'canvas' },
				linkElements
			)
		).toEqual({ ...linkSettings, linkElement: 'canvas' });
	});
});
