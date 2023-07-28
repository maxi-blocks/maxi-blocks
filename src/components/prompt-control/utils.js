/**
 * Internal dependencies
 */
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { isEmpty } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const getChatPrompt = (systemMessageTemplate, humanMessageTemplate) => {
	const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
		systemMessageTemplate
	);

	const humanMessagePrompt =
		HumanMessagePromptTemplate.fromTemplate(humanMessageTemplate);

	return ChatPromptTemplate.fromPromptMessages([
		systemMessagePrompt,
		humanMessagePrompt,
	]);
};

export const getUniqueId = results =>
	!isEmpty(results)
		? Math.max(
				...results.map(result =>
					typeof result.id === 'number' ? result.id : 0
				)
		  ) + 1
		: 1;
