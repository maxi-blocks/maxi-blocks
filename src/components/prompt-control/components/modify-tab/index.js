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
	getContextSection,
	getFormattedMessages,
	getQuotesGuidance,
	getSiteInformation,
	handleContentGeneration,
} from '../../utils';
import { CONTENT_TYPE_DESCRIPTIONS, MODIFY_OPTIONS } from '../../constants';

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
	selectionStart,
	AISettings,
	settings,
	context,
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

		const isCustom = modificationType === 'custom';

		const modificationAction = isCustom
			? 'modifying'
			: `${modificationType}ing`;

		const customExplanation = isCustom
			? `Custom Instructions: ${customText}\n`
			: '';

		const quoteGuidance = getQuotesGuidance(contentType);

		const systemTemplate = `You are a helpful assistant tasked with ${modificationAction} the following text:
		  - Original Prompt: ${prompt}
		  - Content Attributes: Type - ${contentType} (${
			CONTENT_TYPE_DESCRIPTIONS[contentType]
		}), Tone - ${tone}, Style - ${writingStyle}, Language - ${language}
		  - Length: ${characterCount} characters
		  - Confidence Level: ${confidenceLevel}%
		  - Ready for Direct Publication: No further editing needed. ${quoteGuidance}
		  ${customExplanation}
		  Site Information: ${getSiteInformation(AISettings)}
		  ${getContextSection(context)}

		  Your task is to maintain the original intent and context while ${modificationAction} the text. The content must align with the given criteria, and any custom instructions provided, and be suitable for immediate use on the website.`;

		const humanTemplate = results.find(
			result => result.id === selectedResult
		).content;

		return getFormattedMessages(systemTemplate, humanTemplate);
	};

	const modifyContent = async () => {
		handleContentGeneration({
			openAIApiKey: AISettings.openaiApiKey,
			modelName: AISettings.model,
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
							disabled={isEmpty(results) || !selectedResult}
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
				{results.map((result, index) => {
					if (index >= loadUntilIndex) {
						return null;
					}

					const refResultIndex =
						result.refId &&
						results.findIndex(
							refResult => refResult.id === result.refId
						);

					const refResult =
						refResultIndex >= 0 && results[refResultIndex];

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
						if (result.refId) {
							setModifyOption(result.modificationType);
							setCustomText(result.customText);

							if (refResultIndex >= loadUntilIndex) {
								setLoadUntilIndex(refResultIndex + 1);
							}

							setSelectedResult(result.refId);

							return;
						}

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
							isCustom={modifyOption === 'custom'}
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
