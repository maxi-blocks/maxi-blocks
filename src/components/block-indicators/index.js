/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

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
	const dragTime = useRef(null);

	useEffect(() => {
		if (+value !== +val) setValue(val);
	}, [val]);

	const classes = classnames(
		'maxi-block-indicator',
		`maxi-block-indicator--${dir}`,
		`maxi-block-indicators__${type}`
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
		e.preventDefault();

		const newValue = isVertical
			? round(ref.getBoundingClientRect().height)
			: round(ref.getBoundingClientRect().width);

		setValue(newValue);

		return newValue;
	};

	const avoidResizing = () =>
		!isNumber(dragTime.current) || Date.now() - dragTime.current < 150;

	const handleOnResize = (type, e, ref) => {
		// Avoids triggering on click
		if (avoidResizing()) return;

		const newValue = handleChanges(e, ref);

		insertInlineStyles({
			obj: {
				[`${type}-${dir}`]: `${newValue}px`,
				transition: 'none',
			},
		});
	};

	const handleOnResizeStop = (type, e, ref) => {
		// Avoids triggering on click
		if (avoidResizing()) return;

		const newValue = handleChanges(e, ref);
		onChange({
			[`${type}-${dir}-${breakpoint}`]: `${newValue}`,
		});
		cleanInlineStyles();
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
				}}
				defaultSize={size}
				size={size}
				handleWrapperStyle={handleStyles}
				handleStyles={handleStyles}
				onResizeStart={() => {
					dragTime.current = isBlockSelected ? Date.now() : null;
				}}
				onResize={(e, dir, ref) => handleOnResize(type, e, ref)}
				onResizeStop={(e, dir, ref) => handleOnResizeStop(type, e, ref)}
			>
				{content}
			</Resizable>
		</div>
	);
};

const MainIndicator = props => {
	const { type, breakpoint, avoidIndicators } = props;

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
				{...props}
			/>
		);
	});
};

const BlockIndicators = props => {
	const { children, className } = props;

	const classes = classnames('maxi-block-indicators', className);

	return (
		<div className={classes}>
			<MainIndicator type='margin' {...props} />
			{children}
			<MainIndicator type='padding' {...props} />
		</div>
	);
};

export default BlockIndicators;
