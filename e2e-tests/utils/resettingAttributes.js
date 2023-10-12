/**
 * WordPress dependencies
 */

const resettingAttributes = async ({ page, instance, expectValue }) => {
	// Refresh
	await page.$eval(
		`.maxi-tabs-content .${instance} .maxi-base-control__field button`,
		button => button.click()
	);

	await page.waitForTimeout(500);

	// Check value
	const value = await page.$eval(
		`.maxi-tabs-content .${instance} input`,
		input => input.value
	);

	if (value !== expectValue) return false;
	return true;
};

export default resettingAttributes;
