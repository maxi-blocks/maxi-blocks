import getFilteredData from '@extensions/styles/getFilteredData';

describe('getFilteredData', () => {
	const mockStyles = {
		'template-style': { color: 'blue' },
		'template-part-style': { color: 'red' },
		'normal-style': { color: 'green' },
		'custom-template': { color: 'yellow' },
		'header-template-part': { color: 'purple' },
	};

	it('Returns template styles for wp_template type', () => {
		const params = {
			id: 'test-id',
			name: 'wp_template',
		};

		const result = getFilteredData(mockStyles, params);

		expect(result).toEqual({
			'template-style': { color: 'blue' },
			'custom-template': { color: 'yellow' },
		});
		expect(result['template-part-style']).toBeUndefined();
	});

	it('Returns template part styles for wp_template_part type', () => {
		const params = {
			id: 'theme//header',
			name: 'wp_template_part',
		};

		const result = getFilteredData(mockStyles, params);

		expect(result).toEqual({
			'header-template-part': { color: 'purple' },
		});
	});

	it('Returns non-template styles for default type', () => {
		const params = {
			id: 'test-id',
			name: 'default',
		};

		const result = getFilteredData(mockStyles, params);

		expect(result).toEqual({
			'normal-style': { color: 'green' },
		});
		expect(result['template-style']).toBeUndefined();
		expect(result['template-part-style']).toBeUndefined();
	});

	it('Returns empty object when no matching styles found', () => {
		const params = {
			id: 'theme//footer',
			name: 'wp_template_part',
		};

		const result = getFilteredData(mockStyles, params);

		expect(result).toEqual({});
	});

	it('Handles empty styles object', () => {
		const params = {
			id: 'test-id',
			name: 'wp_template',
		};

		const result = getFilteredData({}, params);

		expect(result).toEqual({});
	});
});
