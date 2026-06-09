/**
 * Internal dependencies
 */
import { buildPassthroughLlmContext } from '../hooks/llm/buildPassthroughLlmContext';

describe('buildPassthroughLlmContext', () => {
	it('includes selected block details only once in selection scope', () => {
		const block = {
			name: 'maxi-blocks/text-maxi',
			clientId: 'abc',
			attributes: { content: 'Hello' },
			innerBlocks: [],
		};
		const ctx = buildPassthroughLlmContext({
			scope: 'selection',
			selectedBlock: block,
			activeStyleCard: null,
			logDebug: () => {},
		});
		const matches = ctx.match(/User has selected:/g);
		expect(matches).toHaveLength(1);
	});

	it('appends focus block once for page scope when a block is selected', () => {
		const block = {
			name: 'maxi-blocks/row-maxi',
			clientId: 'row1',
			attributes: {},
			innerBlocks: [],
		};
		const ctx = buildPassthroughLlmContext({
			scope: 'page',
			selectedBlock: block,
			activeStyleCard: null,
			logDebug: () => {},
		});
		expect(ctx).toContain('PAGE mode');
		const matches = ctx.match(/User has selected:/g);
		expect(matches).toHaveLength(1);
	});
});
