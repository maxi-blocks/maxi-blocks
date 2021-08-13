/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { startCase, round } from 'lodash';
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
		top: getLastBreakpointAttribute('margin-top', deviceType, props) || 0,
		right:
			getLastBreakpointAttribute('margin-right', deviceType, props) || 0,
		bottom:
			getLastBreakpointAttribute('margin-bottom', deviceType, props) || 0,
		left: getLastBreakpointAttribute('margin-left', deviceType, props) || 0,
		unit: getLastBreakpointAttribute('margin-unit', deviceType, props) || 0,
	};

	const padding = {
		top: getLastBreakpointAttribute('padding-top', deviceType, props) || 0,
		right:
			getLastBreakpointAttribute('padding-right', deviceType, props) || 0,
		bottom:
			getLastBreakpointAttribute('padding-bottom', deviceType, props) ||
			0,
		left:
			getLastBreakpointAttribute('padding-left', deviceType, props) || 0,
		unit:
			getLastBreakpointAttribute('padding-unit', deviceType, props) || 0,
	};

	const handleOnResizeStart = (type, e, dir) => {
		e.preventDefault();
		onChange({
			[`${type}-${dir}-unit`]: [type].unit,
		});
	};

	const handleOnResizeStop = (type, e, dir, ref, d) => {
		onChange({
			[`${type}-${dir}-${breakpoint}`]:
				dir === 'top' || dir === 'bottom'
					? round(ref.getBoundingClientRect().height)
					: round(ref.getBoundingClientRect().width),
		});
	};

	const marginIndicator = () => {
		return ['top', 'right', 'bottom', 'left'].map(dir =>
			margin[dir] && margin[dir] !== 'auto' && +margin[dir] > 0 ? (
				<div
					key={`margin-indicator-${dir}`}
					style={{
						[dir === 'top' || dir === 'bottom'
							? 'height'
							: 'width']: `${margin[dir]}${margin.unit}`,
						[dir]: `${-margin[dir]}${margin.unit}`,
					}}
					className={`maxi-indicators__margin maxi-indicators__margin--${dir}`}
				>
					<Resizable
						enable={{
							top: dir === 'top',
							right: dir === 'right',
							bottom: dir === 'bottom',
							left: dir === 'left',
						}}
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
						onResizeStop={(e, dir, ref, d) =>
							handleOnResizeStop('margin', e, dir, ref, d)
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
		return ['top', 'right', 'bottom', 'left'].map(dir =>
			padding[dir] && padding[dir] > 0 ? (
				<div
					key={`padding-indicator-${dir}`}
					className={`maxi-indicators__padding maxi-indicators__padding--${dir}`}
				>
					<Resizable
						enable={{
							top: dir === 'top',
							right: dir === 'right',
							bottom: dir === 'bottom',
							left: dir === 'left',
						}}
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
						onResizeStop={(e, dir, ref, d) =>
							handleOnResizeStop('padding', e, dir, ref, d)
						}
					>
						{((padding.unit === 'px' && padding[dir] > 19) ||
							(padding.unit !== 'px' && padding[dir] > 2)) && (
							<span>{`${padding[dir]}${padding.unit}`}</span>
						)}
					</Resizable>
				</div>
			) : null
		);
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
