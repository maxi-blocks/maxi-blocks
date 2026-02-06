import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import { getAllowedAttributes, getBlockAttributeSpec } from '../ai/attributes/attributes.catalog';
import buildCoverageReport from '../ai/attributes/attributeCoverage';
import { normalizeAttributes } from '../ai/attributes/normalizeAttributes';
import { createAttributeRegistry } from '../ai/attributes/attributeRegistry';
import { validateAttributesForBlock } from '../ai/attributes/attributes.validate';
import { ATTRIBUTE_TYPES, inferAttributeType, normalizeAttributeName } from '../ai/attributes/attributeTypes';
import { buildAttributeManifest } from '../ai/attributes/manifest';

const sampleData = {
	blocks: {
		'test-block': ['background-color', 'font-size', 'is-enabled'],
	},
};

const findAttribute = tokens => {
	const tokenList = Array.isArray(tokens) ? tokens : [tokens];
	for (const [blockName, attrs] of Object.entries(rawAttributes.blocks)) {
		const found = attrs.find(attr =>
			tokenList.some(token => attr.toLowerCase().includes(token))
		);
		if (found) return { blockName, attrName: found };
	}
	return null;
};

const findNumberAttribute = () => {
	for (const [blockName, attrs] of Object.entries(rawAttributes.blocks)) {
		const found = attrs.find(attr => {
			const normalized = normalizeAttributeName(attr);
			return inferAttributeType(normalized) === ATTRIBUTE_TYPES.NUMBER;
		});
		if (found) return { blockName, attrName: found };
	}
	return null;
};

describe('attributes catalog', () => {
	test('loads allowed attributes for a block', () => {
		const [blockName] = Object.keys(rawAttributes.blocks);
		const allowed = getAllowedAttributes(blockName);
		expect(allowed.length).toBeGreaterThan(0);
	});

	test('returns attribute spec', () => {
		const [blockName] = Object.keys(rawAttributes.blocks);
		const [attrName] = rawAttributes.blocks[blockName];
		const spec = getBlockAttributeSpec(blockName, attrName);
		expect(spec).toBeTruthy();
		expect(spec.name).toBeDefined();
	});
});

describe('attribute coverage', () => {
	test('all attributes are registered', () => {
		const report = buildCoverageReport();
		expect(report.total).toBe(report.registered);
		expect(report.missing).toHaveLength(0);
	});
});

describe('attribute coverage manifest', () => {
	test('every attribute has a manifest entry with triggers', () => {
		const manifest = buildAttributeManifest(rawAttributes);

		for (const [block, attrs] of Object.entries(rawAttributes.blocks)) {
			for (const attribute of attrs) {
				const key = `${block}::${normalizeAttributeName(attribute)}`;
				const entry = manifest.get(key);
				expect(entry).toBeTruthy();
				expect(entry.type).toBeTruthy();
				expect(Array.isArray(entry.triggers)).toBe(true);
				expect(entry.triggers.length).toBeGreaterThan(0);
			}
		}
	});
});

describe('attribute registry', () => {
	test('builds registry for a block', () => {
		const normalized = normalizeAttributes(sampleData);
		const registry = createAttributeRegistry(normalized);
		const attrs = registry.getAttributesForBlock('test-block');
		expect(attrs).toHaveLength(3);
	});

	test('finds attributes by keyword', () => {
		const registry = createAttributeRegistry(normalizeAttributes(sampleData));
		const matches = registry.findAttribute('background', { block: 'test-block' });
		expect(matches.length).toBeGreaterThan(0);
		expect(matches[0].path).toContain('background');
	});
});

describe('attributes.validate', () => {
	test('rejects unknown attributes', () => {
		const [blockName] = Object.keys(rawAttributes.blocks);
		const result = validateAttributesForBlock(blockName, { 'not-real': 1 });
		expect(result.ok).toBe(false);
	});

	test('rejects wrong type for numbers', () => {
		const target = findNumberAttribute() || findAttribute(['opacity', 'width', 'height', 'size', 'radius']);
		expect(target).toBeTruthy();
		const result = validateAttributesForBlock(target.blockName, {
			[target.attrName]: 'not-a-number',
		});
		expect(result.ok).toBe(false);
	});

	test('accepts color values', () => {
		const target = findAttribute('color');
		expect(target).toBeTruthy();
		const result = validateAttributesForBlock(target.blockName, {
			[target.attrName]: '#fff',
		});
		expect(result.ok).toBe(true);
	});
});

describe('applyAttributeOps', () => {
	test.todo('add coverage once applyAttributeOps is implemented');
});

describe('validateAttribute', () => {
	test.todo('add coverage once validateAttribute is implemented');
});
