import getColumnSizeStyles, { getColumnNum } from '../getColumnSizeStyles';

const rowGapProps = {
	rowElements: ['', ''],
	columnNum: 2,
};

describe('getColumnSizeStyles', () => {
	it('Get a correct column size styles', () => {
		const object = {
			'_cs-g': 1,
			'_cs-xxl': 2,
			'_cs-xl': 3,
			'_cs-l': 4,
			'_cs-m': 1,
			'_cs-s': 2,
			'_cs-xs': 3,
		};

		const result = getColumnSizeStyles(object, rowGapProps);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct column size styles with some fit-content', () => {
		const object = {
			'_cs-g': 1,
			'_cs-xxl': 2,
			'_cs-xl': 3,
			'_cfc-l': true,
			'_cs-s': 2,
			'_cfc-xs': true,
			'_cs-xs': 3,
		};

		const result = getColumnSizeStyles(object, rowGapProps);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct column size styles with some full width columns', () => {
		const object = {
			'_cs-g': 100,
			'_cs-xxl': 2,
			'_cs-xl': 3,
			'_cfc-l': true,
			'_cs-s': 100,
			'_cfc-xs': true,
			'_cs-xs': 3,
		};

		const result = getColumnSizeStyles(object, rowGapProps);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct column size styles with gap options', () => {
		const object = {
			'_cs-g': 1,
			'_cs-xxl': 2,
			'_cs-xl': 3,
			'_cs-m': 100,
			'_cfc-l': true,
			'_cs-s': 2,
			'_cfc-xs': true,
			'_cs-xs': 3,
		};

		const result = getColumnSizeStyles(
			object,
			{
				'_rg-g': 20,
				'_rg.u-g': 'px',
				'_cg-g': 2.5,
				'_cg.u-g': '%',
				'_rg-xxl': 10,
				'_rg.u-xxl': 'px',
				'_cg-xxl': 2.5,
				'_cg.u-xxl': 'px',
				rowElements: ['', ''],
				columnNum: 2,
				columnsSize: {
					'ca79af62-a8ec-4322-a6e5-85861647ced4': {
						'_cs-g': 61,
						'_cs-m': 100,
					},
					'4b275169-92b5-44b0-a383-306b068e2fc8': {
						'_cs-g': 22,
						'_cs-m': 100,
					},
					'6caa0813-684c-4a21-b089-d5c72ff4c859': {
						'_cs-g': 12.5,
						'_cs-m': 100,
					},
					'511c51a1-8cf4-4548-82cc-11cde70bc420': {
						'_cs-g': 12.5,
						'_cs-m': 100,
					},
					'dfc75990-0f18-4a6e-8cc8-4b92cdd79405': {
						'_cs-g': 12.5,
						'_cs-m': 100,
					},
					'816620f6-6ca7-4b67-a653-6af89d6e3c52': {
						'_cs-g': 37,
						'_cs-m': 100,
					},
					'ce524232-68bf-4480-8f43-42e6ca779349': {
						'_cs-g': 41,
						'_cs-m': 100,
					},
					'02b0ceb5-42b9-443d-bd86-67e35f59419b': {
						'_cs-g': 12.5,
						'_cs-m': 100,
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
				'_cs-g': 61,
				'_cs-m': 100,
			},
			'4b275169-92b5-44b0-a383-306b068e2fc8': {
				'_cs-g': 22,
				'_cs-m': 100,
			},
			'6caa0813-684c-4a21-b089-d5c72ff4c859': {
				'_cs-g': 12.5,
				'_cs-m': 100,
			},
			'511c51a1-8cf4-4548-82cc-11cde70bc420': {
				'_cs-g': 12.5,
				'_cs-m': 100,
			},
			'dfc75990-0f18-4a6e-8cc8-4b92cdd79405': {
				'_cs-g': 12.5,
				'_cs-m': 100,
			},
			'816620f6-6ca7-4b67-a653-6af89d6e3c52': {
				'_cs-g': 37,
				'_cs-m': 100,
			},
			'ce524232-68bf-4480-8f43-42e6ca779349': {
				'_cs-g': 41,
				'_cs-m': 100,
			},
			'02b0ceb5-42b9-443d-bd86-67e35f59419b': {
				'_cs-g': 12.5,
				'_cs-m': 100,
			},
		};

		expect(
			getColumnNum(
				columnsSize,
				'ca79af62-a8ec-4322-a6e5-85861647ced4',
				'g'
			)
		).toBe(3);
		expect(
			getColumnNum(
				columnsSize,
				'dfc75990-0f18-4a6e-8cc8-4b92cdd79405',
				'g'
			)
		).toBe(3);
		expect(
			getColumnNum(
				columnsSize,
				'ce524232-68bf-4480-8f43-42e6ca779349',
				'g'
			)
		).toBe(2);
	});
	it('Return number of columns 2', async () => {
		const columnsSize = {
			'1b8793cf-fcdd-4a14-970e-a550c086a503': {
				'_cs-g': 22,
				'_cs-m': 100,
			},
			'81e92657-84b9-479e-b6ed-543612721d63': {
				'_cs-g': 12.5,
				'_cs-m': 100,
			},
			'709ba962-da7f-458f-88bd-131e05c363b5': {
				'_cs-g': 12.5,
				'_cs-m': 100,
			},
			'7e43ba0c-a05a-4249-b324-bab10c00e7cf': {
				'_cs-g': 61,
				'_cs-m': 100,
			},
			'dd70b92d-37df-4f85-87f3-ae53eb3f0656': {
				'_cs-g': 12.5,
				'_cs-m': 100,
			},
			'b9b9085a-ade1-4d29-850b-e9ecbaf35bbd': {
				'_cs-g': 37,
				'_cs-m': 100,
			},
			'fa9ea412-1ce6-477f-bc3e-c07bfe7d6367': {
				'_cs-g': 41,
				'_cs-m': 100,
			},
			'009d8de6-61fe-4441-b940-c64196b73be4': {
				'_cs-g': 12.5,
				'_cs-m': 100,
			},
		};

		expect(
			getColumnNum(
				columnsSize,
				'81e92657-84b9-479e-b6ed-543612721d63',
				'g'
			)
		).toBe(3);
		expect(
			getColumnNum(
				columnsSize,
				'7e43ba0c-a05a-4249-b324-bab10c00e7cf',
				'g'
			)
		).toBe(2);
		expect(
			getColumnNum(
				columnsSize,
				'009d8de6-61fe-4441-b940-c64196b73be4',
				'g'
			)
		).toBe(3);
	});
});
