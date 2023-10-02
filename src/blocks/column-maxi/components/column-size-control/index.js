/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const AdvancedNumberControl = loadable(() =>
	import('../../../../components/advanced-number-control')
);
const ToggleSwitch = loadable(() =>
	import('../../../../components/toggle-switch')
);
const SelectControl = loadable(() =>
	import('../../../../components/select-control')
);
import { getColumnDefaultValue } from '../../../../extensions/column-templates';
import withRTC from '../../../../extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

/**
 * Component
 */
const ColumnSizeControl = props => {
	const { breakpoint, rowPattern, clientId, onChange } = props;

	return (
		<>
			<ToggleSwitch
				label={__('Fit content', 'maxi-blocks')}
				className='maxi-column-inspector__fit-content'
				selected={getLastBreakpointAttribute({
					target: 'column-fit-content',
					breakpoint,
					attributes: props,
				})}
				onChange={val => {
					onChange({
						[`column-fit-content-${breakpoint}`]: val,
					});
				}}
			/>
			{!getLastBreakpointAttribute({
				target: 'column-fit-content',
				breakpoint,
				attributes: props,
			}) && (
				<AdvancedNumberControl
					label={__('Column size (%)', 'maxi-blocks')}
					value={getLastBreakpointAttribute({
						target: 'column-size',
						breakpoint,
						attributes: props,
					})}
					onChangeValue={val => {
						onChange({
							[`column-size-${breakpoint}`]:
								val !== undefined && val !== '' ? val : '',
						});
					}}
					min={0}
					max={100}
					step={0.1}
					onReset={() => {
						const val = getColumnDefaultValue(
							rowPattern,
							{
								...getGroupAttributes(props, 'columnSize'),
							},
							clientId,
							breakpoint
						);

						onChange({
							[`column-size-${breakpoint}`]:
								val !== undefined && val !== '' ? val : '',
							isReset: true,
						});
					}}
					initialPosition={getDefaultAttribute(
						`column-size-${breakpoint}`,
						clientId
					)}
				/>
			)}
			<SelectControl
				label={__('Vertical align', 'maxi-blocks')}
				value={getLastBreakpointAttribute({
					target: 'justify-content',
					breakpoint,
					attributes: props,
				})}
				defaultValue={getDefaultAttribute(
					getAttributeKey('justify-content', false, '', breakpoint)
				)}
				options={[
					{
						label: __('Top', 'maxi-blocks'),
						value: 'flex-start',
					},
					{
						label: __('Center', 'maxi-blocks'),
						value: 'center',
					},
					{
						label: __('Bottom', 'maxi-blocks'),
						value: 'flex-end',
					},
					{
						label: __('Space between', 'maxi-blocks'),
						value: 'space-between',
					},
					{
						label: __('Space around', 'maxi-blocks'),
						value: 'space-around',
					},
				]}
				onChange={verticalAlign =>
					onChange({
						[`justify-content-${breakpoint}`]: verticalAlign,
					})
				}
				onReset={() => {
					onChange({
						[getAttributeKey(
							'justify-content',
							false,
							'',
							breakpoint
						)]: getDefaultAttribute(
							getAttributeKey(
								'justify-content',
								false,
								'',
								breakpoint
							)
						),
						isReset: true,
					});
				}}
			/>
		</>
	);
};

export default withRTC(ColumnSizeControl);
