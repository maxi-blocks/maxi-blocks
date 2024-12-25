/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

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
		siteDescription: 'Description',
		audience: 'Audience',
		siteGoal: 'Goal',
		services: 'Services Offered',
		businessName: 'Business Name',
		businessInfo: 'Business Info',
	};

	const siteInformation = Object.keys(AISettingsKeysToLabels)
		.filter(key => AISettings[key] && AISettings[key].trim() !== '')
		.map(key => `- ${AISettingsKeysToLabels[key]}: ${AISettings[key]}`)
		.join('\n');

	return siteInformation ? `Site Details:\n${siteInformation}` : '';
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
			shouldRemoveQuotes: additionalData?.settings?.contentType
				? !['Quotes', 'Pull quotes Testimonial'].includes(
						additionalData.settings.contentType
				  )
				: true,
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
