/**
 * Editor-only bisect switches. Flags can survive a full reload via sessionStorage (Maps and
 * other runtime state live on `window.__MAXI_BISECT_RUNTIME`).
 *
 * @example Persist across reload (recommended)
 * sessionStorage.setItem(
 *   '__MAXI_BISECT',
 *   JSON.stringify({ freezeBlockTreeSelect: true })
 * );
 * location.reload();
 *
 * @example Same tab, no reload
 * window.__MAXI_BISECT = { freezeBlockTreeSelect: true };
 *
 * @example Clear everything
 * sessionStorage.removeItem('__MAXI_BISECT');
 * delete window.__MAXI_BISECT;
 * delete window.__MAXI_BISECT_RUNTIME;
 *
 * Flags (try one at a time):
 * - freezeBlockTreeSelect — first `useSelect` snapshot of order|index|root per clientId,
 *   then return it without touching `core/block-editor` again. If the extra rerender stops,
 *   the culprit is block-store subscription / this hook path.
 * - freezeMaxiUiSelect — same for device|breakpoint from `maxiBlocks`.
 * - alwaysSkipOwnPropsMemo — `withMaxiProps` outer `memo` always treats Core props as equal.
 * - freezeRowContextValue — row-maxi: Provider `value` frozen to first computed value.
 * - freezeRowInnerBlocksSettings — row-maxi: first innerBlocks settings object kept.
 * - maxiBlockMemoAlwaysEqual — `MaxiBlock` memo always skips.
 * - disableInnerBlocksPropsStability — skip reuse of `useInnerBlocksProps` output in
 *   `innerBlocksBlock.js` (for A/B against the default stabilization).
 *
 * If every flag above is on and you still see churn, the update is almost certainly not
 * from `withMaxiProps` / row context / `MaxiBlock` memo — it is from `useInnerBlocksProps`
 * (and similar block-editor hooks) inside `InnerBlocksBlock`, which subscribe on their own.
 */

let didLogBisectKeys = false;

/**
 * Maps / cached strings for bisect (not JSON-serializable). Survives reload if you only
 * change boolean flags in sessionStorage — runtime object is recreated empty on reload.
 *
 * @returns {Record<string, unknown>}
 */
export function getMaxiBisectRuntime() {
	if (typeof window === 'undefined') {
		return {};
	}
	if (!window.__MAXI_BISECT_RUNTIME) {
		window.__MAXI_BISECT_RUNTIME = {};
	}
	return window.__MAXI_BISECT_RUNTIME;
}

/**
 * Merges `sessionStorage.__MAXI_BISECT` (JSON) with `window.__MAXI_BISECT` (object).
 * Window wins on key conflicts. Use only JSON-safe values in sessionStorage.
 *
 * @returns {Record<string, unknown>|null}
 */
export function getMaxiBisect() {
	if (typeof window === 'undefined') {
		return null;
	}

	let fromStorage = {};
	try {
		const raw = sessionStorage.getItem('__MAXI_BISECT');
		if (raw) {
			fromStorage = JSON.parse(raw);
		}
	} catch (e) {
		console.warn(
			'MaxiBlocks: invalid sessionStorage __MAXI_BISECT JSON — ' +
				JSON.stringify(String(e?.message || e))
		);
	}

	const fromWindow =
		window.__MAXI_BISECT && typeof window.__MAXI_BISECT === 'object'
			? window.__MAXI_BISECT
			: {};

	const merged = { ...fromStorage, ...fromWindow };
	const keys = Object.keys(merged).filter(k => !!merged[k]);
	if (!keys.length) {
		return null;
	}

	if (!didLogBisectKeys && typeof console !== 'undefined') {
		didLogBisectKeys = true;
		const sources = [];
		if (Object.keys(fromStorage).length) {
			sources.push('sessionStorage');
		}
		if (Object.keys(fromWindow).length) {
			sources.push('window.__MAXI_BISECT');
		}
		console.info(
			'MaxiBlocks __MAXI_BISECT active: ' +
				JSON.stringify(keys) +
				' (' +
				sources.join(' + ') +
				')'
		);
	}

	return merged;
}
