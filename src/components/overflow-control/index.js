/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import SelectControl from '@components/select-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import './editor.scss';

/**
 * Icons
 */
import { sync as syncIcon } from '@maxi-icons';

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

	const updateSync = (changedAttributes = null) => {
		const [x, y] = axes.map(axis =>
			getLastBreakpointAttribute({
				target: `overflow-${axis}`,
				breakpoint,
				attributes: changedAttributes
					? { ...props, ...changedAttributes }
					: props,
			})
		);
		changeSync(x === y);
	};

	/**
	 * If `val` is `null`(has been reset), get the last breakpoint attribute
	 * from last version of `attributes`.
	 */
	const updateAxisVal = (val, changedAttributes = null) =>
		setAxisVal(
			!isEmpty(val)
				? val
				: getLastBreakpointAttribute({
						target: 'overflow-x',
						breakpoint,
						attributes: changedAttributes
							? { ...props, ...changedAttributes }
							: props,
				  })
		);

	useEffect(() => {
		updateSync();
		updateAxisVal();
	}, [breakpoint]);

	const getChangedAttributes = ({
		val,
		axis = null,
		sync: currentSync = sync,
	}) =>
		(currentSync ? axes : [axis]).reduce((acc, axis) => {
			acc[`overflow-${axis}-${breakpoint}`] = val;
			return acc;
		}, {});

	const onChangeSync = val => {
		changeSync(val);

		if (val) onChange(getChangedAttributes({ val: axisVal, sync: true }));
	};

	const onChangeValue = (rawValue, axis) => {
		const isValEmpty = isEmpty(rawValue);
		const val = !isValEmpty ? rawValue : null;

		const changedAttributes = getChangedAttributes({ val, axis });

		onChange(changedAttributes);
		updateAxisVal(val, changedAttributes);
		if (isValEmpty && sync) updateSync(changedAttributes);
	};

	return (
		<div className={classes}>
			{axes.map(axis => (
				<SelectControl
					__nextHasNoMarginBottom
					label={__(`Overflow ${axis}`, 'maxi-blocks')}
					key={uniqueId('maxi-position-control__overflow')}
					newStyle
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
					defaultValue={getDefaultAttribute(
						`overflow-${axis}-${breakpoint}`
					)}
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
						onClick={() => onChangeSync(!sync)}
					>
						{syncIcon}
					</Button>
				</Tooltip>
			</div>
		</div>
	);
};

export default OverflowControl;
