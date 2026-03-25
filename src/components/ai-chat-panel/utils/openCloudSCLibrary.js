import { setReactInputValue } from './aiCloudModalDriver';

const SC_CONTAINER = '.maxi-cloud-container__sc';
const SC_SIDEBAR = '.maxi-cloud-container__sc__sidebar';
const SC_SEARCH = `${ SC_SIDEBAR } .ais-SearchBox-input`;
const SC_CATEGORY_ITEMS = `${ SC_SIDEBAR } .maxi-cloud-container__content__svg-categories li`;
const SC_CATEGORY_LINKS = `${ SC_SIDEBAR } .maxi-cloud-container__content__svg-categories li a`;
const SC_CONTENT = '.maxi-cloud-container__sc__content-sc';
/** First card button that isn't already saved/active. */
const SC_FIRST_PREVIEW = `${ SC_CONTENT } .ais-InfiniteHits-item .maxi-cloud-masonry-card__button-load:not(.maxi-cloud-masonry-card__saved)`;

const sleep = ms => new Promise( resolve => setTimeout( resolve, ms ) );

/**
 * Wait for a selector to appear in the document, polling every `interval` ms up to `timeout` ms.
 *
 * @param {string} selector
 * @param {number} [timeout=6000]
 * @param {number} [interval=80]
 * @returns {Promise<Element|null>}
 */
const waitForSelector = async ( selector, timeout = 6000, interval = 80 ) => {
	const deadline = Date.now() + timeout;
	while ( Date.now() < deadline ) {
		const el =
			typeof document !== 'undefined'
				? document.querySelector( selector )
				: null;
		if ( el ) return el;
		await sleep( interval );
	}
	return null;
};

/**
 * Wait for a selector to return at least `minCount` elements.
 *
 * @param {string} selector
 * @param {number} [minCount=1]
 * @param {number} [timeout=8000]
 * @param {number} [interval=100]
 * @returns {Promise<NodeList|null>}
 */
const waitForSelectorCount = async (
	selector,
	minCount = 1,
	timeout = 8000,
	interval = 100
) => {
	const deadline = Date.now() + timeout;
	while ( Date.now() < deadline ) {
		const els =
			typeof document !== 'undefined'
				? document.querySelectorAll( selector )
				: [];
		if ( els.length >= minCount ) return els;
		await sleep( interval );
	}
	return null;
};

/**
 * Opens the Style Cards cloud library browser by programmatically
 * activating the SC editor popup then clicking the "Browse style cards" button.
 * Optionally filters by search query and/or color category after the library loads.
 *
 * @param {Object}  [options]
 * @param {string}  [options.query]        Optional search text to set in the SC library search box.
 * @param {string}  [options.category]     Optional color category to select in the SC library sidebar
 *                                         (e.g. "Red", "Blue"). Matches sc_color facet values.
 * @param {boolean} [options.importFirst]  When true, clicks the first Preview button after filtering.
 * @param {boolean} [options.showLocalOnly] When true, only opens the SC editor (local cards), does
 *                                          not proceed to the cloud library browser.
 * @returns {Promise<boolean>} True if the cloud browser was successfully opened.
 */
const openCloudSCLibrary = async ( {
	query = '',
	category = '',
	importFirst = false,
	showLocalOnly = false,
} = {} ) => {
	// Step 1: Open the Style Cards editor popup.
	if (
		typeof window !== 'undefined' &&
		typeof window.maxiBlocksOpenStyleCardsEditor === 'function'
	) {
		window.maxiBlocksOpenStyleCardsEditor( {} );
	} else {
		const scButton =
			typeof document !== 'undefined'
				? document.getElementById( 'maxi-button__style-cards' )
				: null;
		if ( ! scButton ) return false;
		scButton.click();
	}

	// For "show me the style cards" requests, the SC editor popup already lists
	// locally saved cards — no need to open the cloud library browser.
	if ( showLocalOnly ) return true;

	// Step 2: Wait for the popup to render, then click "Browse style cards".
	// Poll every 150 ms for up to 3 s (20 attempts) — the popup can take a moment
	// to render, especially when the editor is already busy.
	let browseClicked = false;
	for ( let i = 0; i < 20; i++ ) {
		await sleep( 150 );
		const browseBtn =
			typeof document !== 'undefined'
				? document.querySelector(
						'.maxi-style-cards__sc__more-sc--add-more'
				  )
				: null;
		if ( browseBtn ) {
			browseBtn.click();
			browseClicked = true;
			break;
		}
	}

	if ( ! browseClicked ) return false;

	// Step 3: Nothing more to do if no filter/search and no auto-preview requested.
	if ( ! query && ! category && ! importFirst ) return true;

	// Step 4: Wait for the SC cloud panel container to appear.
	const scContainer = await waitForSelector( SC_CONTAINER, 6000 );
	if ( ! scContainer ) return true; // Opened but couldn't interact further.

	// Step 5: Set search text (search box renders quickly).
	if ( query ) {
		const searchInput = await waitForSelector( SC_SEARCH, 4000 );
		if ( searchInput ) {
			setReactInputValue( searchInput, query );
			searchInput.focus();
		}
	}

	// Step 6: Click matching category — wait for Typesense to return the facet
	// data, which populates the category list asynchronously.
	if ( category ) {
		const want = category.trim().toLowerCase();

		// Wait until at least one category item has rendered.
		const items = await waitForSelectorCount( SC_CATEGORY_ITEMS, 1, 8000 );
		if ( ! items ) return true; // Categories didn't load in time.

		const links =
			typeof document !== 'undefined'
				? document.querySelectorAll( SC_CATEGORY_LINKS )
				: [];

		for ( const a of links ) {
			const labelEl = a.querySelector( 'span:first-child' );
			const labelText = (
				labelEl?.textContent ||
				a.textContent ||
				''
			)
				.trim()
				.toLowerCase();

			if ( labelText.includes( want ) || want.includes( labelText ) ) {
				a.click();
				break;
			}
		}
	}

	// Step 7: Click the first Preview button when the user wants to import.
	if ( importFirst ) {
		// Give InstantSearch time to apply the filter and re-render results.
		await sleep( 600 );

		// Wait for a previewable (not-yet-saved) card to appear.
		const previewSpan = await waitForSelector( SC_FIRST_PREVIEW, 6000 );
		if ( previewSpan ) {
			// The span lives inside the card <button> — click the button.
			const cardBtn =
				previewSpan.closest( 'button' ) || previewSpan;
			cardBtn.click();
		}
	}

	return true;
};

export default openCloudSCLibrary;
