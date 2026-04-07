/**
 * WordPress dependencies
 */
import { handleSetAttributes } from '@extensions/maxi-block';
import getCustomFormatValue from '@extensions/text/formats/getCustomFormatValue';
import { getLastBreakpointAttribute } from '@extensions/styles';
import {
	loadColumnsTemplate,
	getNumCol,
	getTemplates,
} from '@extensions/column-templates';

/**
 * Internal dependencies
 */
import { getAiHandlerForBlock } from '../registry';
import updateBackgroundColor from '../color/backgroundUpdate';
import {
	isBackgroundLayerCommand,
	applyBackgroundLayerCommand,
} from './shared/backgroundLayers';
import {
	buildButtonAGroupAttributeChanges,
	buildButtonBGroupAttributeChanges,
	buildButtonCGroupAttributeChanges,
	buildButtonIGroupAttributeChanges,
} from './buttonGroups';
import {
	buildContainerAGroupAttributeChanges,
	buildContainerBGroupAttributeChanges,
	buildContainerCGroupAttributeChanges,
	buildContainerDGroupAttributeChanges,
	buildContainerEGroupAttributeChanges,
	buildContainerFGroupAttributeChanges,
	buildContainerHGroupAttributeChanges,
	buildContainerLGroupAttributeChanges,
	buildContainerMGroupAttributeChanges,
	buildContainerOGroupAttributeChanges,
	buildContainerPGroupAttributeChanges,
	buildContainerRGroupAttributeChanges,
	buildContainerSGroupAttributeChanges,
	buildContainerTGroupAttributeChanges,
	buildContainerWGroupAttributeChanges,
	buildContainerZGroupAttributeChanges,
} from './containerGroups';
import {
	buildTextCGroupAttributeChanges,
	buildTextLGroupAttributeChanges,
	buildTextPGroupAttributeChanges,
	buildTextListGroupAttributeChanges,
} from './textGroup';
import { buildDcGroupAttributeChanges } from './dcGroup';
import { buildAdvancedCssAGroupAttributeChanges } from './advancedCssAGroup';
import { buildMetaAGroupAttributeChanges, resolveMetaTargetKey } from './metaAGroup';
import { getBlockPrefix, matchesTargetBlockName } from './blockHelpers';
import {
	parseUnitValue,
	buildResponsiveSizeChanges,
	buildBreakpointChanges,
	buildWidthChanges,
	buildHeightChanges,
	buildContextLoopChanges,
} from './responsiveHelpers';
import {
	updateTextColor,
	updateMargin,
	updateFontSize,
	updateLineHeight,
	updateLetterSpacing,
	updateBorderRadius,
	updateBoxShadow,
	removeBoxShadow,
	createResponsiveSpacing,
	updateBorder,
	updateGap,
	updateFlexDirection,
	updateJustifyContent,
	updateFlexGrow,
	updateFlexShrink,
	updateDeadCenter,
	updateStacking,
	updateDisplay,
	updateSvgFillColor,
	updateSvgLineColor,
	updateSvgStrokeWidth,
	updateImageFit,
	buildShapeDividerChanges,
	buildShapeDividerColorChanges,
} from './cssBuilders';

/*
 * ============================================================================
 * UNIVERSAL BLOCK UPDATER
 * ============================================================================
 * Applies updates to a list of blocks recursively.
 * Used by both Page changes (allBlocks) and Selection changes ([selectedBlock]).
 */
export const applyUpdatesToBlocks = (blocksToUpdate, property, value, targetBlock = null, specificClientId = null, updateBlockAttributes, scope = 'page') => {
	let count = 0;

	const recursiveUpdate = (blocks) => {
		if (!Array.isArray(blocks)) {
			return;
		}
		
		blocks.forEach(block => {
			let changes = null;
			const isMaxi = block.name.startsWith('maxi-blocks/');
			
			const prefix = getBlockPrefix(block.name);
			let handledBySetAttributes = false;
			
			// MATCHING LOGIC
			const isMatch = specificClientId ? block.clientId === specificClientId : matchesTargetBlockName(block.name, targetBlock);

			// console.log(`[Maxi AI Debug] Checking block: ${block.name} (${block.clientId}). isMaxi: ${isMaxi}, isMatch: ${isMatch}, Target: ${targetBlock}`);

			if (isMaxi && isMatch) {
				// console.log(`[Maxi AI Debug] MATCH: ${block.name} (${block.clientId}). Updating ${property}...`);
				
				switch (property) {

				case 'background_color': {
					// Every Maxi block supports background-layers — allow any matched block.
					// Number Counter backgrounds live on the Canvas (un-prefixed) group.
					const backgroundPrefix = block.name.includes('number-counter') ? '' : prefix;
					changes = updateBackgroundColor(block.clientId, value, block.attributes, backgroundPrefix);
					break;
				}
					case 'background_layers': {
						if (
							specificClientId ||
							(block.attributes && 'background-layers' in block.attributes)
						) {
							if (isBackgroundLayerCommand(value)) {
								const currentLayers =
									block.attributes?.['background-layers'] || [];
								const updatedLayers = applyBackgroundLayerCommand(
									currentLayers,
									value
								);
								if (updatedLayers) {
									changes = { 'background-layers': updatedLayers };
									if (value.enableHover === true) {
										changes['block-background-status-hover'] = true;
									}
									if (value.disableHover === true) {
										changes['block-background-status-hover'] = false;
									}
								}
								break;
							}
							const layers = Array.isArray(value)
								? value
								: value && Array.isArray(value.layers)
									? value.layers
									: null;
							if (layers) {
								changes = { 'background-layers': layers };
							}
						}
						break;
					}
					case 'background_layers_hover': {
						if (
							specificClientId ||
							(block.attributes &&
								'background-layers-hover' in block.attributes)
						) {
							if (isBackgroundLayerCommand(value)) {
								const currentLayers =
									block.attributes?.['background-layers-hover'] || [];
								const updatedLayers = applyBackgroundLayerCommand(
									currentLayers,
									value
								);
								if (updatedLayers) {
									changes = {
										'background-layers-hover': updatedLayers,
									};
									if (value.enableHover === true) {
										changes['block-background-status-hover'] = true;
									}
									if (value.disableHover === true) {
										changes['block-background-status-hover'] = false;
									}
								}
								break;
							}
							const layers = Array.isArray(value)
								? value
								: value && Array.isArray(value.layers)
									? value.layers
									: null;
							if (layers) {
								changes = { 'background-layers-hover': layers };
							}
						}
						break;
					}
					case 'button_background':
					case 'button_background_hover':
					case 'button_background_opacity':
					case 'button_background_opacity_hover':
					case 'button_background_gradient_opacity':
					case 'button_background_gradient_opacity_hover':
					case 'button_background_status_hover':
					case 'button_border':
					case 'button_border_hover':
					case 'button_border_radius':
					case 'button_border_radius_hover':
					case 'button_box_shadow':
					case 'button_box_shadow_hover':
					case 'button_margin':
					case 'button_padding':
					case 'button_width':
					case 'button_height':
					case 'button_min_height':
					case 'button_max_height':
					case 'button_min_width':
					case 'button_max_width':
					case 'button_full_width':
					case 'button_force_aspect_ratio':
					case 'button_size_advanced_options':
					case 'bottom_gap':
					case 'bottom_gap_hover':
						if (specificClientId || block.name.includes('button')) {
							changes = buildButtonBGroupAttributeChanges(property, value);
						}
						break;
					case 'icon_background':
					case 'icon_background_hover':
					case 'icon_border':
					case 'icon_border_hover':
					case 'icon_border_radius':
					case 'icon_border_radius_hover':
					case 'icon_padding':
					case 'icon_spacing':
					case 'icon_spacing_hover':
					case 'icon_width':
					case 'icon_width_hover':
					case 'icon_height':
					case 'icon_height_hover':
					case 'icon_size':
					case 'icon_size_hover':
					case 'icon_force_aspect_ratio':
					case 'icon_force_aspect_ratio_hover':
					case 'icon_fill_color':
					case 'icon_fill_color_hover':
					case 'icon_stroke_color':
					case 'icon_stroke_color_hover':
					case 'icon_stroke_width':
					case 'icon_stroke_width_hover':
					case 'icon_svg_type':
					case 'icon_svg_type_hover':
					case 'icon_content':
					case 'icon_content_hover':
					case 'icon_position':
					case 'icon_position_hover':
					case 'icon_only':
					case 'icon_only_hover':
					case 'icon_inherit':
					case 'icon_inherit_hover':
					case 'icon_status_hover':
					case 'icon_status_hover_target':
						if (specificClientId || block.name.includes('button')) {
							changes = buildButtonIGroupAttributeChanges(property, value);
						}
						break;
					case 'block_background_status_hover': {
						if (specificClientId || (block.attributes && 'block-background-status-hover' in block.attributes)) {
							changes = buildContainerBGroupAttributeChanges(property, value);
						}
						break;
					}
					case 'divider_color': {
						if (specificClientId || block.name.includes('divider')) {
							const isPalette = typeof value === 'number';
							changes = {
								'divider-border-palette-status-general': isPalette,
								'divider-border-palette-color-general': isPalette ? value : '',
								'divider-border-color-general': isPalette ? '' : value,
							};
						}
						break;
					}
					case 'text_color':
					case 'text_color_hover':
					case 'button_hover_text':
					case 'text_decoration':
					case 'text_decoration_hover':
					case 'text_direction':
					case 'text_direction_hover':
					case 'text_indent':
					case 'text_indent_hover':
					case 'text_orientation':
					case 'text_orientation_hover':
					case 'text_shadow':
					case 'text_shadow_hover':
					case 'text_wrap':
					case 'text_wrap_hover': {
						const isTextColorProperty = [
							'text_color',
							'text_color_hover',
							'button_hover_text',
						].includes(property);
						if (block.name.includes('button-maxi')) {
							changes = buildButtonCGroupAttributeChanges(property, value, {
								attributes: block.attributes,
							});
							break;
						}
						if (
							block.name.includes('text-maxi') ||
							block.name.includes('list-item-maxi')
						) {
							changes = buildTextCGroupAttributeChanges(property, value);
							break;
						}
						if (
							isTextColorProperty &&
							(specificClientId ||
								block.name.includes('button-maxi') ||
								block.name.includes('text-maxi'))
						) {
							changes = updateTextColor(value, prefix);
						}
						break;
					}
					case 'link_color':
					case 'link_color_hover':
					case 'link_color_active':
					case 'link_color_visited':
					case 'link_color_reset':
					case 'link_color_reset_hover':
					case 'link_color_reset_active':
					case 'link_color_reset_visited':
					case 'link_palette_color':
					case 'link_palette_color_hover':
					case 'link_palette_color_active':
					case 'link_palette_color_visited':
					case 'link_palette_opacity':
					case 'link_palette_opacity_hover':
					case 'link_palette_opacity_active':
					case 'link_palette_opacity_visited':
					case 'link_palette_status':
					case 'link_palette_status_hover':
					case 'link_palette_status_active':
					case 'link_palette_status_visited':
					case 'link_palette_sc_status':
					case 'link_palette_sc_status_hover':
					case 'link_palette_sc_status_active':
					case 'link_palette_sc_status_visited':
						if (
							block.name.includes('text-maxi') ||
							block.name.includes('list-item-maxi')
						) {
							const linkChanges = buildTextLGroupAttributeChanges(
								property,
								value
							);
							if (linkChanges) {
								handleSetAttributes({
									obj: linkChanges,
									attributes: block.attributes,
									clientId: block.clientId,
									onChange: newAttributes =>
										updateBlockAttributes(
											block.clientId,
											newAttributes
										),
								});
								handledBySetAttributes = true;
								count++;
							}
						}
						break;
					case 'heading_color':
						// Apply only to headings (h1-h6)
						if (block.name.includes('text-maxi') && ['h1','h2','h3','h4','h5','h6'].includes(block.attributes.textLevel)) {
							changes = updateTextColor(value, prefix);
						}
						break;
					case 'palette_color':
					case 'palette_color_hover':
					case 'palette_status':
					case 'palette_status_hover':
					case 'palette_opacity':
					case 'palette_opacity_hover':
					case 'palette_sc_status':
					case 'palette_sc_status_hover':
					case 'preview':
						if (
							specificClientId ||
							block.name.includes('text-maxi') ||
							block.name.includes('list-item-maxi')
						) {
							changes = buildTextPGroupAttributeChanges(property, value);
						}
						break;
					case 'list_color':
					case 'list_palette_color':
					case 'list_palette_opacity':
					case 'list_palette_status':
					case 'list_palette_sc_status':
					case 'list_gap':
					case 'list_indent':
					case 'list_marker_indent':
					case 'list_marker_size':
					case 'list_marker_height':
					case 'list_marker_line_height':
					case 'list_marker_vertical_offset':
					case 'list_paragraph_spacing':
					case 'list_style_position':
					case 'list_text_position':
					case 'is_list':
					case 'list_type':
					case 'list_style':
					case 'list_style_custom':
					case 'list_start':
					case 'list_reversed':
						if (
							specificClientId ||
							block.name.includes('text-maxi') ||
							block.name.includes('list-item-maxi')
						) {
							changes = buildTextListGroupAttributeChanges(property, value);
						}
						break;
					case 'padding':
						changes = buildContainerPGroupAttributeChanges(property, value);
						break;
					case 'responsive_padding':
						if (typeof value === 'object') {
							const { desktop, tablet, mobile } = value;
							// Helper to parse '100px' -> 100
							const parseVal = (v) => parseInt(v) || 0;
							
							const dVal = parseVal(desktop);
							const tVal = parseVal(tablet);
							const mVal = parseVal(mobile);
							
							changes = {
								// Desktop (XL, L)
								[`${prefix}padding-top-xl`]: dVal, [`${prefix}padding-bottom-xl`]: dVal,
								[`${prefix}padding-left-xl`]: 0, [`${prefix}padding-right-xl`]: 0, // Force side padding to 0
								
								[`${prefix}padding-top-lg`]: dVal, [`${prefix}padding-bottom-lg`]: dVal,
								[`${prefix}padding-left-lg`]: 0, [`${prefix}padding-right-lg`]: 0,

								// Tablet (M, S)
								[`${prefix}padding-top-md`]: tVal, [`${prefix}padding-bottom-md`]: tVal,
								[`${prefix}padding-left-md`]: 0, [`${prefix}padding-right-md`]: 0,
								
								[`${prefix}padding-top-sm`]: tVal, [`${prefix}padding-bottom-sm`]: tVal,
								[`${prefix}padding-left-sm`]: 0, [`${prefix}padding-right-sm`]: 0,
								
								// Mobile (XS, XXS)
								[`${prefix}padding-top-xs`]: mVal, [`${prefix}padding-bottom-xs`]: mVal,
								[`${prefix}padding-left-xs`]: 0, [`${prefix}padding-right-xs`]: 0,
								
								[`${prefix}padding-top-xxs`]: mVal, [`${prefix}padding-bottom-xxs`]: mVal,
								[`${prefix}padding-left-xxs`]: 0, [`${prefix}padding-right-xxs`]: 0,
								
								// Units
								[`${prefix}padding-unit-xl`]: 'px', [`${prefix}padding-unit-lg`]: 'px',
								[`${prefix}padding-unit-md`]: 'px', [`${prefix}padding-unit-sm`]: 'px',
								[`${prefix}padding-unit-xs`]: 'px', [`${prefix}padding-unit-xxs`]: 'px',
								
								// Sync - we sync top/bottom but not sides, so set to 'none' (unlinked)
								[`${prefix}padding-sync-xl`]: 'none', 
								[`${prefix}padding-sync-lg`]: 'none', 
								[`${prefix}padding-sync-md`]: 'none',
								[`${prefix}padding-sync-sm`]: 'none',
								[`${prefix}padding-sync-xs`]: 'none',
								[`${prefix}padding-sync-xxs`]: 'none',
							};
						}
						break;
					case 'margin':
						changes = updateMargin(value, null, prefix);
						break;
					case 'font_size':
						changes = updateFontSize(value);
						break;
					case 'border_radius':
						changes = updateBorderRadius(value, null, prefix);
						break;
					case 'border_radius_hover':
						changes = buildContainerBGroupAttributeChanges(property, value);
						break;
					case 'border':
						// value can be string "1px solid red" or object {width, style, color}
						if (value === 'none') {
							changes = updateBorder(0, 'none', null, prefix);
						} else if (typeof value === 'object') {
							changes = updateBorder(value.width, value.style, value.color, prefix);
						} else if (typeof value === 'string') {
							// Simple parse for "1px solid color"
							const parts = value.split(' ');
							if (parts.length >= 3) {
								// Assume format: width style color
								changes = updateBorder(parseInt(parts[0]), parts[1], parts.slice(2).join(' '), prefix);
							} else {
								// FALLBACK: Single value = color only, use defaults
								changes = updateBorder(1, 'solid', value, prefix);
							}
						}
						break;
					case 'border_hover':
						changes = buildContainerBGroupAttributeChanges(property, value);
						break;
					case 'box_shadow':
						// value is expected to be object {x, y, blur, spread, color}
						if (value === 'none') {
							changes = removeBoxShadow(prefix);
						} else if (typeof value === 'object') {
							changes = updateBoxShadow(value.x, value.y, value.blur, value.spread, value.color, prefix, value.opacity);
						}
						break;
					case 'box_shadow_hover':
						changes = buildContainerBGroupAttributeChanges(property, value);
						break;
					case 'apply_responsive_spacing':
						// value is the preset name: 'compact' | 'comfortable' | 'spacious'
						changes = createResponsiveSpacing(value, prefix);
						break;
					case 'width':
						if (block.attributes && Object.prototype.hasOwnProperty.call(block.attributes, 'width-general')) {
							changes =
								buildContainerWGroupAttributeChanges(property, value, { prefix }) ||
								buildWidthChanges(value, prefix);
						} else {
							changes = buildWidthChanges(value, prefix);
						}
						if (
							changes &&
							block?.name?.includes('number-counter') &&
							prefix === 'number-counter-'
						) {
							Object.keys(changes).forEach(key => {
								const match = key.match(/^number-counter-width-(general|xxl|xl|l|m|s|xs)$/);
								if (!match) return;
								changes[`number-counter-width-auto-${match[1]}`] = false;
							});
						}
						break;
					case 'height':
						changes =
							buildContainerHGroupAttributeChanges(property, value) ||
							buildHeightChanges(value, prefix);
						break;
					case 'block_style':
						changes = buildContainerBGroupAttributeChanges(property, value);
						break;
					case 'breakpoints':
						changes = buildContainerBGroupAttributeChanges(property, value);
						break;
					case 'object_fit':
					case 'objectFit':
						// Only apply to images or direct selection
						if (specificClientId || block.name.includes('image')) {
							changes = updateImageFit(value);
						}
						break;
					case 'opacity':
					case 'opacity_hover':
					case 'opacity_status_hover':
					case 'order':
					case 'overflow':
					case 'overflow_x':
					case 'overflow_y':
						changes = buildContainerOGroupAttributeChanges(property, value);
						break;
					case 'svg_icon_color':
						// Update both fill and line (user already confirmed "Both" upstream,
						// or the icon only has one colour type — queueDirectAction handles detection).
						if (specificClientId || block.name.includes('svg-icon')) {
							changes = { ...updateSvgFillColor(value), ...updateSvgLineColor(value) };
						}
						break;
					case 'svg_fill_color':
						// Only apply to SVG icon blocks
						if (specificClientId || block.name.includes('svg-icon')) {
							changes = updateSvgFillColor(value);
						}
						break;
					case 'svg_line_color':
						// Only apply to SVG icon blocks
						if (specificClientId || block.name.includes('svg-icon')) {
							changes = updateSvgLineColor(value);
						}
						break;
					case 'svg_stroke_width':
						// Only apply to SVG icon blocks
						if (specificClientId || block.name.includes('svg-icon')) {
							const width = typeof value === 'number' ? value : parseInt(value) || 2;
							changes = updateSvgStrokeWidth(width);
						}
						break;
					case 'svg_fill_color_hover':
						// Only apply to SVG icon blocks - hover state
						if (specificClientId || block.name.includes('svg-icon')) {
							changes = updateSvgFillColor(value, true); // true = isHover
						}
						break;
					case 'svg_line_color_hover':
						// Only apply to SVG icon blocks - line/stroke hover state
						if (specificClientId || block.name.includes('svg-icon')) {
							changes = updateSvgLineColor(value, true); // true = isHover
						}
						break;
					case 'text_align':
						// Text alignment for text/heading blocks
						changes = { 'text-alignment-general': value };
						break;
					case 'align_items':
						if (block.name.includes('button')) {
							changes = buildButtonAGroupAttributeChanges(property, value, {
								attributes: block.attributes,
							});
						} else {
							// Item alignment for container blocks
							changes = { 
								'justify-content-general': value === 'left' ? 'flex-start' : value === 'right' ? 'flex-end' : 'center',
								'align-items-general': value === 'left' ? 'flex-start' : value === 'right' ? 'flex-end' : 'center',
							};
						}
						break;
					case 'align_everything':
						// Universal alignment: text + flex items together
						const flexValue = value === 'left' ? 'flex-start' : value === 'right' ? 'flex-end' : 'center';
						changes = { 
							'text-alignment-general': value,
							'justify-content-general': flexValue,
							'align-items-general': flexValue,
						};
						break;
					// ======= LAYOUT INTENT PROPERTIES =======
					case 'flex_direction':
						// Apply to layout containers
						if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
							changes = updateFlexDirection(value);
						}
						break;
					case 'justify_content':
						// Apply to layout containers
						if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
							changes = updateJustifyContent(value);
						}
						break;
					case 'align_items_flex':
						// Apply to layout containers (different from text align_items)
						if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
							changes = buildContainerAGroupAttributeChanges(property, value, {
								block,
								attributes: block.attributes,
							});
						}
						break;
					case 'align_content':
						if (block.name.includes('button')) {
							changes = buildButtonAGroupAttributeChanges(property, value, {
								attributes: block.attributes,
							});
						} else if (
							specificClientId ||
							block.name.includes('container') ||
							block.name.includes('row') ||
							block.name.includes('column') ||
							block.name.includes('group')
						) {
							changes = buildContainerAGroupAttributeChanges(property, value, {
								block,
								attributes: block.attributes,
							});
						}
						break;
					case 'flex_wrap':
						// Apply to layout containers
						if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
							changes = {
								'flex-wrap-general': value,
							};
						}
						break;
					case 'gap':
						// Apply to layout containers
						if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
							changes = updateGap(value);
						}
						break;
					case 'row_gap':
						// Apply to layout containers
						if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
							changes = buildContainerRGroupAttributeChanges(property, value);
						}
						break;
					// ======= EXTENDED LAYOUT PROPERTIES =======
					case 'dead_center':
						// Combo: center both axes
						if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
							changes = updateDeadCenter();
						}
						break;
					case 'flex_grow':
						if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
							changes = updateFlexGrow(value);
						}
						break;
					case 'flex_shrink':
						if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
							changes = updateFlexShrink(value);
						}
						break;
					case 'stacking':
						// Combo: z-index + position
						if (typeof value === 'object' && value.zIndex !== undefined) {
							changes = updateStacking(value.zIndex, value.position || 'relative');
						}
						break;
					case 'z_index':
						changes = buildContainerZGroupAttributeChanges(property, value);
						break;
					case 'position':
						changes = buildContainerPGroupAttributeChanges(property, value);
						break;
					case 'position_top':
						changes = buildContainerPGroupAttributeChanges(property, value);
						break;
					case 'position_right':
						changes = buildContainerPGroupAttributeChanges(property, value);
						break;
					case 'position_bottom':
						changes = buildContainerPGroupAttributeChanges(property, value);
						break;
					case 'position_left':
						changes = buildContainerPGroupAttributeChanges(property, value);
						break;
					case 'display':
						changes =
							buildContainerDGroupAttributeChanges(property, value) ||
							updateDisplay(value);
						break;
					case 'extra_class_name':
					case 'extra_class':
						changes = buildContainerEGroupAttributeChanges(property, value);
						break;
					case 'flex_basis':
					case 'flex_grow':
					case 'flex_shrink':
					case 'flex_direction':
					case 'flex_wrap':
					case 'force_aspect_ratio':
					case 'full_width':
						changes = buildContainerFGroupAttributeChanges(property, value);
						break;
					case 'link_settings':
					case 'dc_link':
					case 'dc_link_status':
					case 'dc_link_target':
					case 'dc_link_url':
						changes = buildContainerLGroupAttributeChanges(property, value, {
							attributes: block.attributes,
						});
						break;
					// ======= CALLOUT ARROW =======
					case 'arrow_status':
					case 'arrow_side':
					case 'arrow_position':
					case 'arrow_width': {
						changes = buildContainerAGroupAttributeChanges(property, value, {
							block,
							attributes: block.attributes,
						});
						break;
					}
					// ======= META / ACCESSIBILITY =======
					case 'anchor_link':
					case 'unique_id':
					case 'aria_label':
					case 'relations':
					case 'is_first_on_hierarchy': {
						const targetKey = resolveMetaTargetKey(block?.name);
						const metaChanges = buildMetaAGroupAttributeChanges(property, value, {
							attributes: block?.attributes,
							targetKey,
						});
						if (metaChanges) {
							changes = metaChanges;
						}
						break;
					}
					case 'advanced_css': {
						changes = buildAdvancedCssAGroupAttributeChanges(property, value);
						break;
					}
					// ======= TRANSFORM EFFECTS =======
					case 'transform_rotate':
					case 'transform_scale':
					case 'transform_scale_hover':
					case 'transform_translate':
					case 'transform_origin':
					case 'transform_target':
					case 'transition':
					case 'transition_change_all':
					case 'transition_canvas_selected':
					case 'transition_transform_selected': {
						// svg-icon-maxi uses 'canvas' as its primary transform target,
						// not 'container' (which is the default for layout blocks).
						const isIconBlock =
							block.name.includes('svg-icon') || block.name.includes('icon-maxi');
						const transformAttrs =
							isIconBlock && !block.attributes['transform-target']
								? { ...block.attributes, 'transform-target': 'canvas' }
								: block.attributes;
						changes = buildContainerTGroupAttributeChanges(property, value, {
							attributes: transformAttrs,
							blockName: block.name,
						});
						break;
					}

					// ======= BLOCK ACTIONS (Delegated) =======
					default:
						if (
							property &&
							(String(property).startsWith('scroll_') ||
								String(property).startsWith('shape_divider_') ||
								[
									'shortcut_effect',
									'shortcut_effect_type',
									'show_warning_box',
									'size_advanced_options',
								].includes(property))
						) {
							const sChanges = buildContainerSGroupAttributeChanges(
								property,
								value
							);
							if (sChanges) {
								changes = sChanges;
								break;
							}
						}
						if (property && String(property).startsWith('cl_')) {
							changes = buildContainerCGroupAttributeChanges(property, value, {
								attributes: block.attributes,
							});
							if (changes) break;
						}
						if (property && /^dc[-_]/.test(String(property))) {
							const dcChanges = buildDcGroupAttributeChanges(
								property,
								value
							);
							if (dcChanges) {
								changes = dcChanges;
								break;
							}
						}
						// Try delegating to block-specific handlers
						const blockHandler = getAiHandlerForBlock(block);
						if (blockHandler) {
							const handlerChanges = blockHandler(block, property, value, prefix);
							if (handlerChanges) {
								changes = handlerChanges;
							}
						}
						break;

					case 'scroll_fade':
						changes = { 'scroll-fade-status-general': true };
						break;
					case 'parallax':
						changes = { 
							'background-image-attachment-general': 'fixed',
							'background-image-parallax-general': true,
						};
						break;
					// ======= AESTHETIC (special - triggers apply_theme) =======
					case 'aesthetic':
						// This is handled specially - force to global scope
						// The aesthetic patterns will use apply_theme instead
						changes = null; // Handled in the loop with special logic
						break;
					// ======= TYPOGRAPHY =======
				case 'line_height':
					changes = updateLineHeight( value );
					break;
				case 'letter_spacing':
					changes = updateLetterSpacing( value );
					break;
					case 'font_weight':
						changes = { 'font-weight-general': Number(value) };
						break;
					// ======= BACKGROUNDS & MEDIA =======
					case 'background_media':
						changes = { 'background-active-media-general': value };
						break;
					case 'background_overlay':
						changes = {
							'overlay-background-color-general': 'rgba(0,0,0,' + Number(value) + ')',
							'overlay-status-general': true,
						};
						break;
					case 'object_fit':
						if (block.name.includes('image')) {
							changes = { 'object-fit-general': value };
						}
						break;
					case 'background_tile':
						changes = { 
							'background-image-repeat-general': 'repeat',
							'background-image-size-general': 'auto',
						};
						break;
					// ======= SHAPES & DIVIDERS =======
					case 'shape_divider':
						changes = buildShapeDividerChanges('bottom', value);
						break;
					case 'shape_divider_top':
						changes = buildShapeDividerChanges('top', value);
						break;
					case 'shape_divider_bottom':
						changes = buildShapeDividerChanges('bottom', value);
						break;
					case 'shape_divider_both': {
						const topChanges = buildShapeDividerChanges('top', value);
						const bottomChanges = buildShapeDividerChanges('bottom', value);
						if (topChanges || bottomChanges) {
							changes = { ...topChanges, ...bottomChanges };
						}
						break;
					}
					case 'shape_divider_color_top':
						changes = buildShapeDividerColorChanges('top', value);
						break;
					case 'shape_divider_color_bottom':
						changes = buildShapeDividerColorChanges('bottom', value);
						break;
					case 'shape_divider_color': {
						const topChanges = buildShapeDividerColorChanges('top', value);
						const bottomChanges = buildShapeDividerColorChanges('bottom', value);
						if (topChanges || bottomChanges) {
							changes = { ...topChanges, ...bottomChanges };
						}
						break;
					}
					case 'clip_path':
						changes = { 
							'clip-path-general': value,
							'clip-path-status-general': value !== 'none',
						};
						break;
					// ======= CONSTRAINTS & SIZING =======
					case 'max_width':
						{
							const maxWidth = parseUnitValue(value);
							changes = buildResponsiveSizeChanges(prefix, 'max-width', maxWidth.value, maxWidth.unit, true);
						}
						break;
					case 'min_width':
						{
							const minWidth = parseUnitValue(value);
							changes = buildResponsiveSizeChanges(prefix, 'min-width', minWidth.value, minWidth.unit, true);
						}
						break;
					case 'max_height':
						{
							const maxHeight = parseUnitValue(value);
							changes = buildResponsiveSizeChanges(prefix, 'max-height', maxHeight.value, maxHeight.unit, true);
						}
						break;
					case 'full_width': {
						const isFull = value === undefined ? true : Boolean(value);
						changes = {
							...buildBreakpointChanges(prefix, 'full-width', isFull),
							[`${prefix}size-advanced-options`]: true,
						};
						break;
					}
					case 'min_height':
						{
							const minHeight = parseUnitValue(value);
							changes = buildResponsiveSizeChanges(prefix, 'min-height', minHeight.value, minHeight.unit, true);
						}
						break;
					case 'maxi_version_current':
					case 'maxi_version_origin':
						changes = buildContainerMGroupAttributeChanges(property, value);
						break;
					// ======= ROW PATTERNS =======
					case 'row_pattern': {
						if (block.name === 'maxi-blocks/row-maxi') {
							// AI-to-template name corrections:
							// These responsive/stacked template names are commonly confused
							// with equal-width layouts. Map them to the correct default templates.
							const AI_TEMPLATE_ALIASES = {
								'1-1-1':         '3 columns',
								'1-1-1-1':       '4 columns',
								'1-1-1-1-1':     '5 columns',
								'1-1-1-1-1-1':   '6 columns',
								'1-1-1-1-1-1-1': '7 columns',
							};

							const numCols = Number(value);
							const isNumeric = Number.isInteger(numCols) && numCols > 0 && String(numCols) === String(value);
							let templateName = AI_TEMPLATE_ALIASES[value] ?? value;
							let numColArg = getNumCol(templateName);

							if (isNumeric) {
								// Pure number — resolve to the first equal-width template for that count
								if (numCols > 8) {
									templateName = 'more than 8 columns';
									numColArg = numCols;
								} else {
									const equalTemplate = getTemplates(true, 'general', numCols)
										.find(t => !t.isMoreThanEightColumns);
									if (equalTemplate) {
										templateName = equalTemplate.name;
										numColArg = numCols;
									}
								}
							}

							loadColumnsTemplate(templateName, block.clientId, 'general', numColArg);
							changes = { 'row-pattern-general': templateName };
						} else {
							changes = { 'row-pattern-general': value };
						}
						break;
					}
					// ======= CONTEXT LOOP =======
					case 'context_loop':
						changes =
							buildContainerCGroupAttributeChanges(property, value, {
								attributes: block.attributes,
							}) || buildContextLoopChanges(value);
						break;
					case 'pagination':
					case 'pagination_type':
					case 'pagination_load_more_label':
					case 'pagination_show_pages':
					case 'pagination_spacing':
					case 'pagination_style':
					case 'pagination_text':
					case 'custom_css':
					case 'custom_label':
					case 'column_gap':
					case 'custom_formats':
					case 'custom_formats_hover':
					case 'cl_attributes':
						if (block.name.includes('button')) {
							changes = buildButtonCGroupAttributeChanges(property, value, {
								attributes: block.attributes,
							});
						} else if (
							block.name.includes('text-maxi') ||
							block.name.includes('list-item-maxi')
						) {
							changes = buildTextCGroupAttributeChanges(property, value);
						} else {
							changes = buildContainerCGroupAttributeChanges(property, value, {
								attributes: block.attributes,
							});
						}
						break;
					// ======= RELATIVE SIZING =======
					case 'svg_width_relative':
						// Multiply current SVG icon width by value (2 = 2x, 0.5 = half)
						if (specificClientId || block.name.includes('svg-icon') || block.name.includes('icon-maxi')) {
							const currentSvgWidth = Number(block.attributes?.['svg-width-general']) || 100;
							const newSvgWidth = Math.round(currentSvgWidth * Number(value));
							changes = { 'svg-width-general': Math.max(1, newSvgWidth) };
						}
						break;
					case 'relative_size':
						// Multiply current size by value (1.2 = +20%, 0.8 = -20%)
						const currentWidth = block.attributes['width-general'] || 100;
						const currentHeight = block.attributes['height-general'] || 100;
						changes = {
							'width-general': Math.round(currentWidth * Number(value)),
							'height-general': Math.round(currentHeight * Number(value)),
						};
						break;
					case 'font_size_relative': {
						const textLevel = block.attributes?.textLevel || 'p';
						const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
						const multiplier = Number(value);
						const getNumeric = raw => {
							const num = Number(raw);
							return Number.isFinite(num) && num > 0 ? num : null;
						};
						const getSizeForBreakpoint = bp => {
							const fromCustom = getCustomFormatValue({
								typography: block.attributes,
								prop: 'font-size',
								breakpoint: bp,
								textLevel,
							});
							const customSize = getNumeric(fromCustom);
							if (customSize !== null) return customSize;

							const fallbackSize = getLastBreakpointAttribute({
								target: 'font-size',
								breakpoint: bp,
								attributes: block.attributes,
								forceSingle: true,
								forceUseBreakpoint: true,
								avoidXXL: false,
							});
							return getNumeric(fallbackSize);
						};
						const getUnitForBreakpoint = bp => {
							const fromCustom = getCustomFormatValue({
								typography: block.attributes,
								prop: 'font-size-unit',
								breakpoint: bp,
								textLevel,
							});
							if (fromCustom) return fromCustom;

							const fallbackUnit = getLastBreakpointAttribute({
								target: 'font-size-unit',
								breakpoint: bp,
								attributes: block.attributes,
								forceSingle: true,
								forceUseBreakpoint: true,
								avoidXXL: false,
							});
							return fallbackUnit || 'px';
						};
						const roundSize = (size, unit) => {
							if (!Number.isFinite(size)) return size;
							const normalizedUnit = String(unit || 'px').toLowerCase();
							if (normalizedUnit === 'px') return Math.round(size);
							return Math.round(size * 100) / 100;
						};

						changes = {};
						breakpoints.forEach(bp => {
							const currentSize = getSizeForBreakpoint(bp) ?? 16;
							const unit = getUnitForBreakpoint(bp);
							const nextSize = roundSize(currentSize * multiplier, unit);
							changes[`font-size-${bp}`] = nextSize;
							if (unit) {
								changes[`font-size-unit-${bp}`] = unit;
							}
						});
						break;
					}
					case 'width_relative':
						const currentW = block.attributes['width-general'] || 100;
						changes = { 'width-general': Math.round(currentW * Number(value)) };
						break;
					case 'height_relative':
						const currentH = block.attributes['height-general'] || 100;
						changes = { 'height-general': Math.round(currentH * Number(value)) };
						break;
					// ======= DIRECTIONAL MARGIN =======
					case 'margin_top':
						changes = updateMargin(value, 'top', prefix);
						break;
					case 'margin_bottom':
						changes = updateMargin(value, 'bottom', prefix);
						break;
					case 'margin_left':
						changes = updateMargin(value, 'left', prefix);
						break;
					case 'margin_right':
						changes = updateMargin(value, 'right', prefix);
						break;
					// ======= DIRECTIONAL PADDING =======
					case 'padding_top':
						changes = buildContainerPGroupAttributeChanges(property, value);
						break;
					case 'padding_bottom':
						changes = buildContainerPGroupAttributeChanges(property, value);
						break;
					case 'padding_left':
						changes = buildContainerPGroupAttributeChanges(property, value);
						break;
					case 'padding_right':
						changes = buildContainerPGroupAttributeChanges(property, value);
						break;
					// ======= RESPONSIVE OVERRIDES =======
					case 'display_mobile':
						changes = { 'display-xs': value }; // xs = mobile
						break;
					case 'display_tablet':
						changes = { 'display-sm': value, 'display-md': value }; // sm/md = tablet
						break;
					case 'display_desktop':
						changes = { 'display-xl': value, 'display-lg': value }; // xl/lg = desktop
						break;
					case 'show_mobile_only':
						changes = { 
							'display-xl': 'none', 
							'display-lg': 'none',
							'display-md': 'none',
							'display-xs': 'flex',
						};
						break;
					// ======= HOVER STATE EFFECTS =======
					case 'hover_effect':
						changes = { 
							'transform-status-hover': true,
							'transform-scale-x-hover': 1.05,
							'transform-scale-y-hover': 1.05,
						};
						break;
					case 'hover_lift':
						changes = { 
							'transform-status-hover': true,
							'transform-translate-y-hover': -10,
							'box-shadow-blur-hover': 20,
							'box-shadow-vertical-hover': 10,
						};
						break;
					case 'hover_glow':
						changes = { 
							'box-shadow-status-hover': true,
							'box-shadow-blur-hover': 30,
							'box-shadow-spread-hover': 5,
							'box-shadow-opacity-hover': 0.5,
						};
						break;
					case 'hover_darken':
						changes = { 
							'opacity-hover': 0.7,
							'opacity-status-hover': true,
						};
						break;
					case 'hover_lighten':
						changes = { 
							'filter-brightness-hover': 1.2,
							'filter-status-hover': true,
						};
						break;
				}
			}

			// Fallback: let block-specific handlers process unsupported properties
			if (
				isMaxi &&
				isMatch &&
				!changes &&
				!handledBySetAttributes &&
				!String(property || '').startsWith('flow_')
			) {
				const blockHandler = getAiHandlerForBlock(block);
				if (blockHandler) {
					const handlerResult = blockHandler(block, property, value, prefix, { mode: scope });
					if (handlerResult?.action === 'apply') {
						changes = handlerResult.attributes;
					} else if (handlerResult && !handlerResult.action) {
						changes = handlerResult;
					}
				}
			}

			if (changes && !handledBySetAttributes) {
				// console.log(`[Maxi AI Debug] Dispatching update to ${block.clientId}:`, changes);
				updateBlockAttributes(block.clientId, changes);
				count++;
			}


			if (block.innerBlocks && block.innerBlocks.length > 0) {
				// console.log(`[Maxi AI Debug] Recursing into ${block.innerBlocks.length} inner blocks of ${block.name}`);
				recursiveUpdate(block.innerBlocks);
			} else {
				// Fallback: Check if block helper has innerBlocks not directly on object?
				// Usually block object has 'innerBlocks' array.
			}
		});
	};

	// execute
	if (blocksToUpdate && blocksToUpdate.length > 0) {
		// console.log(`[Maxi AI Debug] applyUpdatesToBlocks started with ${blocksToUpdate.length} blocks. Target: ${targetBlock}`);
		recursiveUpdate(blocksToUpdate);
	} else {
		// console.log('[Maxi AI Debug] applyUpdatesToBlocks called with empty block list.');
	}
	
	return count;
};
