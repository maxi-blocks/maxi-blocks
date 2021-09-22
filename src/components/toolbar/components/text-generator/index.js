/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { create, insert } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */

import Button from '../../../button';
import TextControl from '../../../text-control';
import ToolbarPopover from '../toolbar-popover';
import { withFormatValue } from '../../../../extensions/text/formats';

/**
 * External dependencies
 */

import { LoremIpsum } from 'react-lorem-ipsum';

/**
 * Styles and icons
 */

import './editor.scss';
import { toolbarLoremIpsum } from '../../../../icons';

const TextGenerator = withFormatValue(props => {
	const {
		blockName,
		onChange,
		formatValue,
		isCaptionToolbar = false,
		clientId,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi' && !isCaptionToolbar) return null;

	const [averageSentencesLength, setAverageSentencesLength] = useState(10);
	const [averageWordsLength, setAverageWordsLength] = useState(15);

	const addText = (sentencesPerParagraph, wordsPerSentence) => {
		const generatedText = LoremIpsum({
			p: 1,
			avgWordsPerSentence: wordsPerSentence,
			avgSentencesPerParagraph: sentencesPerParagraph,
		}).map(text => text);

		const newContent = `${formatValue.text} ${generatedText[0].props.children}`;

		const newFormatsArray = [];
		const newReplacementsArray = [];
		newFormatsArray.length = newContent.length;
		newReplacementsArray.length = newContent.length;

		const newFormatValue = insert(
			formatValue,
			` ${generatedText[0].props.children}`
		);

		// Needs a time-out to don't be overwrite by the method `onChangeRichText` used on text related blocks
		setTimeout(() => {
			dispatch('maxiBlocks/text').sendFormatValue(
				newFormatValue,
				clientId
			);
		}, 150);

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

		// Needs a time-out to don't be overwrite by the method `onChangeRichText` used on text related blocks
		setTimeout(() => {
			dispatch('maxiBlocks/text').sendFormatValue(
				newFormatValue,
				clientId
			);
		}, 150);

		onChange({ isList: false, content: generatedText[0].props.children });
	};

	return (
		<ToolbarPopover
			className='toolbar-item__text-generator-blocks'
			tooltip={__('Lorem Ipsum Text', 'maxi-blocks')}
			icon={toolbarLoremIpsum}
		>
			<div className='toolbar-item__text-generator-blocks__popover'>
				<TextControl
					label={__('Words per a sentence', 'maxi-blocks')}
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
						replaceText(averageSentencesLength, averageWordsLength)
					}
				>
					{__('Replace', 'maxi-blocks')}
				</Button>
				<Button
					type='button'
					onClick={obj =>
						addText(averageSentencesLength, averageWordsLength)
					}
				>
					{__('Add', 'maxi-blocks')}
				</Button>
			</div>
		</ToolbarPopover>
	);
});

export default TextGenerator;
