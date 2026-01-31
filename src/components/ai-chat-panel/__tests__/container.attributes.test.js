import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerAGroupAction,
	buildContainerAGroupAttributeChanges,
	getContainerAGroupSidebarTarget,
	buildContainerBGroupAction,
	buildContainerBGroupAttributeChanges,
	getContainerBGroupSidebarTarget,
	buildContainerCGroupAction,
	buildContainerCGroupAttributeChanges,
	getContainerCGroupSidebarTarget,
	buildContainerDGroupAction,
	buildContainerDGroupAttributeChanges,
	getContainerDGroupSidebarTarget,
	buildContainerEGroupAction,
	buildContainerEGroupAttributeChanges,
	getContainerEGroupSidebarTarget,
	buildContainerFGroupAction,
	buildContainerFGroupAttributeChanges,
	getContainerFGroupSidebarTarget,
	buildContainerHGroupAction,
	buildContainerHGroupAttributeChanges,
	getContainerHGroupSidebarTarget,
	buildContainerLGroupAction,
	buildContainerLGroupAttributeChanges,
	getContainerLGroupSidebarTarget,
	buildContainerMGroupAction,
	buildContainerMGroupAttributeChanges,
	getContainerMGroupSidebarTarget,
	buildContainerOGroupAction,
	buildContainerOGroupAttributeChanges,
	getContainerOGroupSidebarTarget,
	buildContainerPGroupAction,
	buildContainerPGroupAttributeChanges,
	getContainerPGroupSidebarTarget,
	buildContainerRGroupAction,
	buildContainerRGroupAttributeChanges,
	getContainerRGroupSidebarTarget,
	buildContainerSGroupAction,
	buildContainerSGroupAttributeChanges,
	getContainerSGroupSidebarTarget,
	buildContainerTGroupAction,
	buildContainerTGroupAttributeChanges,
	getContainerTGroupSidebarTarget,
	buildContainerWGroupAction,
	buildContainerWGroupAttributeChanges,
	getContainerWGroupSidebarTarget,
	buildContainerZGroupAction,
	buildContainerZGroupAttributeChanges,
	getContainerZGroupSidebarTarget,
} from '../ai/utils/containerGroups';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];

describe('container A attributes', () => {
	const aAttributes = containerAttributes.filter(
		attr =>
			/^a/i.test(attr) &&
			!attr.startsWith('advanced-css-') &&
			attr !== 'anchorLink' &&
			attr !== 'ariaLabels'
	);

	const getBreakpoint = attribute => attribute.split('-').pop();

	const buildExpectedForAttribute = attribute => {
		if (attribute.startsWith('align-content-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'align_content',
				value: { value: 'space-between', breakpoint },
				expectedKey: `align-content-${breakpoint}`,
				expectedValue: 'space-between',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('align-items-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'align_items_flex',
				value: { value: 'flex-start', breakpoint },
				expectedKey: `align-items-${breakpoint}`,
				expectedValue: 'flex-start',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('arrow-position-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'arrow_position',
				value: { value: 60, breakpoint },
				expectedKey: `arrow-position-${breakpoint}`,
				expectedValue: 60,
				expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
			};
		}

		if (attribute.startsWith('arrow-width-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'arrow_width',
				value: { value: 40, breakpoint },
				expectedKey: `arrow-width-${breakpoint}`,
				expectedValue: 40,
				expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
			};
		}

		if (attribute.startsWith('arrow-side-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'arrow_side',
				value: { value: 'top', breakpoint },
				expectedKey: `arrow-side-${breakpoint}`,
				expectedValue: 'top',
				expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
			};
		}

		if (attribute.startsWith('arrow-status-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'arrow_status',
				value: { value: true, breakpoint },
				expectedKey: `arrow-status-${breakpoint}`,
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
			};
		}

		return null;
	};

	test('A-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set the anchor ID to hero-section',
				property: 'anchor_link',
				value: 'hero-section',
			},
			{
				phrase: 'Set screen reader label to "Primary hero container"',
				property: 'aria_label',
				value: 'Primary hero container',
			},
			{
				phrase: 'Show the callout arrow',
				property: 'arrow_status',
				value: true,
			},
			{
				phrase: 'Move the arrow to the top',
				property: 'arrow_side',
				value: 'top',
			},
			{
				phrase: 'Set arrow position to 60',
				property: 'arrow_position',
				value: 60,
			},
			{
				phrase: 'Make the arrow 40px wide',
				property: 'arrow_width',
				value: 40,
			},
			{
				phrase: 'Align items to the top',
				property: 'align_items_flex',
				value: 'flex-start',
			},
			{
				phrase: 'Align content space between',
				property: 'align_content',
				value: 'space-between',
			},
			{
				phrase: 'Justify content space between',
				property: 'justify_content',
				value: 'space-between',
			},
			{
				phrase: 'On mobile, align items center',
				property: 'align_items_flex',
				value: { value: 'center', breakpoint: 'xs' },
			},
			{
				phrase: 'On tablet, align content space evenly',
				property: 'align_content',
				value: { value: 'space-evenly', breakpoint: 'm' },
			},
			{
				phrase: 'On desktop, hide the callout arrow',
				property: 'arrow_status',
				value: { value: false, breakpoint: 'xl' },
			},
			{
				phrase: 'On tablet, make the arrow 40px wide',
				property: 'arrow_width',
				value: { value: 40, breakpoint: 'm' },
			},
		];

		samples.forEach(sample => {
			const action = buildContainerAGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('each A attribute can be updated via A-group mapping', () => {
		const block = { attributes: { 'flex-direction-general': 'row' } };
		const missing = [];

		aAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerAGroupAttributeChanges(
				config.property,
				config.value,
				{ block, attributes: block.attributes }
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('A-group breakpoint prompts update the expected attribute and sidebar', () => {
		const block = { attributes: { 'flex-direction-general': 'row' } };
		const samples = [
			{
				phrase: 'On mobile, align items center',
				expectedKey: 'align-items-xs',
				expectedValue: 'center',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			},
			{
				phrase: 'On tablet, align content space evenly',
				expectedKey: 'align-content-m',
				expectedValue: 'space-evenly',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			},
			{
				phrase: 'On desktop, hide the callout arrow',
				expectedKey: 'arrow-status-xl',
				expectedValue: false,
				expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
			},
			{
				phrase: 'On tablet, make the arrow 40px wide',
				expectedKey: 'arrow-width-m',
				expectedValue: 40,
				expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
			},
		];

		samples.forEach(sample => {
			const action = buildContainerAGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			const changes = buildContainerAGroupAttributeChanges(
				action.property,
				action.value,
				{ block, attributes: block.attributes }
			);
			expect(changes).toBeTruthy();
			expect(changes[sample.expectedKey]).toBe(sample.expectedValue);

			const sidebar = getContainerAGroupSidebarTarget(action.property);
			expect(sidebar).toEqual(sample.expectedSidebar);
		});
	});

	test('A-group properties map to sidebar targets', () => {
		const missing = [];
		aAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerAGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container B attributes', () => {
	const bAttributes = containerAttributes.filter(attr => /^b/i.test(attr));

	const baseLayers = [
		{
			type: 'color',
			order: 0,
			'background-palette-status-general': true,
			'background-palette-color-general': 2,
			'background-color-general': 'var(--maxi-color-2)',
		},
	];

	const hoverLayers = [
		{
			type: 'color',
			order: 0,
			'background-palette-status-general': true,
			'background-palette-color-general': 5,
			'background-color-general': 'var(--maxi-color-5)',
		},
	];

	const BORDER_SAMPLE = { width: 2, style: 'solid', color: 3, opacity: 100 };
	const BORDER_HOVER_SAMPLE = { width: 4, style: 'dashed', color: 5, opacity: 80 };
	const BORDER_RADIUS_SAMPLE = 12;
	const BORDER_RADIUS_HOVER_SAMPLE = 16;
	const BOX_SHADOW_SAMPLE = {
		x: 0,
		y: 10,
		blur: 30,
		spread: 0,
		color: 8,
		opacity: 12,
	};
	const BOX_SHADOW_HOVER_SAMPLE = {
		x: 0,
		y: 16,
		blur: 32,
		spread: 0,
		color: 6,
		opacity: 18,
	};

	const resolveBorderExpectedValue = (attribute, sample) => {
		if (attribute.includes('border-style')) return sample.style;
		if (attribute.includes('border-top-width')) return sample.width;
		if (attribute.includes('border-bottom-width')) return sample.width;
		if (attribute.includes('border-left-width')) return sample.width;
		if (attribute.includes('border-right-width')) return sample.width;
		if (attribute.includes('border-sync-width')) return 'all';
		if (attribute.includes('border-unit-width')) return 'px';
		if (attribute.includes('border-palette-status')) return true;
		if (attribute.includes('border-palette-color')) return sample.color;
		if (attribute.includes('border-palette-opacity')) return sample.opacity;
		if (attribute.includes('border-palette-sc-status')) return false;
		if (attribute.includes('border-color')) {
			return `var(--maxi-color-${sample.color})`;
		}
		return null;
	};

	const resolveBorderRadiusExpectedValue = attribute => {
		if (attribute.includes('border-sync-radius')) return 'all';
		if (attribute.includes('border-unit-radius')) return 'px';
		return attribute.includes('hover')
			? BORDER_RADIUS_HOVER_SAMPLE
			: BORDER_RADIUS_SAMPLE;
	};

	const resolveBoxShadowExpectedValue = (attribute, sample) => {
		if (attribute === 'box-shadow-status-hover') return true;
		if (attribute.includes('box-shadow-horizontal-unit')) return 'px';
		if (attribute.includes('box-shadow-vertical-unit')) return 'px';
		if (attribute.includes('box-shadow-blur-unit')) return 'px';
		if (attribute.includes('box-shadow-spread-unit')) return 'px';
		if (attribute.includes('box-shadow-horizontal')) return sample.x;
		if (attribute.includes('box-shadow-vertical')) return sample.y;
		if (attribute.includes('box-shadow-blur')) return sample.blur;
		if (attribute.includes('box-shadow-spread')) return sample.spread;
		if (attribute.includes('box-shadow-inset')) return false;
		if (attribute.includes('box-shadow-palette-status')) return true;
		if (attribute.includes('box-shadow-palette-color')) return sample.color;
		if (attribute.includes('box-shadow-palette-opacity')) return sample.opacity;
		if (attribute.includes('box-shadow-palette-sc-status')) return false;
		if (attribute.includes('box-shadow-color')) return '';
		return null;
	};

	const buildExpectedForAttribute = attribute => {
		if (attribute === 'background-layers') {
			return {
				property: 'background_layers',
				value: baseLayers,
				expectedKey: 'background-layers',
				expectedValue: baseLayers,
				expectedSidebar: { tabIndex: 0, accordion: 'background / layer' },
			};
		}

		if (attribute === 'background-layers-hover') {
			return {
				property: 'background_layers_hover',
				value: hoverLayers,
				expectedKey: 'background-layers-hover',
				expectedValue: hoverLayers,
				expectedSidebar: { tabIndex: 0, accordion: 'background / layer' },
			};
		}

		if (attribute === 'block-background-status-hover') {
			return {
				property: 'block_background_status_hover',
				value: true,
				expectedKey: 'block-background-status-hover',
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'background / layer' },
			};
		}

		if (attribute === 'blockStyle') {
			return {
				property: 'block_style',
				value: 'dark',
				expectedKey: 'blockStyle',
				expectedValue: 'dark',
				expectedSidebar: { tabIndex: 0, accordion: 'block settings' },
			};
		}

		if (attribute.startsWith('breakpoints-')) {
			const breakpoint = attribute.replace('breakpoints-', '');
			return {
				property: 'breakpoints',
				value: { value: 900, breakpoint },
				expectedKey: `breakpoints-${breakpoint}`,
				expectedValue: 900,
				expectedSidebar: { tabIndex: 1, accordion: 'breakpoint' },
			};
		}

		if (attribute.startsWith('border-')) {
			if (attribute === 'border-status-hover') {
				return {
					property: 'border_hover',
					value: BORDER_HOVER_SAMPLE,
					expectedKey: 'border-status-hover',
					expectedValue: true,
					expectedSidebar: { tabIndex: 0, accordion: 'border' },
				};
			}

			const isHover = attribute.includes('-hover');
			const isRadius = attribute.includes('radius');
			if (isRadius) {
				return {
					property: isHover ? 'border_radius_hover' : 'border_radius',
					value: isHover ? BORDER_RADIUS_HOVER_SAMPLE : BORDER_RADIUS_SAMPLE,
					expectedKey: attribute,
					expectedValue: resolveBorderRadiusExpectedValue(attribute),
					expectedSidebar: { tabIndex: 0, accordion: 'border' },
				};
			}

			const sample = isHover ? BORDER_HOVER_SAMPLE : BORDER_SAMPLE;
			return {
				property: isHover ? 'border_hover' : 'border',
				value: sample,
				expectedKey: attribute,
				expectedValue: resolveBorderExpectedValue(attribute, sample),
				expectedSidebar: { tabIndex: 0, accordion: 'border' },
			};
		}

		if (attribute.startsWith('box-shadow-')) {
			const isHover = attribute.includes('-hover');
			const sample = isHover ? BOX_SHADOW_HOVER_SAMPLE : BOX_SHADOW_SAMPLE;
			return {
				property: isHover ? 'box_shadow_hover' : 'box_shadow',
				value: sample,
				expectedKey: attribute,
				expectedValue: resolveBoxShadowExpectedValue(attribute, sample),
				expectedSidebar: { tabIndex: 0, accordion: 'box shadow' },
			};
		}

		return null;
	};

	test('B-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set block style to dark',
				property: 'block_style',
				value: 'dark',
			},
			{
				phrase: 'Set tablet breakpoint to 900',
				property: 'breakpoints',
				value: { value: 900, breakpoint: 'm' },
			},
			{
				phrase: 'Enable hover background',
				property: 'block_background_status_hover',
				value: true,
			},
			{
				phrase: 'Add a background layer with palette 2',
				property: 'background_layers',
				assert: action => Array.isArray(action.value) && action.value.length > 0,
			},
			{
				phrase: 'On hover add a background overlay layer with palette 3',
				property: 'background_layers_hover',
				assert: action => Array.isArray(action.value) && action.value.length > 0,
			},
			{
				phrase: 'Add a 2px solid border with palette 3',
				property: 'border',
				assert: action => action.value && action.value.width === 2,
			},
			{
				phrase: 'On hover, make the border 4px dashed palette 5',
				property: 'border_hover',
				assert: action => action.value && action.value.width === 4,
			},
			{
				phrase: 'On hover, make corners 16px',
				property: 'border_radius_hover',
				value: 16,
			},
			{
				phrase: 'Add a soft shadow with palette 8',
				property: 'box_shadow',
				assert: action => action.value && action.value.blur === 30,
			},
			{
				phrase: 'On hover, add a bold shadow with palette 6',
				property: 'box_shadow_hover',
				assert: action => action.value && action.value.blur === 25,
			},
		];

		samples.forEach(sample => {
			const action = buildContainerBGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.value !== undefined) {
				expect(action.value).toEqual(sample.value);
			}
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			}
		});
	});

	test('each B attribute can be updated via B-group mapping', () => {
		const missing = [];

		bAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || config.expectedValue === null || config.expectedValue === undefined) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerBGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toEqual(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('B-group properties map to sidebar targets', () => {
		const missing = [];
		bAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerBGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container C attributes', () => {
	const cAttributes = containerAttributes.filter(attr => /^c/i.test(attr));

	const getBreakpoint = attribute => attribute.split('-').pop();

	const sampleClValue = () => 'sample';

	const buildExpectedForAttribute = attribute => {
		if (attribute.startsWith('cl-')) {
			const sample = sampleClValue(attribute);
			return {
				property: 'cl_attributes',
				value: { [attribute]: sample },
				expectedKey: attribute,
				expectedValue: sample,
				expectedSidebar: { tabIndex: 0, accordion: 'context loop' },
			};
		}

		if (attribute.startsWith('column-gap-unit-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'column_gap',
				value: { value: 24, unit: 'px', breakpoint },
				expectedKey: `column-gap-unit-${breakpoint}`,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('column-gap-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'column_gap',
				value: { value: 24, unit: 'px', breakpoint },
				expectedKey: `column-gap-${breakpoint}`,
				expectedValue: 24,
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('custom-css-')) {
			const breakpoint = getBreakpoint(attribute);
			const cssValue = 'display: block;';
			return {
				property: 'custom_css',
				value: { css: cssValue, category: 'container', index: 'normal', breakpoint },
				expectedKey: `custom-css-${breakpoint}`,
				expectedValue: { container: { normal: cssValue } },
				expectedSidebar: { tabIndex: 1, accordion: 'custom css' },
			};
		}

		if (attribute === 'customLabel') {
			return {
				property: 'custom_label',
				value: 'Hero Section',
				expectedKey: 'customLabel',
				expectedValue: 'Hero Section',
				expectedSidebar: { tabIndex: 0, accordion: 'block settings' },
			};
		}

		return null;
	};

	test('C-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Loop recent posts',
				property: 'context_loop',
				assert: action => action.value && action.value.type === 'post',
			},
			{
				phrase: 'Loop WooCommerce products',
				property: 'context_loop',
				assert: action => action.value && action.value.type === 'product',
			},
			{
				phrase: 'Show oldest posts first',
				property: 'context_loop',
				assert: action =>
					action.value && action.value.orderBy === 'date' && action.value.order === 'asc',
			},
			{
				phrase: 'Add pagination',
				property: 'pagination',
				value: true,
			},
			{
				phrase: 'Switch pagination to load more',
				property: 'pagination_type',
				value: 'load_more',
			},
			{
				phrase: 'Use prev/next pagination links only',
				property: 'pagination_type',
				value: 'simple',
			},
			{
				phrase: 'Set load more text to "Load more posts"',
				property: 'pagination_load_more_label',
				value: 'Load more posts',
			},
			{
				phrase: 'Make pagination look like buttons',
				property: 'pagination_style',
				value: 'boxed',
			},
			{
				phrase: 'Space out page numbers to 20px',
				property: 'pagination_spacing',
				value: '20px',
			},
			{
				phrase: 'Set pagination next text to "Next >"',
				property: 'pagination_text',
				assert: action => action.value && action.value.nextText === 'Next >',
			},
			{
				phrase: 'Filter posts by author',
				property: 'context_loop',
				assert: action => action.value && action.value.relation === 'by-author',
			},
			{
				phrase: 'Show posts by author 12',
				property: 'context_loop',
				assert: action =>
					action.value &&
					action.value.relation === 'by-author' &&
					action.value.author === 12,
			},
			{
				phrase: 'Show specific posts 12, 15',
				property: 'context_loop',
				assert: action =>
					action.value &&
					action.value.relation === 'by-id' &&
					action.value.id === 12,
			},
			{
				phrase: 'Rename container label to "Hero Section"',
				property: 'custom_label',
				value: 'Hero Section',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerCGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.value !== undefined) {
				expect(action.value).toBe(sample.value);
			}
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			}
		});
	});

	test('each C attribute can be updated via C-group mapping', () => {
		const missing = [];

		cAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerCGroupAttributeChanges(
				config.property,
				config.value,
				{ attributes: {} }
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toEqual(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('pagination type mapping sets expected attributes', () => {
		const loadMore = buildContainerCGroupAttributeChanges('pagination_type', 'load_more');
		expect(loadMore).toMatchObject({
			'cl-pagination': true,
			'cl-pagination-show-page-list': false,
			'cl-pagination-next-text': 'Load More',
		});

		const simple = buildContainerCGroupAttributeChanges('pagination_type', 'simple');
		expect(simple).toMatchObject({
			'cl-pagination': true,
			'cl-pagination-show-page-list': false,
			'cl-pagination-previous-text': 'Previous',
			'cl-pagination-next-text': 'Next',
		});
	});

	test('C-group properties map to sidebar targets', () => {
		const missing = [];
		cAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerCGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container D attributes', () => {
	const dAttributes = containerAttributes.filter(attr => /^d/i.test(attr));

	const getBreakpoint = attribute => attribute.split('-').pop();

	const buildExpectedForAttribute = attribute => {
		if (attribute.startsWith('display-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'display',
				value: { value: 'none', breakpoint },
				expectedKey: `display-${breakpoint}`,
				expectedValue: 'none',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		return null;
	};

	test('D-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Hide this container',
				property: 'display',
				value: 'none',
			},
			{
				phrase: 'Show this container',
				property: 'display',
				value: 'flex',
			},
			{
				phrase: 'Set display to block',
				property: 'display',
				value: 'block',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerDGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toBe(sample.value);
		});
	});

	test('each D attribute can be updated via D-group mapping', () => {
		const missing = [];

		dAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerDGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('D-group properties map to sidebar targets', () => {
		const missing = [];
		dAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerDGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container E attributes', () => {
	const eAttributes = containerAttributes.filter(attr => /^e/i.test(attr));

	const buildExpectedForAttribute = attribute => {
		if (attribute === 'extraClassName') {
			return {
				property: 'extra_class_name',
				value: 'hero-section featured',
				expectedKey: 'extraClassName',
				expectedValue: 'hero-section featured',
				expectedSidebar: { tabIndex: 1, accordion: 'add css classes' },
			};
		}
		return null;
	};

	test('E-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Add CSS class hero-section',
				property: 'extra_class_name',
				value: 'hero-section',
			},
			{
				phrase: 'Set custom classes to "hero featured"',
				property: 'extra_class_name',
				value: 'hero featured',
			},
			{
				phrase: 'Remove custom classes',
				property: 'extra_class_name',
				value: '',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerEGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toBe(sample.value);
		});
	});

	test('each E attribute can be updated via E-group mapping', () => {
		const missing = [];

		eAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerEGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('E-group properties map to sidebar targets', () => {
		const missing = [];
		eAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerEGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container F attributes', () => {
	const fAttributes = containerAttributes.filter(attr => /^f/i.test(attr));

	const getBreakpoint = attribute => attribute.split('-').pop();

	const buildExpectedForAttribute = attribute => {
		if (attribute.startsWith('flex-basis-unit-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'flex_basis',
				value: { value: 40, unit: 'px', breakpoint },
				expectedKey: `flex-basis-unit-${breakpoint}`,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('flex-basis-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'flex_basis',
				value: { value: 40, unit: 'px', breakpoint },
				expectedKey: `flex-basis-${breakpoint}`,
				expectedValue: '40',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('flex-grow-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'flex_grow',
				value: { value: 1, breakpoint },
				expectedKey: `flex-grow-${breakpoint}`,
				expectedValue: 1,
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('flex-shrink-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'flex_shrink',
				value: { value: 0, breakpoint },
				expectedKey: `flex-shrink-${breakpoint}`,
				expectedValue: 0,
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('flex-direction-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'flex_direction',
				value: { value: 'row', breakpoint },
				expectedKey: `flex-direction-${breakpoint}`,
				expectedValue: 'row',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('flex-wrap-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'flex_wrap',
				value: { value: 'wrap', breakpoint },
				expectedKey: `flex-wrap-${breakpoint}`,
				expectedValue: 'wrap',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('force-aspect-ratio-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'force_aspect_ratio',
				value: { value: true, breakpoint },
				expectedKey: `force-aspect-ratio-${breakpoint}`,
				expectedValue: true,
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		if (attribute.startsWith('full-width-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'full_width',
				value: { value: true, breakpoint },
				expectedKey: `full-width-${breakpoint}`,
				expectedValue: true,
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		return null;
	};

	test('F-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set flex basis to 40%',
				property: 'flex_basis',
				value: '40%',
			},
			{
				phrase: 'Set flex grow to 1',
				property: 'flex_grow',
				value: 1,
			},
			{
				phrase: 'Set flex shrink to 0',
				property: 'flex_shrink',
				value: 0,
			},
			{
				phrase: 'Flex direction row',
				property: 'flex_direction',
				value: 'row',
			},
			{
				phrase: 'Allow flex wrap',
				property: 'flex_wrap',
				value: 'wrap',
			},
			{
				phrase: 'Force aspect ratio',
				property: 'force_aspect_ratio',
				value: true,
			},
			{
				phrase: 'Disable aspect ratio lock',
				property: 'force_aspect_ratio',
				value: false,
			},
			{
				phrase: 'Make full width',
				property: 'full_width',
				value: true,
			},
		];

		samples.forEach(sample => {
			const action = buildContainerFGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toBe(sample.value);
		});
	});

	test('each F attribute can be updated via F-group mapping', () => {
		const missing = [];

		fAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerFGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('F-group properties map to sidebar targets', () => {
		const missing = [];
		fAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerFGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container H attributes', () => {
	const hAttributes = containerAttributes.filter(attr => /^h/i.test(attr));

	const getBreakpoint = attribute => attribute.split('-').pop();

	const buildExpectedForAttribute = attribute => {
		if (attribute.startsWith('height-unit-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'height',
				value: { value: 320, unit: 'px', breakpoint },
				expectedKey: `height-unit-${breakpoint}`,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
			};
		}

		if (attribute.startsWith('height-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'height',
				value: { value: 320, unit: 'px', breakpoint },
				expectedKey: `height-${breakpoint}`,
				expectedValue: 320,
				expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
			};
		}

		return null;
	};

	test('H-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set height to 420px',
				property: 'height',
				value: { value: 420, unit: 'px' },
				assert: action => action.value && action.value.value === 420,
			},
			{
				phrase: 'Set tablet height to 320px',
				property: 'height',
				value: { value: 320, unit: 'px', breakpoint: 'm' },
				assert: action =>
					action.value &&
					action.value.value === 320 &&
					action.value.breakpoint === 'm',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerHGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			}
		});
	});

	test('each H attribute can be updated via H-group mapping', () => {
		const missing = [];

		hAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerHGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('H-group properties map to sidebar targets', () => {
		const missing = [];
		hAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerHGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container J attributes', () => {
	const jAttributes = containerAttributes.filter(attr => /^j/i.test(attr));

	const getBreakpoint = attribute => attribute.split('-').pop();

	const buildExpectedForAttribute = attribute => {
		if (attribute.startsWith('justify-content-')) {
			const breakpoint = getBreakpoint(attribute);
			return {
				property: 'justify_content',
				value: { value: 'space-between', breakpoint },
				expectedKey: `justify-content-${breakpoint}`,
				expectedValue: 'space-between',
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		return null;
	};

	test('J-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Justify content space between',
				property: 'justify_content',
				value: 'space-between',
			},
			{
				phrase: 'Justify content center',
				property: 'justify_content',
				value: 'center',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerAGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toBe(sample.value);
		});
	});

	test('each J attribute can be updated via mapping', () => {
		const missing = [];

		jAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerAGroupAttributeChanges(
				config.property,
				config.value,
				{ block: { attributes: {} }, attributes: {} }
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('J-group properties map to sidebar targets', () => {
		const missing = [];
		jAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerAGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container L attributes', () => {
	const lAttributes = containerAttributes.filter(attr => /^l/i.test(attr));

	const buildExpectedForAttribute = attribute => {
		if (attribute === 'linkSettings') {
			return {
				property: 'link_settings',
				value: { url: 'https://example.com', target: '_self', rel: '' },
				expectedKey: 'linkSettings',
				expectedValue: {
					url: 'https://example.com',
					opensInNewTab: false,
					noFollow: false,
					sponsored: false,
					ugc: false,
				},
				expectedSidebar: { tabIndex: 1, accordion: 'link' },
			};
		}

		return null;
	};

	test('L-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Link this section to https://example.com',
				property: 'link_settings',
				assert: action =>
					action.value &&
					action.value.url === 'https://example.com' &&
					action.value.opensInNewTab === false,
			},
			{
				phrase: 'Open in new tab and make it nofollow https://example.com',
				property: 'link_settings',
				assert: action =>
					action.value &&
					action.value.opensInNewTab === true &&
					action.value.noFollow === true,
			},
			{
				phrase: 'Link to current post',
				property: 'dc_link',
				assert: action => action.value && action.value.target === 'entity',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerLGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			}
		});
	});

	test('each L attribute can be updated via L-group mapping', () => {
		const missing = [];

		lAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerLGroupAttributeChanges(
				config.property,
				config.value,
				{ attributes: {} }
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toMatchObject(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('L-group properties map to sidebar targets', () => {
		const missing = [];
		lAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerLGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container M attributes', () => {
	const mAttributes = containerAttributes.filter(attr => /^m/i.test(attr));

	const WIDTH_VALUE = 1200;
	const HEIGHT_VALUE = 600;
	const MARGIN_VALUE = 40;

	const buildExpectedForAttribute = attribute => {
		const marginSideMatch = attribute.match(
			/^margin-(top|bottom|left|right)-(general|xxl|xl|l|m|s|xs)$/
		);
		if (marginSideMatch) {
			const side = marginSideMatch[1];
			const breakpoint = marginSideMatch[2];
			return {
				property: `margin_${side}`,
				value: { value: MARGIN_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: MARGIN_VALUE,
				expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
			};
		}

		const marginUnitMatch = attribute.match(
			/^margin-(top|bottom|left|right)-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (marginUnitMatch) {
			const side = marginUnitMatch[1];
			const breakpoint = marginUnitMatch[2];
			return {
				property: `margin_${side}`,
				value: { value: MARGIN_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
			};
		}

		const marginSyncMatch = attribute.match(/^margin-sync-(general|xxl|xl|l|m|s|xs)$/);
		if (marginSyncMatch) {
			const breakpoint = marginSyncMatch[1];
			return {
				property: 'margin',
				value: { value: MARGIN_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'all',
				expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
			};
		}

		const sizeMatch = attribute.match(
			/^(max|min)-(width|height)-(general|xxl|xl|l|m|s|xs)$/
		);
		if (sizeMatch) {
			const type = sizeMatch[1];
			const axis = sizeMatch[2];
			const breakpoint = sizeMatch[3];
			const value = axis === 'width' ? WIDTH_VALUE : HEIGHT_VALUE;
			return {
				property: `${type}_${axis}`,
				value: { value, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: value,
				expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
			};
		}

		const sizeUnitMatch = attribute.match(
			/^(max|min)-(width|height)-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (sizeUnitMatch) {
			const type = sizeUnitMatch[1];
			const axis = sizeUnitMatch[2];
			const breakpoint = sizeUnitMatch[3];
			const value = axis === 'width' ? WIDTH_VALUE : HEIGHT_VALUE;
			return {
				property: `${type}_${axis}`,
				value: { value, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
			};
		}

		if (attribute === 'maxi-version-current') {
			return {
				property: 'maxi_version_current',
				value: '1.2.3',
				expectedKey: 'maxi-version-current',
				expectedValue: '1.2.3',
				expectedSidebar: { tabIndex: 0, accordion: 'block settings' },
			};
		}

		if (attribute === 'maxi-version-origin') {
			return {
				property: 'maxi_version_origin',
				value: '1.0.0',
				expectedKey: 'maxi-version-origin',
				expectedValue: '1.0.0',
				expectedSidebar: { tabIndex: 0, accordion: 'block settings' },
			};
		}

		return null;
	};

	test('M-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set margin top to 24px',
				property: 'margin_top',
				value: '24px',
			},
			{
				phrase: 'Set margin-top to 24px',
				property: 'margin_top',
				value: '24px',
			},
			{
				phrase: 'Set margin to 16px',
				property: 'margin',
				value: '16px',
			},
			{
				phrase: 'Remove margin bottom',
				property: 'margin_bottom',
				value: '0px',
			},
			{
				phrase: 'Set max width to 1200px',
				property: 'max_width',
				value: '1200px',
			},
			{
				phrase: 'Set max-width to 1200px',
				property: 'max_width',
				value: '1200px',
			},
			{
				phrase: 'Set min width to 320px',
				property: 'min_width',
				value: '320px',
			},
			{
				phrase: 'Set max height to 80vh',
				property: 'max_height',
				value: '80vh',
			},
			{
				phrase: 'Set min height to 400px',
				property: 'min_height',
				value: '400px',
			},
			{
				phrase: 'Set current Maxi version to 1.2.3',
				property: 'maxi_version_current',
				value: '1.2.3',
			},
			{
				phrase: 'Set Maxi origin version to 1.0.0',
				property: 'maxi_version_origin',
				value: '1.0.0',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerMGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.value !== undefined) {
				expect(action.value).toBe(sample.value);
			}
		});
	});

	test('each M attribute can be updated via M-group mapping', () => {
		const missing = [];

		mAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerMGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('M-group properties map to sidebar targets', () => {
		const missing = [];

		mAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerMGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container O attributes', () => {
	const oAttributes = containerAttributes.filter(attr => /^o/i.test(attr));

	const OPACITY_VALUE = 0.6;
	const HOVER_OPACITY_VALUE = 0.25;
	const ORDER_VALUE = 2;
	const OVERFLOW_VALUE = 'hidden';

	const buildExpectedForAttribute = attribute => {
		const hoverOpacityMatch = attribute.match(
			/^opacity-(general|xxl|xl|l|m|s|xs)-hover$/
		);
		if (hoverOpacityMatch) {
			const breakpoint = hoverOpacityMatch[1];
			return {
				property: 'opacity_hover',
				value: { value: HOVER_OPACITY_VALUE, breakpoint },
				expectedKey: attribute,
				expectedValue: HOVER_OPACITY_VALUE,
				expectedSidebar: { tabIndex: 1, accordion: 'opacity' },
			};
		}

		const opacityMatch = attribute.match(/^opacity-(general|xxl|xl|l|m|s|xs)$/);
		if (opacityMatch) {
			const breakpoint = opacityMatch[1];
			return {
				property: 'opacity',
				value: { value: OPACITY_VALUE, breakpoint },
				expectedKey: attribute,
				expectedValue: OPACITY_VALUE,
				expectedSidebar: { tabIndex: 1, accordion: 'opacity' },
			};
		}

		if (attribute === 'opacity-status-hover') {
			return {
				property: 'opacity_status_hover',
				value: true,
				expectedKey: 'opacity-status-hover',
				expectedValue: true,
				expectedSidebar: { tabIndex: 1, accordion: 'opacity' },
			};
		}

		const orderMatch = attribute.match(/^order-(general|xxl|xl|l|m|s|xs)$/);
		if (orderMatch) {
			const breakpoint = orderMatch[1];
			return {
				property: 'order',
				value: { value: ORDER_VALUE, breakpoint },
				expectedKey: attribute,
				expectedValue: ORDER_VALUE,
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		const overflowXMatch = attribute.match(/^overflow-x-(general|xxl|xl|l|m|s|xs)$/);
		if (overflowXMatch) {
			const breakpoint = overflowXMatch[1];
			return {
				property: 'overflow_x',
				value: { value: OVERFLOW_VALUE, breakpoint },
				expectedKey: attribute,
				expectedValue: OVERFLOW_VALUE,
				expectedSidebar: { tabIndex: 1, accordion: 'overflow' },
			};
		}

		const overflowYMatch = attribute.match(/^overflow-y-(general|xxl|xl|l|m|s|xs)$/);
		if (overflowYMatch) {
			const breakpoint = overflowYMatch[1];
			return {
				property: 'overflow_y',
				value: { value: OVERFLOW_VALUE, breakpoint },
				expectedKey: attribute,
				expectedValue: OVERFLOW_VALUE,
				expectedSidebar: { tabIndex: 1, accordion: 'overflow' },
			};
		}

		return null;
	};

	test('O-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set opacity to 60%',
				property: 'opacity',
				value: 0.6,
			},
			{
				phrase: 'Set hover opacity to 25%',
				property: 'opacity_hover',
				value: 0.25,
			},
			{
				phrase: 'Disable opacity hover',
				property: 'opacity_status_hover',
				value: false,
			},
			{
				phrase: 'Set tablet opacity to 50%',
				property: 'opacity',
				value: { value: 0.5, breakpoint: 'm' },
			},
			{
				phrase: 'Set order to 2',
				property: 'order',
				value: 2,
			},
			{
				phrase: 'Set overflow to hidden',
				property: 'overflow',
				value: 'hidden',
			},
			{
				phrase: 'Set overflow x to scroll',
				property: 'overflow_x',
				value: 'scroll',
			},
			{
				phrase: 'Set overflow y to auto',
				property: 'overflow_y',
				value: 'auto',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerOGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (typeof sample.value === 'number') {
				expect(action.value).toBeCloseTo(sample.value, 3);
			} else if (sample.value !== undefined) {
				expect(action.value).toEqual(sample.value);
			}
		});
	});

	test('each O attribute can be updated via O-group mapping', () => {
		const missing = [];

		oAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerOGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('O-group properties map to sidebar targets', () => {
		const missing = [];

		oAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerOGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container P attributes', () => {
	const pAttributes = containerAttributes.filter(attr => /^p/i.test(attr));

	const PADDING_VALUE = 24;
	const POSITION_VALUE = 16;
	const POSITION_MODE = 'absolute';

	const getBreakpoint = attribute => attribute.split('-').pop();

	const buildExpectedForAttribute = attribute => {
		const paddingSideMatch = attribute.match(
			/^padding-(top|right|bottom|left)-(general|xxl|xl|l|m|s|xs)$/
		);
		if (paddingSideMatch) {
			const side = paddingSideMatch[1];
			const breakpoint = paddingSideMatch[2];
			return {
				property: `padding_${side}`,
				value: { value: PADDING_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: PADDING_VALUE,
				expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
			};
		}

		const paddingUnitMatch = attribute.match(
			/^padding-(top|right|bottom|left)-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (paddingUnitMatch) {
			const side = paddingUnitMatch[1];
			const breakpoint = paddingUnitMatch[2];
			return {
				property: `padding_${side}`,
				value: { value: PADDING_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
			};
		}

		const paddingSyncMatch = attribute.match(/^padding-sync-(general|xxl|xl|l|m|s|xs)$/);
		if (paddingSyncMatch) {
			const breakpoint = paddingSyncMatch[1];
			return {
				property: 'padding',
				value: { value: PADDING_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'all',
				expectedSidebar: { tabIndex: 0, accordion: 'margin / padding' },
			};
		}

		const positionModeMatch = attribute.match(/^position-(general|xxl|xl|l|m|s|xs)$/);
		if (positionModeMatch) {
			const breakpoint = positionModeMatch[1];
			return {
				property: 'position',
				value: { value: POSITION_MODE, breakpoint },
				expectedKey: attribute,
				expectedValue: POSITION_MODE,
				expectedSidebar: { tabIndex: 1, accordion: 'position' },
			};
		}

		const positionAxisMatch = attribute.match(
			/^position-(top|right|bottom|left)-(general|xxl|xl|l|m|s|xs)$/
		);
		if (positionAxisMatch) {
			const axis = positionAxisMatch[1];
			const breakpoint = positionAxisMatch[2];
			return {
				property: `position_${axis}`,
				value: { value: POSITION_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: POSITION_VALUE,
				expectedSidebar: { tabIndex: 1, accordion: 'position' },
			};
		}

		const positionUnitMatch = attribute.match(
			/^position-(top|right|bottom|left)-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (positionUnitMatch) {
			const axis = positionUnitMatch[1];
			const breakpoint = positionUnitMatch[2];
			return {
				property: `position_${axis}`,
				value: { value: POSITION_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'px',
				expectedSidebar: { tabIndex: 1, accordion: 'position' },
			};
		}

		const positionSyncMatch = attribute.match(/^position-sync-(general|xxl|xl|l|m|s|xs)$/);
		if (positionSyncMatch) {
			const breakpoint = positionSyncMatch[1];
			return {
				property: 'position_top',
				value: { value: POSITION_VALUE, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: 'none',
				expectedSidebar: { tabIndex: 1, accordion: 'position' },
			};
		}

		return null;
	};

	test('P-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set padding top to 24px',
				property: 'padding_top',
				assert: action => action.value && action.value.value === 24,
			},
			{
				phrase: 'Set padding to 16px',
				property: 'padding',
				assert: action => action.value && action.value.value === 16,
			},
			{
				phrase: 'Remove padding left',
				property: 'padding_left',
				assert: action => action.value && action.value.value === 0,
			},
			{
				phrase: 'Set position to absolute',
				property: 'position',
				value: 'absolute',
			},
			{
				phrase: 'Set position top to 12px',
				property: 'position_top',
				assert: action => action.value && action.value.value === 12,
			},
			{
				phrase: 'Set tablet position bottom to 20px',
				property: 'position_bottom',
				assert: action =>
					action.value &&
					action.value.value === 20 &&
					action.value.breakpoint === 'm',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerPGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			} else if (sample.value !== undefined) {
				expect(action.value).toBe(sample.value);
			}
		});
	});

	test('each P attribute can be updated via P-group mapping', () => {
		const missing = [];

		pAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerPGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('P-group properties map to sidebar targets', () => {
		const missing = [];

		pAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerPGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container R attributes', () => {
	const rAttributes = containerAttributes.filter(
		attr => /^r/i.test(attr) && attr !== 'relations'
	);

	const ROW_GAP_VALUE = 24;
	const ROW_GAP_UNIT = 'px';

	const buildExpectedForAttribute = attribute => {
		const rowGapMatch = attribute.match(
			/^row-gap-(general|xxl|xl|l|m|s|xs)$/
		);
		if (rowGapMatch) {
			const breakpoint = rowGapMatch[1];
			return {
				property: 'row_gap',
				value: { value: ROW_GAP_VALUE, unit: ROW_GAP_UNIT, breakpoint },
				expectedKey: attribute,
				expectedValue: ROW_GAP_VALUE,
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		const rowGapUnitMatch = attribute.match(
			/^row-gap-unit-(general|xxl|xl|l|m|s|xs)$/
		);
		if (rowGapUnitMatch) {
			const breakpoint = rowGapUnitMatch[1];
			return {
				property: 'row_gap',
				value: { value: ROW_GAP_VALUE, unit: ROW_GAP_UNIT, breakpoint },
				expectedKey: attribute,
				expectedValue: ROW_GAP_UNIT,
				expectedSidebar: { tabIndex: 1, accordion: 'flexbox' },
			};
		}

		return null;
	};

	test('R-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set row gap to 24px',
				property: 'row_gap',
				assert: action =>
					action.value &&
					action.value.value === 24 &&
					action.value.unit === 'px',
			},
			{
				phrase: 'Set tablet row gap to 12px',
				property: 'row_gap',
				assert: action =>
					action.value &&
					action.value.value === 12 &&
					action.value.breakpoint === 'm',
			},
			{
				phrase: 'Remove row gap',
				property: 'row_gap',
				assert: action => action.value && action.value.value === 0,
			},
		];

		samples.forEach(sample => {
			const action = buildContainerRGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			} else if (sample.value !== undefined) {
				expect(action.value).toEqual(sample.value);
			}
		});
	});

	test('each R attribute can be updated via R-group mapping', () => {
		const missing = [];

		rAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedKey) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerRGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!config.expectedKey || !(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('R-group properties map to sidebar targets', () => {
		const missing = [];

		rAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerRGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container S attributes', () => {
	const sAttributes = containerAttributes.filter(attr => /^s/i.test(attr));

	const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	const SCROLL_SPEED_VALUE = 600;
	const SCROLL_DELAY_VALUE = 200;
	const SCROLL_EASING_VALUE = 'ease-in-out';
	const SCROLL_VIEWPORT_TOP_VALUE = 'mid';
	const SCROLL_ZONES_VALUE = { 0: 0, 50: 50, 100: 100 };
	const SCROLL_UNIT_VALUE = 'px';

	const SHAPE_HEIGHT_VALUE = 120;
	const SHAPE_OPACITY_VALUE = 0.6;
	const SHAPE_COLOR_VALUE = '#ffffff';
	const SHAPE_PALETTE_COLOR = 3;
	const SHAPE_PALETTE_OPACITY = 70;

	const scrollAttrMap = {
		status: { prop: 'status', value: true, usesBreakpoint: true },
		speed: { prop: 'speed', value: SCROLL_SPEED_VALUE, usesBreakpoint: true },
		delay: { prop: 'delay', value: SCROLL_DELAY_VALUE, usesBreakpoint: false },
		easing: { prop: 'easing', value: SCROLL_EASING_VALUE, usesBreakpoint: true },
		'viewport-top': {
			prop: 'viewport_top',
			value: SCROLL_VIEWPORT_TOP_VALUE,
			usesBreakpoint: true,
		},
		zones: { prop: 'zones', value: SCROLL_ZONES_VALUE, usesBreakpoint: true },
		'preview-status': { prop: 'preview_status', value: true, usesBreakpoint: false },
		'is-block-zone': { prop: 'is_block_zone', value: true, usesBreakpoint: false },
		'status-reverse': { prop: 'status_reverse', value: true, usesBreakpoint: false },
		unit: { prop: 'unit', value: SCROLL_UNIT_VALUE, usesBreakpoint: false },
	};

	const buildExpectedForAttribute = attribute => {
		if (attribute.startsWith('scroll-')) {
			const match = attribute.match(/^scroll-([A-Za-z]+)-(.+)$/);
			if (!match) return null;
			const effect = match[1];
			const suffix = match[2];
			const parts = suffix.split('-');
			const maybeBp = parts[parts.length - 1];
			const hasBreakpoint = BREAKPOINTS.includes(maybeBp);
			const attrKey = hasBreakpoint ? parts.slice(0, -1).join('-') : suffix;
			const mapping = scrollAttrMap[attrKey];
			if (!mapping) return null;

			const property = `scroll_${effect}_${mapping.prop}`;
			const value = mapping.usesBreakpoint
				? { value: mapping.value, breakpoint: maybeBp }
				: mapping.value;

			return {
				property,
				value,
				expectedKey: attribute,
				expectedValue: mapping.value,
				expectDeepEqual: attrKey === 'zones',
				expectedSidebar: { tabIndex: 1, accordion: 'scroll effects' },
			};
		}

		if (attribute.startsWith('shape-divider-')) {
			const match = attribute.match(/^shape-divider-(top|bottom)-(.+)$/);
			if (!match) return null;
			const position = match[1];
			const suffix = match[2];
			const parts = suffix.split('-');
			const maybeBp = parts[parts.length - 1];
			const hasBreakpoint = BREAKPOINTS.includes(maybeBp);
			const attrKey = hasBreakpoint ? parts.slice(0, -1).join('-') : suffix;

			if (attrKey === 'status') {
				return {
					property: `shape_divider_${position}_status`,
					value: true,
					expectedKey: attribute,
					expectedValue: true,
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			if (attrKey === 'shape-style') {
				return {
					property: `shape_divider_${position}_shape_style`,
					value: 'wave',
					expectedKey: attribute,
					expectedValue: 'wave',
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			if (attrKey === 'effects-status') {
				return {
					property: `shape_divider_${position}_effects_status`,
					value: true,
					expectedKey: attribute,
					expectedValue: true,
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			if (attrKey === 'height') {
				return {
					property: `shape_divider_${position}_height`,
					value: { value: SHAPE_HEIGHT_VALUE, unit: 'px', breakpoint: maybeBp },
					expectedKey: attribute,
					expectedValue: SHAPE_HEIGHT_VALUE,
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			if (attrKey === 'height-unit') {
				return {
					property: `shape_divider_${position}_height`,
					value: { value: SHAPE_HEIGHT_VALUE, unit: 'px', breakpoint: maybeBp },
					expectedKey: attribute,
					expectedValue: 'px',
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			if (attrKey === 'opacity') {
				return {
					property: `shape_divider_${position}_opacity`,
					value: { value: SHAPE_OPACITY_VALUE, breakpoint: maybeBp },
					expectedKey: attribute,
					expectedValue: SHAPE_OPACITY_VALUE,
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			if (attrKey === 'color') {
				return {
					property: `shape_divider_${position}_color`,
					value: { value: SHAPE_COLOR_VALUE, breakpoint: maybeBp },
					expectedKey: attribute,
					expectedValue: SHAPE_COLOR_VALUE,
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			if (attrKey === 'palette-color') {
				return {
					property: `shape_divider_${position}_palette_color`,
					value: { value: SHAPE_PALETTE_COLOR, breakpoint: maybeBp },
					expectedKey: attribute,
					expectedValue: SHAPE_PALETTE_COLOR,
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			if (attrKey === 'palette-opacity') {
				return {
					property: `shape_divider_${position}_palette_opacity`,
					value: { value: SHAPE_PALETTE_OPACITY, breakpoint: maybeBp },
					expectedKey: attribute,
					expectedValue: SHAPE_PALETTE_OPACITY,
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			if (attrKey === 'palette-status') {
				return {
					property: `shape_divider_${position}_palette_status`,
					value: { value: true, breakpoint: maybeBp },
					expectedKey: attribute,
					expectedValue: true,
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			if (attrKey === 'palette-sc-status') {
				return {
					property: `shape_divider_${position}_palette_sc_status`,
					value: { value: false, breakpoint: maybeBp },
					expectedKey: attribute,
					expectedValue: false,
					expectedSidebar: { tabIndex: 0, accordion: 'shape divider' },
				};
			}

			return null;
		}

		if (attribute === 'shortcutEffect') {
			return {
				property: 'shortcut_effect',
				value: 1,
				expectedKey: attribute,
				expectedValue: 1,
				expectedSidebar: { tabIndex: 1, accordion: 'scroll effects' },
			};
		}

		if (attribute === 'shortcutEffectType') {
			const shortcutValue = { fade: 2 };
			return {
				property: 'shortcut_effect_type',
				value: shortcutValue,
				expectedKey: attribute,
				expectedValue: shortcutValue,
				expectDeepEqual: true,
				expectedSidebar: { tabIndex: 1, accordion: 'scroll effects' },
			};
		}

		if (attribute === 'show-warning-box') {
			return {
				property: 'show_warning_box',
				value: false,
				expectedKey: attribute,
				expectedValue: false,
				expectedSidebar: { tabIndex: 0, accordion: 'callout arrow' },
			};
		}

		if (attribute === 'size-advanced-options') {
			return {
				property: 'size_advanced_options',
				value: true,
				expectedKey: attribute,
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
			};
		}

		return null;
	};

	test('S-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Enable scroll fade',
				property: 'scroll_fade_status',
				value: true,
			},
			{
				phrase: 'Set scroll blur speed to 600',
				property: 'scroll_blur_speed',
				value: 600,
			},
			{
				phrase: 'Set scroll rotate easing to ease-in-out',
				property: 'scroll_rotate_easing',
				value: 'ease-in-out',
			},
			{
				phrase: 'Set scroll vertical delay to 200',
				property: 'scroll_vertical_delay',
				value: 200,
			},
			{
				phrase: 'Set scroll horizontal viewport to top',
				property: 'scroll_horizontal_viewport_top',
				value: 'top',
			},
			{
				phrase: 'Set top shape divider height to 120px',
				property: 'shape_divider_top_height',
				assert: action => action.value && action.value.value === 120,
			},
			{
				phrase: 'Set bottom shape divider opacity to 60%',
				property: 'shape_divider_bottom_opacity',
				assert: action => action.value === 0.6,
			},
			{
				phrase: 'Set top shape divider color to #ffffff',
				property: 'shape_divider_top_color',
				value: '#ffffff',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerSGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			} else if (sample.value !== undefined) {
				expect(action.value).toEqual(sample.value);
			}
		});
	});

	test('scroll speed enables status for the active breakpoint', () => {
		const changes = buildContainerSGroupAttributeChanges(
			'scroll_blur_speed',
			{ value: 600, breakpoint: 'xl' }
		);

		expect(changes['scroll-blur-speed-xl']).toBe(600);
		expect(changes['scroll-blur-status-xl']).toBe(true);
	});

	test('each S attribute can be updated via S-group mapping', () => {
		const missing = [];

		sAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerSGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			if (config.expectDeepEqual) {
				expect(changes[config.expectedKey]).toEqual(config.expectedValue);
			} else {
				expect(changes[config.expectedKey]).toBe(config.expectedValue);
			}
		});

		expect(missing).toEqual([]);
	});

	test('S-group properties map to sidebar targets', () => {
		const missing = [];

		sAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerSGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container T attributes', () => {
	const tAttributes = containerAttributes.filter(attr => /^t/i.test(attr));

	const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	const TRANSFORM_TARGET = 'container';
	const SCALE_VALUE = 110;
	const ROTATE_VALUE = 15;
	const TRANSLATE_X = 20;
	const TRANSLATE_Y = -10;
	const ORIGIN_X = 'left';
	const ORIGIN_Y = 'top';

	const TRANSITION_DURATION = 0.4;
	const TRANSITION_BASE = {
		canvas: {
			border: {
				'transition-duration-general': 0.3,
				'transition-delay-general': 0,
				easing-general: 'ease',
				'transition-status-general': true,
			},
		},
		transform: {
			container: {
				'transition-duration-general': 0.3,
				'transition-delay-general': 0,
				easing-general: 'ease',
				'transition-status-general': true,
			},
		},
	};

	const buildExpectedForAttribute = attribute => {
		const scaleMatch = attribute.match(/^transform-scale-(general|xxl|xl|l|m|s|xs)$/);
		if (scaleMatch) {
			const breakpoint = scaleMatch[1];
			return {
				property: 'transform_scale',
				value: { x: SCALE_VALUE, y: SCALE_VALUE, breakpoint },
				expectedKey: attribute,
				expectedValue: {
					[TRANSFORM_TARGET]: {
						normal: { x: SCALE_VALUE, y: SCALE_VALUE },
					},
				},
				expectDeepEqual: true,
				expectedSidebar: { tabIndex: 1, accordion: 'transform' },
			};
		}

		const rotateMatch = attribute.match(/^transform-rotate-(general|xxl|xl|l|m|s|xs)$/);
		if (rotateMatch) {
			const breakpoint = rotateMatch[1];
			return {
				property: 'transform_rotate',
				value: { z: ROTATE_VALUE, breakpoint },
				expectedKey: attribute,
				expectedValue: {
					[TRANSFORM_TARGET]: {
						normal: { z: ROTATE_VALUE },
					},
				},
				expectDeepEqual: true,
				expectedSidebar: { tabIndex: 1, accordion: 'transform' },
			};
		}

		const translateMatch = attribute.match(/^transform-translate-(general|xxl|xl|l|m|s|xs)$/);
		if (translateMatch) {
			const breakpoint = translateMatch[1];
			return {
				property: 'transform_translate',
				value: { x: TRANSLATE_X, y: TRANSLATE_Y, unit: 'px', breakpoint },
				expectedKey: attribute,
				expectedValue: {
					[TRANSFORM_TARGET]: {
						normal: {
							x: TRANSLATE_X,
							y: TRANSLATE_Y,
							'x-unit': 'px',
							'y-unit': 'px',
						},
					},
				},
				expectDeepEqual: true,
				expectedSidebar: { tabIndex: 1, accordion: 'transform' },
			};
		}

		const originMatch = attribute.match(/^transform-origin-(general|xxl|xl|l|m|s|xs)$/);
		if (originMatch) {
			const breakpoint = originMatch[1];
			return {
				property: 'transform_origin',
				value: { x: ORIGIN_X, y: ORIGIN_Y, breakpoint },
				expectedKey: attribute,
				expectedValue: {
					[TRANSFORM_TARGET]: {
						normal: {
							x: ORIGIN_X,
							y: ORIGIN_Y,
						},
					},
				},
				expectDeepEqual: true,
				expectedSidebar: { tabIndex: 1, accordion: 'transform' },
			};
		}

		if (attribute === 'transform-target') {
			return {
				property: 'transform_target',
				value: TRANSFORM_TARGET,
				expectedKey: attribute,
				expectedValue: TRANSFORM_TARGET,
				expectedSidebar: { tabIndex: 1, accordion: 'transform' },
			};
		}

		if (attribute === 'transition') {
			const expectedTransition = {
				...TRANSITION_BASE,
				canvas: {
					...TRANSITION_BASE.canvas,
					border: {
						...TRANSITION_BASE.canvas.border,
						'transition-duration-general': TRANSITION_DURATION,
					},
				},
			};
			return {
				property: 'transition',
				value: {
					type: 'canvas',
					setting: 'border',
					attr: 'duration',
					value: TRANSITION_DURATION,
					breakpoint: 'general',
				},
				expectedKey: attribute,
				expectedValue: expectedTransition,
				expectDeepEqual: true,
				expectedSidebar: { tabIndex: 1, accordion: 'hover transition' },
				attributes: { transition: TRANSITION_BASE },
			};
		}

		if (attribute === 'transition-change-all') {
			return {
				property: 'transition_change_all',
				value: true,
				expectedKey: attribute,
				expectedValue: true,
				expectedSidebar: { tabIndex: 1, accordion: 'hover transition' },
			};
		}

		if (attribute === 'transition-canvas-selected') {
			return {
				property: 'transition_canvas_selected',
				value: 'border',
				expectedKey: attribute,
				expectedValue: 'border',
				expectedSidebar: { tabIndex: 1, accordion: 'hover transition' },
			};
		}

		if (attribute === 'transition-transform-selected') {
			return {
				property: 'transition_transform_selected',
				value: 'container',
				expectedKey: attribute,
				expectedValue: 'container',
				expectedSidebar: { tabIndex: 1, accordion: 'hover transition' },
			};
		}

		return null;
	};

	test('T-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Scale container to 110%',
				property: 'transform_scale',
				value: { x: 110, y: 110 },
			},
			{
				phrase: 'On hover, scale container to 105%',
				property: 'transform_scale_hover',
				assert: action => action.value?.state === 'hover',
			},
			{
				phrase: 'Rotate container to 15deg',
				property: 'transform_rotate',
				value: { z: 15 },
			},
			{
				phrase: 'Move container right 20px',
				property: 'transform_translate',
				assert: action => action.value?.x === 20 && action.value?.unit === 'px',
			},
			{
				phrase: 'Set transform origin to top left',
				property: 'transform_origin',
				value: { x: 'left', y: 'top' },
			},
			{
				phrase: 'Set transform target to background',
				property: 'transform_target',
				value: 'background',
			},
			{
				phrase: 'Set transition duration to 0.5s',
				property: 'transition',
				assert: action => action.value?.attr === 'duration',
			},
			{
				phrase: 'Set transition easing to ease-in-out',
				property: 'transition',
				assert: action => action.value?.attr === 'easing' && action.value?.value === 'ease-in-out',
			},
			{
				phrase: 'Select border transition',
				property: 'transition_canvas_selected',
				value: 'border',
			},
			{
				phrase: 'Set transform transition target to container',
				property: 'transition_transform_selected',
				value: 'container',
			},
			{
				phrase: 'Change all transitions',
				property: 'transition_change_all',
				value: true,
			},
		];

		samples.forEach(sample => {
			const action = buildContainerTGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			} else if (sample.value !== undefined) {
				expect(action.value).toEqual(sample.value);
			}
		});
	});

	test('each T attribute can be updated via T-group mapping', () => {
		const missing = [];

		tAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerTGroupAttributeChanges(
				config.property,
				config.value,
				{ attributes: config.attributes }
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			if (config.expectDeepEqual) {
				expect(changes[config.expectedKey]).toEqual(config.expectedValue);
			} else {
				expect(changes[config.expectedKey]).toBe(config.expectedValue);
			}
		});

		expect(missing).toEqual([]);
	});

	test('T-group properties map to sidebar targets', () => {
		const missing = [];

		tAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerTGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container W attributes', () => {
	const wAttributes = containerAttributes.filter(attr => /^w/i.test(attr));

	const WIDTH_VALUE = 640;
	const WIDTH_UNIT = 'px';

	const buildExpectedForAttribute = attribute => {
		const widthMatch = attribute.match(/^width-(general|xxl|xl|l|m|s|xs)$/);
		if (widthMatch) {
			const breakpoint = widthMatch[1];
			return {
				property: 'width',
				value: { value: WIDTH_VALUE, unit: WIDTH_UNIT, breakpoint },
				expectedKey: attribute,
				expectedValue: WIDTH_VALUE,
				expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
			};
		}

		const unitMatch = attribute.match(/^width-unit-(general|xxl|xl|l|m|s|xs)$/);
		if (unitMatch) {
			const breakpoint = unitMatch[1];
			return {
				property: 'width',
				value: { value: WIDTH_VALUE, unit: WIDTH_UNIT, breakpoint },
				expectedKey: attribute,
				expectedValue: WIDTH_UNIT,
				expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
			};
		}

		const fitContentMatch = attribute.match(/^width-fit-content-(general|xxl|xl|l|m|s|xs)$/);
		if (fitContentMatch) {
			const breakpoint = fitContentMatch[1];
			return {
				property: 'width',
				value: { value: 'fit-content', breakpoint },
				expectedKey: attribute,
				expectedValue: true,
				expectedSidebar: { tabIndex: 0, accordion: 'height / width' },
			};
		}

		return null;
	};

	test('W-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set width to 640px',
				property: 'width',
				value: { value: 640, unit: 'px' },
			},
			{
				phrase: 'Set width to fit content',
				property: 'width',
				value: 'fit-content',
			},
			{
				phrase: 'On mobile, set width to 90%',
				property: 'width',
				value: { value: 90, unit: '%', breakpoint: 'xs' },
			},
		];

		samples.forEach(sample => {
			const action = buildContainerWGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('each W attribute can be updated via W-group mapping', () => {
		const missing = [];

		wAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerWGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('W-group properties map to sidebar targets', () => {
		const missing = [];

		wAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerWGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

describe('container Z attributes', () => {
	const zAttributes = containerAttributes.filter(attr => /^z/i.test(attr));

	const Z_INDEX_VALUE = 7;

	const buildExpectedForAttribute = attribute => {
		const zMatch = attribute.match(/^z-index-(general|xxl|xl|l|m|s|xs)$/);
		if (zMatch) {
			const breakpoint = zMatch[1];
			return {
				property: 'z_index',
				value: { value: Z_INDEX_VALUE, breakpoint },
				expectedKey: attribute,
				expectedValue: Z_INDEX_VALUE,
				expectedSidebar: { tabIndex: 1, accordion: 'z-index' },
			};
		}

		return null;
	};

	test('Z-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Set z-index to 10',
				property: 'z_index',
				value: 10,
			},
			{
				phrase: 'On tablet, set z index to 5',
				property: 'z_index',
				value: { value: 5, breakpoint: 'm' },
			},
		];

		samples.forEach(sample => {
			const action = buildContainerZGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('each Z attribute can be updated via Z-group mapping', () => {
		const missing = [];

		zAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerZGroupAttributeChanges(
				config.property,
				config.value
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toBe(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('Z-group properties map to sidebar targets', () => {
		const missing = [];

		zAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerZGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});

