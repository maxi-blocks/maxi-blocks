/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { round } from 'lodash';
import { Resizable } from 're-resizable';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const Indicators = props => {
	const {
		breakpoint = 'general',
		children,
		className,
		deviceType,
		onChange,
	} = props;

	const classes = classnames('maxi-indicators', className);

	const margin = {
		top:
			getLastBreakpointAttribute({
				target: 'margin-top',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		right:
			getLastBreakpointAttribute({
				target: 'margin-right',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		bottom:
			getLastBreakpointAttribute({
				target: 'margin-bottom',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		left:
			getLastBreakpointAttribute({
				target: 'margin-left',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		unit:
			getLastBreakpointAttribute({
				target: 'margin-unit',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
	};

	const padding = {
		top:
			getLastBreakpointAttribute({
				target: 'padding-top',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		right:
			getLastBreakpointAttribute({
				target: 'padding-right',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		bottom:
			getLastBreakpointAttribute({
				target: 'padding-bottom',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		left:
			getLastBreakpointAttribute({
				target: 'padding-left',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		unit:
			getLastBreakpointAttribute({
				target: 'padding-unit',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
	};

	const handleOnResizeStart = (type, e, dir) => {
		e.preventDefault();
		onChange({
			[`${type}-${dir}-unit`]: [type].unit,
		});
	};

	const handleOnResize = (type, e, dir, ref) => {
		e.preventDefault();
		onChange({
			[`${type}-${dir}-${breakpoint}`]:
				dir === 'top' || dir === 'bottom'
					? round(ref.getBoundingClientRect().height)
					: round(ref.getBoundingClientRect().width),
		});
	};

	const handleClasses = dir => {
		return {
			top:
				dir === 'top' &&
				classnames(
					'maxi-indicators__top-handle',
					'maxi-indicators__handle'
				),
			right:
				dir === 'right' &&
				classnames(
					'maxi-indicators__right-handle',
					'maxi-indicators__handle'
				),
			bottom:
				dir === 'bottom' &&
				classnames(
					'maxi-indicators__bottom-handle',
					'maxi-indicators__handle'
				),
			left:
				dir === 'left' &&
				classnames(
					'maxi-indicators__left-handle',
					'maxi-indicators__handle'
				),
		};
	};

	const enableOptions = dir => {
		return {
			top: dir === 'top',
			right: dir === 'right',
			bottom: dir === 'bottom',
			left: dir === 'left',
		};
	};

	const marginIndicator = () => {
		return ['top', 'right', 'bottom', 'left'].map(dir =>
			margin[dir] && margin[dir] !== 'auto' ? (
				<div
					key={`margin-indicator-${dir}`}
					style={{
						[dir === 'top' || dir === 'bottom'
							? 'height'
							: 'width']: `${margin[dir]}${margin.unit}`,
						[dir]: `${margin[dir] <= 0 ? -4 : -margin[dir]}${
							margin.unit
						}`,
					}}
					className={`maxi-indicators__margin maxi-indicators__margin--${dir}`}
				>
					<Resizable
						handleClasses={handleClasses(dir)}
						minWidth={0}
						minHeight={0}
						enable={enableOptions(dir)}
						defaultSize={
							dir === 'top' || dir === 'bottom'
								? {
										width: '100%',
										height: `${margin[dir]}${margin.unit}`,
								  }
								: {
										width: `${margin[dir]}${margin.unit}`,
										height: '100%',
								  }
						}
						size={
							dir === 'top' || dir === 'bottom'
								? {
										width: '100%',
										height: `${margin[dir]}${margin.unit}`,
								  }
								: {
										width: `${margin[dir]}${margin.unit}`,
										height: '100%',
								  }
						}
						onResizeStart={(e, dir) =>
							handleOnResizeStart('margin', e, dir)
						}
						onResize={(e, dir, ref, d) =>
							handleOnResize('margin', e, dir, ref)
						}
					>
						{((margin.unit === 'px' && margin[dir] > 19) ||
							(margin.unit !== 'px' && margin[dir] > 2)) && (
							<span>{`${margin[dir]}${margin.unit}`}</span>
						)}
					</Resizable>
				</div>
			) : null
		);
	};

	const paddingIndicator = () => {
		return ['top', 'right', 'bottom', 'left'].map(dir => (
			<div
				key={`padding-indicator-${dir}`}
				className={`maxi-indicators__padding maxi-indicators__padding--${dir}`}
			>
				<Resizable
					handleClasses={handleClasses(dir)}
					minWidth={0}
					minHeight={0}
					enable={enableOptions(dir)}
					defaultSize={
						dir === 'top' || dir === 'bottom'
							? {
									width: '100%',
									height: `${padding[dir]}${padding.unit}`,
							  }
							: {
									width: `${padding[dir]}${padding.unit}`,
									height: '100%',
							  }
					}
					size={
						dir === 'top' || dir === 'bottom'
							? {
									width: '100%',
									height: `${padding[dir]}${padding.unit}`,
							  }
							: {
									width: `${padding[dir]}${padding.unit}`,
									height: '100%',
							  }
					}
					onResizeStart={(e, dir) =>
						handleOnResizeStart('padding', e, dir)
					}
					onResize={(e, dir, ref, d) =>
						handleOnResize('padding', e, dir, ref)
					}
				>
					{((padding.unit === 'px' && padding[dir] > 19) ||
						(padding.unit !== 'px' && padding[dir] > 2)) && (
						<span>{`${padding[dir]}${padding.unit}`}</span>
					)}
				</Resizable>
			</div>
		));
	};

	return (
		<div className={classes}>
			{marginIndicator()}
			{children}
			{paddingIndicator()}
		</div>
	);
};

export default Indicators;
