/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useMemo,
	useCallback,
	useRef,
	useTransition,
	memo,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import { getGroupAttributes } from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Helper function to compute diff between previous and next attributes
 * Only returns keys that actually changed to minimize payload
 */
const diffAttrs = (prev, next) => {
	const out = {};
	for (const k in next) {
		if (next[k] !== prev?.[k]) {
			out[k] = next[k];
		}
	}
	return out;
};

/**
 * Memoized button component to prevent unnecessary re-renders
 * Only the pressed state button needs to re-render on value change
 */
const LevelButton = memo(({ pressed, onClick, children, className }) => (
	<Button className={className} aria-pressed={pressed} onClick={onClick}>
		{children}
	</Button>
));

LevelButton.displayName = 'LevelButton';

/**
 * Component
 */
const FontLevelControl = memo(props => {
	const { className, value, onChange } = props;

	// Use useTransition to split instant vs heavy updates
	const [, startTransition] = useTransition();

	// Use useRef to cache styles without triggering re-renders
	// This eliminates the performance bottleneck of unnecessary state updates
	const savedStylesRef = useRef({});
	const previousLevelRef = useRef(value);

	// Memoize expensive function calls with proper dependency arrays
	// Only recalculate when the actual typography attributes change
	const fontOptions = useMemo(() => {
		return getGroupAttributes(props, 'typography');
	}, [props]);

	const fontOptionsHover = useMemo(() => {
		return getGroupAttributes(props, 'typographyHover');
	}, [props]);

	// Memoize class names to prevent recalculation
	const classes = useMemo(
		() => classnames('maxi-font-level-control', className),
		[className]
	);

	// Memoize color calculation function
	const getNewColor = useCallback((newLevel, currentColor, lastLevel) => {
		if (lastLevel !== 'p' && newLevel === 'p' && currentColor === 5)
			return 3;
		if (lastLevel === 'p' && newLevel.includes('h') && currentColor === 3)
			return 5;
		return currentColor;
	}, []);

	// Helper to apply only changed attributes - minimizes parent re-renders
	const applyAttrs = useCallback(
		attrs => {
			// Only send changed keys to avoid invalidating unchanged attributes
			const minimal = diffAttrs(props.attributes, attrs);
			if (Object.keys(minimal).length > 0) {
				onChange(minimal);
			}
		},
		[onChange, props.attributes]
	);

	// Optimized main change handler with split instant/heavy updates
	const onChangeValue = useCallback(
		newValue => {
			const previousLevel = previousLevelRef.current;

			// 1) INSTANT: Update just the textLevel so button state responds immediately
			if (newValue !== value) {
				applyAttrs({ textLevel: newValue });
			}

			// 2) DEFERRED: Compute and apply heavy typography attributes in a transition
			// Use requestIdleCallback for even smoother updates
			const defer = cb =>
				window.requestIdleCallback
					? window.requestIdleCallback(cb)
					: setTimeout(cb, 0);

			startTransition(() =>
				defer(() => {
					// Save current styles to ref (no re-render triggered)
					if (fontOptions && Object.keys(fontOptions).length > 0) {
						savedStylesRef.current[previousLevel] = fontOptions;
					}
					if (
						fontOptionsHover &&
						Object.keys(fontOptionsHover).length > 0
					) {
						savedStylesRef.current[`${previousLevel}Hover`] =
							fontOptionsHover;
					}

					// Update previous level ref for next time
					previousLevelRef.current = newValue;

					let fontOptResponse = {};
					let fontOptResponseHover = {};

					// Check if we have saved options for this level
					const savedOptions = savedStylesRef.current[newValue];
					const savedHoverOptions =
						savedStylesRef.current[`${newValue}Hover`];

					if (savedOptions && Object.keys(savedOptions).length > 0) {
						fontOptResponse = savedOptions;
						fontOptResponseHover = savedHoverOptions || {};
					} else if (
						fontOptions &&
						Object.keys(fontOptions).length > 0
					) {
						const newColor = getNewColor(
							newValue,
							fontOptions['palette-color-general'],
							previousLevel
						);

						// Use object spread for better performance and readability
						fontOptResponse = {
							...fontOptions,
							'palette-color-general': newColor,
						};
						fontOptResponseHover = {
							...fontOptionsHover,
							'palette-color-general-hover': 5,
						};
					}

					// Apply heavy typography changes with minimal diff
					const heavyAttrs = {
						...fontOptResponse,
						...fontOptResponseHover,
					};

					// Only send keys that actually changed
					applyAttrs(heavyAttrs);
				})
			);
		},
		[
			value,
			applyAttrs,
			fontOptions,
			fontOptionsHover,
			getNewColor,
			startTransition,
		]
	);

	// Memoize button click handlers to prevent recreation
	const handlePClick = useCallback(() => onChangeValue('p'), [onChangeValue]);
	const handleH1Click = useCallback(
		() => onChangeValue('h1'),
		[onChangeValue]
	);
	const handleH2Click = useCallback(
		() => onChangeValue('h2'),
		[onChangeValue]
	);
	const handleH3Click = useCallback(
		() => onChangeValue('h3'),
		[onChangeValue]
	);
	const handleH4Click = useCallback(
		() => onChangeValue('h4'),
		[onChangeValue]
	);
	const handleH5Click = useCallback(
		() => onChangeValue('h5'),
		[onChangeValue]
	);
	const handleH6Click = useCallback(
		() => onChangeValue('h6'),
		[onChangeValue]
	);

	// Memoize button labels to prevent re-translation on every render
	const labels = useMemo(
		() => ({
			p: __('P', 'maxi-blocks'),
			h1: __('H1', 'maxi-blocks'),
			h2: __('H2', 'maxi-blocks'),
			h3: __('H3', 'maxi-blocks'),
			h4: __('H4', 'maxi-blocks'),
			h5: __('H5', 'maxi-blocks'),
			h6: __('H6', 'maxi-blocks'),
		}),
		[]
	);

	return (
		<div className={classes}>
			<LevelButton
				className='maxi-font-level-control__button'
				pressed={value === 'p'}
				onClick={handlePClick}
			>
				{labels.p}
			</LevelButton>
			<LevelButton
				className='maxi-font-level-control__button'
				pressed={value === 'h1'}
				onClick={handleH1Click}
			>
				{labels.h1}
			</LevelButton>
			<LevelButton
				className='maxi-font-level-control__button'
				pressed={value === 'h2'}
				onClick={handleH2Click}
			>
				{labels.h2}
			</LevelButton>
			<LevelButton
				className='maxi-font-level-control__button'
				pressed={value === 'h3'}
				onClick={handleH3Click}
			>
				{labels.h3}
			</LevelButton>
			<LevelButton
				className='maxi-font-level-control__button'
				pressed={value === 'h4'}
				onClick={handleH4Click}
			>
				{labels.h4}
			</LevelButton>
			<LevelButton
				className='maxi-font-level-control__button'
				pressed={value === 'h5'}
				onClick={handleH5Click}
			>
				{labels.h5}
			</LevelButton>
			<LevelButton
				className='maxi-font-level-control__button'
				pressed={value === 'h6'}
				onClick={handleH6Click}
			>
				{labels.h6}
			</LevelButton>
		</div>
	);
});

FontLevelControl.displayName = 'FontLevelControl';

export default FontLevelControl;
