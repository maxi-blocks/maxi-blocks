/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ClipPathControl from '../clip-path-control';
import ToggleSwitch from '../toggle-switch';
import SettingTabsControl from '../setting-tabs-control';
import {
	getAttributeKey,
	getAttributesValue,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const clipPath = ({ props, selector, prefix = '' }) => {
	const { attributes, deviceType, maxiSetAttributes, getBounds } = props;
	const clipPathControlProps = {
		prefix,
		breakpoint: deviceType,
		onChange: maxiSetAttributes,
		getBounds: () => getBounds(selector),
	};

	return {
		label: __('Clip-path', 'maxi-blocks'),
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<ClipPathControl
								{...getGroupAttributes(attributes, 'clipPath')}
								{...clipPathControlProps}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__('Enable hover', 'maxi-blocks')}
									selected={getAttributesValue({
										target: 'clip-path-status',
										props: attributes,
										isHover: true,
										prefix,
									})}
									onChange={val =>
										maxiSetAttributes({
											[getAttributeKey(
												'clip-path-status',
												true,
												prefix
											)]: val,
											...(isEmpty(
												getLastBreakpointAttribute({
													target: 'clip-path',
													prefix,
													breakpoint: deviceType,
													attributes,
													isHover: true,
												})
											) &&
											!isEmpty(
												getLastBreakpointAttribute({
													target: 'clip-path',
													prefix,
													breakpoint: deviceType,
													attributes,
												})
											)
												? {
														[getAttributeKey(
															'clip-path',
															true,
															prefix,
															deviceType
														)]: getLastBreakpointAttribute(
															{
																target: 'clip-path',
																prefix,
																breakpoint:
																	deviceType,
																attributes,
															}
														),
												  }
												: {}),
										})
									}
								/>
								{getAttributesValue({
									target: 'clip-path-status',
									props,
									isHover: true,
								}) && (
									<ClipPathControl
										{...getGroupAttributes(
											attributes,
											'clipPath',
											true
										)}
										{...clipPathControlProps}
										isHover
									/>
								)}
							</>
						),
					},
				]}
			/>
		),
	};
};

export default clipPath;
