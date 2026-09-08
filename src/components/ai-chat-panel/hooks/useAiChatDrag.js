/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Manages draggable panel position state and mouse event handlers.
 *
 * @returns {{ position: {x:number,y:number}|null, isDragging: boolean, handleMouseDown: Function }}
 */
const useAiChatDrag = () => {
	const [position, setPosition] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const dragOffset = useRef({ x: 0, y: 0 });

	const handleMouseDown = useCallback(e => {
		if (e.target.closest('button')) return;
		setIsDragging(true);
		const panelRect = e.currentTarget
			.closest('.maxi-ai-chat-panel')
			.getBoundingClientRect();
		dragOffset.current = {
			x: e.clientX - panelRect.left,
			y: e.clientY - panelRect.top,
		};
		e.preventDefault();
	}, []);

	const handleMouseMove = useCallback(
		e => {
			if (!isDragging) return;
			const newX = e.clientX - dragOffset.current.x;
			const newY = e.clientY - dragOffset.current.y;
			const maxX = window.innerWidth - 100;
			const maxY = window.innerHeight - 50;
			setPosition({
				x: Math.max(0, Math.min(newX, maxX)),
				y: Math.max(0, Math.min(newY, maxY)),
			});
		},
		[isDragging]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	return { position, isDragging, handleMouseDown };
};

export default useAiChatDrag;
