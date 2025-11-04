/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { round, isNil, capitalize, isNumber } from 'lodash';
import { Resizable } from 're-resizable';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */

const minSizeValue = 10;
const minSize = `var(--maxi-block-indicators-min-size, ${minSizeValue}px)`;

const Indicator = props => {
	const {
		value: val,
		unit,
		dir,
		type,
		breakpoint,
		insertInlineStyles,
		onChange,
		cleanInlineStyles,
		isBlockSelected,
	} = props;

	const [value, setValue] = useState(val);
	const [isDragging, setIsDragging] = useState(false);
	const dragTime = useRef(null);
	const rafRef = useRef(null);
	const { selectBlock } = dispatch('core/block-editor');

	useEffect(() => {
		if (+value !== +val) setValue(val);
	}, [val]);

	useEffect(() => {
		// Cleanup RAF on unmount
		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	const classes = classnames(
		'maxi-block-indicator',
		`maxi-block-indicator--${dir}`,
		`maxi-block-indicators__${type}`,
		{ 'is-dragging': isDragging }
	);

	const getDirection = dir => {
		if (type === 'margin') return dir;

		// Need to do inverse for padding to allow good UX on dragging
		switch (dir) {
			case 'top':
				return 'bottom';
			case 'bottom':
				return 'bottom';
			case 'left':
				return 'right';
			case 'right':
			default:
				return 'left';
		}
	};

	const isVertical = dir === 'top' || dir === 'bottom';

	const style = {
		[isVertical ? 'height' : 'width']: `${value}${unit}`,
		[isVertical ? 'minHeight' : 'minWidth']: minSize,
		...(type === 'margin' &&
			value > 0 && {
				[dir]: `${-value}${unit}`,
			}),
		...(type === 'padding' &&
			!isVertical && {
				[dir]: 0,
				...(dir === 'right' && {
					right: '1px',
				}),
			}),
	};

	const size = {
		height: '100%',
		width: '100%',
		[isVertical ? 'minHeight' : 'minWidth']: minSize,
	};

	const handleStyles = {
		[getDirection(dir)]: {
			[getDirection(dir)]: 0,
			[isVertical ? 'height' : 'width']: `${value}${unit}`,
			[isVertical ? 'minHeight' : 'minWidth']: minSize,
		},
	};

	const handleChanges = (e, ref) => {
		// Only preventDefault for non-touch events to avoid passive listener issues
		if (!e.touches) {
			e.preventDefault();
		}

		const newValue = isVertical
			? round(ref.getBoundingClientRect().height)
			: round(ref.getBoundingClientRect().width);

		setValue(newValue);

		return newValue;
	};

	const avoidResizing = () =>
		!isNumber(dragTime.current) || Date.now() - dragTime.current < 150;

	const getBlockClientId = event => {
		// Method 1: Try to get clientId from event
		if (event && event.target) {
			const blockEl = event.target.closest('[data-block]');
			if (blockEl) {
				return blockEl.getAttribute('data-block');
			}
		}

		// Method 2: Try to find parent .maxi-block-indicators element
		try {
			// Start from document and find parent block
			const indicatorsEl = document.querySelector(
				'.maxi-block-indicators'
			);
			if (indicatorsEl) {
				const parentBlock = indicatorsEl.closest('[data-block]');
				if (parentBlock) {
					return parentBlock.getAttribute('data-block');
				}
			}
		} catch (error) {
			// Silent fail
		}

		return null;
	};

	const handleOnResize = (type, e, ref) => {
		// Avoids triggering on click
		if (avoidResizing()) return;

		// Cancel previous frame to throttle updates
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
		}

		// Schedule update for next frame
		rafRef.current = requestAnimationFrame(() => {
			// Get block clientId
			const blockClientId = getBlockClientId(e);

			// Select the block if it's not already selected and we have a clientId
			if (!isBlockSelected && blockClientId) {
				selectBlock(blockClientId);
			}

			const newValue = isVertical
				? round(ref.getBoundingClientRect().height)
				: round(ref.getBoundingClientRect().width);

			// Only update inline styles during drag, not state
			insertInlineStyles({
				obj: {
					[`${type}-${dir}`]: `${newValue}px`,
					transition: 'none',
				},
			});
		});
	};

	const handleOnResizeStop = (type, e, ref) => {
		// Avoids triggering on click
		if (avoidResizing()) return;

		// Cancel any pending RAF
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}

		setIsDragging(false);

		const newValue = handleChanges(e, ref);
		onChange({
			[`${type}-${dir}-${breakpoint}`]: `${newValue}`,
		});
		cleanInlineStyles();
	};

	const handleOnResizeStart = e => {
		// Don't use preventDefault here as it causes issues with passive listeners
		// Just use stopPropagation to prevent event bubbling
		e.stopPropagation();

		// Always set drag time for consistency
		dragTime.current = Date.now();
		setIsDragging(true);

		// Get block clientId
		const blockClientId = getBlockClientId(e);

		// Select the block if it's not already selected and we have a clientId
		if (!isBlockSelected && blockClientId) {
			selectBlock(blockClientId);
		}
	};

	const showContent =
		(unit === 'px' && value > 19) || (unit !== 'px' && value > 2);

	const content = showContent && (
		<span>{`${capitalize(type)}: ${value}${unit}`}</span>
	);

	return (
		<div key={`${type}-indicator-${dir}`} className={classes} style={style}>
			<Resizable
				className='maxi-block-indicator__content'
				handleClasses={{
					[getDirection(dir)]: classnames(
						`maxi-block-indicators__${dir}-handle`,
						'maxi-block-indicators__handle'
					),
				}}
				direction={dir}
				minWidth={0}
				minHeight={0}
				enable={{
					top: dir !== 'bottom' && dir === getDirection('top'),
					right: dir === getDirection('right'),
					bottom: dir === 'top' || dir === 'bottom',
					left: dir === getDirection('left'),
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				}}
				defaultSize={size}
				size={size}
				handleWrapperStyle={handleStyles}
				handleStyles={handleStyles}
				onMouseDown={e => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onTouchStart={e => {
					// Don't use preventDefault for touch events
					e.stopPropagation();
				}}
				onResizeStart={handleOnResizeStart}
				onResize={(e, dir, ref) => {
					// Only preventDefault for non-touch events
					if (!e.touches) {
						e.preventDefault();
					}
					e.stopPropagation();
					handleOnResize(type, e, ref);
				}}
				onResizeStop={(e, dir, ref) => {
					// Only preventDefault for non-touch events
					if (!e.touches) {
						e.preventDefault();
					}
					e.stopPropagation();
					handleOnResizeStop(type, e, ref);
				}}
				grid={[1, 1]}
				snapGap={1}
			>
				{content}
			</Resizable>
		</div>
	);
};

const MainIndicator = props => {
	const { type, breakpoint, avoidIndicators, clientId } = props;

	return ['top', 'right', 'bottom', 'left'].map(dir => {
		if (avoidIndicators[type] && avoidIndicators[type].includes(dir))
			return null;

		const value =
			getLastBreakpointAttribute({
				target: `${type}-${dir}`,
				breakpoint,
				attributes: props,
			}) || 0;

		// In case it has value, we might think a way to show it 🤔
		if (isNil(value) && value === 'auto') return null;

		const unit =
			getLastBreakpointAttribute({
				target: `${type}-${dir}-unit`,
				breakpoint,
				attributes: props,
			}) || 'px';

		return (
			<Indicator
				key={`maxi-blocks-indicators--${type}-${dir}`}
				value={value}
				unit={unit}
				dir={dir}
				type={type}
				breakpoint={breakpoint}
				clientId={clientId}
				{...props}
			/>
		);
	});
};

const BlockIndicators = props => {
	const { children, className, clientId } = props;

	const classes = classnames('maxi-block-indicators', className);

	return (
		<div className={classes}>
			<MainIndicator type='margin' clientId={clientId} {...props} />
			{children}
			<MainIndicator type='padding' clientId={clientId} {...props} />
		</div>
	);
};

export default BlockIndicators;
