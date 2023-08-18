/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
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
	getContentAttributesSection,
	getContextSection,
	getFormattedMessages,
	getQuotesGuidance,
	getSiteInformation,
	handleContentGeneration,
} from '../../utils';
import { MODIFICATION_ACTIONS, MODIFY_OPTIONS } from '../../constants';

/**
 * External dependencies
 */
import { capitalize, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const ModifyTab = ({
	results,
	content,
	AISettings,
	settings,
	context,
	selectedText,
	formatValue,
	onChangeTextFormat,
	isGenerating,
	setIsGenerating,
	selectedResultId,
	historyStartIdRef,
	setSelectedResultId,
	onContentChange,
	onAbort,
	setResults,
	updateSettings,
	switchToGenerateTab,
	abortControllerRef,
}) => {
	const [modifyOption, setModifyOption] = useState(MODIFY_OPTIONS[0]);
	const [customText, setCustomText] = useState('');
	const [loadUntilIndex, setLoadUntilIndex] = useState(5);

	useEffect(() => {
		if (!selectedResultId) {
			setSelectedResultId(results[0]?.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getMessages = async data => {
		const {
			modificationType,
			customText,
			refFromSelectedText = false,
		} = data;
		const {
			prompt,
			characterCount,
			confidenceLevel,
			contentType,
			tone,
			writingStyle,
			language,
		} = settings || {};

		// Use the mapping to get the appropriate action for the given modification type
		const modificationAction =
			MODIFICATION_ACTIONS[modificationType] || 'modifying';

		const customExplanation =
			modificationType === 'custom'
				? `- **Custom Instructions**: ${customText}\n`
				: '';

		const quoteGuidance = getQuotesGuidance(contentType);

		const generatedTextExplanation = !refFromSelectedText
			? `- **Original Prompt**: ${prompt}
			${getContentAttributesSection(
				contentType,
				tone,
				writingStyle,
				language,
				characterCount
			)}
			- **Confidence Level**: ${confidenceLevel}%
			${quoteGuidance}\n`
			: '';

		const systemTemplate = `You are a helpful assistant tasked with ${modificationAction} the following ${
			refFromSelectedText
				? 'selected on website'
				: 'generated for website'
		} text. Adhere to these guidelines:
			${generatedTextExplanation}
			${customExplanation}
			${getSiteInformation(AISettings)}
			${getContextSection(context)}

			Your task is to maintain the original intent and context while ${modificationAction} the text. The content must align with the given criteria, and any custom instructions provided, and be suitable for immediate use on the website.`;

		const humanTemplate =
			selectedResultId === 'selectedText'
				? selectedText
				: results.find(result => result.id === selectedResultId)
						.content;

		return getFormattedMessages(systemTemplate, humanTemplate);
	};

	const modifyContent = async () => {
		const isSelectedText =
			selectedResultId === 'selectedText' && selectedText;

		handleContentGeneration({
			openAIApiKey: AISettings.openaiApiKey,
			modelName: AISettings.model,
			additionalParams: {
				topP: 1,
			},
			additionalData: {
				...(!isSelectedText && { refId: selectedResultId, settings }),
				modificationType: modifyOption,
				refFromSelectedText: isSelectedText,
				...(modifyOption === 'custom' && customText),
			},
			results,
			abortControllerRef,
			getMessages,
			setResults,
			setSelectedResultId,
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
				{(!isEmpty(results) || selectedResultId) && (
					<div className={`${className}__modification-options`}>
						<ReactSelectControl
							value={{
								label: __(
									capitalize(modifyOption),
									'maxi-blocks'
								),
								value: modifyOption,
							}}
							defaultValue={{
								label: __(
									capitalize(modifyOption),
									'maxi-blocks'
								),
								value: modifyOption,
							}}
							options={MODIFY_OPTIONS.map(option => ({
								label: __(capitalize(option), 'maxi-blocks'),
								value: option,
							}))}
							onChange={({ value }) => setModifyOption(value)}
							isDisabled={isEmpty(results)}
						/>
						<Button
							className={`${className}__button`}
							onClick={modifyContent}
							disabled={isEmpty(results) && !selectedResultId}
						>
							{__('Go!', 'maxi-blocks')}
						</Button>
					</div>
				)}
				{modifyOption === 'custom' && (
					<TextareaControl
						className={`${className}__textarea`}
						placeholder={__(
							'More information gives better results',
							'maxi-blocks'
						)}
						value={customText}
						onChange={val => setCustomText(val)}
						disableResize
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
				{selectedText && (
					<ResultCard
						result={{
							content: selectedText,
							isSelectedText: true,
						}}
						isSelected={selectedResultId === 'selectedText'}
						isCustom={modifyOption === 'custom'}
						onSelect={() => setSelectedResultId('selectedText')}
					/>
				)}
				{results.map((result, index) => {
					if (index >= loadUntilIndex) {
						return null;
					}

					const handleResultInsertion = () => {
						const { start: selectionStart, end: selectionEnd } =
							formatValue;

						const contentBeforeSelection = content.slice(
							0,
							selectionStart
						);
						const contentAfterSelection =
							content.slice(selectionEnd);
						const newContent =
							contentBeforeSelection +
							result.content +
							contentAfterSelection;

						if (selectionStart !== selectionEnd) {
							onChangeTextFormat({
								...formatValue,
								end: selectionStart + result.content.length,
							});
						}

						onContentChange(newContent);
					};

					const handleResultSelection = (id = result.id) =>
						setSelectedResultId(id);

					const handleResultUseSettings = () => {
						if (result.refId) {
							setModifyOption(result.modificationType);
							setCustomText(result.customText);

							const refResultIndex =
								result.refId &&
								results.findIndex(
									refResult => refResult.id === result.refId
								);

							if (refResultIndex >= loadUntilIndex) {
								setLoadUntilIndex(refResultIndex + 1);
							}

							setSelectedResultId(result.refId);

							return;
						}

						if (result.settings) {
							updateSettings(result.settings);
							switchToGenerateTab();
						}
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

						if (selectedResultId === result.id) {
							setSelectedResultId(null);
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
							isSelected={result.id === selectedResultId}
							isSelectedText={!!selectedText}
							isCustom={modifyOption === 'custom'}
							onInsert={handleResultInsertion}
							onSelect={handleResultSelection}
							onUseSettings={handleResultUseSettings}
							onDelete={handleResultDeletion}
						/>
					);
				})}
			</div>
			{isEmpty(results) && !selectedResultId && (
				<h4 className={`${className}__no-results`}>
					{__('History is empty', 'maxi-blocks')}
				</h4>
			)}
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
