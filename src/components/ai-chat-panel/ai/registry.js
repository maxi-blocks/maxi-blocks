/**
 * AI registry for Maxi AI block-specific patterns/handlers/prompts.
 * Add new block entries to AI_BLOCKS to keep the system modular.
 */

import { BUTTON_PATTERNS, handleButtonUpdate } from './blocks/button';
import { CONTAINER_PATTERNS, handleContainerUpdate } from './blocks/container';
import { IMAGE_PATTERNS, handleImageUpdate } from './blocks/image';
import CONTAINER_MAXI_PROMPT from './prompts/container';
import IMAGE_MAXI_PROMPT from './prompts/image';

const AI_BLOCKS = [
	{
		key: 'button',
		match: blockName => typeof blockName === 'string' && blockName.includes('button'),
		target: 'button',
		patterns: BUTTON_PATTERNS,
		handler: handleButtonUpdate,
		prompt: '',
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
