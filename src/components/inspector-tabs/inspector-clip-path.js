/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Suspense, lazy } from '@wordpress/element';

/**
 * Internal dependencies
 */
const ClipPathControl = lazy(() => import('@components/clip-path-control'));
import ToggleSwitch from '@components/toggle-switch';
import SettingTabsControl from '@components/setting-tabs-control';
import Spinner from '@components/spinner';
import {
	getAttributeKey,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
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
		content: () => (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
						<Suspense fallback={<Spinner />}>
							<ClipPathControl
								{...getGroupAttributes(attributes, 'clipPath')}
								{...clipPathControlProps}
							/>
						</Suspense>
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
								<Suspense fallback={<Spinner />}>
									<ClipPathControl
										{...getGroupAttributes(
											attributes,
											'clipPath',
											true
										)}
										{...clipPathControlProps}
										isHover
									/>
								</Suspense>
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
