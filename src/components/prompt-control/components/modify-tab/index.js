/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Button, ReactSelectControl } from '../../../../components';
import ResultCard from '../results-card';
import { getChatPrompt, getUniqueId } from '../../utils';
import { MODIFY_OPTIONS } from '../../constants';

/**
 * External dependencies
 */
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

// {
//     "generations": [
//         [
//             {
//                 "text": "Elon Musk revolutionizes Twitter.com into X.com, marking a new era in online communication.",
//             }
//         ]
//     ],
// }

const ModifyTab = ({
	results,
	content,
	openAIApiKey,
	selectedResult,
	setSelectedResult,
	onChangeContent,
	setResults,
	switchToGenerateTab,
}) => {
	const [modifyOption, setModifyOption] = useState({
		label: MODIFY_OPTIONS[0],
		value: MODIFY_OPTIONS[0],
	});

	const getMessages = async () => {
		const { value: modifyOptionVal } = modifyOption;

		const systemTemplate =
			'You are a helpful assistant that {modify_option} given text.';
		const humanTemplate = '{text}';

		const chatPrompt = getChatPrompt(systemTemplate, humanTemplate);

		const messages = await chatPrompt.formatMessages({
			modify_option: `${modifyOptionVal.toLowerCase()}s`,
			text: results.find(result => result.id === selectedResult).content,
		});

		return messages;
	};

	const modifyContent = async () => {
		try {
			const chat = new ChatOpenAI({
				openAIApiKey,
				modelName: 'gpt-3.5-turbo',
				topP: 1,
				streaming: true,
			});
			const messages = await getMessages();

			const newId = getUniqueId(results);

			setResults(prevResults => {
				const newResults = [
					{
						id: newId,
						content: '',
						refId: selectedResult,
						modificationType: modifyOption.value,
						loading: true,
					},
					...prevResults,
				];

				return newResults;
			});

			setSelectedResult(newId);

			const response = await chat.call(messages, {
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
			// const response = {
			// 	generations: [
			// 		[
			// 			{
			// 				text: 'Elon Musk brings a revolutionary change to the popular platform Twitter.com, transforming it into X.com and ushering in a new era in the world of online communication.',
			// 				message: {
			// 					lc: 1,
			// 					type: 'constructor',
			// 					id: ['langchain', 'schema', 'AIMessage'],
			// 					kwargs: {
			// 						content:
			// 							'Elon Musk brings a revolutionary change to the popular platform Twitter.com, transforming it into X.com and ushering in a new era in the world of online communication.',
			// 						additional_kwargs: {},
			// 					},
			// 				},
			// 			},
			// 		],
			// 	],
			// 	llmOutput: {
			// 		tokenUsage: {
			// 			completionTokens: 33,
			// 			promptTokens: 52,
			// 			totalTokens: 85,
			// 		},
			// 	},
			// };

			setResults(prevResults => {
				const newResults = [...prevResults];
				const addedResult = newResults.find(
					result => result.id === newId
				);

				if (addedResult) {
					addedResult.content = response.content;
					addedResult.loading = false;
				}

				return newResults;
			});
		} catch (error) {
			if (error.response) {
				console.error(error.response.data);
				console.error(error.response.status);
				console.error(error.response.headers);
			} else {
				console.error(error);
			}
		}
	};

	const cleanHistory = () => {
		setResults([]);
	};

	const className = 'maxi-prompt-control-modify-tab';

	return (
		<div className={className}>
			<div className={`${className}__top-bar`}>
				<div className={`${className}__modification-options`}>
					<ReactSelectControl
						value={modifyOption}
						defaultValue={modifyOption}
						options={MODIFY_OPTIONS.map(option => ({
							label: __(option, 'maxi-blocks'),
							value: option,
						}))}
						onChange={obj => setModifyOption(obj)}
						isDisabled={isEmpty(results)}
					/>
					<Button onClick={modifyContent} disabled={isEmpty(results)}>
						Go!
					</Button>
				</div>

				{results.every(result => !result.isSelectedText) && (
					<Button onClick={switchToGenerateTab}>Back</Button>
				)}
				{!isEmpty(results) && (
					<Button onClick={cleanHistory}>Clean history</Button>
				)}
			</div>
			<div className={`${className}__results`}>
				{results.map((result, index) => {
					const refResult =
						result.refId &&
						results.find(
							refResult => refResult.id === result.refId
						);

					return (
						<ResultCard
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							index={index + 1}
							result={result}
							isSelected={result.id === selectedResult}
							isRefOfSelected={refResult?.isSelectedText}
							onInsert={() => {
								if (!refResult?.isSelectedText) {
									return onChangeContent(
										`${content}\n${result.content}`
									);
								}

								return onChangeContent(
									content.replace(
										refResult.content,
										result.content
									)
								);
							}}
							onSelect={(id = result.id) => setSelectedResult(id)}
							onDelete={() => {
								setResults(prevResults => {
									const newResults = [...prevResults];
									return newResults.filter(
										deletedResult =>
											deletedResult.id !== result.id &&
											deletedResult.refId !== result.id
									);
								});
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default ModifyTab;
