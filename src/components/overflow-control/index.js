/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../button';
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import './editor.scss';

/**
 * Icons
 */
import { sync as syncIcon } from '../../icons';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, uniqueId } from 'lodash';

/**
 * Component
 */
const OverflowControl = props => {
	const { className, onChange, breakpoint = 'general' } = props;

	const classes = classnames('maxi-overflow-control', className);

	const axes = ['x', 'y'];
	const [sync, changeSync] = useState(false);

	return (
		<div className={classes}>
			{axes.map(axis => (
				<SelectControl
					label={__(`Overflow ${axis}`, 'maxi-blocks')}
					key={uniqueId('maxi-position-control__overflow')}
					options={[
						{ label: 'Visible', value: 'visible' },
						{ label: 'Hidden', value: 'hidden' },
						{ label: 'Auto', value: 'auto' },
						{ label: 'Clip', value: 'clip' },
						{ label: 'Scroll', value: 'scroll' },
					]}
					value={
						getLastBreakpointAttribute({
							target: `overflow-${axis}`,
							breakpoint,
							attributes: props,
						}) || ''
					}
					onChange={val => {
						if (sync) {
							onChange({
								[`overflow-x-${breakpoint}`]: !isEmpty(val)
									? val
									: null,
								[`overflow-y-${breakpoint}`]: !isEmpty(val)
									? val
									: null,
							});
						} else {
							onChange({
								[`overflow-${axis}-${breakpoint}`]: !isEmpty(
									val
								)
									? val
									: null,
							});
						}
					}}
				/>
			))}
			<div className='sync-wrapper'>
				<Tooltip
					text={
						sync
							? __('Unsync', 'maxi-blocks')
							: __('Sync', 'maxi-blocks')
					}
				>
					<Button
						aria-label={__('Sync units', 'maxi-blocks')}
						isPrimary={sync}
						aria-pressed={sync}
						onClick={() => changeSync(!sync)}
					>
						{syncIcon}
					</Button>
				</Tooltip>
			</div>
		</div>
	);
};

export default OverflowControl;
