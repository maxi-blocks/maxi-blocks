/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Component
 */
const OverflowControl = props => {
	const { className, onChange, breakpoint = 'general' } = props;

	const classes = classnames('maxi-position-control', className);

	return (
		<div className={classes}>
			<SelectControl
				label={__('Overflow', 'maxi-blocks')}
				options={[
					{ label: 'Auto', value: 'auto' },
					{ label: 'Visible', value: 'visible' },
					{ label: 'Hidden', value: 'hidden' },
					{ label: 'Clip', value: 'clip' },
					{ label: 'Scroll', value: 'scroll' },
				]}
				value={
					getLastBreakpointAttribute('overflow', breakpoint, props) ||
					''
				}
				onChange={val =>
					onChange({
						[`overflow-${breakpoint}`]: !isEmpty(val) ? val : null,
					})
				}
			/>
		</div>
	);
};

export default OverflowControl;
