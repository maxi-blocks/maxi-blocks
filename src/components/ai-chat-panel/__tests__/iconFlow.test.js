import validateActionEnvelopeDeep from '../ai/actions/actions.validate';
import { createActionEnvelope, ActionTypes } from '../ai/actions/actions.schema';
import rawAttributes from '../ai/attributes/maxi-block-attributes.json';

const findIconAttribute = () => {
	for (const [blockName, attrs] of Object.entries(rawAttributes.blocks)) {
		const attr = attrs.find(item => item.toLowerCase().includes('icon'));
		if (attr) return { blockName, attr };
	}
	return null;
};

describe('icon flow', () => {
	test('icon selection validates into update action', () => {
		const target = findIconAttribute();
		expect(target).toBeTruthy();

		const envelope = createActionEnvelope({
			actions: [
				{
					type: ActionTypes.UPDATE_ATTRIBUTES,
					target: { scope: 'selected' },
					block: { name: target.blockName },
					attributes: {
						[target.attr]: 'arrow-right',
					},
				},
			],
		});

		const result = validateActionEnvelopeDeep(envelope);
		expect(result.ok).toBe(true);
	});
});
