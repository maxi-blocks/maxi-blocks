import { readFileSync } from 'fs';
import path from 'path';

describe('relation-control editor styles', () => {
	it('keeps the block target dropdown tall enough to scan several options', () => {
		const styles = readFileSync(
			path.resolve(
				process.cwd(),
				'src/components/relation-control/editor.scss'
			),
			'utf8'
		);

		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__options\s*\{[\s\S]*max-height:\s*min\(360px,\s*calc\(100vh - 220px\)\);/
		);
	});

	it('styles block target group labels separately from selectable options', () => {
		const styles = readFileSync(
			path.resolve(
				process.cwd(),
				'src/components/relation-control/editor.scss'
			),
			'utf8'
		);

		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__option-group\s*\{[\s\S]*background:\s*var\(--maxi-white\);[\s\S]*border-top:\s*1px solid var\(--maxi-grey-light\);/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__option-group-button\s*\{[\s\S]*background:\s*var\(--maxi-white\);[\s\S]*font-weight:\s*500;/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__option-group-button\[aria-expanded='false'\]\s*&__option-group-arrow/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__option-column\s*\{[\s\S]*background:\s*var\(--maxi-white\);[\s\S]*border-top:\s*1px solid var\(--maxi-grey-light\);/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__option-column-button\s*\{[\s\S]*padding:\s*7px 12px 7px 20px;[\s\S]*background:\s*var\(--maxi-white\);/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__option-column-button\[aria-expanded='false'\]\s*&__option-column-arrow/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__option--nested\s*\{[\s\S]*padding-left:\s*28px;/
		);
	});

	it('styles the selected block add button as a full-width action', () => {
		const styles = readFileSync(
			path.resolve(
				process.cwd(),
				'src/components/relation-control/editor.scss'
			),
			'utf8'
		);

		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__selected-add\s*\{[\s\S]*width:\s*100%;[\s\S]*border:\s*1px dashed var\(--maxi-grey-light\);/
		);
	});

	it('styles compact block type markers in selectable rows', () => {
		const styles = readFileSync(
			path.resolve(
				process.cwd(),
				'src/components/relation-control/editor.scss'
			),
			'utf8'
		);

		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__option-type-icon\s*\{[\s\S]*width:\s*16px;[\s\S]*min-width:\s*16px;/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__option-type-icon--text::before\s*\{[\s\S]*content:\s*'T';/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__option-type-icon--image::before\s*\{/
		);
	});

	it('styles current badges, search count, and selected actions without picker counts', () => {
		const styles = readFileSync(
			path.resolve(
				process.cwd(),
				'src/components/relation-control/editor.scss'
			),
			'utf8'
		);

		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__current-badge\s*\{[\s\S]*background:\s*var\(--maxi-interaction-pink\);/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__current-badge\s*\{[\s\S]*color:\s*var\(--maxi-white\) !important;/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__search-count\s*\{[\s\S]*font-size:\s*10px;/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__close\s*\{[\s\S]*top:\s*27px;[\s\S]*transform:\s*translateY\(-50%\);/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__selected-locate\s*\{[\s\S]*background:\s*transparent;/
		);
		expect(styles).toMatch(
			/\.maxi-block-select-control[\s\S]*&__selected-clear\s*\{[\s\S]*border:\s*1px solid var\(--maxi-grey-light\);/
		);
		expect(styles).not.toMatch(/&__option-count/);
	});

	it('uses a direct dotted purple-pink highlight for hovered editor blocks and text content', () => {
		const styles = readFileSync(
			path.resolve(
				process.cwd(),
				'src/components/relation-control/editor.scss'
			),
			'utf8'
		);

		expect(styles).toMatch(
			/\.maxi-block--highlighted,[\s\S]*\.maxi-block--highlighted > \.maxi-block,[\s\S]*\.maxi-block--highlighted \.maxi-text-block__content,[\s\S]*\.maxi-text-block__content\.maxi-block--highlighted,[\s\S]*body\.maxi-blocks--active[\s\S]*\.block-editor-rich-text__editable\.maxi-text-block__content\.maxi-block--highlighted\s*\{/
		);
		expect(styles).toMatch(
			/\.maxi-block--highlighted,[\s\S]*outline:\s*2px dotted #c026d3 !important;[\s\S]*position:\s*relative !important;[\s\S]*z-index:\s*1000 !important;/
		);
		expect(styles).not.toMatch(
			/\.maxi-block--highlighted[\s\S]{0,220}&::after/
		);
	});

	it('adds a temporary purple-pink pulse style for revealed editor blocks', () => {
		const styles = readFileSync(
			path.resolve(
				process.cwd(),
				'src/components/relation-control/editor.scss'
			),
			'utf8'
		);

		expect(styles).toMatch(
			/\.maxi-block--revealed,[\s\S]*\.maxi-text-block__content\.maxi-block--revealed[\s\S]*animation:\s*maxi-relation-reveal-pulse 1\.2s ease-out;/
		);
		expect(styles).toMatch(/@keyframes maxi-relation-reveal-pulse/);
		expect(styles).toMatch(/rgba\(192,\s*38,\s*211,\s*0\.45\)/);
	});
});
