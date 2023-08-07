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
	LANGUAGES,
	TONES,
	WRITING_STYLES,
} from '../../constants';

/**
 * External dependencies
 */
import { ChatOpenAI } from 'langchain/chat_models/openai';

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
					setState: setContentType,
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
						value={state}
						defaultValue={state}
						options={list.map(option => ({
							label: __(option, 'maxi-blocks'),
							value: option,
						}))}
						onChange={obj => setState(obj)}
					/>
				</Fragment>
			))}
			<AdvancedNumberControl
				label={__('Character count guideline', 'maxi-blocks')}
				value={characterCount}
				onChangeValue={val => setCharacterCount(val)}
				onReset={() => setCharacterCount(0)}
			/>
			<AdvancedNumberControl
				label={__('Confidence level', 'maxi-blocks')}
				value={confidenceLevel}
				min={0}
				max={100}
				onChangeValue={val => setConfidenceLevel(val)}
				onReset={() => setConfidenceLevel(75)} // TODO
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
