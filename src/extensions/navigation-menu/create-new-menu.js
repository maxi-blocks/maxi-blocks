/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { serialize } from '@wordpress/blocks';

const DRAFT_MENU_PARAMS = [
	'postType',
	'wp_navigation',
	{ status: 'draft', per_page: -1 },
];

const PUBLISHED_MENU_PARAMS = [
	'postType',
	'wp_navigation',
	{ per_page: -1, status: 'publish' },
];

const generateTitle = async () => {
	const defaultTitle = __('Navigation');

	const { getEntityRecords } = select('core');

	const allMenus = await Promise.all([
		...getEntityRecords(...DRAFT_MENU_PARAMS),
		...getEntityRecords(...PUBLISHED_MENU_PARAMS),
	]);

	let menusCount = allMenus.length;
	let title = `${defaultTitle} ${menusCount}`;

	const isTitleRepeating = (title, menus) => {
		return menus.some(menu => menu?.title?.raw === title);
	};

	while (isTitleRepeating(title, allMenus)) {
		menusCount += 1;
		title = `${defaultTitle} ${menusCount}`;
	}

	return title;
};

const createNewMenu = async innerBlocks => {
	const record = {
		title: await generateTitle(),
		content: serialize(innerBlocks),
		status: 'publish',
	};
	console.log(record);
	const { id } = await dispatch('core').saveEntityRecord(
		'postType',
		'wp_navigation',
		record
	);

	return id;
};

export default createNewMenu;
