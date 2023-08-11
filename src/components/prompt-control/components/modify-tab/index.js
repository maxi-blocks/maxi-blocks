/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Button, DialogBox, ReactSelectControl } from '../../../../components';
import ResultCard from '../results-card';
import {
	getFormattedMessages,
	getSiteInformation,
	handleContent,
} from '../../utils';
import { MODIFY_OPTIONS } from '../../constants';

/**
 * External dependencies
 */
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
	AISettings,
	isGenerating,
	setIsGenerating,
	selectedResult,
	setSelectedResult,
	onChangeContent,
	onAbort,
	setResults,
	switchToGenerateTab,
	abortControllerRef,
}) => {
	const [modifyOption, setModifyOption] = useState(MODIFY_OPTIONS[0]);

	const getMessages = async () => {
		const systemTemplate = `You are a helpful assistant that ${modifyOption.toLowerCase()}s the given text for a website. Please follow the specific instructions for the "${modifyOption}" option and consider the following site information:
${getSiteInformation(AISettings)}`;
		const humanTemplate = results.find(
			result => result.id === selectedResult
		).content;

		return getFormattedMessages(systemTemplate, humanTemplate);
	};

	const modifyContent = async () => {
		handleContent({
			openAIApiKey: AISettings.openaiApiKey,
			modelName: AISettings.modelName,
			additionalParams: {
				topP: 1,
			},
			additionalData: {
				refId: selectedResult,
				modificationType: modifyOption,
			},
			results,
			abortControllerRef,
			getMessages,
			setResults,
			setSelectedResult,
			setIsGenerating,
		});
	};

	const cleanHistory = () => {
		setResults([]);
		switchToGenerateTab();
	};

	useEffect(() => {
		if (!selectedResult) {
			setSelectedResult(results[0]?.id);
		}
	}, []);

	const className = 'maxi-prompt-control-modify-tab';

	return (
		<div className={className}>
			<div className={`${className}__top-bar`}>
				<div className={`${className}__modification-options`}>
					<ReactSelectControl
						value={{
							label: __(modifyOption, 'maxi-blocks'),
							value: modifyOption,
						}}
						defaultValue={{
							label: __(modifyOption, 'maxi-blocks'),
							value: modifyOption,
						}}
						options={MODIFY_OPTIONS.map(option => ({
							label: __(option, 'maxi-blocks'),
							value: option,
						}))}
						onChange={({ value }) => setModifyOption(value)}
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
					<DialogBox
						message={__(
							'Are you sure you want to clean the history?',
							'maxi-blocks'
						)}
						cancelLabel={__('Cancel', 'maxi-blocks')}
						confirmLabel={__('Clean', 'maxi-blocks')}
						onConfirm={cleanHistory}
						buttonClassName={`${className}__clean-history-button`}
						buttonChildren={__('Clean history', 'maxi-blocks')}
					/>
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
									const newResults = [...prevResults].filter(
										deletedResult =>
											deletedResult.id !== result.id &&
											deletedResult.refId !== result.id
									);

									if (isEmpty(newResults)) {
										switchToGenerateTab();
									}

									return newResults;
								});
							}}
						/>
					);
				})}
			</div>
			{isGenerating && (
				<Button className={`${className}__abort`} onClick={onAbort}>
					Stop
				</Button>
			)}
		</div>
	);
};

export default ModifyTab;
