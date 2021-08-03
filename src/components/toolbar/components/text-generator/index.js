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

import { toolbarLoremIpsum } from '../../../../icons';

const addText = props => {
	return <div className='lorem_text'>{props}</div>;
};

const TextGenerator = props => {
	// const [length, setLength] = useState(0);
	const [averageSentencesLength, setAverageSentencesLength] = useState(1);

	return (
		<ToolbarPopover
			className='toolbar-item__text-generator-blocks'
			tooltip={__('Lorem Ipsum Text', 'maxi-blocks')}
			icon={toolbarLoremIpsum}
		>
			<div className='toolbar-item__text-generator-blocks__popover'>
				<LoremIpsum
					p={1}
					avgWordsPerSentence={0}
					avgSentencesPerParagraph={averageSentencesLength}
					random='false'
				/>
				{/* {loremIpsum({ avgSentencesPerParagraph={averageSentencesLength} }).map(text => (
					<div className='text' key={text}>
						{text}
					</div>
				))} */}
				<form
					onSubmit={e => {
						e.preventDefault();
						// setLength(0);
						setAverageSentencesLength(1);
						addText(length);
					}}
				>
					{/* <TextControl
						label={__('Paragraph Count', 'maxi-blocks')}
						value={length}
						onChange={setLength}
						type='number'
					/> */}
					<TextControl
						label={__(
							'Average Sentences Per Paragraph',
							'maxi-blocks'
						)}
						value={averageSentencesLength}
						onChange={setAverageSentencesLength}
						type='number'
						min='1'
					/>
					<Button type='submit'>{__('Reset', 'maxi-blocks')}</Button>
				</form>
			</div>
		</ToolbarPopover>
	);
};

export default TextGenerator;
