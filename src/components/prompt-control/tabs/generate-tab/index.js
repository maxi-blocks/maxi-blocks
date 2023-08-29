/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	Button,
	ReactSelectControl,
	TextareaControl,
} from '../../..';
import ResultCard from '../../components/result-card';
import {
	CONTENT_TYPES,
	CONTEXT_OPTIONS,
	DEFAULT_CHARACTER_COUNT_GUIDELINES,
	DEFAULT_CONFIDENCE_LEVEL,
	LANGUAGES,
	TONES,
	WRITING_STYLES,
} from '../../constants';

/**
 * Styles
 */
import './editor.scss';

const GenerateTab = ({
	clientId,
	settings,
	selectedText,
	contextOption,
	setContextOption,
	generateContent,
	updateSettings,
}) => {
	const {
		prompt,
		characterCount,
		confidenceLevel,
		contentType,
		tone,
		writingStyle,
		language,
	} = settings;

	const blockEditor = useSelect(select => select('core/block-editor'), []);

	const contextOptions = Object.entries(CONTEXT_OPTIONS)
		.map(([value, label]) => {
			const hasParentBlock =
				value !== 'container' ||
				blockEditor.getBlockParentsByBlockName(
					clientId,
					'maxi-blocks/container-maxi'
				)[0];

			return hasParentBlock
				? { label: __(label, 'maxi-blocks'), value }
				: null;
		})
		.filter(Boolean);

	const className = 'maxi-prompt-control-generate-tab';

	return (
		<div className={className}>
			{selectedText && (
				<ResultCard
					result={{
						content: selectedText,
						isSelectedText: true,
					}}
					isSelected
				/>
			)}
			{[
				{
					key: 'contentType',
					label: 'Content type',
					list: CONTENT_TYPES,
					state: contentType,
				},
				{
					key: 'tone',
					label: 'Tone',
					list: TONES,
					state: tone,
				},
				{
					key: 'writingStyle',
					label: 'Writing style',
					list: WRITING_STYLES,
					state: writingStyle,
				},
				{
					key: 'language',
					label: 'Language',
					list: LANGUAGES,
					state: language,
				},
			].map(({ key, label, list, state }, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<Fragment key={index}>
					<ReactSelectControl
						labelText={__(label, 'maxi-blocks')}
						value={{
							label: __(state, 'maxi-blocks'),
							value: state,
						}}
						defaultValue={{
							label: __(state, 'maxi-blocks'),
							value: state,
						}}
						options={list.map(option => ({
							label: __(option, 'maxi-blocks'),
							value: option,
						}))}
						onChange={({ value }) =>
							updateSettings({ [key]: value })
						}
					/>
				</Fragment>
			))}
			<AdvancedNumberControl
				label={__('Character count guideline', 'maxi-blocks')}
				value={characterCount}
				onChangeValue={characterCount =>
					updateSettings({ characterCount })
				}
				onReset={() =>
					updateSettings({
						characterCount:
							DEFAULT_CHARACTER_COUNT_GUIDELINES[contentType],
					})
				}
			/>
			<AdvancedNumberControl
				label={__('Confidence level', 'maxi-blocks')}
				value={confidenceLevel}
				min={0}
				max={100}
				onChangeValue={confidenceLevel =>
					updateSettings({ confidenceLevel })
				}
				onReset={() =>
					updateSettings({
						confidenceLevel: DEFAULT_CONFIDENCE_LEVEL,
					})
				}
			/>
			<ReactSelectControl
				labelText={__('Context', 'maxi-blocks')}
				value={{
					label: __(CONTEXT_OPTIONS[contextOption], 'maxi-blocks'),
					value: contextOption,
				}}
				defaultValue={{
					label: __(CONTEXT_OPTIONS[contextOption], 'maxi-blocks'),
					value: contextOption,
				}}
				options={contextOptions}
				onChange={({ value }) => setContextOption(value)}
			/>
			<TextareaControl
				className={`${className}__textarea`}
				label={__('Type your prompt', 'maxi-blocks')}
				placeholder={__(
					'More information gives better results',
					'maxi-blocks'
				)}
				value={prompt}
				onChange={prompt => updateSettings({ prompt })}
			/>
			<div className='maxi-prompt-control__buttons'>
				<Button
					className='maxi-prompt-control__button'
					type='button'
					variant='secondary'
					onClick={generateContent}
				>
					{__('Write for me', 'maxi-blocks')}
				</Button>
			</div>
		</div>
	);
};

export default GenerateTab;
