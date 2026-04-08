/**
 * Internal dependencies
 */
import { resolveAiPanelModel } from '../hooks/llm/executePassthroughLlmTurn';

describe('resolveAiPanelModel', () => {
	const prev = typeof window !== 'undefined' ? window.maxiSettings : undefined;

	afterEach(() => {
		if (typeof window !== 'undefined') {
			if (prev === undefined) {
				delete window.maxiSettings;
			} else {
				window.maxiSettings = prev;
			}
		}
	});

	it('uses integration model when shared key is enabled', () => {
		window.maxiSettings = {
			ai_settings: {
				ai_panel_use_shared: true,
				model: 'gpt-4o',
				ai_panel_model: 'gpt-4o-mini',
			},
		};
		expect(resolveAiPanelModel()).toBe('gpt-4o');
	});

	it('uses panel model when dedicated key is enabled', () => {
		window.maxiSettings = {
			ai_settings: {
				ai_panel_use_shared: false,
				model: 'gpt-4o',
				ai_panel_model: 'gpt-4o-mini',
			},
		};
		expect(resolveAiPanelModel()).toBe('gpt-4o-mini');
	});

	it('falls back when stored model is empty string', () => {
		window.maxiSettings = {
			ai_settings: {
				ai_panel_use_shared: true,
				model: '   ',
				ai_panel_model: 'gpt-4o-mini',
			},
		};
		expect(resolveAiPanelModel()).toBe('gpt-3.5-turbo');
	});
});
