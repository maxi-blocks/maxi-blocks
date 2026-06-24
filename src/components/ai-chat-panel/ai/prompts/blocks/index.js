import ACCORDION_MAXI_PROMPT from './accordion';
import BUTTON_MAXI_PROMPT from './button';
import COLUMN_MAXI_PROMPT from './column';
import CONTAINER_MAXI_PROMPT from './container';
import DIVIDER_MAXI_PROMPT from './divider';
import GROUP_MAXI_PROMPT from './group';
import ICON_MAXI_PROMPT from './icon';
import IMAGE_MAXI_PROMPT from './image';
import MAP_MAXI_PROMPT from './map';
import NUMBER_COUNTER_MAXI_PROMPT from './number-counter';
import PANE_MAXI_PROMPT from './pane';
import ROW_MAXI_PROMPT from './row';
import SEARCH_MAXI_PROMPT from './search';
import SLIDE_MAXI_PROMPT from './slide';
import SLIDER_MAXI_PROMPT from './slider';
import TEXT_MAXI_PROMPT from './text';
import VIDEO_MAXI_PROMPT from './video';

const BLOCK_PROMPT_ENTRIES = [
	{
		key: 'button',
		match: blockName => typeof blockName === 'string' && blockName.includes('button'),
		target: 'button',
		prompt: BUTTON_MAXI_PROMPT,
	},
	{
		key: 'divider',
		match: blockName => typeof blockName === 'string' && blockName.includes('divider'),
		target: 'divider',
		prompt: DIVIDER_MAXI_PROMPT,
	},
	{
		key: 'icon',
		match: blockName =>
			typeof blockName === 'string' &&
			(blockName.includes('icon-maxi') || blockName.includes('svg-icon')),
		target: 'icon',
		prompt: ICON_MAXI_PROMPT,
	},
	{
		key: 'text',
		match: blockName =>
			typeof blockName === 'string' &&
			(blockName.includes('text') || blockName.includes('heading')),
		target: 'text',
		prompt: TEXT_MAXI_PROMPT,
	},
	{
		key: 'container',
		match: blockName =>
			typeof blockName === 'string' &&
			blockName.includes('container') &&
			!blockName.includes('group'),
		target: 'container',
		prompt: CONTAINER_MAXI_PROMPT,
	},
	{
		key: 'group',
		match: blockName => typeof blockName === 'string' && blockName.includes('group'),
		target: 'group',
		prompt: GROUP_MAXI_PROMPT,
	},
	{
		key: 'row',
		match: blockName => typeof blockName === 'string' && blockName.includes('row'),
		target: 'row',
		prompt: ROW_MAXI_PROMPT,
	},
	{
		key: 'column',
		match: blockName => typeof blockName === 'string' && blockName.includes('column'),
		target: 'column',
		prompt: COLUMN_MAXI_PROMPT,
	},
	{
		key: 'accordion',
		match: blockName => typeof blockName === 'string' && blockName.includes('accordion'),
		target: 'accordion',
		prompt: ACCORDION_MAXI_PROMPT,
	},
	{
		key: 'pane',
		match: blockName => typeof blockName === 'string' && blockName.includes('pane'),
		target: 'pane',
		prompt: PANE_MAXI_PROMPT,
	},
	{
		key: 'slide',
		match: blockName =>
			typeof blockName === 'string' &&
			blockName.includes('slide') &&
			!blockName.includes('slider'),
		target: 'slide',
		prompt: SLIDE_MAXI_PROMPT,
	},
	{
		key: 'slider',
		match: blockName => typeof blockName === 'string' && blockName.includes('slider'),
		target: 'slider',
		prompt: SLIDER_MAXI_PROMPT,
	},
	{
		key: 'video',
		match: blockName => typeof blockName === 'string' && blockName.includes('video'),
		target: 'video',
		prompt: VIDEO_MAXI_PROMPT,
	},
	{
		key: 'map',
		match: blockName => typeof blockName === 'string' && blockName.includes('map'),
		target: 'map',
		prompt: MAP_MAXI_PROMPT,
	},
	{
		key: 'search',
		match: blockName => typeof blockName === 'string' && blockName.includes('search'),
		target: 'search',
		prompt: SEARCH_MAXI_PROMPT,
	},
	{
		key: 'number-counter',
		match: blockName =>
			typeof blockName === 'string' && blockName.includes('number-counter'),
		target: 'number-counter',
		prompt: NUMBER_COUNTER_MAXI_PROMPT,
	},
	{
		key: 'image',
		match: blockName => typeof blockName === 'string' && blockName.includes('image'),
		target: 'image',
		prompt: IMAGE_MAXI_PROMPT,
	},
];

const getBlockName = blockOrName =>
	typeof blockOrName === 'string' ? blockOrName : blockOrName?.name || '';

export { BLOCK_PROMPT_ENTRIES };

export const BLOCK_PROMPTS = Object.fromEntries(
	BLOCK_PROMPT_ENTRIES.map(entry => [entry.target, entry.prompt])
);

export const getBlockPromptEntryForBlockName = blockOrName => {
	const name = getBlockName(blockOrName);
	return BLOCK_PROMPT_ENTRIES.find(entry => entry.match(name)) || null;
};

export const getBlockPromptForBlockName = blockOrName => {
	const entry = getBlockPromptEntryForBlockName(blockOrName);
	return entry ? entry.prompt : '';
};

export const getBlockPromptForTarget = target => {
	if (!target) return '';
	const entry = BLOCK_PROMPT_ENTRIES.find(block => block.target === target);
	return entry && entry.prompt ? entry.prompt : '';
};

export default BLOCK_PROMPTS;

