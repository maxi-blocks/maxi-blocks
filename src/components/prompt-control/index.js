/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useEffect, useRef, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { ceil, floor, isEmpty, lowerCase } from 'lodash';

/**
 * Internal dependencies
 */
import ContentLoader from '@components/content-loader';
import InfoBox from '@components/info-box';
import SettingTabsControl from '@components/setting-tabs-control';
import GenerateTab from './tabs/generate-tab';
import ResultsTab from './tabs/results-tab';
import ModifyTab from './tabs/modify-tab';
import TextContext from '@extensions/text/formats/TextContext';
import { getMaxiAdminSettingsUrl } from '@blocks/map-maxi/utils';
import { useAISettings, useResultsHandling, useSettings } from './hooks';
import {
	getContext,
	getContextSection,
    getExamplesSection,
	getFormattedMessages,
	getSiteInformation,
	handleContentGeneration,
} from './utils';
import {
	CONTEXT_OPTIONS,
	DEFAULT_CHARACTER_COUNT_GUIDELINES,
	MODIFY_OPTIONS,
} from './constants';

/**
 * Styles
 */
import './editor.scss';

const PromptControl = ({ clientId, content, onContentChange }) => {
	const AISettings = useAISettings();

	const [tab, setTab] = useState(0);

	const textContext = useContext(TextContext);
	const selectedText = content.substring(
		textContext.formatValue.start,
		textContext.formatValue.end
	);

	const { settings, updateSettings } = useSettings(selectedText);
	const {
		prompt,
		characterCount,
		temperature,
		contentType,
		tone,
		writingStyle,
		language,
	} = settings;

	const [contextOption, setContextOption] = useState(
		Object.keys(CONTEXT_OPTIONS)[0]
	);
	const [results, setResults] = useResultsHandling();
	const [selectedResultId, setSelectedResultId] = useState(results[0]?.id);

	const [isGenerating, setIsGenerating] = useState(false);
	const [isManualMode, setIsManualMode] = useState(false);

	const [modifyOption, setModifyOption] = useState(MODIFY_OPTIONS[0]);
	const [customValue, setCustomValue] = useState('');

	const abortControllerRef = useRef(null);

	useEffect(() => {
		const currentAbortController = abortControllerRef.current;

		return () => {
			currentAbortController?.abort();
		};
	}, []);

	const switchToGenerateTab = () => {
		setTab(0);
	};

	const switchToResultsTab = () => {
		setTab(1);
	};

	const switchToModifyTab = () => {
		setTab(2);
	};

	useEffect(() => {
		if (!isEmpty(selectedText)) {
			setSelectedResultId('selectedText');
			updateSettings({ characterCount: selectedText.length });
		} else {
			setSelectedResultId(null);
			updateSettings({
				characterCount: DEFAULT_CHARACTER_COUNT_GUIDELINES[contentType],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedText]);

	if (isEmpty(AISettings)) {
		return <ContentLoader />;
	}

	if (!AISettings.hasOpenaiApiKey) {
		return (
			<InfoBox
				message={__(
					'You have not set your OpenAI API key, please navigate to the Maxi AI Options and set it',
					'maxi-blocks'
				)}
				links={[
					{
						title: __(
							'Integrations > OpenAI API key',
							'maxi-blocks'
						),
						href: getMaxiAdminSettingsUrl('maxi_blocks_maxi_ai'),
					},
				]}
			/>
		);
	}

	if (isManualMode) {
		return (
			<InfoBox
				message={__(
					'The selected AI model is unavailable. Continue by editing content manually, or select another model in the Maxi AI settings.',
					'maxi-blocks'
				)}
				links={[
					{
						title: __(
							'Maxi AI Settings',
							'maxi-blocks'
						),
						href: getMaxiAdminSettingsUrl('maxi_blocks_maxi_ai'),
					},
				]}
			/>
		);
	}

	const getMessages = async (promptOverride) => {
        const currentPrompt = typeof promptOverride === 'string' ? promptOverride : prompt;

		const systemTemplate = `${getSiteInformation(
			AISettings
		)}${getContextSection(getContext(contextOption, clientId))}
${getExamplesSection(contentType)}${
			AISettings.systemInstructions
				? `\n\n${AISettings.systemInstructions}`
				: ''
		}`;

		const humanTemplate = `Please craft a ${lowerCase(tone)} ${lowerCase(
			writingStyle
		)} ${lowerCase(contentType)} between ${floor(
			characterCount * 0.8
		)} to ${ceil(characterCount * 1.2)} characters, matching the ${
			language === 'Language of the prompt'
				? "language of user's message"
				: `${language} language`
		}${
			!['Quotes', 'Pull quotes Testimonial'].includes(contentType)
				? ', and avoid using quotation marks'
				: ''
		}. Ensure it aligns with the site details and is polished for the website.${
			currentPrompt ? `\nUser's custom instructions: ${currentPrompt}` : ''
		}`;

		return getFormattedMessages(
			systemTemplate,
			humanTemplate,
			AISettings.model
		);
	};

	const generateContent = async (promptOverride) => {
        const currentPrompt = typeof promptOverride === 'string' ? promptOverride : prompt;
		switchToResultsTab();

		handleContentGeneration({
			openAIApiKey: undefined, // No longer needed - using backend proxy
			modelName: AISettings.model,
			additionalParams: {
				temperature,
			},
			additionalData: {
				settings,
				prompt: currentPrompt,
			},
			results,
			abortControllerRef,
			getMessages: () => getMessages(currentPrompt),
			setResults,
			setSelectedResultId,
			setIsGenerating,
			onModelUnavailable: () => setIsManualMode(true),
		});
	};

	const handleClarifySelect = option => {
		if (!option) {
			return;
		}

		if (option.id === 'cancel') {
			switchToGenerateTab();
			return;
		}

		const clarifyPrompt = option.prompt || option.value || option.label || '';
		updateSettings({ prompt: clarifyPrompt });
		generateContent(clarifyPrompt);
	};

	const handleAbort = () => {
		abortControllerRef.current?.abort();
		setIsGenerating(false);
	};

	const className = 'maxi-prompt-control';

	return (
		<div className={className}>
			<SettingTabsControl
				tab={tab}
				items={[
					{
						label: __('Generate', 'maxi-blocks'),
						content: (
							<GenerateTab
								clientId={clientId}
								settings={settings}
								selectedText={selectedText}
								contextOption={contextOption}
								setContextOption={setContextOption}
								prompt={prompt}
								generateContent={generateContent}
								updateSettings={updateSettings}
							/>
						),
					},
					{
						label: __('Results', 'maxi-blocks'),
						content: (
							<ResultsTab
								results={results}
								content={content}
								modifyOption={modifyOption}
								formatValue={textContext.formatValue}
								selectedResultId={selectedResultId}
								isSelectedText={!!selectedText}
								isGenerating={isGenerating}
								setResults={setResults}
								setModifyOption={setModifyOption}
								setCustomValue={setCustomValue}
								setSelectedResultId={setSelectedResultId}
								onContentChange={onContentChange}
                                onClarifySelect={handleClarifySelect}
								onChangeTextFormat={
									textContext.onChangeTextFormat
								}
								onAbort={handleAbort}
								updateSettings={updateSettings}
								switchToGenerateTab={switchToGenerateTab}
								switchToModifyTab={switchToModifyTab}
							/>
						),
					},
					{
						label: __('Modify', 'maxi-blocks'),
						content: (
							<ModifyTab
								clientId={clientId}
								results={results}
								AISettings={AISettings}
								settings={settings}
								contextOption={contextOption}
								selectedText={selectedText}
								modifyOption={modifyOption}
								customValue={customValue}
								abortControllerRef={abortControllerRef}
								setModifyOption={setModifyOption}
								setCustomValue={setCustomValue}
								setIsGenerating={setIsGenerating}
								selectedResultId={selectedResultId}
								setSelectedResultId={setSelectedResultId}
								setResults={setResults}
								onModelUnavailable={() => setIsManualMode(true)}
								switchToGenerateTab={switchToGenerateTab}
								switchToResultsTab={switchToResultsTab}
							/>
						),
					},
				]}
				disablePadding
				hasBorder
				setTab={setTab}
			/>
		</div>
	);
};

export default PromptControl;
