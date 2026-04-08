try {
	require('@testing-library/jest-dom');
} catch (error) {
	// Optional in this repo; tests should still run without it.
}

beforeEach(() => {
	global.fetch = jest.fn();
});
