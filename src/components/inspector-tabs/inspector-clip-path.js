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
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const clipPath = ({ props, prefix = '' }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const clipPathControlProps = {
		onChange: maxiSetAttributes,
		prefix,
		breakpoint: deviceType,
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
								block={props.resizableObject?.resizable}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__('Enable hover', 'maxi-blocks')}
									selected={
										attributes[
											getAttributeKey(
												'clip-path-status',
												true,
												prefix
											)
										]
									}
									onChange={val =>
										maxiSetAttributes({
											[getAttributeKey(
												'clip-path-status',
												true,
												prefix
											)]: val,
											...(isEmpty(
												getLastBreakpointAttribute({
													target: `${prefix}clip-path`,
													breakpoint: deviceType,
													attributes,
													isHover: true,
												})
											) &&
											!isEmpty(
												getLastBreakpointAttribute({
													target: `${prefix}clip-path`,
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
																target: `${prefix}clip-path`,
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
								{attributes['clip-path-status-hover'] && (
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
