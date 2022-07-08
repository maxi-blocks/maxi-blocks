/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import ToggleSwitch from '../toggle-switch';
import AdvancedNumberControl from '../advanced-number-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

const AccordionSettings = props => {
	const {
		accordionLayout,
		clientId,
		onChange,
		autoPaneClose,
		isCollapsible,
		animationDuration,
		breakpoint,
	} = props;

	return (
		<>
			{breakpoint === 'general' && (
				<>
					<SelectControl
						label={__('Accordion layout', 'maxi-blocks')}
						value={accordionLayout}
						options={[
							{ label: 'Simple', value: 'simple' },
							{ label: 'Boxed', value: 'boxed' },
						]}
						onChange={val => {
							const blocks = select(
								'core/block-editor'
							).getClientIdsOfDescendants([clientId]);

							blocks.forEach(block => {
								if (
									select('core/block-editor').getBlockName(
										block
									) === 'maxi-blocks/pane-maxi'
								) {
									dispatch(
										'core/block-editor'
									).updateBlockAttributes(block, {
										accordionLayout: val,
									});
								}
							});

							onChange({ accordionLayout: val });
						}}
					/>
					<ToggleSwitch
						label={__('Collapsible', 'maxi-block')}
						selected={isCollapsible}
						onChange={val =>
							onChange({
								isCollapsible: val,
							})
						}
					/>
					<ToggleSwitch
						label={__(
							'Pane closes when another opens',
							'maxi-block'
						)}
						selected={autoPaneClose}
						onChange={val =>
							onChange({
								autoPaneClose: val,
							})
						}
					/>
				</>
			)}
			<AdvancedNumberControl
				label={__('Spacing', 'maxi-blocks')}
				min={0}
				max={999}
				step={1}
				value={getLastBreakpointAttribute({
					target: 'pane-spacing',
					breakpoint,
					attributes: props,
				})}
				onChangeValue={val => {
					onChange({
						[`pane-spacing-${breakpoint}`]:
							val !== undefined ? val : '',
					});
				}}
				onReset={() =>
					onChange({
						[`pane-spacing-${breakpoint}`]: getDefaultAttribute(
							`pane-spacing-${breakpoint}`
						),
					})
				}
			/>
			<AdvancedNumberControl
				label={__('Animation duration (ms)', 'maxi-blocks')}
				min={0}
				max={9999}
				step={1}
				value={animationDuration}
				onChangeValue={val => {
					onChange({
						animationDuration: val !== undefined ? val : '',
					});
				}}
				onReset={() =>
					onChange({
						animationDuration:
							getDefaultAttribute('animationDuration'),
					})
				}
			/>
		</>
	);
};
export default AccordionSettings;
