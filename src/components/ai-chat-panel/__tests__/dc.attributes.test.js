import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildDcGroupAction,
	buildDcGroupAttributeChanges,
	getDcGroupSidebarTarget,
	DC_BOOLEAN_ATTRIBUTES,
	DC_NUMBER_ATTRIBUTES,
	DC_URL_ATTRIBUTES,
} from '../ai/utils/dcGroup';

const DC_BLOCKS = ['text-maxi', 'image-maxi', 'button-maxi', 'divider-maxi'];

const dcAttributes = [
	...new Set(
		DC_BLOCKS.flatMap(blockName =>
			(rawAttributes.blocks[blockName] || []).filter(
				attr => typeof attr === 'string' && attr.startsWith('dc-')
			)
		)
	),
]
	.filter(attr => typeof attr === 'string')
	.sort();

const getSampleValue = attribute => {
	if (DC_BOOLEAN_ATTRIBUTES.has(attribute)) return true;
	if (DC_NUMBER_ATTRIBUTES.has(attribute)) return 12;
	if (attribute === 'dc-link-target') return 'entity';
	if (attribute === 'dc-link-url') return 'https://example.com';
	if (attribute === 'dc-media-url') return 'https://example.com/image.jpg';
	if (attribute === 'dc-delimiter-content') return ',';
	if (attribute === 'dc-custom-format') return 'd.m.Y t';
	if (attribute === 'dc-format') return 'd.m.Y';
	if (attribute === 'dc-timezone') return 'America/New_York';
	if (attribute === 'dc-timezone-name') return 'short';
	if (attribute === 'dc-locale') return 'en-US';
	if (attribute === 'dc-day') return '2-digit';
	if (attribute === 'dc-month') return 'long';
	if (attribute === 'dc-year') return 'numeric';
	if (attribute === 'dc-weekday') return 'short';
	if (attribute === 'dc-hour') return '2-digit';
	if (attribute === 'dc-minute') return '2-digit';
	if (attribute === 'dc-second') return '2-digit';
	if (attribute === 'dc-era') return 'short';
	if (attribute === 'dc-custom-date') return '2025-01-01';
	if (attribute === 'dc-order') return 'desc';
	if (attribute === 'dc-order-by') return 'date';
	if (attribute === 'dc-type') return 'posts';
	if (attribute === 'dc-source') return 'acf';
	if (attribute === 'dc-show') return 'current';
	if (attribute === 'dc-relation') return 'current';
	if (attribute === 'dc-field') return 'title';
	if (attribute === 'dc-sub-field') return 'name';
	if (attribute === 'dc-acf-field-type') return 'text';
	if (attribute === 'dc-acf-group') return 'group_123';
	if (attribute === 'dc-limit-by-archive') return 'yes';
	if (attribute === 'dc-media-caption') return 'Hero image';
	if (attribute === 'dc-content') return 'Hello world';
	if (attribute === 'dc-error') return 'Missing';
	return 'sample';
};

const buildPrompt = (attribute, value) => {
	if (DC_BOOLEAN_ATTRIBUTES.has(attribute)) {
		return `Enable ${attribute}`;
	}
	if (DC_URL_ATTRIBUTES.has(attribute)) {
		return `Set ${attribute} to ${value}`;
	}
	if (attribute === 'dc-delimiter-content') {
		return `Set ${attribute} to "${value}"`;
	}
	if (attribute === 'dc-custom-format') {
		return `Set ${attribute} to "${value}"`;
	}
	if (typeof value === 'string' && /\s/.test(value)) {
		return `Set ${attribute} to "${value}"`;
	}
	return `Set ${attribute} to ${value}`;
};

describe('dynamic content attributes', () => {
	test('DC prompt phrases resolve to expected properties', () => {
		dcAttributes.forEach(attribute => {
			const value = getSampleValue(attribute);
			const prompt = buildPrompt(attribute, value);
			const action = buildDcGroupAction(prompt);

			if (!action) {
				throw new Error(`buildDcGroupAction returned null for "${prompt}"`);
			}
			expect(action.property).toBe(attribute.replace(/-/g, '_'));
			expect(action.value).toEqual(value);
		});
	});

	test('each DC attribute can be updated via mapping', () => {
		const missing = [];

		dcAttributes.forEach(attribute => {
			const value = getSampleValue(attribute);
			const changes = buildDcGroupAttributeChanges(
				attribute.replace(/-/g, '_'),
				value
			);

			if (!changes || !(attribute in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[attribute]).toEqual(value);
		});

		expect(missing).toEqual([]);
	});

	test('DC properties map to dynamic content sidebar targets', () => {
		const missing = [];

		dcAttributes.forEach(attribute => {
			if (attribute.startsWith('dc-link-')) return;
			const sidebar = getDcGroupSidebarTarget(
				attribute.replace(/-/g, '_'),
				'maxi-blocks/text-maxi'
			);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual({ tabIndex: 1, accordion: 'dynamic content' });
		});

		expect(missing).toEqual([]);
	});

	test('DC sidebar targets respect block tab layouts', () => {
		expect(
			getDcGroupSidebarTarget('dc_status', 'maxi-blocks/button-maxi')
		).toEqual({ tabIndex: 2, accordion: 'dynamic content' });
		expect(
			getDcGroupSidebarTarget('dc_status', 'maxi-blocks/image-maxi')
		).toEqual({ tabIndex: 2, accordion: 'dynamic content' });
		expect(
			getDcGroupSidebarTarget('dc_status', 'maxi-blocks/divider-maxi')
		).toEqual({ tabIndex: 1, accordion: 'dynamic content' });
	});
});
