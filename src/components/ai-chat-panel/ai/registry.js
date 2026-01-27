/**
 * AI registry for Maxi AI block-specific patterns/handlers/prompts.
 * Add new block entries to AI_BLOCKS to keep the system modular.
 */

import { BUTTON_PATTERNS, handleButtonUpdate } from './blocks/button';
import { COLUMN_PATTERNS, handleColumnUpdate } from './blocks/column';
import { CONTAINER_PATTERNS, handleContainerUpdate } from './blocks/container';
import { DIVIDER_PATTERNS, handleDividerUpdate } from './blocks/divider';
import { GROUP_PATTERNS, handleGroupUpdate } from './blocks/group';
import { ICON_PATTERNS, handleIconUpdate } from './blocks/icon';
import { IMAGE_PATTERNS, handleImageUpdate } from './blocks/image';
import { MAP_PATTERNS, handleMapUpdate } from './blocks/map';
import { NUMBER_COUNTER_PATTERNS, handleNumberCounterUpdate } from './blocks/number-counter';
import { PANE_PATTERNS, handlePaneUpdate } from './blocks/pane';
import { ROW_PATTERNS, handleRowUpdate } from './blocks/row';
import { SEARCH_PATTERNS, handleSearchUpdate } from './blocks/search';
import { SLIDE_PATTERNS, handleSlideUpdate } from './blocks/slide';
import { SLIDER_PATTERNS, handleSliderUpdate } from './blocks/slider';
import { TEXT_PATTERNS, handleTextUpdate } from './blocks/text';
import { VIDEO_PATTERNS, handleVideoUpdate } from './blocks/video';
import { ACCORDION_PATTERNS, handleAccordionUpdate } from './blocks/accordion';
import ACCORDION_MAXI_PROMPT from './prompts/accordion';
import BUTTON_MAXI_PROMPT from './prompts/button';
import COLUMN_MAXI_PROMPT from './prompts/column';
import CONTAINER_MAXI_PROMPT from './prompts/container';
import DIVIDER_MAXI_PROMPT from './prompts/divider';
import GROUP_MAXI_PROMPT from './prompts/group';
import ICON_MAXI_PROMPT from './prompts/icon';
import IMAGE_MAXI_PROMPT from './prompts/image';
import MAP_MAXI_PROMPT from './prompts/map';
import NUMBER_COUNTER_MAXI_PROMPT from './prompts/number-counter';
import PANE_MAXI_PROMPT from './prompts/pane';
import ROW_MAXI_PROMPT from './prompts/row';
import SEARCH_MAXI_PROMPT from './prompts/search';
import SLIDE_MAXI_PROMPT from './prompts/slide';
import SLIDER_MAXI_PROMPT from './prompts/slider';
import TEXT_MAXI_PROMPT from './prompts/text';
import VIDEO_MAXI_PROMPT from './prompts/video';

const AI_BLOCKS = [
	{
		key: 'button',
		match: blockName => typeof blockName === 'string' && blockName.includes('button'),
		target: 'button',
		patterns: BUTTON_PATTERNS,
		handler: handleButtonUpdate,
		prompt: BUTTON_MAXI_PROMPT,
	},
	{
		key: 'divider',
		match: blockName => typeof blockName === 'string' && blockName.includes('divider'),
		target: 'divider',
		patterns: DIVIDER_PATTERNS,
		handler: handleDividerUpdate,
		prompt: DIVIDER_MAXI_PROMPT,
	},
	{
		key: 'icon',
		match: blockName =>
			typeof blockName === 'string' &&
			(blockName.includes('icon-maxi') || blockName.includes('svg-icon')),
		target: 'icon',
		patterns: ICON_PATTERNS,
		handler: handleIconUpdate,
		prompt: ICON_MAXI_PROMPT,
	},
	{
		key: 'text',
		match: blockName => typeof blockName === 'string' && (blockName.includes('text') || blockName.includes('heading')),
		target: 'text',
		patterns: TEXT_PATTERNS,
		handler: handleTextUpdate,
		prompt: TEXT_MAXI_PROMPT,
	},
	{
		key: 'container',
		match: blockName =>
			typeof blockName === 'string' &&
			blockName.includes('container') &&
			!blockName.includes('group'),
		target: 'container',
		patterns: CONTAINER_PATTERNS,
		handler: handleContainerUpdate,
		prompt: CONTAINER_MAXI_PROMPT,
	},
	{
		key: 'group',
		match: blockName => typeof blockName === 'string' && blockName.includes('group'),
		target: 'group',
		patterns: GROUP_PATTERNS,
		handler: handleGroupUpdate,
		prompt: GROUP_MAXI_PROMPT,
	},
	{
		key: 'row',
		match: blockName => typeof blockName === 'string' && blockName.includes('row'),
		target: 'row',
		patterns: ROW_PATTERNS,
		handler: handleRowUpdate,
		prompt: ROW_MAXI_PROMPT,
	},
	{
		key: 'column',
		match: blockName => typeof blockName === 'string' && blockName.includes('column'),
		target: 'column',
		patterns: COLUMN_PATTERNS,
		handler: handleColumnUpdate,
		prompt: COLUMN_MAXI_PROMPT,
	},
	{
		key: 'accordion',
		match: blockName => typeof blockName === 'string' && blockName.includes('accordion'),
		target: 'accordion',
		patterns: ACCORDION_PATTERNS,
		handler: handleAccordionUpdate,
		prompt: ACCORDION_MAXI_PROMPT,
	},
	{
		key: 'pane',
		match: blockName => typeof blockName === 'string' && blockName.includes('pane'),
		target: 'pane',
		patterns: PANE_PATTERNS,
		handler: handlePaneUpdate,
		prompt: PANE_MAXI_PROMPT,
	},
	{
		key: 'slide',
		match: blockName =>
			typeof blockName === 'string' &&
			blockName.includes('slide') &&
			!blockName.includes('slider'),
		target: 'slide',
		patterns: SLIDE_PATTERNS,
		handler: handleSlideUpdate,
		prompt: SLIDE_MAXI_PROMPT,
	},
	{
		key: 'slider',
		match: blockName => typeof blockName === 'string' && blockName.includes('slider'),
		target: 'slider',
		patterns: SLIDER_PATTERNS,
		handler: handleSliderUpdate,
		prompt: SLIDER_MAXI_PROMPT,
	},
	{
		key: 'video',
		match: blockName => typeof blockName === 'string' && blockName.includes('video'),
		target: 'video',
		patterns: VIDEO_PATTERNS,
		handler: handleVideoUpdate,
		prompt: VIDEO_MAXI_PROMPT,
	},
	{
		key: 'map',
		match: blockName => typeof blockName === 'string' && blockName.includes('map'),
		target: 'map',
		patterns: MAP_PATTERNS,
		handler: handleMapUpdate,
		prompt: MAP_MAXI_PROMPT,
	},
	{
		key: 'search',
		match: blockName => typeof blockName === 'string' && blockName.includes('search'),
		target: 'search',
		patterns: SEARCH_PATTERNS,
		handler: handleSearchUpdate,
		prompt: SEARCH_MAXI_PROMPT,
	},
	{
		key: 'number-counter',
		match: blockName => typeof blockName === 'string' && blockName.includes('number-counter'),
		target: 'number-counter',
		patterns: NUMBER_COUNTER_PATTERNS,
		handler: handleNumberCounterUpdate,
		prompt: NUMBER_COUNTER_MAXI_PROMPT,
	},
	{
		key: 'image',
		match: blockName => typeof blockName === 'string' && blockName.includes('image'),
		target: 'image',
		patterns: IMAGE_PATTERNS,
		handler: handleImageUpdate,
		prompt: IMAGE_MAXI_PROMPT,
	},
];

const getBlockName = blockOrName =>
	typeof blockOrName === 'string' ? blockOrName : blockOrName?.name || '';

export const AI_BLOCK_PATTERNS = AI_BLOCKS.flatMap(block => block.patterns || []);

export const getAiHandlerForBlock = blockOrName => {
	const name = getBlockName(blockOrName);
	const entry = AI_BLOCKS.find(block => block.match(name));
	return entry ? entry.handler : null;
};

export const getAiHandlerForTarget = target => {
	if (!target) return null;
	const entry = AI_BLOCKS.find(block => block.target === target);
	return entry ? entry.handler : null;
};

export const getAiPromptForBlockName = blockOrName => {
	const name = getBlockName(blockOrName);
	const entry = AI_BLOCKS.find(block => block.match(name));
	return entry && entry.prompt ? entry.prompt : '';
};
