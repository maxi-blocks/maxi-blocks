/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { openSidebarAccordion } from '@extensions/inspector/inspectorPath';
import { getAccordionSidebarTarget } from '../ai/blocks/accordion';
import { getColumnSidebarTarget } from '../ai/blocks/column';
import { getDividerSidebarTarget } from '../ai/blocks/divider';
import { getIconSidebarTarget } from '../ai/blocks/icon';
import { getImageSidebarTarget } from '../ai/blocks/image';
import { getNumberCounterSidebarTarget } from '../ai/blocks/number-counter';
import {
	getButtonAGroupSidebarTarget,
	getButtonBGroupSidebarTarget,
	getButtonCGroupSidebarTarget,
	getButtonIGroupSidebarTarget,
} from '../ai/utils/buttonGroups';
import {
	getContainerAGroupSidebarTarget,
	getContainerBGroupSidebarTarget,
	getContainerCGroupSidebarTarget,
	getContainerDGroupSidebarTarget,
	getContainerEGroupSidebarTarget,
	getContainerFGroupSidebarTarget,
	getContainerHGroupSidebarTarget,
	getContainerLGroupSidebarTarget,
	getContainerMGroupSidebarTarget,
	getContainerOGroupSidebarTarget,
	getContainerPGroupSidebarTarget,
	getContainerRGroupSidebarTarget,
	getContainerSGroupSidebarTarget,
	getContainerTGroupSidebarTarget,
	getContainerWGroupSidebarTarget,
	getContainerZGroupSidebarTarget,
} from '../ai/utils/containerGroups';
import {
	getTextCGroupSidebarTarget,
	getTextLGroupSidebarTarget,
	getTextPGroupSidebarTarget,
	getTextListGroupSidebarTarget,
	getTextTypographySidebarTarget,
} from '../ai/utils/textGroup';
import { getDcGroupSidebarTarget } from '../ai/utils/dcGroup';
import { getAdvancedCssSidebarTarget } from '../ai/utils/advancedCssAGroup';
import { getMetaSidebarTarget } from '../ai/utils/metaAGroup';

/**
 * Provides the sidebar routing helper for the AI chat panel.
 *
 * @param {Object} args
 * @param {Object|null} args.selectedBlock Currently selected Gutenberg block.
 * @returns {{ openSidebarForProperty: Function }}
 */
const useAiChatSidebar = ({ selectedBlock }) => {
	/**
	 * Opens the correct sidebar accordion panel for a given block property.
	 * Reads the selected block name fresh from the store on each call to avoid stale closures.
	 *
	 * @param {string} rawProperty The property key (dash or underscore notation).
	 */
	const openSidebarForProperty = rawProperty => {
		if (!rawProperty) return;

		const property = String(rawProperty).replace(/-/g, '_');
		const normalizedProperty = property.replace(/_(general|xxl|xl|l|m|s|xs)$/, '');

		let selectedBlockName = selectedBlock?.name;
		try {
			const storeSelectedBlock = select('core/block-editor')?.getSelectedBlock?.();
			if (storeSelectedBlock?.name) selectedBlockName = storeSelectedBlock.name;
		} catch {}

		// Flow aliases (e.g. flow_border) → real panel names.
		if (normalizedProperty.startsWith('flow_')) {
			switch (normalizedProperty) {
				case 'flow_outline':
				case 'flow_border':
					openSidebarForProperty('border');
					return;
				case 'flow_shadow':
					openSidebarForProperty('box_shadow');
					return;
				case 'flow_text_align':
					openSidebarAccordion(0, 'typography');
					return;
				default:
			}
		}

		const isTextBlock =
			selectedBlockName?.includes('text-maxi') ||
			selectedBlockName?.includes('list-item-maxi');

		const dcTarget = getDcGroupSidebarTarget(normalizedProperty, selectedBlockName);
		if (dcTarget) {
			openSidebarAccordion(dcTarget.tabIndex, dcTarget.accordion);
			return;
		}

		if (selectedBlockName?.includes('accordion')) {
			const target = getAccordionSidebarTarget(normalizedProperty);
			if (target) { openSidebarAccordion(target.tabIndex, target.accordion); return; }
		}

		if (selectedBlockName?.includes('column')) {
			const target = getColumnSidebarTarget(normalizedProperty);
			if (target) { openSidebarAccordion(target.tabIndex, target.accordion); return; }
		}

		if (selectedBlockName?.includes('divider')) {
			const target = getDividerSidebarTarget(normalizedProperty);
			if (target) { openSidebarAccordion(target.tabIndex, target.accordion); return; }
		}

		if (selectedBlockName?.includes('image')) {
			const target = getImageSidebarTarget(normalizedProperty);
			if (target) { openSidebarAccordion(target.tabIndex, target.accordion); return; }
		}

		if (selectedBlockName?.includes('svg-icon') || selectedBlockName?.includes('icon-maxi')) {
			const target = getIconSidebarTarget(normalizedProperty);
			if (target) { openSidebarAccordion(target.tabIndex, target.accordion); return; }
		}

		if (selectedBlockName?.includes('number-counter')) {
			const target = getNumberCounterSidebarTarget(normalizedProperty);
			if (target) { openSidebarAccordion(target.tabIndex, target.accordion); return; }
		}

		if (selectedBlockName?.includes('button')) {
			for (const getter of [
				getButtonAGroupSidebarTarget,
				getButtonBGroupSidebarTarget,
				getButtonCGroupSidebarTarget,
				getButtonIGroupSidebarTarget,
			]) {
				const target = getter(normalizedProperty);
				if (target) { openSidebarAccordion(target.tabIndex, target.accordion); return; }
			}
		}

		if (isTextBlock) {
			for (const getter of [
				getTextListGroupSidebarTarget,
				getTextLGroupSidebarTarget,
				getTextCGroupSidebarTarget,
				getTextPGroupSidebarTarget,
				getTextTypographySidebarTarget,
			]) {
				const target = getter(normalizedProperty);
				if (target) { openSidebarAccordion(target.tabIndex, target.accordion); return; }
			}
		}

		for (const getter of [
			getContainerAGroupSidebarTarget,
			getContainerBGroupSidebarTarget,
			getContainerCGroupSidebarTarget,
			getContainerDGroupSidebarTarget,
			getContainerEGroupSidebarTarget,
			getContainerFGroupSidebarTarget,
			getContainerHGroupSidebarTarget,
			getContainerLGroupSidebarTarget,
			getContainerMGroupSidebarTarget,
			getContainerWGroupSidebarTarget,
			getContainerPGroupSidebarTarget,
			getContainerRGroupSidebarTarget,
			getContainerSGroupSidebarTarget,
			getContainerTGroupSidebarTarget,
			getContainerOGroupSidebarTarget,
			getContainerZGroupSidebarTarget,
		]) {
			const target = getter(normalizedProperty);
			if (target) { openSidebarAccordion(target.tabIndex, target.accordion); return; }
		}

		switch (normalizedProperty) {
			case 'responsive_padding':
			case 'padding':
			case 'margin':
				openSidebarAccordion(0, 'margin / padding');
				return;
			case 'size':
			case 'width':
			case 'height':
			case 'min_width':
			case 'max_width':
			case 'min_height':
			case 'max_height':
			case 'full_width':
			case 'width_fit_content':
			case 'height_fit_content':
				openSidebarAccordion(0, 'height / width');
				return;
			case 'background_color':
			case 'background_palette_color':
			case 'background_palette_status':
			case 'background_palette_opacity':
			case 'background':
			case 'background_layers':
			case 'background_layers_hover':
			case 'block_background_status_hover':
				openSidebarAccordion(0, 'background / layer');
				return;
			case 'border':
			case 'border_radius':
			case 'border_hover':
				openSidebarAccordion(0, 'border');
				return;
			case 'box_shadow':
			case 'box_shadow_hover':
			case 'hover_glow':
				openSidebarAccordion(0, 'box shadow');
				return;
			case 'shape_divider':
			case 'shape_divider_top':
			case 'shape_divider_bottom':
			case 'shape_divider_both':
			case 'shape_divider_color':
			case 'shape_divider_color_top':
			case 'shape_divider_color_bottom':
				openSidebarAccordion(0, 'shape divider');
				return;
			case 'context_loop':
				openSidebarAccordion(0, 'context loop');
				return;
			case 'arrow_status':
			case 'arrow_side':
			case 'arrow_position':
			case 'arrow_width':
				openSidebarAccordion(0, 'callout arrow');
				return;
			case 'anchor_link':
			case 'unique_id':
			case 'aria_label': {
				const sidebarTarget = getMetaSidebarTarget(property);
				if (sidebarTarget) {
					openSidebarAccordion(sidebarTarget.tabIndex, sidebarTarget.accordion);
				}
				return;
			}
			case 'custom_css':
				openSidebarAccordion(1, 'custom css');
				return;
			case 'advanced_css': {
				const sidebarTarget = getAdvancedCssSidebarTarget('advanced_css', selectedBlockName);
				if (sidebarTarget) {
					openSidebarAccordion(sidebarTarget.tabIndex, sidebarTarget.accordion);
				}
				return;
			}
			case 'scroll_fade':
				openSidebarAccordion(1, 'scroll effects');
				return;
			case 'transform':
			case 'transform_scale_hover':
			case 'hover_effect':
			case 'hover_lift':
				openSidebarAccordion(1, 'transform');
				return;
			case 'transition':
				openSidebarAccordion(1, 'hover transition');
				return;
			case 'display':
			case 'display_mobile':
			case 'display_tablet':
			case 'display_desktop':
			case 'show_mobile_only':
				openSidebarAccordion(1, 'show/hide block');
				return;
			case 'opacity':
			case 'opacity_hover':
			case 'opacity_status_hover':
			case 'hover_darken':
			case 'hover_lighten':
				openSidebarAccordion(1, 'opacity');
				return;
			case 'position':
			case 'position_top':
			case 'position_right':
			case 'position_bottom':
			case 'position_left':
				openSidebarAccordion(1, 'position');
				return;
			case 'overflow':
				openSidebarAccordion(1, 'overflow');
				return;
			case 'z_index':
				openSidebarAccordion(1, 'z-index');
				return;
			case 'align_items':
			case 'align_items_flex':
			case 'align_content':
			case 'justify_content':
			case 'flex_direction':
			case 'flex_wrap':
			case 'gap':
			case 'row_gap':
			case 'column_gap':
				openSidebarAccordion(1, 'flexbox');
				return;
			default:
		}
	};

	return { openSidebarForProperty };
};

export default useAiChatSidebar;
