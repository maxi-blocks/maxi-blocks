/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ToggleSwitch from '@components/toggle-switch';
import SelectControl from '@components/select-control';
import { getColumnDefaultValue } from '@extensions/column-templates';
import withRTC from '@extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * Component
 */
const ColumnSizeControl = props => {
	const { breakpoint, rowPattern, clientId, onChange } = props;

	const useBreakpoint =
		breakpoint === 'general'
			? select('maxiBlocks').receiveBaseBreakpoint()
			: breakpoint;

	return (
		<>
			<ToggleSwitch
				label={__('Fit content', 'maxi-blocks')}
				className='maxi-column-inspector__fit-content'
				selected={getLastBreakpointAttribute({
					target: 'column-fit-content',
					breakpoint: useBreakpoint,
					attributes: props,
				})}
				onChange={val => {
					onChange({
						[`column-fit-content-${useBreakpoint}`]: val,
					});
				}}
			/>
			{!getLastBreakpointAttribute({
				target: 'column-fit-content',
				breakpoint: useBreakpoint,
				attributes: props,
			}) && (
				<AdvancedNumberControl
					label={__('Column size (%)', 'maxi-blocks')}
					value={getLastBreakpointAttribute({
						target: 'column-size',
						breakpoint: useBreakpoint,
						attributes: props,
					})}
					onChangeValue={val => {
						onChange({
							[`column-size-${useBreakpoint}`]:
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
							useBreakpoint
						);

						onChange({
							[`column-size-${useBreakpoint}`]:
								val !== undefined && val !== '' ? val : '',
							isReset: true,
						});
					}}
					initialPosition={getDefaultAttribute(
						`column-size-${useBreakpoint}`,
						clientId
					)}
				/>
			)}
			<SelectControl
				__nextHasNoMarginBottom
				label={__('Vertical align', 'maxi-blocks')}
				value={getLastBreakpointAttribute({
					target: 'justify-content',
					breakpoint: useBreakpoint,
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
						[`justify-content-${useBreakpoint}`]: verticalAlign,
					})
				}
				onReset={() => {
					onChange({
						[getAttributeKey(
							'justify-content',
							false,
							'',
							useBreakpoint
						)]: getDefaultAttribute(
							getAttributeKey(
								'justify-content',
								false,
								'',
								useBreakpoint
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
