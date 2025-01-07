/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	CONTENT_TYPES,
	DEFAULT_CHARACTER_COUNT_GUIDELINES,
	DEFAULT_TEMPERATURE,
	LANGUAGES,
	TONES,
	WRITING_STYLES,
} from '@components/prompt-control/constants';

const useSettings = selectedText => {
	const [settings, setSettings] = useState(() => {
		const storedSettings =
			JSON.parse(localStorage.getItem('maxi-prompt-settings')) || {};
		return {
			contentType: storedSettings.contentType || CONTENT_TYPES[0],
			tone: storedSettings.tone || TONES[0],
			writingStyle: storedSettings.writingStyle || WRITING_STYLES[0],
			characterCount:
				storedSettings.characterCount ||
				DEFAULT_CHARACTER_COUNT_GUIDELINES[CONTENT_TYPES[0]],
			temperature: storedSettings.temperature || DEFAULT_TEMPERATURE,
			language: storedSettings.language || LANGUAGES[0],
			prompt: '',
		};
	});

	const updateSettings = useCallback(newSettings => {
		setSettings(prevSettings => ({
			...prevSettings,
			...newSettings,
		}));
	}, []);

	useEffect(() => {
		const settingsToSave = { ...settings };
		delete settingsToSave.prompt;

		localStorage.setItem(
			'maxi-prompt-settings',
			JSON.stringify(settingsToSave)
		);
	}, [settings]);

	useEffect(() => {
		if (!selectedText) {
			setSettings(prevSettings => ({
				...prevSettings,
				characterCount:
					DEFAULT_CHARACTER_COUNT_GUIDELINES[
						prevSettings.contentType
					],
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings.contentType]);

	return {
		settings,
		updateSettings,
	};
};

export default useSettings;
