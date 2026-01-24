/**
 * Image Logic Handler for AI Chat Panel
 * Maps natural language to Image Maxi attributes.
 */

const CLIP_PATH_PRESETS = {
	circle: 'circle(50% at 50% 50%)',
	oval: 'ellipse(50% 40% at 50% 50%)',
	triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
	triangle_down: 'polygon(0% 0%, 100% 0%, 50% 100%)',
	diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
	hexagon: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
	octagon: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
	star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
	parallelogram: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
	slant_bottom: 'polygon(0% 0%, 100% 0%, 100% 85%, 0% 100%)',
	slant_top: 'polygon(0% 15%, 100% 0%, 100% 100%, 0% 100%)',
};

const SCROLL_DEFAULTS = {
	vertical: { zones: { 0: -400, 50: 0, 100: 400 }, unit: 'px' },
	horizontal: { zones: { 0: -200, 50: 0, 100: 200 }, unit: 'px' },
	rotate: { zones: { 0: 90, 50: 0, 100: 0 } },
	rotateX: { zones: { 0: 90, 50: 0, 100: 0 } },
	rotateY: { zones: { 0: 90, 50: 0, 100: 0 } },
	scale: { zones: { 0: 70, 50: 100, 100: 100 } },
	scaleX: { zones: { 0: 70, 50: 100, 100: 100 } },
	scaleY: { zones: { 0: 70, 50: 100, 100: 100 } },
	fade: { zones: { 0: 0, 50: 100, 100: 100 } },
	blur: { zones: { 0: 10, 50: 0, 100: 0 }, unit: 'px' },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const mergeCustomCss = (attributes, category, index, css) => {
	const existing = attributes?.['custom-css-general'];
	const next = existing ? { ...existing } : {};
	const categoryObj = next[category] ? { ...next[category] } : {};

	if (css) {
		categoryObj[index] = css;
		next[category] = categoryObj;
	} else {
		delete categoryObj[index];
		if (Object.keys(categoryObj).length) next[category] = categoryObj;
		else delete next[category];
	}

	return { 'custom-css-general': next };
};

const toAspectRatio = value => {
	if (!value) return { imageRatio: 'original' };

	if (value.startsWith('custom:')) {
		return { imageRatio: 'custom', imageRatioCustom: value.replace('custom:', '') };
	}

	return { imageRatio: value };
};

export const IMAGE_PATTERNS = [
	// ============================================================
	// GROUP 1: PRIORITY FLOWS (Complex interactions)
	// ============================================================
	{
		regex: /round(ed)?|radius|soft.*corner|rounded.*corner|pill|capsule/i,
		property: 'flow_radius',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'image',
	},
	{
		regex: /border|frame|stroke|outline|picture.*frame/i,
		property: 'flow_border',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'image',
	},
	{
		regex: /shadow|glow|lift|depth|drop.*shadow|elevat(ed|e)?/i,
		property: 'flow_shadow',
		value: 'start',
		selectionMsg: '',
		pageMsg: null,
		target: 'image',
	},

	// ============================================================
	// GROUP 2: ASPECT RATIO & CROP
	// ============================================================
	{ regex: /square|1\s*[:/]\s*1|avatar|profile/i, property: 'image_ratio', value: 'ar11', selectionMsg: 'Set to square.', pageMsg: 'Cropped image to square.', target: 'image' },
	{ regex: /portrait|vertical/i, property: 'image_ratio', value: 'ar23', selectionMsg: 'Set to portrait.', pageMsg: 'Cropped image to portrait.', target: 'image' },
	{ regex: /landscape|horizontal/i, property: 'image_ratio', value: 'ar32', selectionMsg: 'Set to landscape.', pageMsg: 'Cropped image to landscape.', target: 'image' },
	{ regex: /16\s*[:/]\s*9|widescreen|cinema/i, property: 'image_ratio', value: 'ar169', selectionMsg: 'Set to 16:9.', pageMsg: 'Cropped image to 16:9.', target: 'image' },
	{ regex: /4\s*[:/]\s*3/i, property: 'image_ratio', value: 'ar43', selectionMsg: 'Set to 4:3.', pageMsg: 'Cropped image to 4:3.', target: 'image' },
	{ regex: /3\s*[:/]\s*2/i, property: 'image_ratio', value: 'ar32', selectionMsg: 'Set to 3:2.', pageMsg: 'Cropped image to 3:2.', target: 'image' },
	{ regex: /2\s*[:/]\s*3/i, property: 'image_ratio', value: 'ar23', selectionMsg: 'Set to 2:3.', pageMsg: 'Cropped image to 2:3.', target: 'image' },
	{ regex: /9\s*[:/]\s*16/i, property: 'image_ratio', value: 'custom:9/16', selectionMsg: 'Set to 9:16.', pageMsg: 'Cropped image to 9:16.', target: 'image' },
	{ regex: /4\s*[:/]\s*5/i, property: 'image_ratio', value: 'custom:4/5', selectionMsg: 'Set to 4:5.', pageMsg: 'Cropped image to 4:5.', target: 'image' },
	{ regex: /5\s*[:/]\s*4/i, property: 'image_ratio', value: 'custom:5/4', selectionMsg: 'Set to 5:4.', pageMsg: 'Cropped image to 5:4.', target: 'image' },
	{ regex: /original.*(ratio|size)|reset.*crop|no.*crop|uncrop/i, property: 'image_ratio', value: 'original', selectionMsg: 'Reset aspect ratio.', pageMsg: 'Restored original aspect ratio.', target: 'image' },

	// Fit on wrapper / crop
	{ regex: /fit.*(wrapper|container)|fit.*inside|contain|show.*whole|no.*crop/i, property: 'image_fit', value: 'contain', selectionMsg: 'Image fit to wrapper.', pageMsg: 'Image fit inside wrapper.', target: 'image' },
	{ regex: /cover|fill.*(container|area)|crop.*fill|no.*gap/i, property: 'image_fit', value: 'cover', selectionMsg: 'Image set to cover.', pageMsg: 'Image fills the wrapper.', target: 'image' },
	{ regex: /use.*original.*size|reset.*fit/i, property: 'image_fit', value: 'original', selectionMsg: 'Original size.', pageMsg: 'Image returned to original size.', target: 'image' },
	{ regex: /zoom\s*in|crop\s*tighter|fill\s*more/i, property: 'object_size', value: 1.3, selectionMsg: 'Zoomed in.', pageMsg: 'Zoomed image in.', target: 'image' },
	{ regex: /zoom\s*out|show\s*more|loosen\s*crop/i, property: 'object_size', value: 1, selectionMsg: 'Zoomed out.', pageMsg: 'Zoomed image out.', target: 'image' },

	// Object position
	{ regex: /focus.*left|move.*left|position.*left|left\s*side/i, property: 'object_position', value: { x: 0, y: 50 }, selectionMsg: 'Focused left.', pageMsg: 'Focused image to the left.', target: 'image' },
	{ regex: /focus.*right|move.*right|position.*right|right\s*side/i, property: 'object_position', value: { x: 100, y: 50 }, selectionMsg: 'Focused right.', pageMsg: 'Focused image to the right.', target: 'image' },
	{ regex: /focus.*top|move.*up|position.*top|top\s*edge/i, property: 'object_position', value: { x: 50, y: 0 }, selectionMsg: 'Focused top.', pageMsg: 'Focused image to the top.', target: 'image' },
	{ regex: /focus.*bottom|move.*down|position.*bottom|bottom\s*edge/i, property: 'object_position', value: { x: 50, y: 100 }, selectionMsg: 'Focused bottom.', pageMsg: 'Focused image to the bottom.', target: 'image' },
	{ regex: /focus.*center|center.*crop|center.*image/i, property: 'object_position', value: { x: 50, y: 50 }, selectionMsg: 'Centered image.', pageMsg: 'Centered image focus.', target: 'image' },

	// ============================================================
	// GROUP 3: SIZE & DIMENSIONS
	// ============================================================
	{ regex: /full.*width|100%|edge[-\s]*to[-\s]*edge/i, property: 'image_full_width', value: true, selectionMsg: 'Full width.', pageMsg: 'Image set to full width.', target: 'image' },
	{ regex: /half.*width|50%|split.*half/i, property: 'img_width', value: 50, selectionMsg: 'Width set to 50%.', pageMsg: 'Image width set to 50%.', target: 'image' },
	{ regex: /third.*width|one\s*third|33%/i, property: 'img_width', value: 33, selectionMsg: 'Width set to 33%.', pageMsg: 'Image width set to 33%.', target: 'image' },
	{ regex: /quarter.*width|25%/i, property: 'img_width', value: 25, selectionMsg: 'Width set to 25%.', pageMsg: 'Image width set to 25%.', target: 'image' },
	{ regex: /small.*(image|width)|tiny.*(image|width)|mini.*(image|width)/i, property: 'img_width', value: 25, selectionMsg: 'Image made small.', pageMsg: 'Image resized smaller.', target: 'image' },
	{ regex: /large.*(image|width)|big.*(image|width)|bigger.*image|huge.*image/i, property: 'img_width', value: 75, selectionMsg: 'Image made larger.', pageMsg: 'Image resized larger.', target: 'image' },
	{ regex: /use.*original.*size|init.*size/i, property: 'use_init_size', value: true, selectionMsg: 'Using original size.', pageMsg: 'Using original image size.', target: 'image' },

	// WordPress image sizes
	{ regex: /full\s*size|high\s*res|full\s*resolution/i, property: 'image_size', value: 'full', selectionMsg: 'Full size.', pageMsg: 'Image size set to full.', target: 'image' },
	{ regex: /large\s*size/i, property: 'image_size', value: 'large', selectionMsg: 'Large size.', pageMsg: 'Image size set to large.', target: 'image' },
	{ regex: /medium\s*size|normal\s*size/i, property: 'image_size', value: 'medium', selectionMsg: 'Medium size.', pageMsg: 'Image size set to medium.', target: 'image' },
	{ regex: /thumbnail|low\s*res|small\s*size/i, property: 'image_size', value: 'thumbnail', selectionMsg: 'Thumbnail size.', pageMsg: 'Image size set to thumbnail.', target: 'image' },

	// ============================================================
	// GROUP 4: ALIGNMENT
	// ============================================================
	{ regex: /align.*left|left\s*align|flush\s*left/i, property: 'alignment', value: 'left', selectionMsg: 'Aligned left.', pageMsg: 'Aligned images left.', target: 'image' },
	{ regex: /align.*right|right\s*align|flush\s*right/i, property: 'alignment', value: 'right', selectionMsg: 'Aligned right.', pageMsg: 'Aligned images right.', target: 'image' },
	{ regex: /align.*center|centered|centre(d)?/i, property: 'alignment', value: 'center', selectionMsg: 'Aligned center.', pageMsg: 'Aligned images center.', target: 'image' },

	// ============================================================
	// GROUP 5: CAPTIONS & ALT
	// ============================================================
	{ regex: /show.*caption|add.*caption|caption\s*on/i, property: 'caption_type', value: 'custom', selectionMsg: 'Caption enabled.', pageMsg: 'Caption enabled.', target: 'image' },
	{ regex: /remove.*caption|hide.*caption|no.*caption/i, property: 'caption_type', value: 'none', selectionMsg: 'Caption removed.', pageMsg: 'Caption removed.', target: 'image' },
	{ regex: /attachment.*caption|use.*attachment.*caption/i, property: 'caption_type', value: 'attachment', selectionMsg: 'Using attachment caption.', pageMsg: 'Using attachment caption.', target: 'image' },
	{ regex: /caption.*top|caption.*above/i, property: 'caption_position', value: 'top', selectionMsg: 'Caption moved to top.', pageMsg: 'Caption moved to top.', target: 'image' },
	{ regex: /caption.*bottom|caption.*below/i, property: 'caption_position', value: 'bottom', selectionMsg: 'Caption moved to bottom.', pageMsg: 'Caption moved to bottom.', target: 'image' },
	{ regex: /more.*space.*caption|increase.*caption.*gap/i, property: 'caption_gap', value: 2, selectionMsg: 'Increased caption gap.', pageMsg: 'Increased caption gap.', target: 'image' },
	{ regex: /less.*space.*caption|reduce.*caption.*gap/i, property: 'caption_gap', value: 0.5, selectionMsg: 'Reduced caption gap.', pageMsg: 'Reduced caption gap.', target: 'image' },
	{ regex: /remove.*alt|no.*alt\s*text/i, property: 'media_alt', value: null, selectionMsg: 'Alt text removed.', pageMsg: 'Alt text removed.', target: 'image' },
	{ regex: /use.*wordpress.*alt|wp\s*alt/i, property: 'alt_selector', value: 'wordpress', selectionMsg: 'Using WordPress alt.', pageMsg: 'Using WordPress alt.', target: 'image' },
	{ regex: /use.*image.*title|title.*alt/i, property: 'alt_selector', value: 'title', selectionMsg: 'Using image title.', pageMsg: 'Using image title for alt.', target: 'image' },

	// ============================================================
	// GROUP 6: CLIP PATH & SHAPES
	// ============================================================
	{ regex: /circle|circular|round\s*shape/i, property: 'clip_path', value: CLIP_PATH_PRESETS.circle, selectionMsg: 'Applied circle clip.', pageMsg: 'Applied circle clip.', target: 'image' },
	{ regex: /clip\s*path.*circle|circle\s*mask|circle\s*shape/i, property: 'clip_path', value: CLIP_PATH_PRESETS.circle, selectionMsg: 'Applied circle clip.', pageMsg: 'Applied circle clip.', target: 'image' },
	{ regex: /oval|ellipse/i, property: 'clip_path', value: CLIP_PATH_PRESETS.oval, selectionMsg: 'Applied oval clip.', pageMsg: 'Applied oval clip.', target: 'image' },
	{ regex: /triangle(?!.*down)|triangle\s*up/i, property: 'clip_path', value: CLIP_PATH_PRESETS.triangle, selectionMsg: 'Applied triangle clip.', pageMsg: 'Applied triangle clip.', target: 'image' },
	{ regex: /triangle\s*down|inverted\s*triangle/i, property: 'clip_path', value: CLIP_PATH_PRESETS.triangle_down, selectionMsg: 'Applied inverted triangle clip.', pageMsg: 'Applied inverted triangle clip.', target: 'image' },
	{ regex: /diamond/i, property: 'clip_path', value: CLIP_PATH_PRESETS.diamond, selectionMsg: 'Applied diamond clip.', pageMsg: 'Applied diamond clip.', target: 'image' },
	{ regex: /hexagon/i, property: 'clip_path', value: CLIP_PATH_PRESETS.hexagon, selectionMsg: 'Applied hexagon clip.', pageMsg: 'Applied hexagon clip.', target: 'image' },
	{ regex: /octagon/i, property: 'clip_path', value: CLIP_PATH_PRESETS.octagon, selectionMsg: 'Applied octagon clip.', pageMsg: 'Applied octagon clip.', target: 'image' },
	{ regex: /star\s*shape|star\s*mask/i, property: 'clip_path', value: CLIP_PATH_PRESETS.star, selectionMsg: 'Applied star clip.', pageMsg: 'Applied star clip.', target: 'image' },
	{ regex: /parallelogram/i, property: 'clip_path', value: CLIP_PATH_PRESETS.parallelogram, selectionMsg: 'Applied parallelogram clip.', pageMsg: 'Applied parallelogram clip.', target: 'image' },
	{ regex: /slant.*bottom|diagonal.*bottom/i, property: 'clip_path', value: CLIP_PATH_PRESETS.slant_bottom, selectionMsg: 'Applied slanted bottom.', pageMsg: 'Applied slanted bottom.', target: 'image' },
	{ regex: /slant.*top|diagonal.*top/i, property: 'clip_path', value: CLIP_PATH_PRESETS.slant_top, selectionMsg: 'Applied slanted top.', pageMsg: 'Applied slanted top.', target: 'image' },
	{ regex: /remove.*clip|remove.*mask|reset.*shape|no.*mask/i, property: 'clip_path', value: 'none', selectionMsg: 'Removed clip path.', pageMsg: 'Removed clip path.', target: 'image' },

	// ============================================================
	// GROUP 7: FILTERS (Custom CSS)
	// ============================================================
	{ regex: /black.*white|grayscale|grey\s*scale|b&w/i, property: 'image_filter', value: 'grayscale(100%)', selectionMsg: 'Applied grayscale.', pageMsg: 'Applied grayscale filter.', target: 'image' },
	{ regex: /sepia|vintage|old\s*photo/i, property: 'image_filter', value: 'sepia(100%)', selectionMsg: 'Applied sepia.', pageMsg: 'Applied sepia filter.', target: 'image' },
	{ regex: /blur\s*image|blur.*photo/i, property: 'image_filter', value: 'blur(4px)', selectionMsg: 'Applied blur.', pageMsg: 'Applied blur filter.', target: 'image' },
	{ regex: /increase.*contrast|more.*contrast/i, property: 'image_filter', value: 'contrast(1.2)', selectionMsg: 'Increased contrast.', pageMsg: 'Increased contrast.', target: 'image' },
	{ regex: /brighten|increase.*brightness/i, property: 'image_filter', value: 'brightness(1.2)', selectionMsg: 'Brightened image.', pageMsg: 'Brightened image.', target: 'image' },
	{ regex: /saturate|more.*color/i, property: 'image_filter', value: 'saturate(1.2)', selectionMsg: 'Increased saturation.', pageMsg: 'Increased saturation.', target: 'image' },
	{ regex: /invert|negative/i, property: 'image_filter', value: 'invert(1)', selectionMsg: 'Inverted colors.', pageMsg: 'Inverted colors.', target: 'image' },
	{ regex: /remove.*filter|no.*filter|reset.*filter/i, property: 'image_filter', value: 'none', selectionMsg: 'Filters removed.', pageMsg: 'Filters removed.', target: 'image' },

	// ============================================================
	// GROUP 8: HOVER EFFECTS (Image hover system)
	// ============================================================
	{ regex: /hover.*zoom\s*in|zoom\s*in.*hover|grow.*hover/i, property: 'hover_basic', value: 'zoom-in', selectionMsg: 'Zoom on hover.', pageMsg: 'Zoom on hover enabled.', target: 'image' },
	{ regex: /hover.*zoom\s*out|shrink.*hover/i, property: 'hover_basic', value: 'zoom-out', selectionMsg: 'Zoom out on hover.', pageMsg: 'Zoom out on hover enabled.', target: 'image' },
	{ regex: /hover.*rotate|spin.*hover/i, property: 'hover_basic', value: 'rotate', selectionMsg: 'Rotate on hover.', pageMsg: 'Rotate on hover enabled.', target: 'image' },
	{ regex: /hover.*slide|move.*hover/i, property: 'hover_basic', value: 'slide', selectionMsg: 'Slide on hover.', pageMsg: 'Slide on hover enabled.', target: 'image' },
	{ regex: /hover.*blur|blur.*hover/i, property: 'hover_basic', value: 'blur', selectionMsg: 'Blur on hover.', pageMsg: 'Blur on hover enabled.', target: 'image' },
	{ regex: /remove.*hover|disable.*hover|no.*hover/i, property: 'hover_off', value: true, selectionMsg: 'Hover removed.', pageMsg: 'Hover effects removed.', target: 'image' },

	// ============================================================
	// GROUP 9: SCROLL EFFECTS
	// ============================================================
	{ regex: /scroll.*fade|fade.*scroll|fade.*in.*scroll/i, property: 'scroll_effect', value: { type: 'fade' }, selectionMsg: 'Scroll fade enabled.', pageMsg: 'Scroll fade enabled.', target: 'image' },
	{ regex: /scroll.*blur|blur.*scroll/i, property: 'scroll_effect', value: { type: 'blur' }, selectionMsg: 'Scroll blur enabled.', pageMsg: 'Scroll blur enabled.', target: 'image' },
	{ regex: /scroll.*zoom|zoom.*scroll/i, property: 'scroll_effect', value: { type: 'scale' }, selectionMsg: 'Scroll zoom enabled.', pageMsg: 'Scroll zoom enabled.', target: 'image' },
	{ regex: /scroll.*rotate|rotate.*scroll/i, property: 'scroll_effect', value: { type: 'rotate' }, selectionMsg: 'Scroll rotate enabled.', pageMsg: 'Scroll rotate enabled.', target: 'image' },
	{ regex: /scroll.*left|scroll.*right|horizontal.*scroll/i, property: 'scroll_effect', value: { type: 'horizontal' }, selectionMsg: 'Scroll horizontal enabled.', pageMsg: 'Scroll horizontal enabled.', target: 'image' },
	{ regex: /scroll.*up|scroll.*down|vertical.*scroll/i, property: 'scroll_effect', value: { type: 'vertical' }, selectionMsg: 'Scroll vertical enabled.', pageMsg: 'Scroll vertical enabled.', target: 'image' },
	{ regex: /remove.*scroll|disable.*scroll/i, property: 'scroll_effect', value: { type: 'off' }, selectionMsg: 'Scroll effects removed.', pageMsg: 'Scroll effects removed.', target: 'image' },

	// ============================================================
	// GROUP 10: DYNAMIC CONTENT
	// ============================================================
	{ regex: /featured\s*image|featured\s*media/i, property: 'dynamic_image', value: { type: 'posts', field: 'featured_media' }, selectionMsg: 'Using featured image.', pageMsg: 'Using featured image.', target: 'image' },
	{ regex: /author\s*avatar|author\s*photo/i, property: 'dynamic_image', value: { type: 'posts', field: 'author_avatar' }, selectionMsg: 'Using author avatar.', pageMsg: 'Using author avatar.', target: 'image' },
	{ regex: /site\s*logo|logo/i, property: 'dynamic_image', value: { type: 'settings', field: 'site_logo' }, selectionMsg: 'Using site logo.', pageMsg: 'Using site logo.', target: 'image' },
	{ regex: /product\s*image|woocommerce\s*image/i, property: 'dynamic_image', value: { type: 'products', field: 'featured_media' }, selectionMsg: 'Using product image.', pageMsg: 'Using product image.', target: 'image' },
	{ regex: /product\s*gallery/i, property: 'dynamic_image', value: { type: 'products', field: 'gallery' }, selectionMsg: 'Using product gallery image.', pageMsg: 'Using product gallery image.', target: 'image' },
	{ regex: /acf.*image|custom\s*field.*image/i, property: 'dynamic_image', value: { source: 'acf', field: 'acf' }, selectionMsg: 'Dynamic image enabled.', pageMsg: 'Dynamic image enabled (ACF).', target: 'image' },
	{ regex: /remove.*dynamic|disable.*dynamic/i, property: 'dynamic_image', value: { off: true }, selectionMsg: 'Dynamic content removed.', pageMsg: 'Dynamic content removed.', target: 'image' },
];

export const handleImageUpdate = (block, property, value, prefix, context = {}) => {
	let changes = null;
	const isImage = block?.name?.includes('image');

	if (!isImage) return null;

	// === INTERACTION FLOWS ===
	if (property === 'flow_radius') {
		if (context.radius_value === undefined) {
			return {
				action: 'ask_options',
				target: 'radius_value',
				msg: 'Choose corner style:',
				options: [
					{ label: 'Sharp', value: 0 },
					{ label: 'Subtle (8px)', value: 8 },
					{ label: 'Soft (24px)', value: 24 },
					{ label: 'Full (50px)', value: 50 },
					{ label: 'Circle', value: 50 },
				],
			};
		}

		const r = context.radius_value;
		const unit = r === 50 ? '%' : 'px';

		changes = {
			[`${prefix}border-top-left-radius-general`]: r,
			[`${prefix}border-top-right-radius-general`]: r,
			[`${prefix}border-bottom-right-radius-general`]: r,
			[`${prefix}border-bottom-left-radius-general`]: r,
			[`${prefix}border-sync-radius-general`]: 'all',
			[`${prefix}border-unit-radius-general`]: unit,
		};

		if (r === 50) {
			changes.imageRatio = 'ar11';
		}

		return { action: 'apply', attributes: changes, done: true, message: 'Updated image corners.' };
	}

	if (property === 'flow_border') {
		if (!context.border_color) {
			return { action: 'ask_palette', target: 'border_color', msg: 'Which colour for the border?' };
		}
		if (!context.border_style) {
			return {
				action: 'ask_options',
				target: 'border_style',
				msg: 'Which border style?',
				options: [
					{ label: 'Solid Thin', value: 'solid-1px' },
					{ label: 'Solid Medium', value: 'solid-2px' },
					{ label: 'Solid Thick', value: 'solid-4px' },
					{ label: 'Dashed', value: 'dashed-2px' },
					{ label: 'Dotted', value: 'dotted-2px' },
				],
			};
		}

		const style = context.border_style.split('-')[0];
		const width = parseInt(context.border_style.split('-')[1].replace('px', ''), 10);
		const color = context.border_color;
		const isPalette = typeof color === 'number';
		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

		changes = {};
		breakpoints.forEach(bp => {
			changes[`${prefix}border-style-${bp}`] = style;
			changes[`${prefix}border-top-width-${bp}`] = width;
			changes[`${prefix}border-bottom-width-${bp}`] = width;
			changes[`${prefix}border-left-width-${bp}`] = width;
			changes[`${prefix}border-right-width-${bp}`] = width;
			changes[`${prefix}border-sync-width-${bp}`] = 'all';
			changes[`${prefix}border-unit-width-${bp}`] = 'px';

			if (isPalette) {
				changes[`${prefix}border-palette-status-${bp}`] = true;
				changes[`${prefix}border-palette-color-${bp}`] = color;
			} else {
				changes[`${prefix}border-color-${bp}`] = color;
				changes[`${prefix}border-palette-status-${bp}`] = false;
			}
		});

		return { action: 'apply', attributes: changes, done: true, message: 'Applied border to images.' };
	}

	if (property === 'flow_shadow') {
		if (!context.shadow_color) {
			return { action: 'ask_palette', target: 'shadow_color', msg: 'Which colour for the shadow?' };
		}
		if (!context.shadow_intensity) {
			return {
				action: 'ask_options',
				target: 'shadow_intensity',
				msg: 'Choose intensity:',
				options: [
					{ label: 'Soft', value: 'soft' },
					{ label: 'Crisp', value: 'crisp' },
					{ label: 'Bold', value: 'bold' },
					{ label: 'Glow', value: 'glow' },
				],
			};
		}

		const color = context.shadow_color;
		const intensity = context.shadow_intensity;

		let x = 0;
		let y = 4;
		let blur = 10;
		let spread = 0;
		if (intensity === 'soft') { x = 0; y = 10; blur = 30; spread = 0; }
		if (intensity === 'crisp') { x = 0; y = 2; blur = 4; spread = 0; }
		if (intensity === 'bold') { x = 0; y = 20; blur = 25; spread = -5; }
		if (intensity === 'glow') { x = 0; y = 0; blur = 15; spread = 2; }

		const baseShadow = {
			[`${prefix}box-shadow-status-general`]: true,
			[`${prefix}box-shadow-horizontal-general`]: x,
			[`${prefix}box-shadow-vertical-general`]: y,
			[`${prefix}box-shadow-blur-general`]: blur,
			[`${prefix}box-shadow-spread-general`]: spread,
			[`${prefix}box-shadow-inset-general`]: false,
		};

		const colorAttr = typeof color === 'number'
			? { [`${prefix}box-shadow-palette-status-general`]: true, [`${prefix}box-shadow-palette-color-general`]: color }
			: { [`${prefix}box-shadow-color-general`]: color, [`${prefix}box-shadow-palette-status-general`]: false };

		changes = { ...baseShadow, ...colorAttr };
		return { action: 'apply', attributes: changes, done: true, message: 'Applied shadow to images.' };
	}

	// === STANDARD ACTIONS ===
	switch (property) {
		case 'image_ratio':
			changes = toAspectRatio(value);
			break;
		case 'imageRatio':
			changes = toAspectRatio(String(value));
			break;
		case 'imageRatioCustom':
			changes = { imageRatio: 'custom', imageRatioCustom: String(value) };
			break;

		case 'image_size':
			changes = { imageSize: value };
			break;
		case 'imageSize':
			changes = { imageSize: value };
			break;

		case 'image_full_width':
			changes = { 'image-full-width-general': Boolean(value) };
			break;
		case 'image-full-width':
			changes = { 'image-full-width-general': Boolean(value) };
			break;

		case 'img_width':
			changes = {
				'img-width-general': Number(value),
				'image-full-width-general': Number(value) >= 100,
			};
			break;
		case 'img-width':
			changes = {
				'img-width-general': Number(value),
				'image-full-width-general': Number(value) >= 100,
			};
			break;

		case 'use_init_size':
			changes = { useInitSize: Boolean(value) };
			break;

		case 'image_fit':
			if (value === 'cover') {
				changes = { fitParentSize: true, 'object-size-general': 1.2 };
			} else if (value === 'contain') {
				changes = { fitParentSize: true, 'object-size-general': 1 };
			} else {
				changes = { fitParentSize: false, imageRatio: 'original' };
			}
			break;
		case 'fitParentSize':
			changes = { fitParentSize: Boolean(value) };
			break;

		case 'object_size':
			changes = {
				fitParentSize: true,
				'object-size-general': clamp(Number(value), 1, 5),
			};
			break;
		case 'object-size':
			changes = {
				fitParentSize: true,
				'object-size-general': clamp(Number(value), 1, 5),
			};
			break;

		case 'object_position':
			changes = {
				'object-position-horizontal-general': value?.x ?? 50,
				'object-position-vertical-general': value?.y ?? 50,
			};
			break;
		case 'object-position-horizontal':
			changes = {
				'object-position-horizontal-general': Number(value),
			};
			break;
		case 'object-position-vertical':
			changes = {
				'object-position-vertical-general': Number(value),
			};
			break;

		case 'alignment':
			changes = { 'alignment-general': value };
			break;

		case 'caption_type':
			changes = { captionType: value };
			break;
		case 'captionType':
			changes = { captionType: value };
			break;
		case 'caption_content':
		case 'captionContent':
			changes = { captionType: 'custom', captionContent: String(value) };
			break;

		case 'caption_position':
			changes = { captionPosition: value };
			break;

		case 'caption_gap':
			changes = {
				'caption-gap-general': Number(value),
				'caption-gap-unit-general': 'em',
			};
			break;
		case 'caption-gap':
			changes = {
				'caption-gap-general': Number(value),
				'caption-gap-unit-general': 'em',
			};
			break;

		case 'media_alt':
			changes = {
				altSelector: value === null ? 'none' : 'custom',
				mediaAlt: value,
			};
			break;
		case 'mediaAlt':
			changes = {
				altSelector: value === null ? 'none' : 'custom',
				mediaAlt: value,
			};
			break;

		case 'alt_selector':
			changes = { altSelector: value };
			break;

		case 'media_url':
			changes = {
				mediaURL: value,
				isImageUrl: true,
				isImageUrlInvalid: false,
			};
			break;
		case 'mediaURL':
			changes = {
				mediaURL: value,
				isImageUrl: true,
				isImageUrlInvalid: false,
			};
			break;

		case 'clip_path':
			changes = {
				'clip-path-general': value,
				'clip-path-status-general': value !== 'none',
			};
			break;
		case 'clip-path':
			changes = {
				'clip-path-general': value,
				'clip-path-status-general': value !== 'none',
			};
			break;

		case 'image_filter': {
			const css = value && value !== 'none' ? `filter: ${value};` : '';
			changes = mergeCustomCss(block.attributes, 'image', 'normal', css);
			break;
		}

		case 'hover_basic':
			changes = {
				'hover-type': 'basic',
				'hover-basic-effect-type': value,
				'hover-preview': true,
				...(value === 'zoom-in' && { 'hover-basic-zoom-in-value': 1.2 }),
				...(value === 'zoom-out' && { 'hover-basic-zoom-out-value': 1.2 }),
				...(value === 'rotate' && { 'hover-basic-rotate-value': 15 }),
				...(value === 'slide' && { 'hover-basic-slide-value': 30 }),
				...(value === 'blur' && { 'hover-basic-blur-value': 2 }),
			};
			break;
		case 'hover-basic-effect-type':
			changes = {
				'hover-type': 'basic',
				'hover-basic-effect-type': value,
				'hover-preview': true,
			};
			break;

		case 'hover_off':
			changes = { 'hover-type': 'none' };
			break;

		case 'scroll_effect': {
			if (value?.type === 'off') {
				changes = {
					'scroll-vertical-status-general': false,
					'scroll-horizontal-status-general': false,
					'scroll-rotate-status-general': false,
					'scroll-rotateX-status-general': false,
					'scroll-rotateY-status-general': false,
					'scroll-scale-status-general': false,
					'scroll-scaleX-status-general': false,
					'scroll-scaleY-status-general': false,
					'scroll-fade-status-general': false,
					'scroll-blur-status-general': false,
				};
				break;
			}

			const type = value?.type;
			const defaults = SCROLL_DEFAULTS[type];
			if (type && defaults) {
				changes = {
					[`scroll-${type}-status-general`]: true,
					[`scroll-${type}-zones-general`]: defaults.zones,
				};
				if (defaults.unit) {
					changes[`scroll-${type}-unit-general`] = defaults.unit;
				}
			}
			break;
		}

		case 'dynamic_image': {
			if (value?.off) {
				changes = { 'dc-status': false };
				break;
			}

			if (value?.source === 'acf') {
				changes = {
					'dc-status': true,
					'dc-source': 'acf',
					'dc-acf-field-type': 'image',
				};
				break;
			}

			changes = {
				'dc-status': true,
				'dc-source': 'wp',
				'dc-type': value?.type,
				'dc-field': value?.field,
				'dc-show': 'current',
			};
			break;
		}
	}

	if (!changes && typeof property === 'string' && property.startsWith('dc-')) {
		changes = { [property]: value };
	}

	return changes;
};
