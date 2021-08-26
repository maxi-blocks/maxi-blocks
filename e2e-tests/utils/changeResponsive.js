/**
 * WordPress dependencies
 */
import {
	ensureSidebarOpened,
	openDocumentSettingsSidebar,
} from '@wordpress/e2e-test-utils';

const changeResponsive = async page => {
	await openDocumentSettingsSidebar();
	await ensureSidebarOpened();

	await page.$eval(
		'.edit-post-header .edit-post-header__toolbar .maxi-toolbar-layout button',
		button => button.click()
	);
	/// /////////////////////////////////////
	const responsive = [base, xxl, l, m, s, xs, cl, sc];

	for (let i = 0; i < responsive.length; i++) {
		await page.$$('.maxi-responsive-selector button');
		await responsive[xxl].click();
	}

	/// //////////////////////////////////

	const responsiveButtons = await page.$$('.maxi-responsive-selector button');

	const responsive = responsiveButtons[(Base, XXL, L, M, S, XS, CL, SC)];
};
export default changeResponsive;
