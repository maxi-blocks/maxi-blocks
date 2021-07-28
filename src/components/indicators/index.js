/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, startCase } from 'lodash';

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const Indicators = props => {
	const { className, children, deviceType } = props;

	const classes = classnames('maxi-indicators', className);

	const marginTop = getLastBreakpointAttribute(
		'margin-top',
		deviceType,
		props
	);
	const marginRight = getLastBreakpointAttribute(
		'margin-right',
		deviceType,
		props
	);
	const marginBottom = getLastBreakpointAttribute(
		'margin-bottom',
		deviceType,
		props
	);
	const marginLeft = getLastBreakpointAttribute(
		'margin-left',
		deviceType,
		props
	);
	const marginUnit = getLastBreakpointAttribute(
		'margin-unit',
		deviceType,
		props
	);

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

	const paddingIndicator = () => {
		const direction = ['top', 'right', 'bottom', 'left'];

		return direction.map(dir =>
			padding[dir] && padding[dir] > 0 ? (
				<div
					key={`padding-indicator-${dir}`}
					style={{
						[`padding${startCase(
							dir
						)}`]: `${padding[dir]}${padding.unit}`,
						[dir]: `${margin.top}${margin.unit}`,
					}}
					className={`maxi-indicators__padding maxi-indicators__padding--${dir}`}
				>
					{((padding.unit === 'px' && padding[dir] > 19) ||
						(padding.unit !== 'px' && padding[dir] > 2)) && (
						<span>{`${padding[dir]}${padding.unit}`}</span>
					)}
				</div>
			) : null
		);
	};

	return (
		<div className={classes}>
			{!isNil(marginTop) && marginTop !== 'auto' && +marginTop > 19 ? (
				<div
					style={{
						top: -marginTop,
						height: +marginTop,
					}}
					className='maxi-indicators__margin maxi-indicators__margin--top'
				>
					{`${marginTop}${marginUnit}`}
				</div>
			) : null}
			{!isNil(marginRight) &&
			marginRight !== 'auto' &&
			+marginRight > 35 ? (
				<div
					style={{
						right: -marginRight,
						width: +marginRight,
					}}
					className='maxi-indicators__margin maxi-indicators__margin--right'
				>
					{`${marginRight}${marginUnit}`}
				</div>
			) : null}
			{!isNil(marginBottom) &&
			marginBottom !== 'auto' &&
			+marginBottom > 19 ? (
				<div
					style={{
						bottom: -marginBottom,
						height: +marginBottom,
					}}
					className='maxi-indicators__margin maxi-indicators__margin--bottom'
				>
					{`${marginBottom}${marginUnit}`}
				</div>
			) : null}
			{!isNil(marginLeft) && marginLeft !== 'auto' && +marginLeft > 35 ? (
				<div
					style={{
						left: -marginLeft,
						width: +marginLeft,
					}}
					className='maxi-indicators__margin maxi-indicators__margin--left'
				>
					{`${marginLeft}${marginUnit}`}
				</div>
			) : null}
			{children}
			{paddingIndicator()}
		</div>
	);
};

export default Indicators;
