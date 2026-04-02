/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Block Helpers
 *
 * Pure utility functions for working with Gutenberg block objects.
 * No React state dependencies — safe to import anywhere.
 */

export const getBlockPrefix = blockName => {
	if (!blockName) return '';
	const lowerName = String(blockName).toLowerCase();
	if (lowerName.includes('button-maxi')) return 'button-';
	if (lowerName.includes('image-maxi')) return 'image-';
	if (lowerName.includes('svg-icon')) return 'svg-';
	if (lowerName.includes('number-counter')) return 'number-counter-';
	if (lowerName.includes('icon-maxi')) return 'icon-';
	return '';
};

/**
 * Resolve the effective attribute prefix and whether the user is targeting the
 * canvas (block wrapper) vs the sub-element of a block.
 *
 * Blocks like button-maxi, image-maxi, svg-icon-maxi, and number-counter-maxi
 * have TWO attribute layers:
 *   - Element layer  → prefixed (e.g. 'button-', 'image-', 'svg-', 'number-counter-')
 *   - Canvas layer   → unprefixed ('')
 *
 * All other blocks only have a canvas layer (prefix is always ''), so this
 * function is a no-op for them — it returns { prefix: '', isCanvasScope: false }.
 *
 * @param {Object}  block        - Gutenberg block object (needs .name)
 * @param {string}  lowerMessage - Lowercased user message
 * @returns {{ prefix: string, isCanvasScope: boolean }}
 */
export const resolveBlockScope = (block, lowerMessage = '') => {
	const elementPrefix = getBlockPrefix(block?.name || '');
	const hasCanvasLevel = elementPrefix !== '';
	const wantsCanvas = hasCanvasLevel && /\bcanvas\b/i.test(lowerMessage);
	return {
		prefix: wantsCanvas ? '' : elementPrefix,
		isCanvasScope: wantsCanvas,
	};
};

export const matchesTargetBlockName = (blockName, targetBlockArg) => {
	if (!targetBlockArg) return true;
	if (!blockName) return false;

	const lowerName = blockName.toLowerCase();
	const lowerTarget = targetBlockArg.toLowerCase();

	if (lowerTarget === 'image') {
		return lowerName === 'maxi-blocks/image-maxi' || lowerName === 'maxi-blocks/image';
	}
	if (lowerTarget === 'button') {
		return lowerName.includes('button-maxi') || lowerName.includes('button');
	}
	if (lowerTarget === 'text') return lowerName.includes('text') || lowerName.includes('heading');
	if (lowerTarget === 'container') {
		return lowerName.includes('container') && !lowerName.includes('group');
	}
	if (lowerTarget === 'icon') {
		return lowerName.includes('icon-maxi') || lowerName.includes('svg-icon');
	}
	if (lowerTarget === 'divider') return lowerName.includes('divider');
	if (lowerTarget === 'row') return lowerName.includes('row');
	if (lowerTarget === 'column') return lowerName.includes('column');
	if (lowerTarget === 'group') return lowerName.includes('group');
	if (lowerTarget === 'accordion') return lowerName.includes('accordion');
	if (lowerTarget === 'pane') return lowerName.includes('pane');
	if (lowerTarget === 'slide') return lowerName.includes('slide') && !lowerName.includes('slider');
	if (lowerTarget === 'slider') return lowerName.includes('slider');
	if (lowerTarget === 'video') return lowerName.includes('video');
	if (lowerTarget === 'map') return lowerName.includes('map');
	if (lowerTarget === 'search') return lowerName.includes('search');
	if (lowerTarget === 'number-counter') return lowerName.includes('number-counter');
	return true;
};

export const collectBlocks = (blocks, matcher) => {
	const result = [];
	const walk = list => {
		list.forEach(block => {
			if (matcher(block)) {
				result.push(block);
			}
			if (block.innerBlocks && block.innerBlocks.length) {
				walk(block.innerBlocks);
			}
		});
	};
	walk(blocks);
	return result;
};

export const findBlockByClientId = (blocks, id) => {
	for (const block of blocks) {
		if (block.clientId === id) return block;
		if (block.innerBlocks && block.innerBlocks.length > 0) {
			const found = findBlockByClientId(block.innerBlocks, id);
			if (found) return found;
		}
	}
	return null;
};

export const stripHtml = value =>
	String(value || '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

export const isIconBlock = block =>
	block?.name?.includes('icon-maxi') || block?.name?.includes('svg-icon');

export const isLabelBlock = blockName =>
	typeof blockName === 'string' &&
	(blockName.includes('text-maxi') ||
		blockName.includes('list-item-maxi') ||
		blockName.includes('heading') ||
		blockName.includes('paragraph'));

export const isHeadingTextBlock = block =>
	block?.name?.includes('heading') ||
	/^h[1-6]$/i.test(block?.attributes?.textLevel || '');

export const toTitleCase = value =>
	String(value || '')
		.toLowerCase()
		.split(' ')
		.filter(Boolean)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

export const getBlockLabelText = block => {
	if (!block || !block.attributes || !isLabelBlock(block.name)) {
		return '';
	}
	const raw =
		block.attributes.content ||
		block.attributes.text ||
		block.attributes.title ||
		block.attributes.label ||
		'';
	return stripHtml(raw);
};

export const findLabelInBlocks = blocks => {
	for (const block of blocks) {
		const direct = getBlockLabelText(block);
		if (direct) return direct;
		if (block.innerBlocks && block.innerBlocks.length > 0) {
			const nested = findLabelInBlocks(block.innerBlocks);
			if (nested) return nested;
		}
	}
	return '';
};

export const findLabelBlockInBlocks = blocks => {
	for (const block of blocks) {
		if (isLabelBlock(block?.name)) {
			return block;
		}
		if (block.innerBlocks && block.innerBlocks.length > 0) {
			const nested = findLabelBlockInBlocks(block.innerBlocks);
			if (nested) return nested;
		}
	}
	return null;
};

export const findLabelForIconBlock = iconBlock => {
	if (!iconBlock?.clientId) return '';
	const { getBlockParents, getBlock } = select('core/block-editor');
	const parentIds = getBlockParents(iconBlock.clientId) || [];
	for (const parentId of parentIds) {
		const parent = getBlock(parentId);
		if (!parent?.innerBlocks?.length) continue;
		const siblings = parent.innerBlocks;
		const index = siblings.findIndex(block => block.clientId === iconBlock.clientId);
		if (index === -1) continue;
		const after = siblings.slice(index + 1);
		const labelAfter = findLabelInBlocks(after);
		if (labelAfter) return labelAfter;
		const before = siblings.slice(0, index);
		const labelBefore = findLabelInBlocks(before);
		if (labelBefore) return labelBefore;
	}
	return '';
};

export const findLabelBlockForIconBlock = iconBlock => {
	if (!iconBlock?.clientId) return null;
	const { getBlockParents, getBlock } = select('core/block-editor');
	const parentIds = getBlockParents(iconBlock.clientId) || [];
	for (const parentId of parentIds) {
		const parent = getBlock(parentId);
		if (!parent?.innerBlocks?.length) continue;
		const siblings = parent.innerBlocks;
		const index = siblings.findIndex(block => block.clientId === iconBlock.clientId);
		if (index === -1) continue;
		const after = siblings.slice(index + 1);
		const labelAfter = findLabelBlockInBlocks(after);
		if (labelAfter) return labelAfter;
		const before = siblings.slice(0, index);
		const labelBefore = findLabelBlockInBlocks(before);
		if (labelBefore) return labelBefore;
	}
	return null;
};

export const findGroupRootForIconBlock = iconBlock => {
	if (!iconBlock?.clientId) return null;
	const { getBlockParents, getBlock } = select('core/block-editor');
	const parentIds = getBlockParents(iconBlock.clientId) || [];
	for (const parentId of parentIds) {
		const parent = getBlock(parentId);
		if (!parent?.innerBlocks?.length) continue;
		const hasDirectIconChild = parent.innerBlocks.some(
			block => block.clientId === iconBlock.clientId
		);
		if (!hasDirectIconChild) continue;
		const textBlocks = collectBlocks(parent.innerBlocks, block =>
			isLabelBlock(block?.name)
		);
		if (textBlocks.length > 0) return parent;
	}
	return null;
};

export const extractSvgLabel = svgCode => {
	if (!svgCode) return '';
	const titleMatch = String(svgCode).match(/<title[^>]*>([^<]+)<\/title>/i);
	if (titleMatch?.[1]) return stripHtml(titleMatch[1]);
	const descMatch = String(svgCode).match(/<desc[^>]*>([^<]+)<\/desc>/i);
	if (descMatch?.[1]) return stripHtml(descMatch[1]);
	const ariaMatch = String(svgCode).match(/aria-label=["']([^"']+)["']/i);
	if (ariaMatch?.[1]) return stripHtml(ariaMatch[1]);
	return '';
};

export const getIconLabelFromBlock = iconBlock => {
	if (!iconBlock?.attributes) return '';
	const altTitle = stripHtml(iconBlock.attributes.altTitle || '');
	if (altTitle) return altTitle;
	const altDescription = stripHtml(iconBlock.attributes.altDescription || '');
	if (altDescription) return altDescription;
	const ariaLabel = stripHtml(
		iconBlock.attributes.ariaLabels?.icon ||
			iconBlock.attributes.ariaLabels?.canvas ||
			''
	);
	if (ariaLabel) return ariaLabel;
	const svgContent =
		iconBlock.attributes.content ||
		iconBlock.attributes['icon-content'] ||
		'';
	return extractSvgLabel(svgContent);
};

export const buildTextContentChange = (block, value) => {
	if (!block?.attributes) return null;
	const nextValue = stripHtml(value || '');
	if (!nextValue) return null;
	if (Object.prototype.hasOwnProperty.call(block.attributes, 'content')) {
		return { content: nextValue };
	}
	if (Object.prototype.hasOwnProperty.call(block.attributes, 'text')) {
		return { text: nextValue };
	}
	if (Object.prototype.hasOwnProperty.call(block.attributes, 'title')) {
		return { title: nextValue };
	}
	if (Object.prototype.hasOwnProperty.call(block.attributes, 'label')) {
		return { label: nextValue };
	}
	return { content: nextValue };
};

export const buildIconRelatedText = (iconLabel, block, index) => {
	const rawLabel = stripHtml(iconLabel);
	if (!rawLabel) return '';
	const label = /^[A-Z0-9\s&+.-]+$/.test(rawLabel)
		? rawLabel
		: toTitleCase(rawLabel);

	if (isHeadingTextBlock(block)) {
		return label;
	}

	const currentText = getBlockLabelText(block);
	const lowerCurrent = currentText.toLowerCase();
	if (currentText && lowerCurrent.includes(label.toLowerCase())) {
		return currentText;
	}

	const hasNumber = /\d/.test(currentText);
	const statWordMatch = lowerCurrent.match(
		/\b(courses?|classes?|lessons?|events?|sessions?|programs?)\b/
	);
	if (hasNumber && statWordMatch) {
		const numberMatch = currentText.match(/\d+\+?|\d+%/);
		const numberPart = numberMatch ? numberMatch[0] : currentText;
		return `${numberPart} ${label} ${statWordMatch[1]}`;
	}
	if (hasNumber) {
		return `${label} ${currentText}`;
	}

	const templates = [
		`Explore ${label}.`,
		`Learn about ${label}.`,
		`Discover ${label}.`,
		`Find out more about ${label}.`,
	];
	return templates[index % templates.length];
};
