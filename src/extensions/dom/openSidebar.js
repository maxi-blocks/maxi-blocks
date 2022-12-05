/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

const openSidebar = item => {
	const accordionUid = item.replace(/[^a-zA-Z0-9]+/g, '');

	dispatch('maxiBlocks').updateInspectorPath({
		depth: 1,
		value: accordionUid,
	});

	const sidebar = document.querySelector('.maxi-sidebar');
	const wrapperElement = document.querySelector(
		`.maxi-accordion-control__item[data-name="${item}"]`
	);

	sidebar?.scroll({
		top: wrapperElement?.getBoundingClientRect().top,
		behavior: 'smooth',
	});
};

export default openSidebar;
