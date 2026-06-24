import {
	getRequestedTargetFromMessage,
	isTargetedPatternTarget,
} from '../ai/patterns/targeting';

describe('pattern targeting helpers', () => {
	test('detects icon target from message and svg icon selection', () => {
		expect(
			getRequestedTargetFromMessage('cart icon', {
				selectedBlockName: 'maxi-blocks/svg-icon-maxi',
			})
		).toBe('icon');

		expect(
			getRequestedTargetFromMessage('background colour', {
				selectedBlockName: 'maxi-blocks/svg-icon-maxi',
			})
		).toBe('icon');
	});

	test('prefers explicit container wording over icon selection', () => {
		expect(
			getRequestedTargetFromMessage('set container background colour', {
				selectedBlockName: 'maxi-blocks/svg-icon-maxi',
			})
		).toBe('container');
	});

	test('defaults to selected button target for ambiguous icon prompts', () => {
		expect(
			getRequestedTargetFromMessage('cart icon', {
				selectedBlockName: 'maxi-blocks/button-maxi',
			})
		).toBe('button');
	});

	test('tracks which pattern targets are gated', () => {
		expect(isTargetedPatternTarget('button')).toBe(true);
		expect(isTargetedPatternTarget('icon')).toBe(true);
		expect(isTargetedPatternTarget('number-counter')).toBe(true);
		expect(isTargetedPatternTarget(undefined)).toBe(false);
		expect(isTargetedPatternTarget(null)).toBe(false);
		expect(isTargetedPatternTarget('row')).toBe(true);
	});
});
