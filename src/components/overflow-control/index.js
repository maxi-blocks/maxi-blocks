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

	const axes = ['x', 'y'];

	return (
		<div className={classes}>
			{axes.map(axis => (
				<SelectControl
					label={__(`Overflow ${axis}`, 'maxi-blocks')}
					options={[
						{ label: 'Default', value: '' },
						{ label: 'Visible', value: 'visible' },
						{ label: 'Hidden', value: 'hidden' },
						{ label: 'Auto', value: 'auto' },
						{ label: 'Clip', value: 'clip' },
						{ label: 'Scroll', value: 'scroll' },
					]}
					value={
						getLastBreakpointAttribute(
							`overflow-${axis}`,
							breakpoint,
							props
						) || ''
					}
					onChange={val =>
						onChange({
							[`overflow-${axis}-${breakpoint}`]: !isEmpty(val)
								? val
								: null,
						})
					}
				/>
			))}
		</div>
	);
};

export default OverflowControl;
