/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * Component
 */

const FlexGapControl = props => {
	const { className, prefix = '' } = props;

	const classes = classNames('maxi-gap-control', className);

	return (
		<div className={classes}>
			<GapAxisControl
				label='Row gap'
				target={`${prefix}row-gap`}
				{...props}
			/>
			<GapAxisControl
				label='Column gap'
				target={`${prefix}column-gap`}
				{...props}
			/>
		</div>
	);
};

const GapAxisControl = props => {
	const { label, target, onChange, breakpoint } = props;

	return (
		<AdvancedNumberControl
			className={`maxi-gap-control__${target}`}
			label={__(label, 'maxi-blocks')}
			enableUnit
			unit={getLastBreakpointAttribute({
				target: `${target}-unit`,
				breakpoint,
				attributes: props,
			})}
			onChangeUnit={val => {
				onChange({
					[`${target}-unit-${breakpoint}`]: val,
				});
			}}
			value={getLastBreakpointAttribute({
				target,
				breakpoint,
				attributes: props,
			})}
			onChangeValue={val => {
				onChange({
					[`${target}-${breakpoint}`]: val,
				});
			}}
			allowedUnits={['px', 'em', 'vw', '%']}
			onReset={() =>
				onChange({
					[`${target}-${breakpoint}`]: getDefaultAttribute(
						`${target}-${breakpoint}`
					),
					[`${target}-unit-${breakpoint}`]: getDefaultAttribute(
						`${target}-unit-${breakpoint}`
					),
					isReset: true,
				})
			}
		/>
	);
};
export default FlexGapControl;
