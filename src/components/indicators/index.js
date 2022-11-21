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
		topUnit:
			getLastBreakpointAttribute({
				target: 'margin-top-unit',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		rightUnit:
			getLastBreakpointAttribute({
				target: 'margin-right-unit',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		leftUnit:
			getLastBreakpointAttribute({
				target: 'margin-left-unit',
				breakpoint: deviceType,
				attributes: props,
			}) || 0,
		bottomUnit:
			getLastBreakpointAttribute({
				target: 'margin-bottom-unit',
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
		topUnit:
			getLastBreakpointAttribute({
				target: 'padding-top-unit',
				breakpoint: deviceType,
				attributes: props,
			}) || 'px',
		bottomUnit:
			getLastBreakpointAttribute({
				target: 'padding-bottom-unit',
				breakpoint: deviceType,
				attributes: props,
			}) || 'px',
		leftUnit:
			getLastBreakpointAttribute({
				target: 'padding-left-unit',
				breakpoint: deviceType,
				attributes: props,
			}) || 'px',
		rightUnit:
			getLastBreakpointAttribute({
				target: 'padding-right-unit',
				breakpoint: deviceType,
				attributes: props,
			}) || 'px',
	};

	const handleOnResizeStart = (type, e, dir) => {
		e.preventDefault();
		onChange({
			[`${type}-${dir}-unit`]: [type][`${[dir]}Unit`],
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
							: 'width']: `${margin[dir]}${
							margin[`${[dir]}Unit`]
						}`,
						[dir]: `${margin[dir] <= 0 ? -4 : -margin[dir]}${
							margin[`${[dir]}Unit`]
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
										height: `${margin[dir]}${
											margin[`${[dir]}Unit`]
										}`,
								  }
								: {
										width: `${margin[dir]}${
											margin[`${[dir]}Unit`]
										}`,
										height: '100%',
								  }
						}
						size={
							dir === 'top' || dir === 'bottom'
								? {
										width: '100%',
										height: `${margin[dir]}${
											margin[`${[dir]}Unit`]
										}`,
								  }
								: {
										width: `${margin[dir]}${
											margin[`${[dir]}Unit`]
										}`,
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
						{((margin[`${[dir]}Unit`] === 'px' &&
							margin[dir] > 19) ||
							(margin[`${[dir]}Unit`] !== 'px' &&
								margin[dir] > 2)) && (
							<span>{`${margin[dir]}${
								margin[`${[dir]}Unit`]
							}`}</span>
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
									height: `${padding[dir]}${
										padding[`${[dir]}Unit`]
									}`,
							  }
							: {
									width: `${padding[dir]}${
										padding[`${[dir]}Unit`]
									}`,
									height: '100%',
							  }
					}
					size={
						dir === 'top' || dir === 'bottom'
							? {
									width: '100%',
									height: `${padding[dir]}${
										padding[`${[dir]}Unit`]
									}`,
							  }
							: {
									width: `${padding[dir]}${
										padding[`${[dir]}Unit`]
									}`,
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
					{((padding[`${[dir]}Unit`] === 'px' && padding[dir] > 19) ||
						(padding[`${[dir]}Unit`] !== 'px' &&
							padding[dir] > 2)) && (
						<span>{`${padding[dir]}${
							padding[`${[dir]}Unit`]
						}`}</span>
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
