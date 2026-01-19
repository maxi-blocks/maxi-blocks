/**
 * MaxiBlocks Block Skills Context
 * 
 * This module provides condensed skill knowledge about MaxiBlocks blocks
 * for injection into the AI system prompt. Each block type has key controls,
 * common patterns, and accessibility notes that help the AI provide
 * better assistance.
 */

/**
 * Block skill summaries - condensed from the full skill documentation
 * in the ./skills/ folder for runtime injection into AI context.
 */
export const BLOCK_SKILLS = {
	'container-maxi': {
		name: 'Container Maxi',
		purpose: 'Core layout wrapper for sections, rows, and groups. Foundation for spacing, sizing, and responsive layouts.',
		keyControls: [
			'Background, border, box shadow, size, margin/padding',
			'Shape dividers (top/bottom) with style, color, height, opacity',
			'Callout arrows per breakpoint',
		],
		patterns: [
			'Section wrapper with background and spacing',
			'Divided sections with top/bottom dividers',
		],
		accessibility: 'Maintain logical heading order (H1→H2→H3). Ensure background overlays preserve text contrast.',
	},
	'text-maxi': {
		name: 'Text Maxi',
		purpose: 'Core text block for headings, paragraphs, labels, and helper text.',
		keyControls: [
			'Text splitting for editor effects',
			'Style card color hooks',
			'Typography settings',
		],
		patterns: [
			'Headings and body copy',
			'Stacked text groups (title + subtitle)',
		],
		accessibility: 'Maintain logical heading hierarchy. Ensure sufficient color contrast.',
	},
	'button-maxi': {
		name: 'Button Maxi',
		purpose: 'Inserts and styles buttons for calls to action.',
		keyControls: [
			'Button hover color/background/border settings',
			'Style card hooks for theming',
		],
		patterns: [
			'Primary CTA in hero sections',
			'Button rows with consistent spacing',
		],
		accessibility: 'Use clear, actionable labels. Ensure visible focus states.',
	},
	'image-maxi': {
		name: 'Image Maxi',
		purpose: 'Inserts and styles images in layouts.',
		keyControls: [
			'Image sizing and styling controls',
			'Alt text support',
		],
		patterns: [
			'Hero imagery (full-width)',
			'Card media (thumbnails)',
		],
		accessibility: 'Provide meaningful alt text for informative images. Use empty alt for decorative.',
	},
	'svg-icon-maxi': {
		name: 'Icon Maxi',
		purpose: 'Adds and styles icons or shapes.',
		keyControls: [
			'SVG fill color (palette 1-8)',
			'SVG line/stroke color',
			'Stroke width',
		],
		patterns: [
			'Feature list (icon + heading + description)',
			'Accent icons next to headings or buttons',
		],
		accessibility: 'Provide accessible labels for meaningful icons. Mark decorative icons as aria-hidden.',
	},
	'divider-maxi': {
		name: 'Divider Maxi',
		purpose: 'Creates visual dividers between elements.',
		keyControls: ['Divider style and spacing'],
		patterns: [
			'Section separation',
			'Content grouping',
		],
		accessibility: "Don't rely on dividers as the only indicator of hierarchy.",
	},
	'group-maxi': {
		name: 'Group Maxi',
		purpose: 'Combines blocks into a single grouped unit for layout consistency.',
		keyControls: ['Group styling and spacing'],
		patterns: [
			'Card content (heading + text + button)',
			'Feature stacks (icon + heading + text)',
		],
		accessibility: 'Keep grouped content in logical reading order.',
	},
	'slider-maxi': {
		name: 'Slider Maxi',
		purpose: 'Creates sliders with blocks, controls, and animations.',
		keyControls: [
			'Slide blocks and navigation controls',
			'Animation settings',
		],
		patterns: [
			'Testimonial carousel',
			'Hero slider',
		],
		accessibility: 'Ensure controls are keyboard accessible. Avoid auto-advancing without pause.',
	},
	'number-counter-maxi': {
		name: 'Number Counter Maxi',
		purpose: 'Creates animated number counters for metrics.',
		keyControls: ['Counter value and animation'],
		patterns: [
			'Stats row (multiple counters)',
			'Icon + counter combinations',
		],
		accessibility: 'Provide text labels alongside numbers to clarify meaning.',
	},
	'search-maxi': {
		name: 'Search Maxi',
		purpose: 'Adds a search bar with icon.',
		keyControls: ['Search input styling'],
		patterns: [
			'Header search',
			'Standalone search section',
		],
		accessibility: 'Ensure input has descriptive label or accessible name.',
	},
	'map-maxi': {
		name: 'Map Maxi',
		purpose: 'Creates maps with marker and description.',
		keyControls: ['Map location and marker settings'],
		patterns: [
			'Contact section with address',
			'Location highlight in cards',
		],
		accessibility: 'Provide text alternative (address) near the map.',
	},
	'video-maxi': {
		name: 'Video Maxi',
		purpose: 'Inserts videos with controls or lightbox.',
		keyControls: ['Video source and playback controls'],
		patterns: [
			'Demo section with CTA',
			'Hero media',
		],
		accessibility: 'Provide captions or transcripts. Ensure controls are keyboard accessible.',
	},
};

/**
 * Layout and responsive skills summary
 */
export const LAYOUT_SKILLS = {
	responsive: {
		name: 'Responsive Design',
		summary: 'Six responsive breakpoints for phones, tablets, laptops, and large screens. Flexbox grid control per breakpoint.',
	},
	patterns: {
		name: 'Patterns',
		summary: 'Reusable block compositions accessible via Cloud library Maxi block. Hero, feature grid, testimonial patterns.',
	},
	templates: {
		name: 'Templates',
		summary: 'Full-page compositions. Hero + Features + CTA + Footer structures.',
	},
	styleCards: {
		name: 'Style Cards',
		summary: 'Re-style entire templates quickly. Light/dark variants. Apply to update typography, colors, spacing globally.',
	},
	layeredBackgrounds: {
		name: 'Layered Backgrounds',
		summary: 'Combine images, colors, overlays. Shape masks for visual interest.',
	},
};

/**
 * Dynamic content skills summary
 */
export const DYNAMIC_SKILLS = {
	contextLoop: {
		name: 'Context Loop',
		summary: 'Query loop equivalent for blogs, products, archives. Works with container, row, column, group blocks.',
	},
	dynamicContent: {
		name: 'Dynamic Content',
		summary: 'ACF integration for data-driven layouts. Bind fields to blocks dynamically.',
	},
};

/**
 * Get relevant skill context for a given block name.
 * Returns a condensed string suitable for AI context injection.
 * 
 * @param {string} blockName - The full block name (e.g., 'maxi-blocks/container-maxi')
 * @returns {string} Skill context string or empty string if not found
 */
export const getSkillContextForBlock = (blockName) => {
	if (!blockName) return '';
	
	// Extract the block type from the full name
	const blockType = blockName.replace('maxi-blocks/', '');
	const skill = BLOCK_SKILLS[blockType];
	
	if (!skill) return '';
	
	return `
[${skill.name}]
Purpose: ${skill.purpose}
Key Controls: ${skill.keyControls.join('; ')}
Common Patterns: ${skill.patterns.join('; ')}
Accessibility: ${skill.accessibility}
`.trim();
};

/**
 * Get all skills as a condensed context string.
 * Use sparingly - this adds significant token count.
 * 
 * @returns {string} All skills formatted for AI context
 */
export const getAllSkillsContext = () => {
	const blockSummaries = Object.values(BLOCK_SKILLS)
		.map(skill => `- ${skill.name}: ${skill.purpose}`)
		.join('\n');
	
	const layoutSummaries = Object.values(LAYOUT_SKILLS)
		.map(skill => `- ${skill.name}: ${skill.summary}`)
		.join('\n');
	
	return `
MaxiBlocks Knowledge:

BLOCKS:
${blockSummaries}

LAYOUT FEATURES:
${layoutSummaries}
`.trim();
};
