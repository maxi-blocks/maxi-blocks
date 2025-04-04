import downloadTextFile from '@editor/style-cards/downloadTextFile';

describe('downloadTextFile', () => {
	let mockAnchor;
	let mockURL;

	beforeEach(() => {
		mockAnchor = {
			style: '',
			href: '',
			download: '',
			click: jest.fn(),
		};

		document.createElement = jest.fn(() => mockAnchor);
		document.body.appendChild = jest.fn();
		document.body.removeChild = jest.fn();

		mockURL = 'blob:mock-url';
		window.URL.createObjectURL = jest.fn(() => mockURL);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('Should create and trigger download with correct data', () => {
		const testData = { test: 'data' };
		const fileName = 'test.json';

		downloadTextFile(testData, fileName);

		expect(document.createElement).toHaveBeenCalledWith('a');
		expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
		expect(mockAnchor.style).toContain('display: none');
		expect(mockAnchor.download).toBe(fileName);
		expect(mockAnchor.href).toBe(mockURL);

		expect(window.URL.createObjectURL).toHaveBeenCalledWith(
			expect.any(Blob)
		);

		expect(mockAnchor.click).toHaveBeenCalled();
		expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
	});

	it('Should handle empty data', () => {
		const emptyData = {};
		const fileName = 'empty.json';

		downloadTextFile(emptyData, fileName);

		expect(window.URL.createObjectURL).toHaveBeenCalledWith(
			expect.any(Blob)
		);
		expect(mockAnchor.click).toHaveBeenCalled();
	});
});
