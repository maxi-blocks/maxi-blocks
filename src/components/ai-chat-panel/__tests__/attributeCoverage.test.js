import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import { buildAttributeManifest } from '../ai/attributes/manifest';
import { normalizeAttributeName } from '../ai/attributes/attributeTypes';

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
