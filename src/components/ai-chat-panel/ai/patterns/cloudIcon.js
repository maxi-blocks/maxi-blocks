export const CLOUD_ICON_PATTERN = {
	regex: /\b(icon|icons)\b.*\b(cloud|library)\b|\b(cloud|library)\b.*\bicon(s)?\b|\b(?:change|swap|replace|use|set|add|insert|make)\b[^.]*\bicons?\b[^.]*\b(?:to|with|as|of|for|called|named)\b\s+[^,.;]+|\bicons?\b\s*(?:to|with|as|of|for|called|named)\b\s+[^,.;]+|\b(?:use|set|add|insert|make|change|swap|replace)\b\s+(?:the\s+|a\s+|an\s+)?[^,.;]+?\s+icons?\b|\b(?:change|swap|replace|use|set|add|insert|make)\b\s+(?:to\s+)?(?:a\s+|an\s+|the\s+)?(?:different|another|alternative|new|other)\s+[^,.;]+|\ball\s+icons?\b|\b(?:theme|style|vibe|look)\b|\bmatch\b[^.]*\b(text|titles?|labels?|headings?)\b[^.]*\bicons?\b|\b(text|titles?|labels?|headings?)\b[^.]*\bmatch\b[^.]*\bicons?\b|\b[^,.;]+\s+icons?\b\s*[.!?]*\s*$/i,
	property: 'cloud_icon',
	value: 'typesense',
	selectionMsg: 'Searching Cloud Library for icons...',
	pageMsg: 'Searching Cloud Library for icons...',
};

