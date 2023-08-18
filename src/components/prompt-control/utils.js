/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { goThroughMaxiBlocks } from '../../extensions/maxi-block';
import { CONTENT_TYPE_DESCRIPTIONS, CONTENT_TYPE_EXAMPLES } from './constants';

/**
 * External dependencies
 */
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { isEmpty, startCase } from 'lodash';

export const getSiteInformation = AISettings => {
	const AISettingsKeysToDisplay = [
		'siteDescription',
		'audience',
		'siteGoal',
		'services',
		'businessName',
		'businessInfo',
	];

	const siteInformation = AISettingsKeysToDisplay.map(
		key =>
			!isEmpty(AISettings[key]) &&
			`\t- ${startCase(key)}: ${AISettings[key]}`
	)
		.filter(Boolean)
		.join('\n');

	if (!siteInformation) {
		return '';
	}

	return `- **Site Information**:\n${siteInformation}`;
};

export const getQuotesGuidance = contentType =>
	`- **Ready for Direct Publication**: No further editing needed.
	${
		contentType === 'Quotes' || contentType === 'Pull quotes Testimonial'
			? 'Use quotes as necessary for this content type, e.g., when citing someone’s words.'
			: 'Avoid unnecessary quotes or special characters, such as using quotes around headlines or titles.'
	}`;

export const getContentAttributesSection = (
	contentType,
	tone,
	writingStyle,
	language,
	characterCount
) => `- **Content Attributes**:
			- Type: ${contentType} (${CONTENT_TYPE_DESCRIPTIONS[contentType]})
			- Tone: ${tone}
			- Style: ${writingStyle}
			- Language: ${language}
			- Length: ${characterCount} characters`;

export const getContextSection = context => {
	if (!context) {
		return '';
	}

	// Format the context into a compact section with a clear explanation of the keys
	const contextSection = context
		.map(item => `\t\t**${item.l}**: "${item.c}"`)
		.join('\n');

	return `**Page Context (level: content)**: The context represents the structure of the page, including headings (e.g., h1, h5) and paragraphs (e.g., p). Use this information to align the generated content with the existing page layout.
					${contextSection}`;
};

export const getExamplesSection = contentType => {
	const examples = CONTENT_TYPE_EXAMPLES[contentType];
	if (!examples || examples.length === 0) {
		return '';
	}

	const formattedExamples = examples.join('\n- ');

	return `Examples:\n- ${formattedExamples}`;
};

export const getFormattedMessages = async (
	systemMessageTemplate,
	humanMessageTemplate
) => {
	const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
		systemMessageTemplate
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

export const createChat = (openAIApiKey, modelName, additionalParams) =>
	new ChatOpenAI({
		openAIApiKey,
		modelName,
		...additionalParams,
		streaming: true,
	});

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
			...additionalData,
		},
		...prevResults,
	];

	return newResults;
};

export const callChatAndUpdateResults = async ({
	chat,
	messages,
	newId,
	abortControllerRef,
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
							addedResult.content += token;
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
			addedResult.content = response.content;
			addedResult.loading = false;
		}

		return newResults;
	});
};

export const handleContentGeneration = async ({
	openAIApiKey,
	modelName,
	additionalParams,
	additionalData,
	results,
	abortControllerRef,
	getMessages,
	setResults,
	setSelectedResultId,
	setIsGenerating,
}) => {
	const newId = getUniqueId(results);

	try {
		const messages = await getMessages(additionalData);

		// Updating results with loading state
		setResults(prevResults =>
			updateResultsWithLoading(prevResults, newId, additionalData)
		);

		setSelectedResultId(newId);

		// Chat creation and settings
		const chat = createChat(openAIApiKey, modelName, additionalParams);

		// Calling chat and updating results
		await callChatAndUpdateResults({
			chat,
			messages,
			newId,
			abortControllerRef,
			setIsGenerating,
			setResults,
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
		} else if (!error.name === 'AbortError') {
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
