/* eslint-disable no-lone-blocks */
import React, { useState } from 'react';

/**
 * Internal dependencies
 */

import { __ } from '@wordpress/i18n';
import ToolbarPopover from '../toolbar-popover';
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */

import Button from '../../../button';
import TextControl from '../../../text-control';
import { LoremIpsum } from 'react-lorem-ipsum';
// import { getGroupAttributes } from '../../../../extensions/styles';
import { withFormatValue } from '../../../../extensions/text/formats';

import './editor.scss';
import { toolbarLoremIpsum } from '../../../../icons';
import { insert } from '@wordpress/rich-text';

const TextGenerator = withFormatValue(props => {
	const {
		blockName,
		onChange,
		formatValue,
		isCaptionToolbar = false,
		clientId,
	} = props;
	const [averageSentencesLength, setAverageSentencesLength] = useState(10);
	const [averageWordsLength, setAverageWordsLength] = useState(15);

	if (blockName !== 'maxi-blocks/text-maxi' && !isCaptionToolbar) return null;

	const addText = (sentencesPerParagraph, wordsPerSentence) => {
		const generatedText = LoremIpsum({
			p: 1,
			avgWordsPerSentence: wordsPerSentence,
			avgSentencesPerParagraph: sentencesPerParagraph,
		}).map(text => text);

		// const { getSelectedBlock } = wp.data.select('core/block-editor');
		// const currentContent = getSelectedBlock().attributes.content;

		const newContent = `${formatValue.text} ${generatedText[0].props.children}`;

		const newFormatsArray = [];
		const newReplacementsArray = [];
		newFormatsArray.length = newContent.length;
		newReplacementsArray.length = newContent.length;

		const newFormatValue = insert(formatValue, {
			formats: newFormatsArray,
			replacements: newReplacementsArray,
			text: newContent,
		});

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

		onChange({ isList: false, content: generatedText[0].props.children });
	};

	const replaceContent = () => {
		replaceText(averageSentencesLength, averageWordsLength);
	};

	const addContent = () => {
		addText(averageSentencesLength, averageWordsLength);
	};

	return (
		<ToolbarPopover
			className='toolbar-item__text-generator-blocks'
			tooltip={__('Lorem Ipsum Text', 'maxi-blocks')}
			icon={toolbarLoremIpsum}
		>
			<div className='toolbar-item__text-generator-blocks__popover'>
				<form>
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
					<Button type='button' onClick={replaceContent}>
						{__('Replace', 'maxi-blocks')}
					</Button>
					<Button type='button' onClick={addContent}>
						{__('Add', 'maxi-blocks')}
					</Button>
				</form>
			</div>
		</ToolbarPopover>
	);
});

export default TextGenerator;
