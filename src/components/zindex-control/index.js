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
} from '../../extensions/attributes';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ZIndexControl = props => {
	const { onChange, className, breakpoint } = props;

	const classes = classnames('maxi-zindex-control', className);

	return (
		<AdvancedNumberControl
			label={__('Z-index', 'maxi-blocks')}
			className={classes}
			defaultValue={getDefaultAttribute(
				getAttributeKey('_zi', false, '', breakpoint)
			)}
			value={getLastBreakpointAttribute({
				target: '_zi',
				breakpoint,
				attributes: props,
			})}
			onChangeValue={val => {
				onChange({
					[getAttributeKey('_zi', false, '', breakpoint)]:
						val !== undefined && val !== '' ? val : '',
				});
			}}
			min={-9999}
			max={9999}
			onReset={() =>
				onChange({
					[getAttributeKey('_zi', false, '', breakpoint)]:
						getDefaultAttribute(
							getAttributeKey('_zi', false, '', breakpoint)
						),
					isReset: true,
				})
			}
			initialPosition={getDefaultAttribute(
				getAttributeKey('_zi', false, '', breakpoint)
			)}
		/>
	);
};

export default ZIndexControl;
