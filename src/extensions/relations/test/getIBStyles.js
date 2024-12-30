import getIBStyles from '@extensions/relations/getIBStyles';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				receiveMaxiBreakpoints: jest.fn(() => ({
					xs: 480,
					s: 767,
					m: 1024,
					l: 1366,
					xl: 1920,
				})),
				receiveXXLSize: jest.fn(() => 1921),
			};
		}),
		createReduxStore: jest.fn(),
		register: jest.fn(),
		dispatch: jest.fn(() => {
			return { savePrevSavedAttrs: jest.fn() };
		}),
	};
});

describe('getIBStyles', () => {
	it('Should return correct object for SVG Icon block and Icon colour settings from IB', () => {
		const stylesObj = {
			'  .maxi-svg-icon-block__icon svg[data-fill]:not([fill^="none"])': {
				SVGPathFill: {
					label: 'SVG path-fill',
					general: {
						fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
					},
				},
			},
			'  .maxi-svg-icon-block__icon svg[data-fill]:not([fill^="none"]) *':
				{
					SVGPathFill: {
						label: 'SVG path-fill',
						general: {
							fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
						},
					},
				},
			'  .maxi-svg-icon-block__icon svg g[data-fill]:not([fill^="none"])':
				{
					SVGPathFill: {
						label: 'SVG path-fill',
						general: {
							fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
						},
					},
				},
			'  .maxi-svg-icon-block__icon svg use[data-fill]:not([fill^="none"])':
				{
					SVGPathFill: {
						label: 'SVG path-fill',
						general: {
							fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
						},
					},
				},
			'  .maxi-svg-icon-block__icon svg circle[data-fill]:not([fill^="none"])':
				{
					SVGPathFill: {
						label: 'SVG path-fill',
						general: {
							fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
						},
					},
				},
			'  .maxi-svg-icon-block__icon svg path[data-fill]:not([fill^="none"])':
				{
					SVGPathFill: {
						label: 'SVG path-fill',
						general: {
							fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
						},
					},
				},
			'  .maxi-svg-icon-block__icon svg path': {
				SVGPath: {
					label: 'SVG path',
					general: {},
				},
			},
			'  .maxi-svg-icon-block__icon svg[data-stroke]:not([stroke^="none"]) *':
				{
					SVGPathStroke: {
						label: 'SVG Path stroke',
						general: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
					},
				},
			'  .maxi-svg-icon-block__icon svg path[data-stroke]:not([stroke^="none"])':
				{
					SVGPathStroke: {
						label: 'SVG Path stroke',
						general: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
					},
				},
			'  .maxi-svg-icon-block__icon svg[data-stroke]:not([stroke^="none"])':
				{
					SVGPathStroke: {
						label: 'SVG Path stroke',
						general: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
					},
				},
			'  .maxi-svg-icon-block__icon svg g[data-stroke]:not([stroke^="none"])':
				{
					SVGPathStroke: {
						label: 'SVG Path stroke',
						general: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
					},
				},
			'  .maxi-svg-icon-block__icon svg use[data-stroke]:not([stroke^="none"])':
				{
					SVGPathStroke: {
						label: 'SVG Path stroke',
						general: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
					},
				},
			'  .maxi-svg-icon-block__icon svg circle[data-stroke]:not([stroke^="none"])':
				{
					SVGPathStroke: {
						label: 'SVG Path stroke',
						general: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
					},
				},
		};
		const blockAttributes = {};

		const result = getIBStyles({
			stylesObj,
			blockAttributes,
			isFirst: true,
		});

		const expectedResult = {
			'  .maxi-svg-icon-block__icon svg[data-fill]:not([fill^="none"])': {
				general: {
					styles: {
						fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
					},
					breakpoint: null,
				},
			},
			'  .maxi-svg-icon-block__icon svg[data-fill]:not([fill^="none"]) *':
				{
					general: {
						styles: {
							fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
						},
						breakpoint: null,
					},
				},
			'  .maxi-svg-icon-block__icon svg g[data-fill]:not([fill^="none"])':
				{
					general: {
						styles: {
							fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
						},
						breakpoint: null,
					},
				},
			'  .maxi-svg-icon-block__icon svg use[data-fill]:not([fill^="none"])':
				{
					general: {
						styles: {
							fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
						},
						breakpoint: null,
					},
				},
			'  .maxi-svg-icon-block__icon svg circle[data-fill]:not([fill^="none"])':
				{
					general: {
						styles: {
							fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
						},
						breakpoint: null,
					},
				},
			'  .maxi-svg-icon-block__icon svg path[data-fill]:not([fill^="none"])':
				{
					general: {
						styles: {
							fill: 'var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-3,155,155,155),1))',
						},
						breakpoint: null,
					},
				},
			'  .maxi-svg-icon-block__icon svg path': {
				general: {
					styles: {},
					breakpoint: null,
				},
			},
			'  .maxi-svg-icon-block__icon svg[data-stroke]:not([stroke^="none"]) *':
				{
					general: {
						styles: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
						breakpoint: null,
					},
				},
			'  .maxi-svg-icon-block__icon svg path[data-stroke]:not([stroke^="none"])':
				{
					general: {
						styles: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
						breakpoint: null,
					},
				},
			'  .maxi-svg-icon-block__icon svg[data-stroke]:not([stroke^="none"])':
				{
					general: {
						styles: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
						breakpoint: null,
					},
				},
			'  .maxi-svg-icon-block__icon svg g[data-stroke]:not([stroke^="none"])':
				{
					general: {
						styles: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
						breakpoint: null,
					},
				},
			'  .maxi-svg-icon-block__icon svg use[data-stroke]:not([stroke^="none"])':
				{
					general: {
						styles: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
						breakpoint: null,
					},
				},
			'  .maxi-svg-icon-block__icon svg circle[data-stroke]:not([stroke^="none"])':
				{
					general: {
						styles: {
							stroke: 'var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-8,150,176,203),1))',
						},
						breakpoint: null,
					},
				},
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return the correct object for Typography settings on IB', () => {
		const stylesObj = {
			general: {
				'font-size': '35px',
			},
		};
		const blockAttributes = {};

		const result = getIBStyles({
			stylesObj,
			blockAttributes,
			isFirst: true,
		});

		const expectedResult = {
			general: {
				styles: {
					'font-size': '35px',
				},
				breakpoint: null,
			},
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return the correct object for Typography on a XXL baseBreakpoint and XL deviceType', () => {
		const stylesObj = {
			xl: {
				'font-size': '20px',
			},
		};
		const blockAttributes = {};

		const result = getIBStyles({
			stylesObj,
			blockAttributes,
			isFirst: true,
		});

		const expectedResult = {
			xl: {
				styles: {
					'font-size': '20px',
				},
				breakpoint: 1920,
			},
		};

		expect(result).toStrictEqual(expectedResult);
	});
});
