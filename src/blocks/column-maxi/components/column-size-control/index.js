/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	SelectControl,
	ToggleSwitch,
} from '../../../../components';
import { getColumnDefaultValue } from '../../../../extensions/column-templates';
import withRTC from '../../../../extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

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
					target: '_cfc',
					breakpoint,
					attributes: props,
				})}
				onChange={val => {
					onChange({
						[`_cfc-${breakpoint}`]: val,
					});
				}}
			/>
			{!getLastBreakpointAttribute({
				target: '_cfc',
				breakpoint,
				attributes: props,
			}) && (
				<AdvancedNumberControl
					label={__('Column size (%)', 'maxi-blocks')}
					value={getLastBreakpointAttribute({
						target: '_cs',
						breakpoint,
						attributes: props,
					})}
					onChangeValue={val => {
						onChange({
							[`_cs-${breakpoint}`]:
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
							[`_cs-${breakpoint}`]:
								val !== undefined && val !== '' ? val : '',
							isReset: true,
						});
					}}
					initialPosition={getDefaultAttribute(
						`_cs-${breakpoint}`,
						clientId
					)}
				/>
			)}
			<SelectControl
				label={__('Vertical align', 'maxi-blocks')}
				value={getLastBreakpointAttribute({
					target: '_jc',
					breakpoint,
					attributes: props,
				})}
				defaultValue={getDefaultAttribute(
					getAttributeKey('_jc', false, '', breakpoint)
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
						[`_jc-${breakpoint}`]: verticalAlign,
					})
				}
				onReset={() => {
					onChange({
						[getAttributeKey('_jc', false, '', breakpoint)]:
							getDefaultAttribute(
								getAttributeKey('_jc', false, '', breakpoint)
							),
						isReset: true,
					});
				}}
			/>
		</>
	);
};

export default withRTC(ColumnSizeControl);
