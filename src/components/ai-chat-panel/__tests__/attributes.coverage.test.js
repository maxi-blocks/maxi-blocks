import buildCoverageReport from '../ai/attributes/attributeCoverage';

describe('attribute coverage', () => {
	test('all attributes are registered', () => {
		const report = buildCoverageReport();
		expect(report.total).toBe(report.registered);
		expect(report.missing).toHaveLength(0);
	});
});
