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

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
			step: 1,
		},
		em: {
			min: 0,
			max: 99,
			step: 1,
		},
		vh: {
			min: 0,
			max: 99,
			step: 1,
		},
	};

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
										'border-bottom-left-radius-general': 10,
										'border-bottom-right-radius-general': 10,
										'border-bottom-width-general': 5,
										'border-left-width-general': 5,
										'border-right-width-general': 5,
										'border-top-left-radius-general': 10,
										'border-top-right-radius-general': 10,
										'border-top-width-general': 5,
										'border-unit-radius-general': 'px',
										'border-unit-width-general': 'px',
										'border-style-general': 'solid',
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
				minMaxSettings={minMaxSettings}
				value={getLastBreakpointAttribute({
					target: 'pane-spacing',
					breakpoint,
					attributes: props,
				})}
				unit={getLastBreakpointAttribute({
					target: 'pane-spacing-unit',
					breakpoint,
					attributes: props,
				})}
				enableUnit
				allowedUnits={['px', 'em', 'vh']}
				onChangeValue={val => {
					onChange({
						[`pane-spacing-${breakpoint}`]:
							val !== undefined ? val : '',
					});
				}}
				onChangeUnit={val => {
					onChange({
						[`pane-spacing-unit-${breakpoint}`]: val,
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
