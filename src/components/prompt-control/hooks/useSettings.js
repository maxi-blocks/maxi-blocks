/**
 * WordPress dependencies
 */
import { useState, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	CONTENT_TYPES,
	DEFAULT_CHARACTER_COUNT_GUIDELINES,
	DEFAULT_CONFIDENCE_LEVEL,
	LANGUAGES,
	TONES,
	WRITING_STYLES,
} from '../constants';

const useSettings = () => {
	const [settings, setSettings] = useState({
		contentType: CONTENT_TYPES[0],
		tone: TONES[0],
		writingStyle: WRITING_STYLES[0],
		characterCount: DEFAULT_CHARACTER_COUNT_GUIDELINES[CONTENT_TYPES[0]],
		confidenceLevel: DEFAULT_CONFIDENCE_LEVEL,
		language: LANGUAGES[0],
		prompt: '',
	});

	const updateSettings = useCallback(newSettings => {
		setSettings(prevSettings => ({
			...prevSettings,
			...newSettings,
		}));
	}, []);

	return {
		settings,
		updateSettings,
	};
};

export default useSettings;
