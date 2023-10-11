// Helper function
async function typeWithDelay(page, text, delay = 350) {
	await page.keyboard.type(text, { delay });
}

export default typeWithDelay;
