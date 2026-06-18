/**
 * Canonicalize the ordering of CSS rule blocks in a block's generated style string.
 *
 * The editor's style generator emits rules in an order that depends on the current
 * device/base breakpoint, which is derived from the editor canvas width
 * (see `getWinBreakpoint` in src/extensions/store/actions.js). That width differs
 * between environments (e.g. CI headless viewport vs. a local machine), so rules
 * that carry the *same* declaration block — e.g. the background transition targets
 * `> div`, `> div > svg` and `> div > svg *`, which all resolve to the identical
 * `transition: ...` value — can come out in a different but functionally identical
 * order. That makes the background snapshots pass locally yet fail on CI (or vice
 * versa) depending on the breakpoint.
 *
 * This normalizer only reorders rules *within* a maximal run of consecutive rules
 * that share an identical declaration body, sorting them by selector. Because every
 * rule in such a run produces the exact same effect, the reordering is cosmetic and
 * deterministic across environments, while rules with distinct declarations keep
 * their original positions untouched.
 *
 * @param {string} css Generated block style string (flat `selector{decls}` rules).
 * @return {string} CSS with identical-declaration runs in a stable order.
 */
const canonicalizeBlockStyle = css => {
	if (typeof css !== 'string' || !css.includes('{')) return css;

	// Only operate on editor block CSS, never on other snapshot values.
	if (!css.trimStart().startsWith('body')) return css;

	const rules = [];
	let i = 0;
	const n = css.length;

	while (i < n) {
		const open = css.indexOf('{', i);
		if (open === -1) break;

		let depth = 0;
		let close = -1;
		for (let j = open; j < n; j += 1) {
			if (css[j] === '{') depth += 1;
			else if (css[j] === '}') {
				depth -= 1;
				if (depth === 0) {
					close = j;
					break;
				}
			}
		}
		if (close === -1) return css; // Unbalanced braces: leave untouched.

		rules.push({
			selector: css.slice(i, open),
			body: css.slice(open + 1, close),
			raw: css.slice(i, close + 1),
		});
		i = close + 1;
	}

	if (rules.length < 2) return css;

	const out = [];
	let run = [];
	const flushRun = () => {
		run.sort((a, b) => {
			if (a.selector < b.selector) return -1;
			if (a.selector > b.selector) return 1;
			return 0;
		});
		out.push(...run);
		run = [];
	};

	rules.forEach(rule => {
		if (run.length && rule.body === run[0].body) run.push(rule);
		else {
			flushRun();
			run = [rule];
		}
	});
	flushRun();

	return out.map(rule => rule.raw).join('');
};

export default canonicalizeBlockStyle;
