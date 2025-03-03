import createIconTransitions from '@extensions/styles/transitions/createIconTransitions';

describe('createIconTransitions', () => {
	it('Creates basic icon transitions with default options', () => {
		const target = '.icon-class';
		const titlePrefix = 'Icon';

		const result = createIconTransitions({
			target,
			titlePrefix,
		});

		// Check color transitions
		expect(result['Icon colour']).toEqual({
			title: 'Icon colour',
			target: ' .icon-class svg > *:not(g)',
			property: false,
			hoverProp: 'status-hover',
		});

		expect(result['Icon colour two']).toEqual({
			title: 'Icon colour two',
			target: ' .icon-class svg g *:not(g)',
			property: false,
			hoverProp: 'status-hover',
		});

		// Check background, width, and border transitions
		expect(result['Icon background']).toEqual({
			title: 'Icon background',
			target: '.icon-class',
			property: 'background',
			hoverProp: 'status-hover',
		});

		expect(result['Icon width']).toEqual({
			title: 'Icon width',
			target: '.icon-class svg',
			property: ['width', 'height'],
			hoverProp: 'status-hover',
		});

		expect(result['Icon border']).toEqual({
			title: 'Icon border',
			target: '.icon-class',
			property: 'border',
			hoverProp: 'status-hover',
		});
	});

	it('Creates transitions with custom prefix', () => {
		const target = '.icon-class';
		const titlePrefix = 'Custom';
		const prefix = 'custom-';

		const result = createIconTransitions({
			target,
			titlePrefix,
			prefix,
		});

		// Verify custom prefix is used in hoverProp
		Object.values(result).forEach(transition => {
			expect(transition.hoverProp).toBe('custom-status-hover');
		});
	});

	it('Disables specific transitions when flags are set', () => {
		const target = '.icon-class';
		const titlePrefix = 'Icon';

		const result = createIconTransitions({
			target,
			titlePrefix,
			disableBackground: true,
			disableBorder: true,
			disableWidth: true,
		});

		// Check that disabled transitions are not included
		expect(result['Icon background']).toBeUndefined();
		expect(result['Icon width']).toBeUndefined();
		expect(result['Icon border']).toBeUndefined();

		// Check that color transitions still exist
		expect(result['Icon colour']).toBeDefined();
		expect(result['Icon colour two']).toBeDefined();
	});

	it('Creates transitions without title prefix', () => {
		const target = '.icon-class';

		const result = createIconTransitions({
			target,
		});

		// Check that transitions use unprefixed titles
		expect(result.colour).toEqual({
			title: 'Colour',
			target: ' .icon-class svg > *:not(g)',
			property: false,
			hoverProp: 'status-hover',
		});

		expect(result['colour two']).toEqual({
			title: 'Colour two',
			target: ' .icon-class svg g *:not(g)',
			property: false,
			hoverProp: 'status-hover',
		});
	});
});
