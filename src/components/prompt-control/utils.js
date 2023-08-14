/**
 * Internal dependencies
 */
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { isEmpty, startCase } from 'lodash';

export const getSiteInformation = AISettings => {
	const AISettingsKeys = [
		'siteDescription',
		'audience',
		'siteGoal',
		'services',
		'businessName',
		'businessInfo',
	];

	return AISettingsKeys.map(
		key =>
			!isEmpty(AISettings[key]) && `${startCase(key)}: ${AISettings[key]}`
	)
		.filter(Boolean)
		.join('\n');
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

export const handleContent = async ({
	openAIApiKey,
	modelName,
	additionalParams,
	additionalData,
	results,
	abortControllerRef,
	getMessages,
	setResults,
	setSelectedResult,
	setIsGenerating,
}) => {
	try {
		const messages = await getMessages(additionalData);
		const newId = getUniqueId(results);

		// Updating results with loading state
		setResults(prevResults =>
			updateResultsWithLoading(prevResults, newId, additionalData)
		);

		setSelectedResult(newId);

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
			console.error(error.response.data);
			console.error(error.response.status);
			console.error(error.response.headers);
		} else if (!error.name === 'AbortError') {
			console.error(error);
		}
	}
};
