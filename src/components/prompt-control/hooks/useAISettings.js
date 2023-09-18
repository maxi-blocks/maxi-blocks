/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { camelCase } from 'lodash';

const useAISettings = () => {
	const { receiveMaxiSettings } = resolveSelect('maxiBlocks');
	const [AISettings, setAISettings] = useState({});

	useEffect(() => {
		const fetchAISettings = async () => {
			try {
				const maxiSettings = await receiveMaxiSettings();

				const AISettings = Object.entries(
					maxiSettings.ai_settings
				).reduce((acc, [key, value]) => {
					const newKey = camelCase(key);
					acc[newKey] = value;
					return acc;
				}, {});

				setAISettings(AISettings);
			} catch (error) {
				console.error('Maxi Blocks: Could not load settings', error);
			}
		};

		fetchAISettings();
	}, [receiveMaxiSettings]);

	return AISettings;
};

export default useAISettings;
