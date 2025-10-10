import { test as base } from '@wordpress/e2e-test-utils-playwright';

const test = base.extend({
	editor: async ({ editor }, use) => {
		async function customOpenPreviewPage() {
			const editorTopBar = this.page.locator(
				'role=region[name="Editor top bar"i]'
			);
			const previewButton = editorTopBar.locator(
				'role=button[name="Preview"i]'
			);

			await previewButton.click();

			const [previewPage] = await Promise.all([
				this.context.waitForEvent('page'),
				this.page.click('role=menuitem[name="Preview in new tab"i]'),
			]);

			return previewPage;
		}

		editor.openPreviewPage = customOpenPreviewPage.bind(editor);

		await use(editor);
	},
});

export default test;
