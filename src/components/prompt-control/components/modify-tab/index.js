/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	Button,
	DialogBox,
	ReactSelectControl,
	TextareaControl,
} from '../../../../components';
import ResultCard from '../results-card';
import { downloadTextFile } from '../../../../editor/style-cards/utils';
import {
	getFormattedMessages,
	getSiteInformation,
	handleContentGeneration,
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
	selectionStart,
	AISettings,
	settings,
	isGenerating,
	setIsGenerating,
	selectedResult,
	historyStartIdRef,
	setSelectedResult,
	onContentChange,
	onAbort,
	setResults,
	setSettings,
	switchToGenerateTab,
	abortControllerRef,
}) => {
	const [modifyOption, setModifyOption] = useState(MODIFY_OPTIONS[0]);
	const [customText, setCustomText] = useState('');
	const [loadUntilIndex, setLoadUntilIndex] = useState(5);

	useEffect(() => {
		if (!selectedResult) {
			setSelectedResult(results[0]?.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getMessages = async data => {
		const {
			modificationType,
			customText,
			settings: {
				prompt,
				characterCount,
				confidenceLevel,
				contentType,
				tone,
				writingStyle,
				language,
			},
		} = data;

		let modificationAction = `${modificationType.toLowerCase()}ing`;
		let customExplanation = '';

		if (modificationType.toLowerCase() === 'custom') {
			modificationAction = 'modifying';
			customExplanation = `The user has provided custom instructions for the modification. Please follow these specific instructions: ${customText}\n`;
		}

		const systemTemplate = `You are a helpful assistant tasked with ${modificationAction} the following text. Please note that the original text was generated based on the following criteria:
	  - Original Prompt User Text: ${prompt}
	  - Content Type: ${contentType}
	  - Approximate length (for original text): ${characterCount} characters
	  - Required Tone (for original text): ${tone}
	  - Writing Style (for original text): ${writingStyle}
	  - Language (for original text): ${language}
	  - Confidence Level (for original text): ${confidenceLevel}%
	  ${customExplanation}
	  Additionally, consider the following site information:
	  ${getSiteInformation(AISettings)}
	  Your task is to ${modificationAction} the text while maintaining its original intent and context. The criteria listed above are provided to give you background information on how the original text was generated.`;

		const humanTemplate = results.find(
			result => result.id === selectedResult
		).content;

		return getFormattedMessages(systemTemplate, humanTemplate);
	};

	const modifyContent = async () => {
		handleContentGeneration({
			openAIApiKey: AISettings.openaiApiKey,
			modelName: AISettings.modelName,
			additionalParams: {
				topP: 1,
			},
			additionalData: {
				refId: selectedResult,
				modificationType: modifyOption,
				customText,
				settings,
			},
			results,
			abortControllerRef,
			getMessages,
			setResults,
			setSelectedResult,
			setIsGenerating,
		});
	};

	const handleHistorySelect = media => {
		fetch(media.url)
			// Need to parse the response 2 times,
			// because it was stringified twice in the export function
			.then(response => response.json())
			.then(response => JSON.parse(response))
			.then(jsonData => {
				setResults(jsonData);
			})
			.catch(error => {
				console.error(error);
			});
	};

	const handleHistoryExport = () => {
		downloadTextFile(results, 'history.txt');
	};

	const cleanHistory = () => {
		setResults([]);
		historyStartIdRef.current = null;
		switchToGenerateTab();
	};

	const className = 'maxi-prompt-control-modify-tab';

	return (
		<div className={className}>
			<div className={`${className}__buttons`}>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={handleHistorySelect}
						allowedTypes='text'
						render={({ open }) => (
							<Button
								className={`${className}__button`}
								onClick={open}
							>
								{__('Import history', 'maxi-blocks')}
							</Button>
						)}
					/>
				</MediaUploadCheck>
				<Button
					className={`${className}__button`}
					onClick={handleHistoryExport}
				>
					{__('Export history', 'maxi-blocks')}
				</Button>
			</div>
			<div className={`${className}__top-bar`}>
				{!isEmpty(results) && (
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
						<Button
							className={`${className}__button`}
							onClick={modifyContent}
							disabled={isEmpty(results) || !selectedResult}
						>
							{__('Go!', 'maxi-blocks')}
						</Button>
					</div>
				)}
				{modifyOption === 'Custom' && (
					<TextareaControl
						className={`${className}__textarea`}
						placeholder={__(
							'More information gives better results',
							'maxi-blocks'
						)}
						value={customText}
						onChange={val => setCustomText(val)}
					/>
				)}
				<div className={`${className}__buttons`}>
					{results.every(result => !result.isSelectedText) && (
						<Button
							className={`${className}__button`}
							onClick={switchToGenerateTab}
						>
							{__('Back', 'maxi-blocks')}
						</Button>
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
							buttonClassName={`${className}__button ${className}__clean-history-button`}
							buttonChildren={__('Clean history', 'maxi-blocks')}
						/>
					)}
				</div>
			</div>
			<div className={`${className}__results`}>
				{results.map((result, index) => {
					if (index >= loadUntilIndex) {
						return null;
					}

					const refResult =
						result.refId &&
						results.find(
							refResult => refResult.id === result.refId
						);

					const handleResultInsertion = () => {
						if (!refResult?.isSelectedText) {
							const contentBeforeSelection = content.slice(
								0,
								selectionStart
							);
							const contentAfterSelection =
								content.slice(selectionStart);
							const newContent =
								contentBeforeSelection +
								result.content +
								contentAfterSelection;

							return onContentChange(newContent);
						}

						return onContentChange(
							content.replace(refResult.content, result.content)
						);
					};

					const handleResultSelection = (id = result.id) =>
						setSelectedResult(id);

					const handleResultUseSettings = () => {
						setSettings(result.settings);

						switchToGenerateTab();
					};

					const handleResultDeletion = () => {
						if (historyStartIdRef.current === result.id) {
							historyStartIdRef.current -= 1;
						}

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

						if (selectedResult === result.id) {
							setSelectedResult(null);
						}
					};

					return (
						<ResultCard
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							index={index + 1}
							result={result}
							isFromPreviousSession={
								result.id <= historyStartIdRef.current
							}
							isSelected={result.id === selectedResult}
							isRefOfSelected={refResult?.isSelectedText}
							onInsert={handleResultInsertion}
							onSelect={handleResultSelection}
							onUseSettings={handleResultUseSettings}
							onDelete={handleResultDeletion}
						/>
					);
				})}
			</div>
			{results.length > loadUntilIndex && (
				<div className={`${className}__load-more`}>
					<Button
						onClick={() => setLoadUntilIndex(loadUntilIndex + 5)}
					>
						{__('Load more', 'maxi-blocks')}
					</Button>
				</div>
			)}
			{isGenerating && (
				<Button className={`${className}__abort`} onClick={onAbort}>
					{__('Stop', 'maxi-blocks')}
				</Button>
			)}
		</div>
	);
};

export default ModifyTab;
