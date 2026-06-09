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

	it('falls back to provider default when stored model is empty string', () => {
		window.maxiSettings = {
			ai_settings: {
				ai_panel_use_shared: true,
				maxi_ai_provider: 'openai',
				model: '   ',
				ai_panel_model: 'gpt-4o-mini',
			},
		};
		expect(resolveAiPanelModel()).toBe('gpt-4o-mini');
	});

	it('rejects OpenAI model when provider is anthropic', () => {
		window.maxiSettings = {
			ai_settings: {
				ai_panel_use_shared: true,
				maxi_ai_provider: 'anthropic',
				model: 'gpt-5.4',
			},
		};
		expect(resolveAiPanelModel()).toBe('claude-sonnet-4-20250514');
	});

	it('rejects Anthropic model when provider is openai', () => {
		window.maxiSettings = {
			ai_settings: {
				ai_panel_use_shared: true,
				maxi_ai_provider: 'openai',
				model: 'claude-sonnet-4-20250514',
			},
		};
		expect(resolveAiPanelModel()).toBe('gpt-4o-mini');
	});

	it('accepts matching Anthropic model for anthropic provider', () => {
		window.maxiSettings = {
			ai_settings: {
				ai_panel_use_shared: true,
				maxi_ai_provider: 'anthropic',
				model: 'claude-3-haiku-20240307',
			},
		};
		expect(resolveAiPanelModel()).toBe('claude-3-haiku-20240307');
	});

	it('uses dedicated panel provider when ai_panel_use_shared is false', () => {
		window.maxiSettings = {
			ai_settings: {
				ai_panel_use_shared: false,
				ai_panel_provider: 'anthropic',
				ai_panel_model: 'gpt-4o',
			},
		};
		expect(resolveAiPanelModel()).toBe('claude-sonnet-4-20250514');
	});
});
