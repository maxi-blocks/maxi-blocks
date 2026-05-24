import { getRenamedSavedStyles } from '../utils';

describe('saved styles utils', () => {
	it('renames a saved style without changing its data', () => {
		const savedStyles = {
			Original: { styles: { color: 'red' } },
		};

		expect(
			getRenamedSavedStyles({
				savedStyles,
				selectedStyle: 'Original',
				newName: 'Renamed',
			})
		).toEqual({
			Renamed: { styles: { color: 'red' } },
		});
	});

	it('does not overwrite an existing saved style name', () => {
		const savedStyles = {
			Original: { styles: { color: 'red' } },
			Existing: { styles: { color: 'blue' } },
		};

		expect(
			getRenamedSavedStyles({
				savedStyles,
				selectedStyle: 'Original',
				newName: 'Existing',
			})
		).toBeNull();
	});
});
