import validateActionEnvelopeDeep from '../ai/actions/actions.validate';
import { createActionEnvelope } from '../ai/actions/actions.schema';
import rawAttributes from '../ai/attributes/maxi-block-attributes.json';

const pickSampleAttribute = () => {
	const [blockName] = Object.keys(rawAttributes.blocks);
	const [attrName] = rawAttributes.blocks[blockName];
	return { blockName, attrName };
};

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
