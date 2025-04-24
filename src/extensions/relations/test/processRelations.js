/**
 * Internal dependencies
 */
import processRelations from '@extensions/relations/processRelations';
import Relation from '@extensions/relations/Relation';

jest.mock('@extensions/relations/Relation', () => {
	return jest
		.fn()
		.mockImplementation(function MockRelation(relation, action, index) {
			this.relation = relation;
			this.action = action;
			this.index = index;
			this.removePreviousStylesAndTransitions = jest.fn();
			return this;
		});
});

describe('processRelations', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return null if relations is falsy', () => {
		expect(processRelations(null)).toBeNull();
		expect(processRelations(undefined)).toBeNull();
		expect(processRelations(false)).toBeNull();
	});

	it('should transform relation properties to arrays except specific keys', () => {
		const relations = [
			{
				id: 'rel-1',
				uniqueID: 'unique-1',
				action: 'click',
				trigger: 'div',
				target: 'button',
				styles: { color: 'red' },
				css: { padding: '10px' },
			},
		];

		processRelations(relations);

		// Verify Relation constructor was called with transformed data
		expect(Relation).toHaveBeenCalledWith({
			id: 'rel-1', // Should remain as is
			uniqueID: 'unique-1', // Should remain as is
			action: 'click', // Should remain as is
			trigger: 'div', // Should remain as is
			target: 'button', // Should remain as is
			styles: [{ color: 'red' }], // Should be converted to array
			css: [{ padding: '10px' }], // Should be converted to array
		});

		// Relation constructor is called once for each relation
		expect(Relation).toHaveBeenCalledTimes(1);
	});

	it('should keep arrays as they are when transforming relations', () => {
		const relations = [
			{
				id: 'rel-1',
				uniqueID: 'unique-1',
				styles: [{ color: 'red' }, { backgroundColor: 'blue' }],
				css: { padding: '10px' },
			},
		];

		processRelations(relations);

		// Verify Relation constructor was called with correctly transformed data
		expect(Relation).toHaveBeenCalledWith({
			id: 'rel-1',
			uniqueID: 'unique-1',
			styles: [{ color: 'red' }, { backgroundColor: 'blue' }], // Should remain an array
			css: [{ padding: '10px' }], // Should be converted to array
		});
	});

	it('should handle multiple relations', () => {
		const relations = [
			{
				id: 'rel-1',
				uniqueID: 'unique-1',
				css: { padding: '10px' },
			},
			{
				id: 'rel-2',
				uniqueID: 'unique-2',
				css: { margin: '20px' },
			},
		];

		processRelations(relations);

		// Verify Relation constructor was called for each relation
		expect(Relation).toHaveBeenCalledTimes(2);
		expect(Relation).toHaveBeenNthCalledWith(1, {
			id: 'rel-1',
			uniqueID: 'unique-1',
			css: [{ padding: '10px' }],
		});
		expect(Relation).toHaveBeenNthCalledWith(2, {
			id: 'rel-2',
			uniqueID: 'unique-2',
			css: [{ margin: '20px' }],
		});
	});

	it('should handle removal action with matching relationIndex', () => {
		const relations = [
			{
				id: 'rel-1',
				uniqueID: 'unique-1',
				css: { padding: '10px' },
			},
			{
				id: 'rel-2',
				uniqueID: 'unique-2',
				css: { margin: '20px' },
			},
		];

		const result = processRelations(relations, 'remove', 'rel-2');

		// Should find the relation with id === relationIndex
		expect(Relation).toHaveBeenCalledWith(
			{
				id: 'rel-2',
				uniqueID: 'unique-2',
				css: [{ margin: '20px' }],
			},
			'remove',
			'rel-2'
		);

		// Verify removePreviousStylesAndTransitions was called
		const mockInstance = Relation.mock.instances[0];
		expect(
			mockInstance.removePreviousStylesAndTransitions
		).toHaveBeenCalled();

		// Should return null for removal
		expect(result).toBeNull();
	});

	it('should handle non-removal action with relationIndex', () => {
		const relations = [
			{
				id: 'rel-1',
				uniqueID: 'unique-1',
				css: { padding: '10px' },
			},
		];

		const result = processRelations(relations, 'update', 'rel-1');

		// Should call Relation constructor with action and index
		expect(Relation).toHaveBeenCalledWith(
			{
				id: 'rel-1',
				uniqueID: 'unique-1',
				css: [{ padding: '10px' }],
			},
			'update',
			'rel-1'
		);

		// Should not call removePreviousStylesAndTransitions for non-remove action
		const mockInstance = Relation.mock.instances[0];
		expect(
			mockInstance.removePreviousStylesAndTransitions
		).not.toHaveBeenCalled();

		// Should return null when relationAction and relationIndex are provided
		expect(result).toBeNull();
	});
});
