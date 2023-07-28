/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { resolveSelect } from '@wordpress/data';
import { useContext, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ContentLoader from '../content-loader';
import GenerateTab from './components/generate-tab';
import TextContext from '../../extensions/text/formats/textContext';
import ModifyTab from './components/modify-tab';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const PromptControl = ({ content, onChangeContent }) => {
	const { receiveMaxiSettings } = resolveSelect('maxiBlocks');

	// const openAIApiKey = receiveMaxiSettings()
	// 	.then(maxiSettings => {
	// 		const openAIApiKey = maxiSettings?.openai_api_key;
	// 		return openAIApiKey;
	// 	})
	// 	.catch(() => console.error('Maxi Blocks: Could not load settings'));

	// console.log(openAIApiKey);
	const [openAIApiKey, setOpenAIApiKey] = useState(null);

	const textContext = useContext(TextContext);
	const selectedText = content.substring(
		textContext.formatValue.start,
		textContext.formatValue.end
	);

	const [isFetching, setIsFetching] = useState(false);
	const [results, setResults] = useState([]);

	useEffect(() => {
		const getOpenAIApiKey = async () => {
			try {
				const maxiSettings = await receiveMaxiSettings();
				const openAIApiKey = maxiSettings?.openai_api_key;

				setOpenAIApiKey(openAIApiKey);
			} catch (error) {
				console.error('Maxi Blocks: Could not load settings');
			}
		};

		getOpenAIApiKey();
	}, []);

	useEffect(() => {
		if (!isEmpty(selectedText)) {
			setResults([
				{
					id: 1,
					content: selectedText,
					isSelectedText: true,
					formatValue: {
						start: textContext.formatValue.start,
						end: textContext.formatValue.end,
					},
				},
			]);
		} else if (!isEmpty(results) && isEmpty(selectedText)) {
			setResults(results.filter(result => !result.isSelectedText));
		}
	}, [selectedText]);

	if (isFetching || !openAIApiKey) {
		return <ContentLoader />;
	}

	const goToGenerateTab = () => {
		setResults([]);
	};

	const className = 'maxi-prompt-control';

	return (
		<div className={className}>
			{isEmpty(results) && (
				<GenerateTab
					results={results}
					openAIApiKey={openAIApiKey}
					setResults={setResults}
					setIsFetching={setIsFetching}
				/>
			)}
			{!isEmpty(results) && (
				<ModifyTab
					results={results}
					content={content}
					openAIApiKey={openAIApiKey}
					onChangeContent={onChangeContent}
					setResults={setResults}
					setIsFetching={setIsFetching}
					goToGenerateTab={goToGenerateTab}
				/>
			)}
		</div>
	);
};

export default PromptControl;
