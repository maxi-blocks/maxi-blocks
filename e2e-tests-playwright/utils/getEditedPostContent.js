import waitForAttribute from './waitForAttribute';

const getEditedPostContent = async (page, editor) => {
	await waitForAttribute(page, [
		'maxi-version-current',
		'maxi-version-origin',
	]);
	return editor.getEditedPostContent();
};

export default getEditedPostContent;
