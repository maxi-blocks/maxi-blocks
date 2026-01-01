/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { goThroughMaxiBlocks } from '@extensions/maxi-block';
import { CONTENT_TYPE_EXAMPLES } from './constants';

/**
 * External dependencies
 */
import { ChatOpenAI } from '@langchain/openai';
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { isEmpty } from 'lodash';

export const getSiteInformation = AISettings => {
	const AISettingsKeysToLabels = {
		siteDescription: __('Description', 'maxi-blocks'),
		audience: __('Audience', 'maxi-blocks'),
		siteGoal: __('Goal', 'maxi-blocks'),
		services: __('Services Offered', 'maxi-blocks'),
		businessName: __('Business Name', 'maxi-blocks'),
		businessInfo: __('Business Info', 'maxi-blocks'),
	};

	const siteInformation = Object.keys(AISettingsKeysToLabels)
		.filter(key => AISettings[key] && AISettings[key].trim() !== '')
		.map(key => `- ${AISettingsKeysToLabels[key]}: ${AISettings[key]}`)
		.join('\n');

	return siteInformation
		? __('Site Details:', 'maxi-blocks') + '\n' + siteInformation
		: '';
};

export const getContentAttributesSection = (
	contentType,
	tone,
	writingStyle,
	language
) => {
	return `Content Specifications:
- Type: ${contentType}
- Tone: ${tone}
- Style: ${writingStyle}
- Language: ${
		language === 'Language of the prompt'
			? 'Match the language of this prompt'
			: language
	}
- Avoid using quotation marks in your answer`;
};

export const getContextSection = context => {
	if (!context) return '';

	const contextSection = context
		.map(({ l: label, c: content }) => `- ${label}: ${content}`)
		.join('\n');

	return `\nExisting Page Elements (Do not reuse or closely mimic these phrases):
${contextSection}`;
};

export const getExamplesSection = contentType => {
	const examples = CONTENT_TYPE_EXAMPLES[contentType];
	if (!examples || examples.length === 0) {
		return '';
	}

	const beforeEveryExample = '\n- ';
	const formattedExamples = `${beforeEveryExample}${examples.join(
		beforeEveryExample
	)}`;

	return `Examples (Refer to these for the desired output format and style. Do not reuse phrases):${formattedExamples}`;
};

export const getFormattedMessages = async (
	systemMessageTemplate,
	humanMessageTemplate,
	modelName
) => {
	const directGeneratorInstruction = `Act as a direct content generator that only outputs the requested content.
Never ask questions or offer help - just generate the content.

`;

	// For o1 and o3 models, we need to combine system and human messages differently
	if (modelName?.includes('o1') || modelName?.includes('o3')) {
		return [
			{
				role: 'user',
				content: `${directGeneratorInstruction}${systemMessageTemplate}

${humanMessageTemplate}`,
			},
		];
	}

	// Original OpenAI format
	const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
		`${directGeneratorInstruction}${systemMessageTemplate}`
	);

	const humanMessagePrompt =
		HumanMessagePromptTemplate.fromTemplate(humanMessageTemplate);

	const chatPrompt = ChatPromptTemplate.fromPromptMessages([
		systemMessagePrompt,
		humanMessagePrompt,
	]);

	const messages = await chatPrompt.formatMessages({});

	return messages;
};

export const getUniqueId = results =>
	!isEmpty(results)
		? Math.max(
				...results.map(result =>
					typeof result.id === 'number' ? result.id : 0
				)
		  ) + 1
		: 1;

export const createChat = (openAIApiKey, modelName, additionalParams) => {
	const config = {
		openAIApiKey,
		modelName,
		streaming: true,
	};

	// Only add temperature for non-o1, non-o3, and non-gpt-5 models
	if (
		!modelName?.includes('o1') &&
		!modelName?.includes('o3') &&
		!modelName?.includes('gpt-5')
	) {
		config.temperature = additionalParams?.temperature;
	}
	if (modelName?.includes('o1') && !modelName?.includes('mini')) {
		config.streaming = false;
	}
	if (modelName?.includes('gpt-5') || modelName?.includes('o3')) {
		config.streaming = false;
	}

	return new ChatOpenAI(config);
};

export const updateResultsWithLoading = (
	prevResults,
	newId,
	additionalData = {}
) => {
	const newResults = [
		{
			id: newId,
			content: '',
			loading: true,
			progress: 0,
			...additionalData,
		},
		...prevResults,
	];

	return newResults;
};

export const sanitizeContent = (content, shouldRemoveQuotes) => {
	if (!shouldRemoveQuotes) {
		return content;
	}

	// Trim any white spaces from the start and end
	let newContent = content.trim();

	// Remove quotes from the beginning and end if they exist
	if (content.startsWith('"') || content.startsWith("'")) {
		newContent = content.substr(1);
	}
	if (content.endsWith('"') || content.endsWith("'")) {
		newContent = content.slice(0, -1);
	}

	return newContent;
};

export const callChatAndUpdateResults = async ({
	chat,
	messages,
	newId,
	abortControllerRef,
	shouldRemoveQuotes = true,
	setIsGenerating,
	setResults,
}) => {
	abortControllerRef.current = new AbortController();

	setIsGenerating(true);
	const response = await chat.call(messages, {
		signal: abortControllerRef.current.signal,
		callbacks: [
			{
				handleLLMNewToken(token) {
					setResults(prevResults => {
						const newResults = [...prevResults];
						const addedResult = newResults.find(
							result => result.id === newId
						);

						if (addedResult?.loading) {
							addedResult.content = sanitizeContent(
								addedResult.content + token,
								shouldRemoveQuotes
							);
						}

						return newResults;
					});
				},
			},
		],
	});
	setIsGenerating(false);

	abortControllerRef.current = null;

	setResults(prevResults => {
		const newResults = [...prevResults];
		const addedResult = newResults.find(result => result.id === newId);

		if (addedResult) {
			addedResult.content = sanitizeContent(
				response.content,
				shouldRemoveQuotes
			);
			addedResult.loading = false;
		}

		return newResults;
	});
};

export const callBackendAIProxy = async ({
	messages,
	modelName,
	additionalParams,
	newId,
	abortControllerRef,
	shouldRemoveQuotes = true,
	setIsGenerating,
	setResults,
	onModelUnavailable,
}) => {
	abortControllerRef.current = new AbortController();

	setIsGenerating(true);
	const wpApiRoot = window.wpApiSettings?.root || '/wp-json/';
	const wpNonce = window.wpApiSettings?.nonce;

	const updateResultWithError = errorMessage => {
		setResults(prevResults => {
			const newResults = [...prevResults];
			const addedResult = newResults.find(result => result.id === newId);

			if (addedResult) {
				addedResult.content = errorMessage || 'AI request failed';
				addedResult.loading = false;
				addedResult.error = true;
			}

			return newResults;
		});
	};

	const finalizeResult = finalContent => {
		setResults(prevResults => {
			const newResults = [...prevResults];
			const addedResult = newResults.find(result => result.id === newId);

			if (addedResult) {
				addedResult.content = sanitizeContent(
					finalContent ?? addedResult.content,
					shouldRemoveQuotes
				);
				addedResult.loading = false;
				addedResult.progress = addedResult.content.length;
			}

			return newResults;
		});
	};

	const isModelUnavailableError = errorMessage =>
		Boolean(
			errorMessage?.includes('model_not_found') ||
				errorMessage?.toLowerCase().includes('model not found') ||
				errorMessage?.toLowerCase().includes('model is not available')
		);

	try {
		const response = await fetch(`${wpApiRoot}maxi-blocks/v1.0/ai/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'text/event-stream',
				...(wpNonce ? { 'X-WP-Nonce': wpNonce } : {}),
			},
			body: JSON.stringify({
				messages,
				model: modelName,
				temperature: additionalParams?.temperature,
				streaming: true,
			}),
			signal: abortControllerRef.current.signal,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('MaxiBlocks AI request failed:', errorText);
			updateResultWithError(errorText);
			if (isModelUnavailableError(errorText)) {
				onModelUnavailable?.();
			}
			throw new Error(errorText);
		}

		const isEventStream = response.headers
			.get('content-type')
			?.includes('text/event-stream');

		if (!isEventStream || !response.body) {
			const fallbackResponse = await apiFetch({
				path: '/maxi-blocks/v1.0/ai/chat',
				method: 'POST',
				data: {
					messages,
					model: modelName,
					temperature: additionalParams?.temperature,
					streaming: false,
				},
				signal: abortControllerRef.current.signal,
			});

			setIsGenerating(false);
			abortControllerRef.current = null;

			const content =
				fallbackResponse?.choices?.[0]?.message?.content || '';

			setResults(prevResults => {
				const newResults = [...prevResults];
				const addedResult = newResults.find(
					result => result.id === newId
				);

				if (addedResult) {
					addedResult.content = sanitizeContent(
						content,
						shouldRemoveQuotes
					);
					addedResult.loading = false;
					addedResult.progress = content.length;
				}

				return newResults;
			});

			return;
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder('utf-8');
		let buffer = '';
		let responseContent = '';

		while (true) {
			const { value, done } = await reader.read();
			buffer += decoder.decode(value || new Uint8Array(), {
				stream: !done,
			});
			const lines = buffer.split('\n');
			buffer = lines.pop();

			for (const line of lines) {
				const trimmedLine = line.trim();
				if (!trimmedLine.startsWith('data:')) {
					continue;
				}
				const dataString = trimmedLine.replace(/^data:\s*/, '');
				if (dataString === '[DONE]') {
					finalizeResult(responseContent);
					setIsGenerating(false);
					abortControllerRef.current = null;
					return;
				}
				try {
					const parsed = JSON.parse(dataString);
					if (parsed?.type === 'error' || parsed?.error) {
						const errorMessage =
							parsed?.message ||
							parsed?.error?.message ||
							'AI request failed';
						console.error('MaxiBlocks AI stream error:', parsed);
						updateResultWithError(errorMessage);
						if (isModelUnavailableError(errorMessage)) {
							onModelUnavailable?.();
						}
						throw new Error(errorMessage);
					}

					const delta =
						parsed?.choices?.[0]?.delta?.content || '';
					if (delta) {
						responseContent = sanitizeContent(
							responseContent + delta,
							shouldRemoveQuotes
						);
						setResults(prevResults => {
							const newResults = [...prevResults];
							const addedResult = newResults.find(
								result => result.id === newId
							);

							if (addedResult?.loading) {
								addedResult.content = responseContent;
								addedResult.progress = responseContent.length;
							}

							return newResults;
						});
					}
				} catch (error) {
					console.error('MaxiBlocks AI stream parse error:', error);
				}
			}

			if (done) {
				break;
			}
		}

		finalizeResult(responseContent);
		setIsGenerating(false);
		abortControllerRef.current = null;
	} catch (error) {
		setIsGenerating(false);
		abortControllerRef.current = null;

		if (error?.name !== 'AbortError') {
			updateResultWithError(error.message || 'AI request failed');
		}

		if (isModelUnavailableError(error.message)) {
			onModelUnavailable?.();
		}

		throw error;
	}
};

export const handleContentGeneration = async ({
	openAIApiKey, // This parameter is now unused but kept for compatibility
	modelName,
	additionalParams,
	additionalData,
	results,
	abortControllerRef,
	getMessages,
	setResults,
	setSelectedResultId,
	setIsGenerating,
	onModelUnavailable,
}) => {
	const newId = getUniqueId(results);

	try {
		const messages = await getMessages(additionalData);

		// Updating results with loading state
		setResults(prevResults =>
			updateResultsWithLoading(prevResults, newId, additionalData)
		);

		setSelectedResultId(newId);

		// Use backend proxy instead of direct OpenAI calls
		await callBackendAIProxy({
			messages,
			modelName,
			additionalParams,
			newId,
			abortControllerRef,
			shouldRemoveQuotes: additionalData?.settings?.contentType
				? !['Quotes', 'Pull quotes Testimonial'].includes(
						additionalData.settings.contentType
				  )
				: true,
			setIsGenerating,
			setResults,
			onModelUnavailable,
		});
	} catch (error) {
		// Error handling logic
		if (error.response) {
			setResults(prevResults => {
				const newResults = [...prevResults];
				const addedResult = newResults.find(
					result => result.id === newId
				);

				if (addedResult) {
					addedResult.content = error.response.data.error.message;
					addedResult.loading = false;
					addedResult.error = true;
				}

				return newResults;
			});

			console.error(error.response.data.error);
		} else if (
			error.name !== 'AbortError' &&
			error.message !== 'Cancel: canceled'
		) {
			console.error(error);
		}
	}
};

export const isLoremIpsum = text => {
	// Common Latin words and patterns found in Lorem Ipsum text
	const loremPatterns = [
		'dolor',
		'amet',
		'consectetur',
		'adipiscing',
		'elit',
		'incididunt',
		'labore',
		'dolore',
		'aliqua',
		'ullamcorper',
		'nulla',
		'quis',
		'nibh',
		'donec',
		'justo',
		'facilisis',
		'ultrices',
		'fermentum',
		'vulputate',
		'vehicula',
		'mauris',
		'imperdiet',
		'suscipit',
		'tincidunt',
		'tempus',
		'venenatis',
		'pellentesque',
		'iaculis',
		'cras',
		'curabitur',
		'lorem',
		'ipsum',
		'sed',
		'do',
		'eiusmod',
		'magna',
		'efficitur',
		'metus',
		'erat',
		'sit',
		'et',
		'at',
		'ac',
		'cum',
		'sem',
		'eu',
		'ligula',
		'vel',
		'nunc',
		'leo',
		'aenean',
		'integer',
		'porta',
		'odio',
		'viverra',
		'morbi',
		'quisque',
		'pretium',
		'non',
		'duis',
		'augue',
	];

	// Convert the text to lower case and split it into words
	const words = text.toLowerCase().split(/\s+/);

	// Check if any of the patterns are found in the text
	const matches = words.filter(word => loremPatterns.includes(word));

	return matches.length > 0;
};

export const getContext = (contextOption, clientId) => {
	if (contextOption === 'false') {
		return null;
	}

	const blocks =
		contextOption === 'container'
			? select('core/block-editor').getBlock(
					select('core/block-editor').getBlockParentsByBlockName(
						clientId,
						'maxi-blocks/container-maxi'
					)[0]
			  )?.innerBlocks
			: select('core/block-editor').getBlocks();

	const result = [];
	const addedContents = new Set(); // To track added contents and avoid repetitions

	if (contextOption === 'page') {
		const title = select('core/editor').getEditedPostAttribute('title');

		if (title && !isLoremIpsum(title)) {
			result.push({
				l: 'title',
				c: title,
			});
		}
	}

	const buildBlockStructure = ({ name, attributes }) => {
		if (
			name === 'maxi-blocks/text-maxi' &&
			attributes.content &&
			!isLoremIpsum(attributes.content) &&
			!addedContents.has(attributes.content)
		) {
			const level = attributes.textLevel;

			result.push({
				l: level,
				c: attributes.content,
			});

			addedContents.add(attributes.content);
		}
	};

	goThroughMaxiBlocks(buildBlockStructure, false, blocks);

	return result;
};
