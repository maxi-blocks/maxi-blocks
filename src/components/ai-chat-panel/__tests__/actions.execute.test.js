import executeActionEnvelope from '../ai/actions/actions.execute';
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
