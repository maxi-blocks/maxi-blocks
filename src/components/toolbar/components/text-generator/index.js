/* eslint-disable no-lone-blocks */
import React, { useState } from 'react';

/**
 * Internal dependencies
 */

import { __ } from '@wordpress/i18n';
import ToolbarPopover from '../toolbar-popover';

/**
 * Internal dependencies
 */

import Button from '../../../button';
import TextControl from '../../../text-control';
import { LoremIpsum } from 'react-lorem-ipsum';

import './editor.scss';
import { toolbarLoremIpsum } from '../../../../icons';

let placeholderText = 1;

const TextGenerator = props => {
	const { blockName, onChange, isCaptionToolbar = false } = props;
	const [averageSentencesLength, setAverageSentencesLength] =
		useState(placeholderText);

	if (blockName !== 'maxi-blocks/text-maxi' && !isCaptionToolbar) return null;

	const addText = sentencesPerParagraph => {
		const generatedText = LoremIpsum({
			p: 1,
			avgWordsPerSentence: 8,
			avgSentencesPerParagraph: sentencesPerParagraph,
		}).map(text => text);

		onChange({ isList: false, content: generatedText[0].props.children });
	};

	return (
		<ToolbarPopover
			className='toolbar-item__text-generator-blocks'
			tooltip={__('Lorem Ipsum Text', 'maxi-blocks')}
			icon={toolbarLoremIpsum}
		>
			<div className='toolbar-item__text-generator-blocks__popover'>
				<form
					onSubmit={e => {
						e.preventDefault();
						placeholderText = averageSentencesLength;
						addText(averageSentencesLength);
					}}
				>
					<TextControl
						label={__('Average Sentences', 'maxi-blocks')}
						value={averageSentencesLength}
						onChange={setAverageSentencesLength}
						type='number'
						min='1'
					/>
					<Button type='submit'>
						{__('Add Text', 'maxi-blocks')}
					</Button>
				</form>
			</div>
		</ToolbarPopover>
	);
};

export default TextGenerator;
