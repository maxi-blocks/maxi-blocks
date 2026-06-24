import { clampPosition } from '../hooks/useDraggable';
import { readStoredValue, writeStoredValue } from '../hooks/usePersistentState';

describe('drag + persistence', () => {
	test('clamps position within bounds', () => {
		const position = clampPosition({ x: 120, y: -20 }, { minX: 0, minY: 0, maxX: 100, maxY: 100 });
		expect(position.x).toBe(100);
		expect(position.y).toBe(0);
	});

	test('persists to localStorage', () => {
		writeStoredValue('maxi-chat-test', { x: 10, y: 20 });
		const value = readStoredValue('maxi-chat-test', {});
		expect(value).toEqual({ x: 10, y: 20 });
	});
});
