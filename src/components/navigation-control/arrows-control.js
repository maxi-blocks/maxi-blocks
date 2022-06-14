/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingTabsControl, ToggleSwitch } from '../../components';
import ArrowIconControl from './arrow-icon-control';

const NavigationArrowsControl = props => {
	const {
		onChange,
		deviceType,
		insertInlineStyles,
		cleanInlineStyles,
		svgType,
		clientId,
		blockStyle,
		attributes,
	} = props;

	return (
		<SettingTabsControl
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: (
						<ArrowIconControl
							{...attributes}
							onChangeInline={(
								obj,
								target,
								isMultiplySelector = false
							) =>
								insertInlineStyles({
									obj,
									target,
									isMultiplySelector,
								})
							}
							onChange={(obj, target) => {
								onChange(obj);
								cleanInlineStyles(target);
							}}
							svgType={svgType}
							breakpoint={deviceType}
							clientId={clientId}
							blockStyle={blockStyle}
						/>
					),
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__('Enable icon hover', 'maxi-blocks')}
								selected={
									attributes[
										'navigation-arrow-both-icon-status-hover'
									]
								}
								onChange={val =>
									onChange({
										'navigation-arrow-both-icon-status-hover':
											val,
									})
								}
							/>
							{attributes[
								'navigation-arrow-both-icon-status-hover'
							] && (
								<ArrowIconControl
									{...attributes}
									onChangeInline={(
										obj,
										target,
										isMultiplySelector = false
									) =>
										insertInlineStyles({
											obj,
											target,
											isMultiplySelector,
										})
									}
									onChange={(obj, target) => {
										onChange(obj);
										cleanInlineStyles(target);
									}}
									svgType={svgType}
									breakpoint={deviceType}
									clientId={clientId}
									blockStyle={blockStyle}
									isHover
								/>
							)}
						</>
					),
				},
			]}
		/>
	);
};

export default NavigationArrowsControl;
