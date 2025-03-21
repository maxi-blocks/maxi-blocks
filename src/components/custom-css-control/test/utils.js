import {
	getBgLayersSelectorsCss,
	getSelectorsCss,
	getCategoriesCss,
} from '@components/custom-css-control/utils';

describe('utils', () => {
	describe('getBgLayersSelectorsCss', () => {
		it('Returns empty object when bgLayers is empty', () => {
			expect(getBgLayersSelectorsCss([])).toEqual({
				background: {
					'background-displayer': {
						label: 'background wrapper',
						target: ' > .maxi-background-displayer',
					},
				},
				'background hover': {
					'background-displayer': {
						label: 'background wrapper on hover',
						target: ':hover > .maxi-background-displayer',
					},
				},
			});
		});

		it('Creates selectors for background layers', () => {
			const bgLayers = [
				{
					id: 'layer1',
					type: 'color',
					order: 1,
					isHover: false,
				},
				{
					id: 'layer2',
					type: 'image',
					order: 2,
					isHover: false,
				},
			];

			const result = getBgLayersSelectorsCss(bgLayers);

			expect(result).toEqual({
				background: {
					'background-displayer': {
						label: 'background wrapper',
						target: ' > .maxi-background-displayer',
					},
					_layer1: {
						label: 'background color 1',
						target: ' > .maxi-background-displayer .maxi-background-displayer__1',
					},
					_layer2: {
						label: 'background image 2',
						target: ' > .maxi-background-displayer .maxi-background-displayer__2',
					},
				},
				'background hover': {
					'background-displayer': {
						label: 'background wrapper on hover',
						target: ':hover > .maxi-background-displayer',
					},
					_layer1: {
						label: 'background color 1 on hover',
						target: ':hover > .maxi-background-displayer .maxi-background-displayer__1',
					},
					_layer2: {
						label: 'background image 2 on hover',
						target: ':hover > .maxi-background-displayer .maxi-background-displayer__2',
					},
				},
			});
		});

		it('Handles hover layers correctly', () => {
			const bgLayers = [
				{
					id: 'layer1',
					type: 'color',
					order: 1,
					isHover: true,
				},
			];

			const result = getBgLayersSelectorsCss(bgLayers);

			expect(result.background._layer1).toBeUndefined();
			expect(result['background hover']._layer1).toEqual({
				label: 'background color 1 on hover',
				target: ':hover > .maxi-background-displayer .maxi-background-displayer__1',
			});
		});

		it('Respects addOnHoverToLabel parameter', () => {
			const bgLayers = [
				{
					id: 'layer1',
					type: 'color',
					order: 1,
					isHover: false,
				},
			];

			const result = getBgLayersSelectorsCss(bgLayers, false);

			expect(result['background hover']._layer1.label).toBe(
				'background color 1'
			);
			expect(
				result['background hover']['background-displayer'].label
			).toBe('background wrapper');
		});

		it('Handles cleanParallaxLayers parameter', () => {
			const bgLayers = [
				{
					id: 'layer1',
					type: 'image',
					order: 1,
					'background-image-parallax-status': true,
				},
			];

			const result = getBgLayersSelectorsCss(bgLayers, true, true, true);

			expect(result.background._layer1).toBeUndefined();
			expect(result['background hover']._layer1).toBeUndefined();
		});
	});

	describe('getSelectorsCss', () => {
		it('Returns null when attributes is null or undefined', () => {
			expect(getSelectorsCss({}, null)).toBeNull();
			expect(getSelectorsCss({}, undefined)).toBeNull();
		});

		it('Merges background layer selectors with existing selectors', () => {
			const existingSelectors = {
				button: { label: 'Button', target: '.button' },
			};
			const attributes = {
				'background-layers': [
					{ id: 'layer1', type: 'color', order: 1 },
				],
				'background-layers-hover': [],
				'block-background-status-hover': true,
			};

			const result = getSelectorsCss(existingSelectors, attributes);

			expect(result).toHaveProperty('button');
			expect(result).toHaveProperty('background');
			expect(result).toHaveProperty('background hover');
		});

		it('Removes background hover when hover status is false', () => {
			const attributes = {
				'background-layers': [
					{ id: 'layer1', type: 'color', order: 1 },
				],
				'background-layers-hover': [],
				'block-background-status-hover': false,
			};

			const result = getSelectorsCss({}, attributes);

			expect(result).toHaveProperty('background');
			expect(result).not.toHaveProperty('background hover');
		});
	});

	describe('getCategoriesCss', () => {
		it('Removes background category when no layers exist', () => {
			const categories = ['typography', 'background', 'background hover'];
			const attributes = {
				'background-layers': [],
				'background-layers-hover': [],
				'block-background-status-hover': true,
			};

			const result = getCategoriesCss(categories, attributes);

			expect(result).not.toContain('background');
			expect(result).not.toContain('background hover');
			expect(result).toContain('typography');
		});

		it('Removes background hover when hover status is false', () => {
			const categories = ['typography', 'background', 'background hover'];
			const attributes = {
				'background-layers': [{ id: 'layer1' }],
				'background-layers-hover': [],
				'block-background-status-hover': false,
			};

			const result = getCategoriesCss(categories, attributes);

			expect(result).toContain('background');
			expect(result).not.toContain('background hover');
			expect(result).toContain('typography');
		});

		it('Keeps both categories when layers exist and hover is enabled', () => {
			const categories = ['typography', 'background', 'background hover'];
			const attributes = {
				'background-layers': [{ id: 'layer1' }],
				'background-layers-hover': [{ id: 'layer2' }],
				'block-background-status-hover': true,
			};

			const result = getCategoriesCss(categories, attributes);

			expect(result).toContain('background');
			expect(result).toContain('background hover');
			expect(result).toContain('typography');
		});

		it('Handles undefined attributes with default values', () => {
			const categories = ['typography', 'background', 'background hover'];
			const attributes = {};

			const result = getCategoriesCss(categories, attributes);

			expect(result).not.toContain('background');
			expect(result).not.toContain('background hover');
			expect(result).toContain('typography');
		});
	});
});
