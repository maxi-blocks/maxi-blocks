/**
 * Official JS interface for Maxi AI (and any automation) to drive the Cloud Library modal.
 *
 * Same DOM a user interacts with; selectors live here and must be updated when Cloud Library
 * markup changes (same team owns both).
 *
 * Entry points:
 * - `executeCloudModalUiOps(ops, deps)` — ordered op list (what the LLM emits as CLOUD_MODAL_UI).
 * - Named exports below — imperative calls from code.
 * - `window.maxiAiCloudModal` — full surface for devtools / manual checks.
 */

/**
 * @typedef {Object} CloudModalOp
 * @property {string} op Operation name (see executeCloudModalUiOps).
 */

/** @type {readonly string[]} Keep in sync with `executeCloudModalUiOps` switch + system prompt. */
export const MAXI_AI_CLOUD_MODAL_OP_NAMES = Object.freeze( [
	'wait_ms',
	'ensure_open',
	'open_placeholder',
	'set_search',
	'clear_search',
	'gutenberg_type',
	'cost_filter',
	'light_dark',
	'clear_filters',
	'category_contains',
	'click_first_insert',
] );

const MODAL_ID = 'maxi-modal';
const PATTERNS_ROOT = '.maxi-cloud-container__patterns';
const TOP_MENU = '.maxi-cloud-container__patterns__top-menu';
const SIDEBAR = '.maxi-cloud-container__patterns__sidebar';
const COST_WRAP = '.maxi-cloud-container__content-patterns__cost';
const FIRST_INSERT_SELECTOR =
	'.maxi-cloud-container__patterns__content-patterns .ais-InfiniteHits-list button.maxi-cloud-masonry-card__button-load';
/** InstantSearch Stats in the patterns hits column (same scope as InfiniteHits). */
const PATTERNS_HITS_STATS = '.maxi-cloud-container__patterns__content-patterns .ais-Stats';

/**
 * Patterns InstantSearch lives under Cloud Library. `@wordpress/components` Modal often
 * portals content outside `#maxi-modal`, so we must not only look under the overlay node.
 *
 * @param {HTMLElement|null} modalHint `#maxi-modal` or null (global discover).
 * @returns {HTMLElement|null}
 */
export const getCloudPatternsPanelRoot = modalHint => {
	if ( typeof document === 'undefined' ) {
		return null;
	}
	const underHint = modalHint?.querySelector?.( PATTERNS_ROOT );
	if ( underHint ) {
		return underHint;
	}
	const underMaxiId = document.querySelector( `#${ MODAL_ID } ${ PATTERNS_ROOT }` );
	if ( underMaxiId ) {
		return underMaxiId;
	}
	const underLibraryShell = document.querySelector(
		`.maxi-library-modal ${ PATTERNS_ROOT }`
	);
	if ( underLibraryShell ) {
		return underLibraryShell;
	}
	const underWpModal = document.querySelector(
		`.components-modal__frame ${ PATTERNS_ROOT }, [role="dialog"] ${ PATTERNS_ROOT }`
	);
	if ( underWpModal ) {
		return underWpModal;
	}
	return document.querySelector( PATTERNS_ROOT );
};

/**
 * Reads nbHits from the patterns content Stats widget (`strong` holds a locale-formatted integer).
 *
 * @param {HTMLElement|null} modalHint
 * @returns {number|null} Null if the Stats node or parseable count is missing.
 */
export const parsePatternsStatsHitCount = modalHint => {
	const panel = getCloudPatternsPanelRoot( modalHint );
	const statsRoot = panel?.querySelector( PATTERNS_HITS_STATS );
	const strong = statsRoot?.querySelector( 'strong' );
	const raw = strong?.textContent?.trim() || '';
	if ( ! raw ) {
		return null;
	}
	const digitsOnly = raw.replace( /[^\d]/g, '' );
	if ( digitsOnly === '' ) {
		return null;
	}
	const n = parseInt( digitsOnly, 10 );
	return Number.isFinite( n ) ? n : null;
};

/**
 * Clicks the WordPress modal close control for the Cloud Library (same as the user).
 *
 * @returns {boolean} True if a close control was clicked.
 */
export const closeCloudLibraryModal = () => {
	if ( typeof document === 'undefined' ) {
		return false;
	}
	const frames = [
		document.querySelector(
			'.components-modal__frame.maxi-library-modal'
		),
		document.querySelector( '.maxi-library-modal.components-modal__frame' ),
		document.querySelector( '.maxi-library-modal' ),
	].filter( Boolean );
	for ( const frame of frames ) {
		const direct =
			frame.querySelector( 'button.components-modal__header-close' ) ||
			frame.querySelector(
				'.components-modal__header button[aria-label="Close"]'
			);
		if ( direct && ! direct.disabled ) {
			direct.click();
			return true;
		}
		const headerButtons = frame.querySelectorAll(
			'.components-modal__header button'
		);
		for ( const btn of headerButtons ) {
			const al = btn.getAttribute( 'aria-label' ) || '';
			if ( /close/i.test( al ) && ! btn.disabled ) {
				btn.click();
				return true;
			}
		}
	}
	return false;
};

/**
 * After InstantSearch updates, confirm zero hits: two reads of 0 spaced apart, only after a
 * minimum delay from the last set_search so we do not read stale Stats.
 *
 * @param {HTMLElement|null} modalHint
 * @param {number}           searchSetAtMs `Date.now()` when `set_search` ran in this op batch.
 * @param {number}           [maxWaitMs=9000]
 * @returns {Promise<boolean>} True when zero hits are confirmed.
 */
const waitForConfirmedZeroHitsAfterSearch = async (
	modalHint,
	searchSetAtMs,
	maxWaitMs = 9000
) => {
	const deadline = Date.now() + maxWaitMs;
	const minDelayMs = 2000;
	while ( Date.now() < deadline ) {
		const sinceSearch = Date.now() - searchSetAtMs;
		if ( sinceSearch < minDelayMs ) {
			await sleep( minDelayMs - sinceSearch );
		}
		const n = parsePatternsStatsHitCount( modalHint );
		if ( n === null ) {
			await sleep( 120 );
			continue;
		}
		if ( n > 0 ) {
			return false;
		}
		if ( n === 0 ) {
			await sleep( 320 );
			const n2 = parsePatternsStatsHitCount( modalHint );
			if ( n2 === 0 ) {
				return true;
			}
			if ( n2 !== null && n2 > 0 ) {
				return false;
			}
		}
		await sleep( 120 );
	}
	return false;
};

/**
 * @param {HTMLElement|null} panel
 * @returns {HTMLInputElement|null}
 */
const findPatternsSearchInputInPanel = panel => {
	if ( ! panel ) {
		return null;
	}
	const selectors = [
		'.ais-SearchBox-input',
		'.ais-SearchBox input[type="search"]',
		'.ais-SearchBox input[type="text"]',
		'form.ais-SearchBox-form input',
		`${ SIDEBAR } input[type="search"]`,
		`${ SIDEBAR } .ais-SearchBox input`,
	];
	for ( const sel of selectors ) {
		const el = panel.querySelector( sel );
		if ( el && el.tagName === 'INPUT' ) {
			return el;
		}
	}
	return null;
};

/**
 * @param {HTMLElement|null} modalHint
 * @param {number}           [timeoutMs=6000]
 * @returns {Promise<HTMLInputElement|null>}
 */
export const waitForPatternsSearchInput = async (
	modalHint,
	timeoutMs = 6000
) => {
	const start = Date.now();
	while ( Date.now() - start < timeoutMs ) {
		const input = findPatternsSearchInputInPanel(
			getCloudPatternsPanelRoot( modalHint )
		);
		if ( input ) {
			return input;
		}
		await sleep( 50 );
	}
	return null;
};

/**
 * @returns {HTMLElement|null}
 */
export const getMaxiCloudModalRoot = () =>
	typeof document !== 'undefined'
		? document.getElementById( MODAL_ID )
		: null;

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = ms =>
	new Promise( resolve => {
		setTimeout( resolve, ms );
	} );

/**
 * React 16+ controlled inputs: set native value + dispatch input.
 *
 * @param {HTMLInputElement} input
 * @param {string}          value
 * @returns {void}
 */
export const setReactInputValue = ( input, value ) => {
	if ( ! input || input.tagName !== 'INPUT' ) {
		return;
	}
	const desc = Object.getOwnPropertyDescriptor(
		HTMLInputElement.prototype,
		'value'
	);
	if ( desc?.set ) {
		desc.set.call( input, value );
	} else {
		input.value = value;
	}
	input.dispatchEvent( new Event( 'input', { bubbles: true } ) );
	input.dispatchEvent( new Event( 'change', { bubbles: true } ) );
};

/**
 * @param {string} text
 * @returns {string}
 */
const normLabel = text =>
	String( text || '' )
		.replace( /\s+/g, ' ' )
		.trim()
		.toLowerCase();

/**
 * Case- and accent-insensitive comparison for menu labels (InstantSearch Menu + translated strings).
 *
 * @param {string} labelNorm Output of normLabel().
 * @param {string} wantNorm  Output of normLabel() for the wanted English menu value (e.g. "pages").
 * @returns {boolean}
 */
const accentInsensitiveIncludes = ( labelNorm, wantNorm ) => {
	if ( ! labelNorm || ! wantNorm ) {
		return false;
	}
	try {
		const fold = s =>
			String( s )
				.normalize( 'NFD' )
				.replace( /\p{M}+/gu, '' );
		const lf = fold( labelNorm ).toLowerCase();
		const wf = fold( wantNorm ).toLowerCase();
		return (
			lf.includes( wf ) ||
			wf.includes( lf.slice( 0, Math.min( 8, lf.length ) ) )
		);
	} catch ( _e ) {
		return (
			labelNorm.includes( wantNorm ) ||
			wantNorm.includes( labelNorm.slice( 0, 8 ) )
		);
	}
};

/**
 * Waits until the Patterns InstantSearch top menu has rendered facet links (Typesense can lag after open).
 *
 * @param {HTMLElement|null} modalHint
 * @param {number}           [minLinks=2]
 * @param {number}           [timeoutMs=10000]
 * @returns {Promise<HTMLElement|null>} The top-menu container, or null.
 */
const waitForPatternsTopMenuContainer = async (
	modalHint,
	minLinks = 2,
	timeoutMs = 10000
) => {
	const start = Date.now();
	while ( Date.now() - start < timeoutMs ) {
		const panel = getCloudPatternsPanelRoot( modalHint );
		const container = panel?.querySelector?.( TOP_MENU );
		if ( container ) {
			const anchors = container.querySelectorAll(
				'.ais-Menu-item a, a.ais-Menu-link'
			);
			if ( anchors.length >= minLinks ) {
				return container;
			}
		}
		await sleep( 50 );
	}
	return null;
};

/**
 * @param {HTMLElement} container Top menu element (see TOP_MENU).
 * @param {string}      wanted    English facet label from the index (e.g. Pages, Patterns).
 * @returns {boolean}
 */
const clickMenuLinkByWantedLabel = ( container, wanted ) => {
	if ( ! container || ! wanted ) {
		return false;
	}
	const want = normLabel( wanted );
	const wantRaw = String( wanted ).trim();
	const links = container.querySelectorAll(
		'.ais-Menu-item a, a.ais-Menu-link'
	);
	for ( const a of links ) {
		const href = a.getAttribute( 'href' ) || '';
		if (
			wantRaw &&
			( href.includes( wantRaw ) ||
				href.includes( encodeURIComponent( wantRaw ) ) )
		) {
			a.click();
			return true;
		}
		const label = normLabel( a.textContent || '' ).replace( /\d+/g, '' );
		if (
			label.includes( want ) ||
			want.includes( label.slice( 0, 8 ) ) ||
			accentInsensitiveIncludes( label, want )
		) {
			a.click();
			return true;
		}
	}
	return false;
};

/**
 * @param {ParentNode|null} root
 * @param {string}          selector
 * @param {number}          timeoutMs
 * @returns {Promise<Element|null>}
 */
export const waitForElement = async ( root, selector, timeoutMs = 4000 ) => {
	const start = Date.now();
	while ( Date.now() - start < timeoutMs ) {
		const el = root?.querySelector?.( selector ) || document.querySelector( selector );
		if ( el ) {
			return el;
		}
		await sleep( 50 );
	}
	return null;
};

/**
 * @returns {boolean}
 */
export const isCloudModalVisible = () => {
	const el = getMaxiCloudModalRoot();
	return Boolean( el && el.offsetParent !== null );
};

/**
 * Clicks the Cloud library placeholder button (opens overlay if closed).
 *
 * @returns {boolean} True if a button was clicked.
 */
export const clickOpenCloudPlaceholder = () => {
	if ( typeof document === 'undefined' ) {
		return false;
	}
	const selectors = [
		'.maxi-block-library__placeholder button.components-button',
		'.maxi-block-library__modal-button__placeholder',
		'.maxi-block-library__placeholder .maxi-block-library__modal-button__placeholder',
	];
	for ( const sel of selectors ) {
		const btn = document.querySelector( sel );
		if ( btn && ! btn.disabled ) {
			btn.click();
			return true;
		}
	}
	return false;
};

/**
 * @param {HTMLElement|null} modalHint
 * @returns {HTMLInputElement|null}
 */
export const getPatternsSearchInput = modalHint =>
	findPatternsSearchInputInPanel( getCloudPatternsPanelRoot( modalHint ) );

/**
 * @param {HTMLElement|null} modalHint
 * @param {string}          text
 * @returns {boolean}
 */
export const setPatternsSearchText = ( modalHint, text ) => {
	const input = getPatternsSearchInput( modalHint );
	if ( ! input ) {
		return false;
	}
	setReactInputValue( input, String( text ?? '' ) );
	input.focus();
	return true;
};

/**
 * Uses current `#maxi-modal` hint (panel may be portaled elsewhere).
 *
 * @param {string} text
 * @returns {boolean}
 */
export const setPatternsSearchUsingOpenModal = text => {
	const modal = getMaxiCloudModalRoot();
	return setPatternsSearchText( modal, text );
};

/**
 * Clicks an InstantSearch Menu link inside `container` whose label matches `wanted` (English or translated substring).
 *
 * @param {HTMLElement|null} modalHint
 * @param {string}           containerSelector Relative to patterns panel (e.g. TOP_MENU).
 * @param {string}           wanted
 * @returns {boolean}
 */
export const clickInstantSearchMenuLabel = (
	modalHint,
	containerSelector,
	wanted
) => {
	const panel = getCloudPatternsPanelRoot( modalHint );
	const container = panel?.querySelector( containerSelector );
	if ( ! container ) {
		return false;
	}
	return clickMenuLinkByWantedLabel( container, wanted );
};

/**
 * Cost row: All | Free | Pro (third label may be "Cloud" for Pro in UI).
 *
 * @param {HTMLElement|null} modal
 * @param {'all'|'free'|'pro'} which
 * @returns {boolean}
 */
export const clickCostFilterButton = ( modalHint, which ) => {
	const panel = getCloudPatternsPanelRoot( modalHint );
	const wrap = panel?.querySelector( COST_WRAP );
	const buttons = wrap?.querySelectorAll( '.top-Menu button' );
	if ( ! buttons?.length ) {
		return false;
	}
	const w = String( which ).toLowerCase();
	const idx =
		w === 'all' ? 0 : w === 'free' ? 1 : w === 'pro' || w === 'cloud' ? 2 : -1;
	if ( idx < 0 || ! buttons[ idx ] ) {
		return false;
	}
	buttons[ idx ].click();
	return true;
};

/**
 * Light / Dark refinement menu (first `.ais-Menu` in patterns sidebar after cost buttons).
 *
 * @param {HTMLElement|null} modal
 * @param {'light'|'dark'}   which
 * @returns {boolean}
 */
export const clickLightOrDarkMenu = ( modalHint, which ) => {
	const panel = getCloudPatternsPanelRoot( modalHint );
	const sidebar = panel?.querySelector( SIDEBAR );
	if ( ! sidebar ) {
		return false;
	}
	const menus = sidebar.querySelectorAll( '.ais-Menu' );
	const menu = menus[ 0 ];
	if ( ! menu ) {
		return false;
	}
	const want = normLabel( which );
	const links = menu.querySelectorAll( '.ais-Menu-item a, a.ais-Menu-link' );
	for ( const a of links ) {
		const label = normLabel( a.textContent || '' );
		if ( label.includes( want ) ) {
			a.click();
			return true;
		}
	}
	return false;
};

/**
 * Clicks "Clear filters" in the patterns sidebar (same behaviour as the UI button).
 *
 * @param {HTMLElement|null} modal
 * @returns {boolean}
 */
export const clickClearPatternFilters = modalHint => {
	const panel = getCloudPatternsPanelRoot( modalHint );
	const btn = panel?.querySelector(
		`${ SIDEBAR } .ais-ClearRefinements-button`
	);
	if ( ! btn ) {
		return false;
	}
	btn.click();
	return true;
};

/**
 * Hierarchical category: first link whose text contains `fragment`.
 *
 * @param {HTMLElement|null} modal
 * @param {string}           fragment
 * @returns {boolean}
 */
export const clickCategoryContaining = ( modalHint, fragment ) => {
	if ( ! fragment ) {
		return false;
	}
	const panel = getCloudPatternsPanelRoot( modalHint );
	const want = normLabel( fragment );
	const links = panel?.querySelectorAll(
		`${ SIDEBAR } .ais-HierarchicalMenu-item a`
	) || [];
	for ( const a of links ) {
		if ( normLabel( a.textContent || '' ).includes( want ) ) {
			a.click();
			return true;
		}
	}
	return false;
};

/**
 * gutenberg_type top menu: Patterns | Blocks | Pages | Playground | Theme (English values in index).
 * Waits for InstantSearch to render menu links — otherwise the first op often runs against an empty list.
 *
 * @param {HTMLElement|null} modal
 * @param {string}           value
 * @returns {Promise<boolean>}
 */
export async function clickGutenbergType( modal, value ) {
	const container = await waitForPatternsTopMenuContainer( modal, 2, 10000 );
	if ( ! container ) {
		return false;
	}
	return clickMenuLinkByWantedLabel( container, value );
}

/**
 * First visible **Insert** on a pattern hit (skips disabled / hidden). Waits for InfiniteHits.
 *
 * @param {HTMLElement|null} modalHint
 * @param {number}           [timeoutMs=12000]
 * @returns {Promise<HTMLButtonElement|null>}
 */
export const waitForFirstPatternInsertButton = async (
	modalHint,
	timeoutMs = 12000
) => {
	const start = Date.now();
	while ( Date.now() - start < timeoutMs ) {
		const panel = getCloudPatternsPanelRoot( modalHint );
		const buttons = panel?.querySelectorAll( FIRST_INSERT_SELECTOR );
		if ( buttons?.length ) {
			for ( const btn of buttons ) {
				if (
					btn.offsetParent !== null &&
					! btn.disabled &&
					! btn.classList.contains(
						'maxi-cloud-masonry-card__button-go-pro'
					)
				) {
					return btn;
				}
			}
		}
		await sleep( 75 );
	}
	return null;
};

/**
 * Clicks the first insertable pattern result’s Insert button.
 *
 * @param {HTMLElement|null} modalHint
 * @param {number}           [timeoutMs=12000]
 * @returns {Promise<boolean>}
 */
export const clickFirstPatternInsert = async (
	modalHint,
	timeoutMs = 12000
) => {
	const btn = await waitForFirstPatternInsertButton(
		modalHint,
		timeoutMs
	);
	if ( ! btn ) {
		return false;
	}
	try {
		btn.scrollIntoView( {
			block: 'center',
			inline: 'nearest',
			behavior: 'auto',
		} );
	} catch ( _scrollErr ) {
		// scrollIntoView can throw in edge DOM cases; click may still work.
	}
	await sleep( 150 );
	btn.click();
	return true;
};

/**
 * Runs a sequence of Cloud modal operations (for AI / automation).
 *
 * Ops:
 * - `{ op: "wait_ms", ms: number }`
 * - `{ op: "ensure_open" }` — insert cloud block (callback) + open placeholder if needed
 * - `{ op: "open_placeholder" }` — click Cloud library button only
 * - `{ op: "set_search", text: string }`
 * - `{ op: "clear_search" }` — empty search field
 * - `{ op: "gutenberg_type", value: string }` — e.g. Pages, Patterns, Blocks
 * - `{ op: "cost_filter", value: "all"|"free"|"pro" }`
 * - `{ op: "light_dark", value: "light"|"dark" }`
 * - `{ op: "clear_filters" }`
 * - `{ op: "category_contains", text: string }` — hierarchical category link
 * - `{ op: "click_first_insert" }` — after `set_search`, reads InstantSearch **Stats** in the hits column; if hit count is **0**, closes the Cloud modal and returns `{ outcome: "zero_hits" }` instead of inserting.
 *
 * @param {Array<CloudModalOp & Record<string, *>>} ops
 * @param {Object}                                 deps
 * @param {() => void | Promise<void>}             [deps.insertCloudBlock] Inserts or reopens maxi-cloud (e.g. insertMaxiCloudLibraryBlock).
 * @param {(msg: string) => void}                  [deps.logDebug]
 * @returns {Promise<{ ok: boolean, message: string, lastError?: string, outcome?: string }>}
 */
export async function executeCloudModalUiOps( ops, deps = {} ) {
	const { insertCloudBlock = null, logDebug = () => {} } = deps;
	const steps = Array.isArray( ops ) ? ops : [];

	let modal = getMaxiCloudModalRoot();
	let lastError = '';
	/** Timestamp of the last successful `set_search` in this batch (for Stats-based zero-hit detection). */
	let lastPatternsSearchAt = 0;

	const log = msg => {
		logDebug( String( msg ) );
	};

	for ( const raw of steps ) {
		const op = raw && typeof raw === 'object' ? raw : {};
		const name = String( op.op || '' ).toLowerCase();

		try {
			switch ( name ) {
				case 'wait_ms':
					await sleep( Math.min( 10000, Math.max( 0, Number( op.ms ) || 0 ) ) );
					break;

				case 'ensure_open': {
					const patternsUiLive = hint => {
						const p = getCloudPatternsPanelRoot( hint );
						return Boolean( p && p.isConnected );
					};
					modal = getMaxiCloudModalRoot();
					if (
						! modal &&
						! patternsUiLive( modal ) &&
						typeof insertCloudBlock === 'function'
					) {
						await Promise.resolve( insertCloudBlock() );
						await sleep( 200 );
					}
					modal = getMaxiCloudModalRoot();
					if ( ! modal && ! patternsUiLive( modal ) ) {
						clickOpenCloudPlaceholder();
						await sleep( 200 );
					}
					modal = getMaxiCloudModalRoot();
					if ( ! modal && ! patternsUiLive( modal ) ) {
						lastError = 'Cloud modal not found after insert/open.';
						log( `[Maxi AI CloudModal] ${ lastError }` );
						return {
							ok: false,
							message: lastError,
							lastError,
						};
					}
					break;
				}

				case 'open_placeholder':
					clickOpenCloudPlaceholder();
					await sleep( 150 );
					modal = getMaxiCloudModalRoot();
					break;

				case 'set_search': {
					modal = modal || getMaxiCloudModalRoot();
					const searchInput = await waitForPatternsSearchInput(
						modal,
						6000
					);
					if ( ! searchInput ) {
						lastError = 'Patterns search input not found.';
						break;
					}
					setReactInputValue(
						searchInput,
						String( op.text ?? '' )
					);
					searchInput.focus();
					await sleep( 80 );
					lastPatternsSearchAt = Date.now();
					break;
				}

				case 'clear_search': {
					modal = modal || getMaxiCloudModalRoot();
					const clearInput = await waitForPatternsSearchInput(
						modal,
						4000
					);
					if ( clearInput ) {
						setReactInputValue( clearInput, '' );
						clearInput.focus();
					}
					await sleep( 80 );
					break;
				}

				case 'gutenberg_type': {
					modal = modal || getMaxiCloudModalRoot();
					if ( ! ( await clickGutenbergType( modal, op.value ) ) ) {
						lastError = `gutenberg_type failed: ${ String( op.value ) }`;
					}
					await sleep( 120 );
					break;
				}

				case 'cost_filter': {
					modal = modal || getMaxiCloudModalRoot();
					if ( ! clickCostFilterButton( modal, op.value ) ) {
						lastError = `cost_filter failed: ${ String( op.value ) }`;
					}
					await sleep( 100 );
					break;
				}

				case 'light_dark': {
					modal = modal || getMaxiCloudModalRoot();
					if ( ! clickLightOrDarkMenu( modal, op.value ) ) {
						lastError = `light_dark failed: ${ String( op.value ) }`;
					}
					await sleep( 100 );
					break;
				}

				case 'clear_filters': {
					modal = modal || getMaxiCloudModalRoot();
					if ( ! clickClearPatternFilters( modal ) ) {
						lastError = 'clear_filters failed.';
					}
					await sleep( 150 );
					break;
				}

				case 'category_contains': {
					modal = modal || getMaxiCloudModalRoot();
					if ( ! clickCategoryContaining( modal, op.text ) ) {
						lastError = `category_contains failed: ${ String( op.text ) }`;
					}
					await sleep( 120 );
					break;
				}

				case 'click_first_insert': {
					modal = modal || getMaxiCloudModalRoot();
					const waitMs = Math.min(
						20000,
						Math.max( 3000, Number( op.timeout_ms ) || 12000 )
					);
					if ( lastPatternsSearchAt > 0 ) {
						const zeroHits = await waitForConfirmedZeroHitsAfterSearch(
							modal,
							lastPatternsSearchAt,
							10000
						);
						if ( zeroHits ) {
							const didClose = closeCloudLibraryModal();
							if ( ! didClose ) {
								log(
									'[Maxi AI CloudModal] Zero hits: could not find modal close control.'
								);
							}
							await sleep( 200 );
							return {
								ok: false,
								message: '',
								lastError: 'cloud_zero_hits',
								outcome: 'zero_hits',
							};
						}
					}
					const clicked = await clickFirstPatternInsert(
						modal,
						waitMs
					);
					if ( ! clicked ) {
						lastError =
							'No Insert button found in results (try a different search or insert manually).';
					}
					await sleep( 200 );
					break;
				}

				default:
					if ( name ) {
						lastError = `Unknown cloud_modal op: ${ name }`;
						log( `[Maxi AI CloudModal] ${ lastError }` );
					}
			}
		} catch ( err ) {
			lastError = String( err?.message || err );
			log( `[Maxi AI CloudModal] op error: ${ lastError }` );
			return {
				ok: false,
				message: `Cloud Library UI step failed: ${ lastError }`,
				lastError,
			};
		}

		if ( lastError && name !== 'wait_ms' ) {
			return {
				ok: false,
				message: lastError,
				lastError,
			};
		}
	}

	const ok = ! lastError;
	const didAutoInsert = steps.some(
		s => s && String( s.op || '' ).toLowerCase() === 'click_first_insert'
	);
	return {
		ok,
		message: ok
			? didAutoInsert
				? 'Searched the Cloud Library and inserted the first available pattern from the results.'
				: 'Applied Cloud Library UI steps. Use the modal to pick and insert a design.'
			: lastError || 'Cloud Library UI steps failed.',
		lastError: ok ? undefined : lastError,
	};
}

/**
 * Single object: full imperative interface + op runner + op name registry.
 */
export const maxiAiCloudModalInterface = {
	OP_NAMES: MAXI_AI_CLOUD_MODAL_OP_NAMES,
	executeOps: executeCloudModalUiOps,
	getMaxiCloudModalRoot,
	getCloudPatternsPanelRoot,
	getPatternsSearchInput,
	waitForPatternsSearchInput,
	isCloudModalVisible,
	waitForElement,
	setReactInputValue,
	clickOpenCloudPlaceholder,
	setPatternsSearchText,
	setPatternsSearchUsingOpenModal,
	clickInstantSearchMenuLabel,
	clickGutenbergType,
	clickCostFilterButton,
	clickLightOrDarkMenu,
	clickClearPatternFilters,
	clickCategoryContaining,
	waitForFirstPatternInsertButton,
	clickFirstPatternInsert,
	closeCloudLibraryModal,
	parsePatternsStatsHitCount,
};

/** @deprecated Use `maxiAiCloudModalInterface`; kept for older references. */
export const maxiAiCloudModalApi = maxiAiCloudModalInterface;

if ( typeof window !== 'undefined' ) {
	window.maxiAiCloudModal = maxiAiCloudModalInterface;
	window.maxiAiCloudModalInterface = maxiAiCloudModalInterface;
}
