import getColumnSizeStyles, {
	getColumnNum,
} from '@extensions/styles/helpers/getColumnSizeStyles';

const rowGapProps = {
	rowElements: ['', ''],
	columnNum: 2,
};

describe('getColumnSizeStyles', () => {
	it('Get a correct column size styles', () => {
		const object = {
			'column-size-general': 1,
			'column-size-xxl': 2,
			'column-size-xl': 3,
			'column-size-l': 4,
			'column-size-m': 1,
			'column-size-s': 2,
			'column-size-xs': 3,
		};

		const result = getColumnSizeStyles(object, rowGapProps);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct column size styles with some fit-content', () => {
		const object = {
			'column-size-general': 1,
			'column-size-xxl': 2,
			'column-size-xl': 3,
			'column-fit-content-l': true,
			'column-size-s': 2,
			'column-fit-content-xs': true,
			'column-size-xs': 3,
		};

		const result = getColumnSizeStyles(object, rowGapProps);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct column size styles with some fullwidth columns', () => {
		const object = {
			'column-size-general': 100,
			'column-size-xxl': 2,
			'column-size-xl': 3,
			'column-fit-content-l': true,
			'column-size-s': 100,
			'column-fit-content-xs': true,
			'column-size-xs': 3,
		};

		const result = getColumnSizeStyles(object, rowGapProps);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct column size styles with gap options', () => {
		const object = {
			'column-size-general': 1,
			'column-size-xxl': 2,
			'column-size-xl': 3,
			'column-size-m': 100,
			'column-fit-content-l': true,
			'column-size-s': 2,
			'column-fit-content-xs': true,
			'column-size-xs': 3,
		};

		const result = getColumnSizeStyles(
			object,
			{
				'row-gap-general': 20,
				'row-gap-unit-general': 'px',
				'column-gap-general': 2.5,
				'column-gap-unit-general': '%',
				'row-gap-xxl': 10,
				'row-gap-unit-xxl': 'px',
				'column-gap-xxl': 2.5,
				'column-gap-unit-xxl': 'px',
				rowElements: ['', ''],
				columnNum: 2,
				columnsSize: {
					'ca79af62-a8ec-4322-a6e5-85861647ced4': {
						'column-size-general': 61,
						'column-size-m': 100,
					},
					'4b275169-92b5-44b0-a383-306b068e2fc8': {
						'column-size-general': 22,
						'column-size-m': 100,
					},
					'6caa0813-684c-4a21-b089-d5c72ff4c859': {
						'column-size-general': 12.5,
						'column-size-m': 100,
					},
					'511c51a1-8cf4-4548-82cc-11cde70bc420': {
						'column-size-general': 12.5,
						'column-size-m': 100,
					},
					'dfc75990-0f18-4a6e-8cc8-4b92cdd79405': {
						'column-size-general': 12.5,
						'column-size-m': 100,
					},
					'816620f6-6ca7-4b67-a653-6af89d6e3c52': {
						'column-size-general': 37,
						'column-size-m': 100,
					},
					'ce524232-68bf-4480-8f43-42e6ca779349': {
						'column-size-general': 41,
						'column-size-m': 100,
					},
					'02b0ceb5-42b9-443d-bd86-67e35f59419b': {
						'column-size-general': 12.5,
						'column-size-m': 100,
					},
				},
			},
			'816620f6-6ca7-4b67-a653-6af89d6e3c52'
		);

		expect(result).toMatchSnapshot();
	});

	it('Return number of columns', async () => {
		const columnsSize = {
			'ca79af62-a8ec-4322-a6e5-85861647ced4': {
				'column-size-general': 61,
				'column-size-m': 100,
			},
			'4b275169-92b5-44b0-a383-306b068e2fc8': {
				'column-size-general': 22,
				'column-size-m': 100,
			},
			'6caa0813-684c-4a21-b089-d5c72ff4c859': {
				'column-size-general': 12.5,
				'column-size-m': 100,
			},
			'511c51a1-8cf4-4548-82cc-11cde70bc420': {
				'column-size-general': 12.5,
				'column-size-m': 100,
			},
			'dfc75990-0f18-4a6e-8cc8-4b92cdd79405': {
				'column-size-general': 12.5,
				'column-size-m': 100,
			},
			'816620f6-6ca7-4b67-a653-6af89d6e3c52': {
				'column-size-general': 37,
				'column-size-m': 100,
			},
			'ce524232-68bf-4480-8f43-42e6ca779349': {
				'column-size-general': 41,
				'column-size-m': 100,
			},
			'02b0ceb5-42b9-443d-bd86-67e35f59419b': {
				'column-size-general': 12.5,
				'column-size-m': 100,
			},
		};

		expect(
			getColumnNum(
				columnsSize,
				'ca79af62-a8ec-4322-a6e5-85861647ced4',
				'general'
			)
		).toBe(3);
		expect(
			getColumnNum(
				columnsSize,
				'dfc75990-0f18-4a6e-8cc8-4b92cdd79405',
				'general'
			)
		).toBe(3);
		expect(
			getColumnNum(
				columnsSize,
				'ce524232-68bf-4480-8f43-42e6ca779349',
				'general'
			)
		).toBe(2);
	});
	it('Return number of columns 2', async () => {
		const columnsSize = {
			'1b8793cf-fcdd-4a14-970e-a550c086a503': {
				'column-size-general': 22,
				'column-size-m': 100,
			},
			'81e92657-84b9-479e-b6ed-543612721d63': {
				'column-size-general': 12.5,
				'column-size-m': 100,
			},
			'709ba962-da7f-458f-88bd-131e05c363b5': {
				'column-size-general': 12.5,
				'column-size-m': 100,
			},
			'7e43ba0c-a05a-4249-b324-bab10c00e7cf': {
				'column-size-general': 61,
				'column-size-m': 100,
			},
			'dd70b92d-37df-4f85-87f3-ae53eb3f0656': {
				'column-size-general': 12.5,
				'column-size-m': 100,
			},
			'b9b9085a-ade1-4d29-850b-e9ecbaf35bbd': {
				'column-size-general': 37,
				'column-size-m': 100,
			},
			'fa9ea412-1ce6-477f-bc3e-c07bfe7d6367': {
				'column-size-general': 41,
				'column-size-m': 100,
			},
			'009d8de6-61fe-4441-b940-c64196b73be4': {
				'column-size-general': 12.5,
				'column-size-m': 100,
			},
		};

		expect(
			getColumnNum(
				columnsSize,
				'81e92657-84b9-479e-b6ed-543612721d63',
				'general'
			)
		).toBe(3);
		expect(
			getColumnNum(
				columnsSize,
				'7e43ba0c-a05a-4249-b324-bab10c00e7cf',
				'general'
			)
		).toBe(2);
		expect(
			getColumnNum(
				columnsSize,
				'009d8de6-61fe-4441-b940-c64196b73be4',
				'general'
			)
		).toBe(3);
	});
});
