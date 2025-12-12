/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Open accordion and optionally scroll to a specific control inside it.
 *
 * @param {string} item - Accordion name (data-name) to open, e.g. 'typography'
 * @param {string} [targetSelector] - Optional CSS selector for an inner element to scroll to
 */
const openSidebar = (item, targetSelector) => {
	const accordionUid = item.replace(/[^a-zA-Z0-9]+/g, '');

	dispatch('maxiBlocks').updateInspectorPath({
		depth: 1,
		value: accordionUid,
	});

	const sidebar = document.querySelector('.maxi-sidebar');
	const wrapperElement = document.querySelector(
		`.maxi-accordion-control__item[data-name="${item}"]`
	);

	// If a target selector is provided and found, scroll to that control; otherwise scroll to accordion top
	const targetEl = targetSelector
		? wrapperElement?.querySelector(targetSelector)
		: null;

	const top = (targetEl || wrapperElement)?.getBoundingClientRect().top;

	sidebar?.scroll({
		top,
		behavior: 'smooth',
	});
};

export default openSidebar;
