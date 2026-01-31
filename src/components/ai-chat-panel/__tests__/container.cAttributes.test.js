import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerCGroupAction,
	buildContainerCGroupAttributeChanges,
	getContainerCGroupSidebarTarget,
} from '../ai/utils/containerGroups';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
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

describe('container C attributes', () => {
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
