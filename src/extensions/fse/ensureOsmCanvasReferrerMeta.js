/**
 * OpenStreetMap tile CDN returns 403r when Referer is missing. Gutenberg/FSE loads the
 * canvas in iframe[name="editor-canvas"]; that nested document needs an explicit referrer
 * policy. Template part focus vs full template vs reusable editor can use different iframe
 * instances or refresh contentDocument — inject into every editor canvas.
 *
 * @see https://wiki.openstreetmap.org/wiki/Blocked_tiles
 */

const OSM_CANVAS_REFERRER_META_ID = 'maxi-blocks-osm-canvas-referrer';

/**
 * @param {Document | null | undefined} canvasDocument - Nested canvas document (not wp-admin shell).
 */
export function ensureOsmCanvasReferrerMeta(canvasDocument) {
	if (!canvasDocument?.head) {
		return;
	}

	try {
		if (
			typeof window === 'undefined' ||
			canvasDocument === window.document
		) {
			return;
		}
	} catch {
		return;
	}

	if (canvasDocument.getElementById(OSM_CANVAS_REFERRER_META_ID)) {
		return;
	}

	const meta = canvasDocument.createElement('meta');
	meta.id = OSM_CANVAS_REFERRER_META_ID;
	meta.name = 'referrer';
	meta.content = 'no-referrer-when-downgrade';
	canvasDocument.head.prepend(meta);
}

/**
 * Applies {@link ensureOsmCanvasReferrerMeta} to every in-page block editor canvas iframe.
 */
export function ensureOsmReferrerMetaInAllEditorCanvasIframes() {
	if (typeof document === 'undefined') {
		return;
	}

	document.querySelectorAll('iframe[name="editor-canvas"]').forEach(iframe => {
		try {
			ensureOsmCanvasReferrerMeta(iframe.contentDocument);
		} catch {
			// Cross-origin or document not ready.
		}
	});
}
