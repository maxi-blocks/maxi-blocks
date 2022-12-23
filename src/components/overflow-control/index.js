/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../button';
import SelectControl from '../select-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
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
	const [sync, changeSync] = useState(true);

	const [axisVal, setAxisVal] = useState();

	useEffect(() => {
		setAxisVal(props[`overflow-x-${breakpoint}`]);
	}, [breakpoint]);

	const syncOverflow = newSync => {
		if (newSync) {
			onChange({
				[`overflow-x-${breakpoint}`]: axisVal,
				[`overflow-y-${breakpoint}`]: axisVal,
			});
		}
	};

	const onChangeValue = (val, axis) => {
		if (sync) {
			setAxisVal(val);

			onChange({
				[`overflow-x-${breakpoint}`]: !isEmpty(val) ? val : null,
				[`overflow-y-${breakpoint}`]: !isEmpty(val) ? val : null,
			});
		} else {
			setAxisVal(val);

			onChange({
				[`overflow-${axis}-${breakpoint}`]: !isEmpty(val) ? val : null,
			});
		}
	};

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
					onChange={val => onChangeValue(val, axis)}
					onReset={() =>
						onChangeValue(
							getDefaultAttribute(
								`overflow-${axis}-${breakpoint}`
							),
							axis
						)
					}
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
						onClick={() => {
							const newSync = !sync;
							changeSync(newSync);
							syncOverflow(newSync);
						}}
					>
						{syncIcon}
					</Button>
				</Tooltip>
			</div>
		</div>
	);
};

export default OverflowControl;
