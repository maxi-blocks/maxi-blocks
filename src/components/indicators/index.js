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
					{((margin.unit === 'px' && margin[dir] > 19) ||
						(margin.unit !== 'px' && margin[dir] > 2)) && (
						<span>{`${margin[dir]}${margin.unit}`}</span>
					)}
				</div>
			) : null
		);
	};

	const paddingIndicator = () => {
		return ['top', 'right', 'bottom', 'left'].map(dir =>
			padding[dir] && padding[dir] > 0 ? (
				<div
					key={`padding-indicator-${dir}`}
					style={{
						[`padding${startCase(
							dir
						)}`]: `${padding[dir]}${padding.unit}`,
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
			{marginIndicator()}
			{children}
			{paddingIndicator()}
		</div>
	);
};

export default Indicators;
