import executeActionEnvelope from '../ai/actions/actions.execute';
import { parseActionEnvelope } from '../ai/actions/actions.parse';
import validateActionEnvelopeDeep from '../ai/actions/actions.validate';
import { createActionEnvelope, ActionTypes } from '../ai/actions/actions.schema';
import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import { normalizeAttributeName } from '../ai/attributes/attributeTypes';

const findAttribute = token => {
	for (const [blockName, attrs] of Object.entries(rawAttributes.blocks)) {
		const found = attrs.find(attr => attr.toLowerCase().includes(token));
		if (found) return { blockName, attrName: found };
	}
	return null;
};

const pickSampleAttribute = () => {
	const [blockName] = Object.keys(rawAttributes.blocks);
	const [attrName] = rawAttributes.blocks[blockName];
	return { blockName, attrName };
};

describe('actions.execute', () => {
	test('applies update_attributes using editor bridge', () => {
		const target = findAttribute('color') || findAttribute('width');
		expect(target).toBeTruthy();

		const envelope = createActionEnvelope({
			actions: [
				{
					type: ActionTypes.UPDATE_ATTRIBUTES,
					target: { scope: 'selected' },
					block: { name: target.blockName },
					attributes: {
						[target.attrName]: '#ffffff',
					},
				},
			],
		});

		const updateBlockAttributes = jest.fn();
		const editorBridge = {
			getSelectedClientIds: () => ['client-1'],
			updateBlockAttributes,
			getBlockAttributes: () => ({}),
		};

		const result = executeActionEnvelope(envelope, { editorBridge });

		expect(result.ok).toBe(true);
		expect(updateBlockAttributes).toHaveBeenCalledTimes(1);
		const payload = updateBlockAttributes.mock.calls[0][1];
		expect(payload).toHaveProperty(normalizeAttributeName(target.attrName));
	});
});

describe('actions.parse', () => {
	test('extracts JSON from fenced block', () => {
		const text = `Here is your action:\n\n\`\`\`json\n{"version":1,"actions":[]}\n\`\`\``;
		const result = parseActionEnvelope(text);
		expect(result.envelope).toBeTruthy();
		expect(result.error).toBeNull();
	});

	test('rejects invalid JSON', () => {
		const text = '```json\n{invalid}\n```';
		const result = parseActionEnvelope(text);
		expect(result.envelope).toBeNull();
		expect(result.error).toBeTruthy();
	});
});

describe('actions.validate', () => {
	test('rejects unknown action type', () => {
		const envelope = createActionEnvelope({
			actions: [{ type: 'unknown' }],
		});
		const result = validateActionEnvelopeDeep(envelope);
		expect(result.ok).toBe(false);
	});

	test('rejects missing target', () => {
		const { blockName } = pickSampleAttribute();
		const envelope = createActionEnvelope({
			actions: [
				{
					type: 'update_attributes',
					block: { name: blockName },
					attributes: {},
				},
			],
		});
		const result = validateActionEnvelopeDeep(envelope);
		expect(result.ok).toBe(false);
	});
});
