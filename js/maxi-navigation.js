/* eslint-disable no-undef */
// Navigation Menu inside Maxi Container
const Navigation = () => {
	const getKeysWithNavigation = navigationArray => {
		const keysWithNavigation = [];

		for (const navigationObject of navigationArray) {
			for (const [key, value] of Object.entries(navigationObject)) {
				try {
					const parsedValue = JSON.parse(value);
					if (parsedValue.navigation?.enable === true) {
						keysWithNavigation.push(key);
					}
				} catch (e) {}
			}
		}

		return keysWithNavigation.length > 0 ? keysWithNavigation : false;
	};

	const containersWithNavigation = getKeysWithNavigation(maxiNavigation);
	if (!containersWithNavigation) return;

	const showHideHamburgerNavigation = type => {
		containersWithNavigation.forEach(containerWithNavigation => {
			const hamburgerNavigations = document.querySelectorAll(
				`#${containerWithNavigation} .wp-block-navigation__responsive-container-open`
			);

			hamburgerNavigations.forEach(hamburgerNavigation => {
				let menuNavigation = null;

				// Check if the very next sibling has the class 'wp-block-navigation__responsive-container'
				if (
					hamburgerNavigation.nextElementSibling &&
					hamburgerNavigation.nextElementSibling.classList.contains(
						'wp-block-navigation__responsive-container'
					)
				) {
					menuNavigation = hamburgerNavigation.nextElementSibling;
				}

				if (hamburgerNavigation && menuNavigation) {
					const styleId = 'maxi-blocks-hide-navigation';

					const addStyleElement = () => {
						let styleElement = document.getElementById(styleId);

						// If the style element does not exist, create it
						if (!styleElement) {
							styleElement = document.createElement('style');
							styleElement.type = 'text/css';
							styleElement.id = styleId;
							document.head.appendChild(styleElement);
						}

						// Generate CSS content for all containers
						const cssContent = containersWithNavigation
							.map(
								containerId =>
									`#${containerId} .wp-block-navigation__responsive-container:not(.has-modal-open):not(.hidden-by-default) {display: none;}`
							)
							.join(' ');

						// Set or replace the content of the style element
						if (styleElement.firstChild) {
							styleElement.firstChild.nodeValue = cssContent;
						} else {
							styleElement.appendChild(
								document.createTextNode(cssContent)
							);
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
							hamburgerNavigation.classList.remove(
								'always-shown'
							);
							menuNavigation.classList.remove(
								'hidden-by-default'
							);
							removeStyleElement();
						}
					}
					// Handle type as a number (screen size)
					else if (typeof type === 'number') {
						const windowWidth = window.width || window.innerWidth;
						if (windowWidth <= type) {
							// Show for window sizes type and down
							hamburgerNavigation.classList.add('always-shown');
							menuNavigation.classList.add('hidden-by-default');
							addStyleElement();
						} else {
							// Hide for window sizes larger than type
							hamburgerNavigation.classList.remove(
								'always-shown'
							);
							menuNavigation.classList.remove(
								'hidden-by-default'
							);
							removeStyleElement();
						}
					}
				}
			});
		});
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
