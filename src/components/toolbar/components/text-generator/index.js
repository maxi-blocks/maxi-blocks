/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */

import Button from '@components/button';
import AdvancedNumberControl from '@components/advanced-number-control';
import Dropdown from '@components/dropdown';
import { TextContext } from '@extensions/text/formats';
import { generateLoremIpsum } from '@extensions/text/generateLoremIpsum';

/**
 * Styles
 */
import './editor.scss';

const TextGenerator = props => {
	const { onChange, closeMoreSettings } = props;
	const { content } = useContext(TextContext);

	const [averageSentencesLength, setAverageSentencesLength] = useState(10);
	const [averageWordsLength, setAverageWordsLength] = useState(15);

	const addText = (sentencesPerParagraph, wordsPerSentence) => {
		const generatedText = generateLoremIpsum({
			avgWordsPerSentence: wordsPerSentence,
			avgSentencesPerParagraph: sentencesPerParagraph,
		});

		const newContent = `${content}${generatedText}`;

		const newFormatsArray = [];
		const newReplacementsArray = [];
		newFormatsArray.length = newContent.length;
		newReplacementsArray.length = newContent.length;

		onChange({ isList: false, content: newContent });
		closeMoreSettings();
	};

	const replaceText = (sentencesPerParagraph, wordsPerSentence) => {
		const generatedText = generateLoremIpsum({
			avgWordsPerSentence: wordsPerSentence,
			avgSentencesPerParagraph: sentencesPerParagraph,
		});

		const newFormatsArray = [];
		const newReplacementsArray = [];
		newFormatsArray.length = generatedText.length;
		newReplacementsArray.length = generatedText.length;

		onChange({ isList: false, content: generatedText });
		closeMoreSettings();
	};

	return (
		<Dropdown
			className='maxi-text-generator__generator'
			contentClassName='maxi-more-settings__popover maxi-dropdown__child-content maxi-dropdown__text-generator-child-content'
			position='right top'
			renderToggle={({ isOpen, onToggle }) => (
				<Button onClick={onToggle} text='Copy'>
					{__('Placeholder text generator', 'maxi-blocks')}
				</Button>
			)}
			renderContent={() => (
				<div className='toolbar-item__text-generator-blocks__popover'>
					<AdvancedNumberControl
						disableRange
						disableReset
						label={__('Words per sentence', 'maxi-blocks')}
						value={averageWordsLength}
						onChangeValue={val => {
							setAverageWordsLength(val);
						}}
						min={0}
						max={100}
					/>
					<AdvancedNumberControl
						disableRange
						disableReset
						label={__('Sentences', 'maxi-blocks')}
						value={averageSentencesLength}
						onChangeValue={val => {
							setAverageSentencesLength(val);
						}}
						min={0}
						max={20}
					/>
					<Button
						type='button'
						onClick={() => {
							addText(averageSentencesLength, averageWordsLength);
						}}
					>
						{__('Add', 'maxi-blocks')}
					</Button>
					<Button
						type='button'
						onClick={() =>
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
