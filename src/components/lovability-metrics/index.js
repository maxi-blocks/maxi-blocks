/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { select, subscribe, useSelect } from '@wordpress/data';

/**
 * Styles
 */
import './editor.scss';

const TEXT_ATTRIBUTE_KEYS = [
	'content',
	'text',
	'title',
	'subtitle',
	'label',
	'description',
	'caption',
	'alt',
	'ariaLabel',
	'placeholder',
	'heading',
	'subheading',
];

const countTokens = value => {
	if (!value || typeof value !== 'string') return 0;
	const trimmed = value.trim();
	if (!trimmed) return 0;
	return trimmed.split(/\s+/).length;
};

const countTokensFromAttributes = attributes => {
	if (!attributes) return 0;
	return TEXT_ATTRIBUTE_KEYS.reduce((total, key) => {
		const value = attributes[key];
		if (typeof value === 'string') {
			return total + countTokens(value);
		}
		if (Array.isArray(value)) {
			return (
				total +
				value.reduce((arrayTotal, item) => {
					if (typeof item === 'string') {
						return arrayTotal + countTokens(item);
					}
					return arrayTotal;
				}, 0)
			);
		}
		return total;
	}, 0);
};

const collectTokenUsage = blocks => {
	const usage = [];

	const traverse = block => {
		const tokenCount = countTokensFromAttributes(block.attributes);
		if (tokenCount > 0) {
			usage.push(tokenCount);
		}

		if (block.innerBlocks?.length) {
			block.innerBlocks.forEach(traverse);
		}
	};

	blocks.forEach(traverse);
	return usage;
};

const calculateCohesionScore = tokenUsage => {
	if (!tokenUsage.length) return 0;
	if (tokenUsage.length === 1) return 100;

	const mean =
		tokenUsage.reduce((sum, value) => sum + value, 0) / tokenUsage.length;
	if (!mean) return 0;

	const variance =
		tokenUsage.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
		tokenUsage.length;
	const stdDev = Math.sqrt(variance);
	const normalized = Math.max(0, Math.min(1, 1 - stdDev / mean));

	return Math.round(normalized * 100);
};

const getEditorContent = () => {
	const editorSelect = select('core/editor');
	if (editorSelect?.getEditedPostAttribute) {
		return editorSelect.getEditedPostAttribute('content');
	}
	if (editorSelect?.getEditedPostContent) {
		return editorSelect.getEditedPostContent();
	}
	return null;
};

const getHistoryLengths = () => {
	const editorSelect = select('core/editor');
	const blockEditorSelect = select('core/block-editor');
	const undoStack =
		editorSelect?.getUndoStack?.() || blockEditorSelect?.getUndoStack?.();
	const redoStack =
		editorSelect?.getRedoStack?.() || blockEditorSelect?.getRedoStack?.();

	return {
		undoLength: Array.isArray(undoStack) ? undoStack.length : 0,
		redoLength: Array.isArray(redoStack) ? redoStack.length : 0,
	};
};

const calculateFlowScore = timeToFirstEditMs => {
	if (!timeToFirstEditMs) return null;
	const maxMs = 5 * 60 * 1000;
	const clamped = Math.min(timeToFirstEditMs, maxMs);
	const score = 1 - clamped / maxMs;
	return Math.round(score * 100);
};

const LovabilityMetrics = () => {
	const blocks = useSelect(
		selectInstance => selectInstance('core/block-editor')?.getBlocks?.() || [],
		[]
	);

	const [timeToFirstEditMs, setTimeToFirstEditMs] = useState(null);
	const [undoCount, setUndoCount] = useState(0);
	const [redoCount, setRedoCount] = useState(0);

	const startTimeRef = useRef(Date.now());
	const firstEditRecordedRef = useRef(false);

	useEffect(() => {
		const initialContent = getEditorContent();
		const unsubscribe = subscribe(() => {
			if (firstEditRecordedRef.current) {
				return;
			}

			const currentContent = getEditorContent();
			if (currentContent !== null && currentContent !== initialContent) {
				firstEditRecordedRef.current = true;
				setTimeToFirstEditMs(Date.now() - startTimeRef.current);
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		let { undoLength, redoLength } = getHistoryLengths();

		const unsubscribe = subscribe(() => {
			const {
				undoLength: currentUndo,
				redoLength: currentRedo,
			} = getHistoryLengths();

			if (currentUndo < undoLength && currentRedo > redoLength) {
				setUndoCount(count => count + 1);
			} else if (currentUndo > undoLength && currentRedo < redoLength) {
				setRedoCount(count => count + 1);
			}

			undoLength = currentUndo;
			redoLength = currentRedo;
		});

		return () => unsubscribe();
	}, []);

	const tokenUsage = useMemo(() => collectTokenUsage(blocks), [blocks]);
	const cohesionScore = useMemo(
		() => calculateCohesionScore(tokenUsage),
		[tokenUsage]
	);
	const flowScore = useMemo(
		() => calculateFlowScore(timeToFirstEditMs),
		[timeToFirstEditMs]
	);
	const timeToFirstEditSeconds = timeToFirstEditMs
		? (timeToFirstEditMs / 1000).toFixed(1)
		: null;

	return (
		<div className='maxi-lovability-metrics'>
			<div className='maxi-lovability-metrics__header'>
				Lovability metrics
			</div>
			<div className='maxi-lovability-metrics__rows'>
				<div className='maxi-lovability-metrics__row'>
					<span>Design cohesion</span>
					<strong>{cohesionScore}</strong>
				</div>
				<div className='maxi-lovability-metrics__row'>
					<span>Flow score</span>
					<strong>{flowScore ?? '—'}</strong>
				</div>
				<div className='maxi-lovability-metrics__row'>
					<span>Time to first edit</span>
					<strong>
						{timeToFirstEditSeconds
							? `${timeToFirstEditSeconds}s`
							: '—'}
					</strong>
				</div>
				<div className='maxi-lovability-metrics__row'>
					<span>Undo / rollback</span>
					<strong>
						{undoCount} / {redoCount}
					</strong>
				</div>
			</div>
		</div>
	);
};

export default LovabilityMetrics;
