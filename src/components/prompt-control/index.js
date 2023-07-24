/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ReactSelectControl from '../react-select-control';
import { CONTENT_TYPES, TONES, WRITING_STYLES } from './constants';
import AdvancedNumberControl from '../advanced-number-control';
import TextareaControl from '../textarea-control';

/**
 * External dependencies
 */
import { Configuration, OpenAIApi } from 'openai';

/**
 * Styles
 */
import './editor.scss';
import Button from '../button';

const configuration = new Configuration({
	apiKey: '#######',
});

export const openAI = new OpenAIApi(configuration);

const PromptControl = props => {
	const [contentType, setContentType] = useState({
		label: CONTENT_TYPES[0],
		value: CONTENT_TYPES[0],
	});
	const [tone, setTone] = useState({ label: TONES[0], value: TONES[0] });
	const [writingStyle, setWritingStyle] = useState({
		label: WRITING_STYLES[0],
		value: WRITING_STYLES[0],
	});
	const [textLength, setTextLength] = useState(0);
	const [confidenceLevel, setConfidenceLevel] = useState(0);
	const [prompt, setPrompt] = useState('');

	const getPrompt = () => {
		const { value: contentTypeVal } = contentType;
		const { value: toneVal } = tone;
		const { value: writingStyleVal } = writingStyle;

		const instruction = `Generate text based on the given criteria:
		Content type: ${contentTypeVal}
		Tone: ${toneVal}
		Writing style: ${writingStyleVal}
		Additional criteria: ${prompt}`;

		return instruction;
	};

	const generateContent = async () => {
		// {
		// 	"data": {
		// 		"id": "chatcmpl-7ei7CQsAvUvhTiovM0swN5Ys78dA9",
		// 		"object": "chat.completion",
		// 		"created": 1689937054,
		// 		"model": "gpt-3.5-turbo-0613",
		// 		"choices": [
		// 			{
		// 				"index": 0,
		// 				"message": {
		// 					"role": "assistant",
		// 					"content": "\"Tech Visionary Elon Musk Acquires Twitter, Paving the Way for Groundbreaking Business Opportunities\""
		// 				},
		// 				"finish_reason": "stop"
		// 			}
		// 		],
		// 		"usage": {
		// 			"prompt_tokens": 46,
		// 			"completion_tokens": 20,
		// 			"total_tokens": 66
		// 		}
		// 	},
		// 	"status": 200,
		// 	"statusText": "",
		// 	"headers": {
		// 		"cache-control": "no-cache, must-revalidate",
		// 		"content-type": "application/json"
		// 	},
		// 	"config": {
		// 		"transitional": {
		// 			"silentJSONParsing": true,
		// 			"forcedJSONParsing": true,
		// 			"clarifyTimeoutError": false
		// 		},
		// 		"transformRequest": [
		// 			null
		// 		],
		// 		"transformResponse": [
		// 			null
		// 		],
		// 		"timeout": 0,
		// 		"xsrfCookieName": "XSRF-TOKEN",
		// 		"xsrfHeaderName": "X-XSRF-TOKEN",
		// 		"maxContentLength": -1,
		// 		"maxBodyLength": -1,
		// 		"headers": {
		// 			"Accept": "application/json, text/plain, */*",
		// 			"Content-Type": "application/json",
		// 			"User-Agent": "OpenAI/NodeJS/3.3.0",
		// 			"Authorization": "Bearer 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"
		// 		},
		// 		"method": "post",
		// 		"data": "{\"messages\":[{\"role\":\"user\",\"content\":\"Generate text based on the given criteria:\\n\\t\\tContent type: Headline\\n\\t\\tTone: Formal\\n\\t\\tWriting style: Business\\n\\t\\tAdditional criteria: Elon musk bought twitter\"}],\"model\":\"gpt-3.5-turbo\",\"temperature\":0.8}",
		// 		"url": "https://api.openai.com/v1/chat/completions"
		// 	},
		// 	"request": {}
		// }

		try {
			const response = await openAI.createChatCompletion({
				messages: [
					{
						role: 'user',
						content: getPrompt(),
					},
				],
				model: 'gpt-3.5-turbo',
				temperature: confidenceLevel / 100,
			});

			console.log(response);
		} catch (error) {
			if (error.response) {
				// console.log(error.response.data);
				console.error(error.response.data);
				console.error(error.response.status);
				console.error(error.response.headers);
			} else {
				console.error(error.message);
			}
		}
	};

	const className = 'maxi-prompt-control';

	return (
		<div className={className}>
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
				label={__('Text length', 'maxi-blocks')}
				value={textLength}
				onChangeValue={val => setTextLength(val)}
				onReset={() => setTextLength(0)}
			/>
			<AdvancedNumberControl
				label={__('Confidence level', 'maxi-blocks')}
				value={confidenceLevel}
				min={0}
				max={100}
				onChangeValue={val => setConfidenceLevel(val)}
				onReset={() => setConfidenceLevel(0)}
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
		</div>
	);
};

export default PromptControl;
