/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { renderToString } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { SvgColor } from '../svg-color';
import AdvancedNumberControl from '../advanced-number-control';

import ResponsiveTabsControl from '../responsive-tabs-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
	getMapPresetItemClasses,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';
import ReactDOMServer from 'react-dom/server';

/**
 * Icons
 */
import * as mapMarkers from '../../icons/map-icons/markers';

const MapMarkersControl = props => {
	const { onChange, deviceType } = props;

	return (
		<>
			<div className='maxi-map-control__markers'>
				{Object.keys(mapMarkers).map((item, index) => (
					<div
						key={`map-marker-${uniqueId()}`}
						data-item={index + 1}
						onClick={e =>
							onChange({
								'map-marker': +e.currentTarget.dataset.item,
								'map-marker-icon': renderToString(
									mapMarkers[item]
								),
							})
						}
						className={getMapPresetItemClasses(
							'maxi-map-control__markers__item',
							props['map-marker'],
							index
						)}
					>
						{mapMarkers[item]}
					</div>
				))}
			</div>
			<SvgColor
				{...props}
				type='fill'
				label={__('Marker fill', 'maxi-blocks')}
				onChangeFill={({ content, ...rest }) => {
					onChange({
						'map-marker-icon': content,
						...rest,
					});
				}}
				content={props['map-marker-icon']}
			/>
			<SvgColor
				{...props}
				type='line'
				label={__('Marker stroke', 'maxi-blocks')}
				onChangeStroke={({ content, ...rest }) => {
					onChange({
						'map-marker-icon': content,
						...rest,
					});
				}}
				content={props['map-marker-icon']}
			/>
			<ResponsiveTabsControl breakpoint={deviceType}>
				<AdvancedNumberControl
					label={__('Marker size', 'maxi-blocks')}
					min={15}
					max={40}
					step={1}
					value={getLastBreakpointAttribute({
						target: 'svg-width',
						breakpoint: deviceType,
						attributes: props,
					})}
					defaultValue={getDefaultAttribute(
						`svg-width-${deviceType}`
					)}
					onChangeValue={val => {
						onChange({
							[`svg-width-${deviceType}`]: val,
						});
					}}
					onReset={() => {
						const defaultAttr = getDefaultAttribute(
							`svg-width-${deviceType}`
						);
						onChange({
							[`svg-width-${deviceType}`]: defaultAttr,
						});
					}}
					optionType='string'
				/>
			</ResponsiveTabsControl>
		</>
	);
};

export default MapMarkersControl;
