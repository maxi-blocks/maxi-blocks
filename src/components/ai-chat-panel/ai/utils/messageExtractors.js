/**
 * Message Extractors
 *
 * Pure utility functions for extracting structured values from natural-language
 * user messages. No React state dependencies — safe to import anywhere.
 */

export const HEX_COLOR_REGEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/;

export const extractHexColor = message => {
	if (!message) return null;
	const match = message.match(HEX_COLOR_REGEX);
	return match ? match[0] : null;
};

export const extractQuotedText = message => {
	if (!message) return null;
	const match = message.match(/["']([^"']+)["']/);
	return match ? match[1].trim() : null;
};

export const extractUrl = message => {
	if (!message) return null;
	const match = message.match(/https?:\/\/[^\s"'<>]+/i);
	if (match) return match[0];
	const wwwMatch = message.match(/\bwww\.[^\s"'<>]+/i);
	if (wwwMatch) return `https://${wwwMatch[0]}`;
	const relativeMatch = message.match(/(?:to|link)\s+(\/[^\s"'<>]+)/i);
	if (relativeMatch) return relativeMatch[1];
	return null;
};

export const extractValueFromPatterns = (message, patterns) => {
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) return match[1].trim();
	}
	return null;
};

export const extractNumericValue = (message, patterns) => {
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (Number.isFinite(num)) return num;
		}
	}
	return null;
};

export const getSpacingIntent = (message = '') => {
	const lower = String(message || '').toLowerCase();
	if (!/(padding|margin)/.test(lower)) return null;

	const baseMatch = lower.match(/\b(padding|margin)\b/);
	if (!baseMatch) return null;

	const sidePattern = /\b(padding|margin)\b[\s-]*(top|right|bottom|left)\b|\b(top|right|bottom|left)\b[\s-]*(padding|margin)\b/;
	const sideMatch = lower.match(sidePattern);
	const base = sideMatch ? (sideMatch[1] || sideMatch[4]) : baseMatch[1];
	const side = sideMatch ? (sideMatch[2] || sideMatch[3]) : null;

	return { base, side };
};

export const parseRemoveSpacingRequest = (message = '') => {
	const lower = String(message || '').toLowerCase();
	if (!/(padding|margin)/.test(lower)) return null;

	const removeMatch = /\b(remove|clear|reset|delete|unset|none|zero)\b/.test(lower)
		|| /\bno\s+(padding|margin)\b/.test(lower)
		|| /\bwithout\s+(padding|margin)\b/.test(lower);

	if (!removeMatch) return null;

	const intent = getSpacingIntent(message);
	if (!intent) return null;

	const property = intent.side ? `${intent.base}_${intent.side}` : intent.base;
	return { property, value: '0px' };
};

export const parseNumericSpacingRequest = (message = '') => {
	const spacingIntent = getSpacingIntent(message);
	if (!spacingIntent) return null;

	const numberMatch = String(message || '').toLowerCase().match(/(-?\d+(?:\.\d+)?)\s*(px|%|em|rem|vh|vw)?/);
	if (!numberMatch) return null;

	const value = numberMatch[1];
	const unit = numberMatch[2] || 'px';
	const property = spacingIntent.side
		? `${spacingIntent.base}_${spacingIntent.side}`
		: spacingIntent.base;

	return { property, value: `${value}${unit}` };
};

export const detectSpacingTarget = (message = '') => {
	const lower = String(message || '').toLowerCase();
	if (lower.includes('video')) return 'video';
	if (lower.includes('image') || lower.includes('photo') || lower.includes('picture')) return 'image';
	if (lower.includes('button')) return 'button';
	if (lower.includes('text') || lower.includes('heading')) return 'text';
	if (lower.includes('column')) return 'column';
	if (lower.includes('row')) return 'row';
	if (lower.includes('group')) return 'group';
	if (lower.includes('container') || lower.includes('section')) return 'container';
	return null;
};

export const extractButtonText = message => {
	const quoted = extractQuotedText(message);
	if (quoted) return quoted;
	return extractValueFromPatterns(message, [
		/(?:button\s*)?(?:text|label|copy|content)\s*(?:to|=|is|:)\s*(.+)$/i,
		/(?:button\s*)?(?:text|label|copy|content)\s+(?!colou?r\b)(.+)$/i,
		/(?:rename|change)\s*button\s*(?:to|as)\s*(.+)$/i,
		/(?:button\s*)?(?:says|say|reads)\s*(.+)$/i,
	]);
};

export const extractCaptionText = message => {
	const quoted = extractQuotedText(message);
	if (quoted) return quoted;
	return extractValueFromPatterns(message, [
		/(?:caption|description)\s*(?:to|=|is|:)\s*(.+)$/i,
	]);
};

export const extractAltText = message => {
	const quoted = extractQuotedText(message);
	if (quoted) return quoted;
	return extractValueFromPatterns(message, [
		/(?:alt\s*text|alt)\s*(?:to|=|is|:)\s*(.+)$/i,
	]);
};

export const extractIconAltTitle = message => {
	const quoted = extractQuotedText(message);
	if (quoted) return quoted;
	return extractValueFromPatterns(message, [
		/(?:alt\s*title|icon\s*title|svg\s*title|title\s*tag)\s*(?:to|=|is|:)\s*(.+)$/i,
	]);
};

export const extractIconAltDescription = message => {
	const quoted = extractQuotedText(message);
	if (quoted) return quoted;
	return extractValueFromPatterns(message, [
		/(?:alt\s*(?:description|desc)|icon\s*(?:description|desc)|svg\s*(?:description|desc)|description)\s*(?:to|=|is|:)\s*(.+)$/i,
	]);
};

export const extractColumnSize = message => {
	if (!message) return null;
	const percentMatch = message.match(
		/(\d+(?:\.\d+)?)\s*(%|percent|percentage)\b/i
	);
	if (percentMatch) {
		const numeric = Number(percentMatch[1]);
		return Number.isFinite(numeric) ? numeric : null;
	}
	const columnMatch = message.match(
		/\bcolumn\b.*\b(?:width|size)\b.*?(\d+(?:\.\d+)?)/i
	);
	if (columnMatch) {
		const numeric = Number(columnMatch[1]);
		return Number.isFinite(numeric) ? numeric : null;
	}
	return null;
};

export const extractDividerValue = message => {
	if (!message) return null;
	const percentMatch = message.match(
		/(-?\d+(?:\.\d+)?)\s*(%|percent|percentage)\b/i
	);
	if (percentMatch) return `${percentMatch[1]}%`;

	const unitMatch = message.match(
		/(-?\d+(?:\.\d+)?)\s*(px|em|rem|vw)\b/i
	);
	if (unitMatch) return `${unitMatch[1]}${unitMatch[2]}`;

	const numericMatch = message.match(/(-?\d+(?:\.\d+)?)/);
	if (numericMatch) return Number(numericMatch[1]);
	return null;
};

export const extractNumberCounterRangeValue = message => {
	if (!message) return null;

	const fromToMatch = message.match(
		/\bfrom\b\s*(-?\d+(?:\.\d+)?)\b.*\bto\b\s*(-?\d+(?:\.\d+)?)\b/i
	);
	if (fromToMatch) {
		return { start: Number(fromToMatch[1]), end: Number(fromToMatch[2]) };
	}

	const startEndMatch = message.match(
		/\bstart(?:ing)?\s*(?:number|value)?\b.*?(-?\d+(?:\.\d+)?)\b.*\bend(?:ing)?\s*(?:number|value)?\b.*?(-?\d+(?:\.\d+)?)\b/i
	);
	if (startEndMatch) {
		return { start: Number(startEndMatch[1]), end: Number(startEndMatch[2]) };
	}

	return null;
};

export const extractNumberCounterStartValue = message =>
	extractNumericValue(message, [
		/\bstart(?:ing)?\s*(?:number|value)?\b\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		/\bfrom\b\s*(-?\d+(?:\.\d+)?)/i,
	]);

export const extractNumberCounterEndValue = message =>
	extractNumericValue(message, [
		/\bend(?:ing)?\s*(?:number|value)?\b\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		/\bto\b\s*(-?\d+(?:\.\d+)?)/i,
	]);

export const extractNumberCounterDurationValue = message => {
	const secondsMatch = message.match(
		/\b(-?\d+(?:\.\d+)?)\s*(?:s|sec|secs|second|seconds)\b/i
	);
	if (secondsMatch) return Number(secondsMatch[1]);
	return extractNumericValue(message, [
		/\bduration\b\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
	]);
};

export const extractNumberCounterStrokeValue = message =>
	extractNumericValue(message, [
		/\bstroke(?:\s*width)?\b\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		/\bthickness\b\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		/\bline\s*width\b\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
	]);

export const extractNumberCounterStartOffsetValue = message =>
	extractNumericValue(message, [
		/\boffset\b\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?)/i,
	]);

export const extractNumberCounterTitleFontSizeValue = message =>
	extractNumericValue(message, [
		/\btitle\b.*\b(?:font\s*)?size\b\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
	]);

export const extractNumberCounterTextColorValue = message => {
	const hex = extractHexColor(message);
	if (hex) return hex;
	const varMatch = String(message || '').match(/var\(--[^)]+\)/i);
	if (varMatch) return varMatch[0];
	const paletteMatch = String(message || '').match(/\bpalette\s*([1-8])\b/i);
	if (paletteMatch) return Number(paletteMatch[1]);
	const colorNumberMatch = String(message || '').match(/\bcolou?r\s*([1-8])\b/i);
	if (colorNumberMatch) return Number(colorNumberMatch[1]);
	return null;
};

export const resolveImageRatioValue = (width, height) => {
	const ratioKey = `${width}/${height}`;
	const ratioMap = {
		'1/1': 'ar11',
		'4/3': 'ar43',
		'16/9': 'ar169',
		'3/2': 'ar32',
		'2/3': 'ar23',
		'9/16': 'custom:9/16',
		'4/5': 'custom:4/5',
		'5/4': 'custom:5/4',
	};

	return ratioMap[ratioKey] || `custom:${ratioKey}`;
};

export const resolvePromptValue = (property, message) => {
	if (!message) return null;
	switch (property) {
		case 'button_text':
			return extractButtonText(message);
		case 'captionContent':
			return extractCaptionText(message);
		case 'mediaAlt':
			return extractAltText(message);
		case 'altTitle':
			return extractIconAltTitle(message);
		case 'altDescription':
			return extractIconAltDescription(message);
		case 'button_url':
		case 'mediaURL':
			return extractUrl(message);
		case 'column_size':
			return extractColumnSize(message);
		case 'divider_weight':
		case 'divider_size':
			return extractDividerValue(message);
		case 'number_counter_range':
			return extractNumberCounterRangeValue(message);
		case 'number_counter_start':
			return extractNumberCounterStartValue(message);
		case 'number_counter_end':
			return extractNumberCounterEndValue(message);
		case 'number_counter_duration':
			return extractNumberCounterDurationValue(message);
		case 'number_counter_stroke':
			return extractNumberCounterStrokeValue(message);
		case 'number_counter_start_offset':
			return extractNumberCounterStartOffsetValue(message);
		case 'number_counter_title_font_size':
			return extractNumberCounterTitleFontSizeValue(message);
		case 'number_counter_text_color':
			return extractNumberCounterTextColorValue(message);
		default:
			return null;
	}
};
