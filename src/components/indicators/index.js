/**
 * External dependencies
 */
import classnames from 'classnames';

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

	const paddingTop = getLastBreakpointAttribute(
		'padding-top',
		deviceType,
		props
	);
	const paddingRight = getLastBreakpointAttribute(
		'padding-right',
		deviceType,
		props
	);
	const paddingBottom = getLastBreakpointAttribute(
		'padding-bottom',
		deviceType,
		props
	);
	const paddingLeft = getLastBreakpointAttribute(
		'padding-left',
		deviceType,
		props
	);
	const paddingUnit = getLastBreakpointAttribute(
		'padding-unit',
		deviceType,
		props
	);

	return (
		<div className={classes}>
			{marginTop && (
				<div
					style={{
						height: marginTop,
					}}
					className='maxi-indicators__margin maxi-indicators__margin--top'
				>
					{marginTop > 19 && `${marginTop}${marginUnit}`}
				</div>
			)}
			{marginRight && (
				<div
					style={{
						width: marginRight,
					}}
					className='maxi-indicators__margin maxi-indicators__margin--right'
				>
					{marginRight > 35 && `${marginRight}${marginUnit}`}
				</div>
			)}
			{marginBottom && (
				<div
					style={{
						height: marginBottom,
					}}
					className='maxi-indicators__margin maxi-indicators__margin--bottom'
				>
					{marginBottom > 19 && `${marginBottom}${marginUnit}`}
				</div>
			)}
			{marginLeft && (
				<div
					style={{
						width: marginLeft,
					}}
					className='maxi-indicators__margin maxi-indicators__margin--left'
				>
					{marginLeft > 35 && `${marginLeft}${marginUnit}`}
				</div>
			)}
			{children}
			{paddingTop && (
				<div
					style={{
						height: paddingTop,
						top: marginTop,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--top'
				>
					{paddingTop > 19 && `${paddingTop}${paddingUnit}`}
				</div>
			)}
			{paddingRight && (
				<div
					style={{
						width: paddingRight,
						right: marginRight,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--right'
				>
					{paddingRight > 35 && `${paddingRight}${paddingUnit}`}
				</div>
			)}
			{paddingBottom && (
				<div
					style={{
						height: paddingBottom,
						bottom: marginBottom,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--bottom'
				>
					{paddingBottom > 19 && `${paddingBottom}${paddingUnit}`}
				</div>
			)}
			{paddingLeft && (
				<div
					style={{
						width: paddingLeft,
						left: marginLeft,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--left'
				>
					{paddingLeft > 35 && `${paddingLeft}${paddingUnit}`}
				</div>
			)}
		</div>
	);
};

export default Indicators;
