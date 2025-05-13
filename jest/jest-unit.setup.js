module.exports = () => {
	global.wp = {
		domReady: jest.fn(),
	};
};
