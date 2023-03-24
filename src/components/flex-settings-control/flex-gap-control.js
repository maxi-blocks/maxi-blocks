/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';

/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * Component
 */

const FlexGapControl = props => {
	const { className } = props;

	const classes = classNames('maxi-gap-control', className);

	return (
		<div className={classes}>
			<GapAxisControl label='Row gap' target='row-gap' {...props} />
			<GapAxisControl label='Column gap' target='column-gap' {...props} />
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
					[getAttributeKey(
						`${target}-unit`,
						false,
						false,
						breakpoint
					)]: val,
				});
			}}
			value={getLastBreakpointAttribute({
				target,
				breakpoint,
				attributes: props,
			})}
			onChangeValue={val => {
				onChange({
					[getAttributeKey(target, false, false, breakpoint)]: val,
				});
			}}
			allowedUnits={['px', 'em', 'vw', '%']}
			onReset={() =>
				onChange({
					[getAttributeKey(target, false, false, breakpoint)]:
						getDefaultAttribute(
							getAttributeKey(target, false, false, breakpoint)
						),
					[getAttributeKey(
						`${target}-unit`,
						false,
						false,
						breakpoint
					)]: getDefaultAttribute(
						getAttributeKey(
							`${target}-unit`,
							false,
							false,
							breakpoint
						)
					),
					isReset: true,
				})
			}
		/>
	);
};
export default FlexGapControl;
