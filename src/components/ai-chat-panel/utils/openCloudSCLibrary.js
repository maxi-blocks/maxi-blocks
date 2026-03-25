/**
 * Opens the Style Cards cloud library browser by programmatically
 * activating the SC editor popup then clicking the "Browse style cards" button.
 *
 * Mirrors the DOM-driving approach used by openStyleCardsEditor() in
 * applyThemeToStyleCards.js.
 *
 * @returns {Promise<boolean>} True if the cloud browser was successfully opened.
 */
const openCloudSCLibrary = async () => {
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

	// Step 2: Wait for the popup to render, then click "Browse style cards".
	// Poll every 150 ms for up to ~1.2 s.
	for ( let i = 0; i < 8; i++ ) {
		await new Promise( resolve => setTimeout( resolve, 150 ) );
		const browseBtn =
			typeof document !== 'undefined'
				? document.querySelector(
						'.maxi-style-cards__sc__more-sc--add-more'
				  )
				: null;
		if ( browseBtn ) {
			browseBtn.click();
			return true;
		}
	}

	return false;
};

export default openCloudSCLibrary;
