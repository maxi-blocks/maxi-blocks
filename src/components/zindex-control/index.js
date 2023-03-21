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
	getAttributeKey,
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
			defaultValue={getDefaultAttribute(
				getAttributeKey('z-index', breakpoint)
			)}
			value={getLastBreakpointAttribute({
				target: 'z-index',
				breakpoint,
				attributes: props,
			})}
			onChangeValue={val => {
				onChange({
					[getAttributeKey('z-index', breakpoint)]:
						val !== undefined && val !== '' ? val : '',
				});
			}}
			min={-9999}
			max={9999}
			onReset={() =>
				onChange({
					[getAttributeKey('z-index', breakpoint)]:
						getDefaultAttribute(
							getAttributeKey('z-index', breakpoint)
						),
					isReset: true,
				})
			}
			initialPosition={getDefaultAttribute(
				getAttributeKey('z-index', breakpoint)
			)}
		/>
	);
};

export default ZIndexControl;
