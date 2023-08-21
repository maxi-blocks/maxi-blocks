/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
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
	clientId,
	settings,
	contextOption,
	setContextOption,
	generateContent,
	updateSettings,
	switchToModifyTab,
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

	const className = 'maxi-prompt-control-generate-tab';

	return (
		<>
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
				options={Object.entries(CONTEXT_OPTIONS)
					.map(
						([value, label]) =>
							(value !== 'container' ||
								select(
									'core/block-editor'
								).getBlockParentsByBlockName(
									clientId,
									'maxi-blocks/container-maxi'
								)[0]) && {
								label: __(label, 'maxi-blocks'),
								value,
							}
					)
					.filter(Boolean)}
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
