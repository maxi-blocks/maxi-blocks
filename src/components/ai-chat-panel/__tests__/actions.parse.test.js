import { parseActionEnvelope } from '../ai/actions/actions.parse';

describe('actions.parse', () => {
	test('extracts JSON from fenced block', () => {
		const text = `Here is your action:\n\n\`\`\`json\n{\"version\":1,\"actions\":[]}\n\`\`\``;
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
