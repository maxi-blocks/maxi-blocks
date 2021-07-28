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
			{paddingTop && paddingTop > 0 ? (
				<div
					style={{
						paddingTop: `${paddingTop}${paddingUnit}`,
						top: `${marginTop}${marginUnit}`,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--top'
				>
					{((paddingUnit === 'px' && paddingTop > 19) ||
						(paddingUnit !== 'px' && paddingTop > 2)) && (
						<span>{`${paddingTop}${paddingUnit}`}</span>
					)}
				</div>
			) : null}
			{paddingRight && paddingRight > 0 ? (
				<div
					style={{
						paddingRight: `${paddingRight}${paddingUnit}`,
						right: `${marginRight}${marginUnit}`,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--right'
				>
					{((paddingUnit === 'px' && paddingRight > 35) ||
						(paddingUnit !== 'px' && paddingRight > 2)) && (
						<span>{`${paddingRight}${paddingUnit}`}</span>
					)}
				</div>
			) : null}
			{paddingBottom && paddingBottom > 0 ? (
				<div
					style={{
						paddingBottom: `${paddingBottom}${paddingUnit}`,
						bottom: `${marginBottom}${marginUnit}`,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--bottom'
				>
					{((paddingUnit === 'px' && paddingBottom > 19) ||
						(paddingUnit !== 'px' && paddingBottom > 2)) && (
						<span>{`${paddingBottom}${paddingUnit}`}</span>
					)}
				</div>
			) : null}
			{paddingLeft && paddingLeft > 0 ? (
				<div
					style={{
						paddingLeft: `${paddingLeft}${paddingUnit}`,
						left: `${marginLeft}${marginUnit}`,
					}}
					className='maxi-indicators__padding maxi-indicators__padding--left'
				>
					{((paddingUnit === 'px' && paddingLeft > 35) ||
						(paddingUnit !== 'px' && paddingLeft > 2)) && (
						<span>{`${paddingLeft}${paddingUnit}`}</span>
					)}
				</div>
			) : null}
		</div>
	);
};

export default Indicators;
