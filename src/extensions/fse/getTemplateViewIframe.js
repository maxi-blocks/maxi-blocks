/**
 * Internal dependencies
 */
import getTemplatePartChooseList from './getTemplatePartChooseList';

const getTemplateViewIframe = uniqueID => {
	let templateViewIframe = null;

	const templatesList = getTemplatePartChooseList();

	if (!templatesList) return templateViewIframe;

	const listItems = templatesList.querySelectorAll(
		'.block-editor-block-patterns-list__list-item'
	);

	Array.from(listItems).forEach(listItem => {
		const listItemIframe = listItem.querySelector(
			'.block-editor-block-preview__content iframe'
		)?.contentDocument;

		if (!listItemIframe) return;

		if (listItemIframe.querySelector(`.${uniqueID}`))
			templateViewIframe = listItemIframe;
	});

	return templateViewIframe;
};

export default getTemplateViewIframe;
