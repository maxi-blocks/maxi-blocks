/**
 * WordPress dependencies
 */
import { subscribe } from '@wordpress/data';
import { createRoot, render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import LovabilityMetrics from '@components/lovability-metrics';

const ROOT_ID = 'maxi-blocks__lovability-metrics';

const getParentNode = () =>
	document.querySelector('.edit-post-header__settings') ||
	document.querySelector('.edit-site-header__actions') ||
	document.querySelector('.edit-site-header__settings') ||
	document.querySelector('.edit-site-header__toolbar') ||
	document.querySelector('.editor-header__settings');

const renderWidget = () => {
	const parentNode = getParentNode();
	if (!parentNode) return null;

	let rootElement = document.getElementById(ROOT_ID);
	if (!rootElement) {
		rootElement = document.createElement('div');
		rootElement.id = ROOT_ID;
		parentNode.appendChild(rootElement);
	}

	return rootElement;
};

wp.domReady(() => {
	let isMounted = false;
	let currentRoot = null;
	let isReact18 = typeof createRoot === 'function';

	const mountWidget = () => {
		const rootElement = renderWidget();
		if (!rootElement) return;

		if (isReact18) {
			if (!currentRoot) {
				currentRoot = createRoot(rootElement);
			}
			currentRoot.render(<LovabilityMetrics />);
		} else {
			render(<LovabilityMetrics />, rootElement);
		}

		isMounted = true;
	};

	const unsubscribe = subscribe(() => {
		if (!document.getElementById(ROOT_ID)) {
			isMounted = false;
		}

		if (!isMounted) {
			mountWidget();
		}
	});

	const observer = new MutationObserver(() => {
		if (!document.getElementById(ROOT_ID)) {
			isMounted = false;
			mountWidget();
		}
	});

	const observeTarget =
		document.querySelector('.interface-interface-skeleton__editor') ||
		document.querySelector('.edit-post-layout') ||
		document.querySelector('.edit-site-layout') ||
		document.body;

	observer.observe(observeTarget, {
		childList: true,
		subtree: true,
	});

	window.addEventListener('beforeunload', () => {
		unsubscribe();
		observer.disconnect();
		if (currentRoot && isReact18) {
			currentRoot.unmount();
		}
	});
});
