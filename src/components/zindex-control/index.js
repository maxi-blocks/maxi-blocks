/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ZIndexControl = props => {
	const { onChange, className, breakpoint } = props;

	const classes = classnames('maxi-zIndex-control', className);

	return (
		<AdvancedNumberControl
			label={__('Z-index', 'maxi-blocks')}
			className={classes}
			placeholder=''
			disableUnit
			defaultValue={getDefaultAttribute(`z-index-${breakpoint}`)}
			value={getLastBreakpointAttribute('z-index', breakpoint, props)}
			onChangeValue={val => {
				onChange({
					[`z-index-${breakpoint}`]:
						val !== undefined && val !== '' ? val : '',
				});
			}}
			min={0}
			max={9999}
			onReset={() =>
				onChange({
					[`z-index-${breakpoint}`]: getDefaultAttribute(
						`z-index-${breakpoint}`
					),
				})
			}
			initialPosition={getDefaultAttribute(`z-index-${breakpoint}`)}
		/>
	);
};

export default ZIndexControl;
