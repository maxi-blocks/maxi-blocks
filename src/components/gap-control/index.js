/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import AdvancedNumberControl from '../advanced-number-control';

import { paddingSyncAll as paddingSyncAllIcon } from '../../icons';

/**
 * Component
 */

const GapControl = props => {
	const { className, onChange } = props;
	const sync = props['gap-sync'];

	return (
		<div className={className}>
			<SettingTabsControl
				label='Gap'
				type='buttons'
				className='maxi-axis-control__header'
				selected={sync}
				items={[
					{
						value: 'all',
						className: 'maxi-axis-control__sync-all',
						icon: paddingSyncAllIcon,
					},
					{
						value: 'axis',
						className: 'maxi-axis-control__sync-all',
						icon: paddingSyncAllIcon,
					},
				]}
				onChange={val =>
					onChange({
						['gap-sync']: val,
					})
				}
			/>
			{sync === 'all' && (
				<GapAxisControl
					label='Gap'
					target='gap'
					allowedUnits={['px', 'em', 'vw']}
					{...props}
				/>
			)}
			{sync === 'axis' && (
				<>
					<GapAxisControl
						label='Row Gap'
						target='row-gap'
						{...props}
					/>
					<GapAxisControl
						label='Column Gap'
						target='column-gap'
						{...props}
					/>
				</>
			)}
		</div>
	);
};

const GapAxisControl = props => {
	const { label, target, onChange } = props;

	return (
		<AdvancedNumberControl
			className='maxi__size'
			label={__(label, 'maxi-blocks')}
			enableUnit
			unit={props[`${target}-unit`]}
			onChangeUnit={val => {
				onChange({
					[`${target}-unit`]: val,
				});
			}}
			value={props[target]}
			onChangeValue={val => {
				onChange({
					[target]: val,
				});
			}}
			minMaxSettings={{
				px: {
					min: 0,
					max: 999,
				},
				em: {
					min: 0,
					max: 999,
				},
				vw: {
					min: 0,
					max: 999,
				},
			}}
			allowedUnits={['px', 'em', 'vw']}
			onReset={() =>
				onChange({
					[target]: 0,
				})
			}
		/>
	);
};
export default GapControl;
