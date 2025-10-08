/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { camelCase } from 'lodash';

const useAISettings = () => {
	const [AISettings, setAISettings] = useState({});

	useEffect(() => {
		// Load AI settings from injected data (no API call needed)
		if (window.maxiSettings?.ai_settings) {
			const AISettings = Object.entries(
				window.maxiSettings.ai_settings
			).reduce((acc, [key, value]) => {
				const newKey = camelCase(key);
				acc[newKey] = value;
				return acc;
			}, {});

			setAISettings(AISettings);
		} else {
			console.error(
				'MaxiBlocks: AI settings not available in window.maxiSettings'
			);
		}
	}, []);

	return AISettings;
};

export default useAISettings;
