import path from 'node:path';
import {
	runCopyPasteCoverageScan,
	runCopyPasteAttributeCoverageScan,
	getCopyPasteCoverageForBlock,
	getCopyPasteAttributeCoverageForBlock,
} from '@extensions/copy-paste/scanCopyPasteCoverage';

describe('scanCopyPasteCoverage', () => {
	it('collects mapped keys from template-based mappings', () => {
		const fixturePath = path.resolve(
			__dirname,
			'fixtures',
			'scan-copy-paste-block.js'
		);
		const result = getCopyPasteCoverageForBlock('scan-maxi', fixturePath);

		expect(result.hasCopyPasteMapping).toBe(true);
		expect(result.missingStyleKeys).toEqual([]);
	});

	it('runs scan over repository blocks and returns all block entries', () => {
		const report = runCopyPasteCoverageScan(
			path.resolve(__dirname, '../../../../')
		);
		expect(report).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					block: 'button-maxi',
					hasCopyPasteMapping: true,
				}),
			])
		);
	});

	it('reports all-attribute gaps separately from explicit exclusions', () => {
		const dataPath = path.resolve(
			__dirname,
			'fixtures',
			'scan-copy-paste-block.js'
		);
		const attributesPath = path.resolve(
			__dirname,
			'fixtures',
			'scan-copy-paste-attributes.js'
		);
		const result = getCopyPasteAttributeCoverageForBlock(
			'scan-maxi',
			attributesPath,
			dataPath
		);

		expect(result.coveredAttributeKeys).toEqual(
			expect.arrayContaining([
				'advanced-css-general',
				'ariaLabels',
				'blockStyle',
				'cl-source',
				'opacity-general-hover',
				'palette-test-color',
				'palette-test-palette-status',
				'plain-setting',
				'fixture-gap-general',
				'fixture-width-general',
			])
		);
		expect(result.excludedAttributeKeys).toEqual(
			expect.arrayContaining([
				'excluded-setting',
				'preview',
				'transition-canvas-selected',
			])
		);
		expect(result.missingAttributeKeys).toEqual(['missing-setting']);
		expect(result.missingAttributeCategoryCounts).toEqual({
			'block-specific': 1,
		});
	});

	it('runs all-attribute scan over repository blocks', () => {
		const report = runCopyPasteAttributeCoverageScan(
			path.resolve(__dirname, '../../../../')
		);
		expect(report).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					block: 'button-maxi',
					hasCopyPasteMapping: true,
				}),
			])
		);
	});

	it('has no repository attribute coverage gaps outside Dynamic Content', () => {
		const report = runCopyPasteAttributeCoverageScan(
			path.resolve(__dirname, '../../../../')
		);
		const nonDynamicContentGaps = report.flatMap(block =>
			Object.entries(block.missingAttributeCategories)
				.filter(([category]) => category !== 'dynamic-content')
				.flatMap(([category, keys]) =>
					keys.map(key => `${block.block}:${category}:${key}`)
				)
		);

		expect(nonDynamicContentGaps).toEqual([]);
	});
});
