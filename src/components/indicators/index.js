/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

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
			{!isNil(marginTop) && marginTop !== 'auto' && +marginTop > 19 ? (
				<div
					style={{
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
						width: +marginLeft,
					}}
					className='maxi-indicators__margin maxi-indicators__margin--left'
				>
					{`${marginLeft}${marginUnit}`}
				</div>
			) : null}
			{children}
			{paddingTop && paddingTop > 19 ? (
				<div
					style={{
						height: paddingTop,
						top: marginTop,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--top'
				>
					{`${paddingTop}${paddingUnit}`}
				</div>
			) : null}
			{paddingRight && paddingRight > 35 ? (
				<div
					style={{
						width: paddingRight,
						right: marginRight,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--right'
				>
					{`${paddingRight}${paddingUnit}`}
				</div>
			) : null}
			{paddingBottom && paddingBottom > 19 ? (
				<div
					style={{
						height: paddingBottom,
						bottom: marginBottom,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--bottom'
				>
					{`${paddingBottom}${paddingUnit}`}
				</div>
			) : null}
			{paddingLeft && paddingLeft > 35 ? (
				<div
					style={{
						width: paddingLeft,
						left: marginLeft,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--left'
				>
					{`${paddingLeft}${paddingUnit}`}
				</div>
			) : null}
		</div>
	);
};

export default Indicators;
