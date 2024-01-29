/* eslint-disable no-undef */
// Navigation Menu inside Maxi Container
const Navigation = () => {
	console.log('maxiNavigation', maxiNavigation);

	const getKeyWithNavigation = navigationArray => {
		// Assuming there's only one object in the array. Adjust as needed.
		const navigationObject = navigationArray[0];

		for (const [key, value] of Object.entries(navigationObject)) {
			try {
				const parsedValue = JSON.parse(value);
				if (parsedValue.navigation?.enable === true) {
					return key;
				}
			} catch (e) {}
		}

		return false;
	};

	const containerWithNavigation = getKeyWithNavigation(maxiNavigation);
	if (!containerWithNavigation) return;

	const showHideHamburgerNavigation = type => {
		const hamburgerNavigation = document.querySelector(
			`#${containerWithNavigation} .wp-block-navigation__responsive-container-open`
		);

		let menuNavigation = null;

		// Check if the very next sibling has the class 'wp-block-navigation__responsive-container'
		if (
			hamburgerNavigation &&
			hamburgerNavigation.nextElementSibling &&
			hamburgerNavigation.nextElementSibling.classList.contains(
				'wp-block-navigation__responsive-container'
			)
		) {
			menuNavigation = hamburgerNavigation.nextElementSibling;
		}

		if (hamburgerNavigation && menuNavigation) {
			// Create a <style> element
			const addStyleElement = () => {
				const styleId = 'maxi-blocks-hide-navigation';
				let styleElement = document.getElementById(styleId);

				// If the style element does not exist, create it
				if (!styleElement) {
					styleElement = document.createElement('style');
					const cssContent = `#${containerWithNavigation} .wp-block-navigation__responsive-container:not(.has-modal-open):not(.hidden-by-default) {display: none;}`;
					styleElement.appendChild(
						document.createTextNode(cssContent)
					);
					styleElement.type = 'text/css';
					styleElement.id = styleId;
					document.head.appendChild(styleElement);
				}
			};
			const removeStyleElement = () => {
				const styleElement = document.getElementById(
					'maxi-blocks-hide-navigation'
				);
				if (styleElement) {
					styleElement.remove();
				}
			};
			// Handle type as a string ('show' or 'hide')
			if (typeof type === 'string') {
				if (type === 'show') {
					hamburgerNavigation.classList.add('always-shown');
					menuNavigation.classList.add('hidden-by-default');
					addStyleElement();
				} else {
					hamburgerNavigation.classList.remove('always-shown');
					menuNavigation.classList.remove('hidden-by-default');
					removeStyleElement();
				}
			}
			// Handle type as a number (screen size)
			else if (typeof type === 'number') {
				const windowWidth = window.width || window.innerWidth;
				if (windowWidth <= type) {
					// Show for editor sizes type and down
					hamburgerNavigation.classList.add('always-shown');
					menuNavigation.classList.add('hidden-by-default');
					addStyleElement();
				} else {
					// Hide for editor sizes larger than type
					hamburgerNavigation.classList.remove('always-shown');
					menuNavigation.classList.remove('hidden-by-default');
					removeStyleElement();
				}
			}
		}
	};

	const alwaysShowMobileNavigation =
		maxiNavigation?.[0]?.navigation?.['always-show-mobile'];
	const showMobileNavigationDownFrom =
		maxiNavigation?.[0]?.navigation?.['show-mobile-down-from'];

	if (alwaysShowMobileNavigation) showHideHamburgerNavigation('show');
	else if (showMobileNavigationDownFrom) {
		showHideHamburgerNavigation(showMobileNavigationDownFrom);
		window.addEventListener('resize', () => {
			showHideHamburgerNavigation(showMobileNavigationDownFrom);
		});
	}
};

window.addEventListener('DOMContentLoaded', Navigation);
