import { useCallback, useState } from '@wordpress/element';

export const clampPosition = (position, bounds) => {
	if (!bounds) return position;
	const { x, y } = position;
	const { minX = 0, minY = 0, maxX = x, maxY = y } = bounds;

	return {
		x: Math.min(Math.max(x, minX), maxX),
		y: Math.min(Math.max(y, minY), maxY),
	};
};

export const useDraggable = ({ initial = { x: 0, y: 0 }, bounds } = {}) => {
	const [position, setPosition] = useState(initial);

	const updatePosition = useCallback(
		next => {
			const nextPos = typeof next === 'function' ? next(position) : next;
			const clamped = clampPosition(nextPos, bounds);
			setPosition(clamped);
			return clamped;
		},
		[position, bounds]
	);

	return {
		position,
		setPosition: updatePosition,
	};
};

export default useDraggable;

