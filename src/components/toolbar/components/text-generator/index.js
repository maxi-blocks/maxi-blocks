/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { create, insert } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */

import Button from '../../../button';
import TextControl from '../../../text-control';
import Dropdown from '../../../dropdown';
import { textContext } from '../../../../extensions/text/formats';

/**
 * External dependencies
 */

import { LoremIpsum } from 'react-lorem-ipsum';

/**
 * Styles
 */
import './editor.scss';

const TextGenerator = props => {
	const { onChange } = props;

	const { formatValue, onChangeTextFormat } = useContext(textContext);

	const [averageSentencesLength, setAverageSentencesLength] = useState(10);
	const [averageWordsLength, setAverageWordsLength] = useState(15);

	const addText = (sentencesPerParagraph, wordsPerSentence) => {
		const generatedText = LoremIpsum({
			p: 1,
			avgWordsPerSentence: wordsPerSentence,
			avgSentencesPerParagraph: sentencesPerParagraph,
		}).map(text => text);

		const newContent = `${formatValue.text}${generatedText[0].props.children}`;

		const newFormatsArray = [];
		const newReplacementsArray = [];
		newFormatsArray.length = newContent.length;
		newReplacementsArray.length = newContent.length;

		const newFormatValue = insert(
			formatValue,
			` ${generatedText[0].props.children}`
		);

		onChangeTextFormat(newFormatValue);

		onChange({ isList: false, content: newContent });
	};

	const replaceText = (sentencesPerParagraph, wordsPerSentence) => {
		const generatedText = LoremIpsum({
			p: 1,
			avgWordsPerSentence: wordsPerSentence,
			avgSentencesPerParagraph: sentencesPerParagraph,
		}).map(text => text);

		const newContent = generatedText[0].props.children;

		const newFormatsArray = [];
		const newReplacementsArray = [];
		newFormatsArray.length = newContent.length;
		newReplacementsArray.length = newContent.length;

		const newFormatValue = create({ text: newContent });

		onChangeTextFormat(newFormatValue);

		onChange({ isList: false, content: generatedText[0].props.children });
	};

	return (
		<Dropdown
			className='maxi-text-generator__generator'
			contentClassName='maxi-more-settings__popover maxi-dropdown__child-content maxi-dropdown__text-generator-child-content'
			position='right top'
			renderToggle={({ isOpen, onToggle }) => (
				<Button onClick={onToggle} text='Copy'>
					{__('Ipsum text generator (Ipsum)', 'maxi-blocks')}
				</Button>
			)}
			renderContent={() => (
				<div className='toolbar-item__text-generator-blocks__popover'>
					<TextControl
						label={__('Words per sentence', 'maxi-blocks')}
						value={averageWordsLength}
						onChange={val => setAverageWordsLength(val)}
						type='number'
						min='1'
					/>
					<TextControl
						label={__('Sentences', 'maxi-blocks')}
						value={averageSentencesLength}
						onChange={val => setAverageSentencesLength(val)}
						type='number'
						min='1'
					/>
					<Button
						type='button'
						onClick={obj =>
							addText(averageSentencesLength, averageWordsLength)
						}
					>
						{__('Add', 'maxi-blocks')}
					</Button>
					<Button
						type='button'
						onClick={obj =>
							replaceText(
								averageSentencesLength,
								averageWordsLength
							)
						}
					>
						{__('Replace', 'maxi-blocks')}
					</Button>
				</div>
			)}
		/>
	);
};

export default TextGenerator;
