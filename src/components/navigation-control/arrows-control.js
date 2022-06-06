/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	IconControl,
	SettingTabsControl,
	ToggleSwitch,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import ArrowIconControl from './arrow-icon-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
								label={__('Enable Icon Hover', 'maxi-blocks')}
								selected={
									props['navigation-arrow-both-status-hover']
								}
								onChange={val =>
									onChange({
										'navigation-arrow-both-status-hover':
											val,
									})
								}
							/>
							{props['navigation-arrow-both-status-hover'] && (
								<IconControl
									{...getGroupAttributes(
										props,
										[
											'navigationArrowIcon',
											'navigationArrowIconHover',
										],
										true
									)}
									onChange={obj => {
										onChange(obj);
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
