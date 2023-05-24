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
			<GapAxisControl label='Row gap' target='_rg' {...props} />
			<GapAxisControl label='Column gap' target='_cg' {...props} />
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
				target: `${target}.u`,
				breakpoint,
				attributes: props,
			})}
			onChangeUnit={val => {
				onChange({
					[getAttributeKey({ key: `${target}.u`, breakpoint })]: val,
				});
			}}
			value={getLastBreakpointAttribute({
				target,
				breakpoint,
				attributes: props,
			})}
			onChangeValue={val => {
				onChange({
					[getAttributeKey({ key: target, breakpoint })]: val,
				});
			}}
			allowedUnits={['px', 'em', 'vw', '%']}
			onReset={() =>
				onChange({
					[getAttributeKey({ key: target, breakpoint })]:
						getDefaultAttribute(
							getAttributeKey({ key: target, breakpoint })
						),
					[getAttributeKey({ key: `${target}.u`, breakpoint })]:
						getDefaultAttribute(
							getAttributeKey({
								key: `${target}.u`,
								breakpoint,
							})
						),
					isReset: true,
				})
			}
		/>
	);
};
export default FlexGapControl;
