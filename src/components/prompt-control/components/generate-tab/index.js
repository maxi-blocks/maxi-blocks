/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
	contentType,
	setContentType,
	tone,
	setTone,
	writingStyle,
	setWritingStyle,
	characterCount,
	setCharacterCount,
	language,
	setLanguage,
	confidenceLevel,
	setConfidenceLevel,
	contextOption,
	setContextOption,
	prompt,
	setPrompt,
	generateContent,
	switchToModifyTab,
}) => {
	const className = 'maxi-prompt-control-generate-tab';

	return (
		<>
			{[
				{
					label: 'Content type',
					list: CONTENT_TYPES,
					state: contentType,
					setState: value => {
						setContentType(value);
						setCharacterCount(
							DEFAULT_CHARACTER_COUNT_GUIDELINES[value]
						);
					},
				},
				{
					label: 'Tone',
					list: TONES,
					state: tone,
					setState: setTone,
				},
				{
					label: 'Writing style',
					list: WRITING_STYLES,
					state: writingStyle,
					setState: setWritingStyle,
				},
				{
					label: 'Language',
					list: LANGUAGES,
					state: language,
					setState: setLanguage,
				},
			].map(({ label, list, state, setState }, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<Fragment key={index}>
					<label>{__(label, 'maxi-blocks')}</label>
					<ReactSelectControl
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
						onChange={({ value }) => setState(value)}
					/>
				</Fragment>
			))}
			<AdvancedNumberControl
				label={__('Character count guideline', 'maxi-blocks')}
				value={characterCount}
				onChangeValue={val => setCharacterCount(val)}
				onReset={() =>
					setCharacterCount(
						DEFAULT_CHARACTER_COUNT_GUIDELINES[contentType]
					)
				}
			/>
			<AdvancedNumberControl
				label={__('Confidence level', 'maxi-blocks')}
				value={confidenceLevel}
				min={0}
				max={100}
				onChangeValue={val => setConfidenceLevel(val)}
				onReset={() => setConfidenceLevel(DEFAULT_CONFIDENCE_LEVEL)}
			/>
			<label>{__('Context', 'maxi-blocks')}</label>
			<ReactSelectControl
				value={{
					label: __(CONTEXT_OPTIONS[contextOption], 'maxi-blocks'),
					value: contextOption,
				}}
				defaultValue={{
					label: __(CONTEXT_OPTIONS[contextOption], 'maxi-blocks'),
					value: contextOption,
				}}
				options={Object.entries(CONTEXT_OPTIONS).map(
					([value, label]) => ({
						label: __(label, 'maxi-blocks'),
						value,
					})
				)}
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
				onChange={val => setPrompt(val)}
			/>
			<Button type='button' variant='secondary' onClick={generateContent}>
				{__('Write for me', 'maxi-blocks')}
			</Button>
			<Button
				type='button'
				variant='secondary'
				onClick={switchToModifyTab}
			>
				{__('History', 'maxi-blocks')}
			</Button>
		</>
	);
};

export default GenerateTab;
