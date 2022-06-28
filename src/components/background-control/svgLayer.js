/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SettingTabsControl from '../setting-tabs-control';
import SVGFillControl from '../svg-fill-control';
import PositionControl from '../position-control';
import {
	getAttributeKey,
	getBlockStyle,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import MaxiModal from '../../editor/library/modal';
import { getDefaultLayerAttr } from './utils';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Component
 */
const SVGSize = props => {
	const {
		breakpoint,
		isHover,
		isLayer = false,
		onChange,
		prefix = '',
		options: SVGOptions,
	} = props;

	const minMaxSettings = {
		px: {
			min: 0,
			max: 3999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 999,
		},
		'%': {
			min: 0,
			max: 999,
		},
	};

	const getDefaultAttr = target => {
		if (isLayer) return getDefaultLayerAttr('SVGOptions', target);

		return getDefaultAttribute(
			getAttributeKey(target, isHover, prefix, breakpoint)
		);
	};

	return (
		<AdvancedNumberControl
			label={__('Size', 'maxi-blocks')}
			value={getLastBreakpointAttribute({
				target: `${prefix}background-svg-size`,
				breakpoint,
				attributes: SVGOptions,
				isHover,
			})}
			allowedUnits={['px', 'em', 'vw', '%']}
			enableUnit
			unit={getLastBreakpointAttribute({
				target: `${prefix}background-svg-size-unit`,
				breakpoint,
				attributes: SVGOptions,
				isHover,
			})}
			onChangeValue={val => {
				onChange({
					[getAttributeKey(
						'background-svg-size',
						isHover,
						prefix,
						breakpoint
					)]: val,
				});
			}}
			onChangeUnit={val =>
				onChange({
					[getAttributeKey(
						'background-svg-size-unit',
						isHover,
						prefix,
						breakpoint
					)]: val,
				})
			}
			onReset={() =>
				onChange({
					[getAttributeKey(
						'background-svg-size',
						isHover,
						prefix,
						breakpoint
					)]: getDefaultAttr('background-svg-size'),
					[getAttributeKey(
						'background-svg-size-unit',
						isHover,
						prefix,
						breakpoint
					)]: getDefaultAttr('background-svg-size-unit'),
				})
			}
			minMaxSettings={minMaxSettings}
		/>
	);
};

const SVGLayerContent = props => {
	const { onChange, isHover = false, breakpoint } = props;

	const SVGOptions = cloneDeep(props.options);

	return (
		<div className='maxi-background-control__svg-layer--size'>
			{isHover ? (
				!isEmpty(SVGOptions['background-svg-SVGElement']) && (
					<SVGSize {...props} />
				)
			) : (
				<SettingTabsControl
					disablePadding
					className='maxi-background-control__svg-layer--size'
					items={[
						{
							label: __('Position', 'maxi-blocks'),
							content: (
								<PositionControl
									{...SVGOptions}
									prefix='background-svg-'
									onChange={onChange}
									breakpoint={breakpoint}
									disablePosition
								/>
							),
						},
						!isEmpty(SVGOptions['background-svg-SVGElement']) && {
							label: __('Size', 'maxi-blocks'),
							content: <SVGSize {...props} />,
						},
					]}
				/>
			)}
		</div>
	);
};

const SVGLayer = props => {
	const {
		clientId,
		layerOrder,
		onChange,
		breakpoint,
		prefix = '',
		isHover = false,
		isLayer = false,
	} = props;

	const SVGOptions = cloneDeep(props.options);
	const isLayerHover = SVGOptions.isHover;

	const SVGElement = SVGOptions[`${prefix}background-svg-SVGElement`];

	return (
		<>
			{(!isHover || (isHover && isLayerHover)) && (
				<MaxiModal
					type='bg-shape'
					style={getBlockStyle(clientId)}
					onRemove={obj => {
						if (layerOrder) {
							delete SVGOptions[
								`${prefix}background-svg-SVGElement`
							];
							delete SVGOptions[
								`${prefix}background-svg-SVGData`
							];
						}
						onChange({ ...SVGOptions, ...obj });
					}}
					icon={SVGElement}
					onSelect={obj => onChange(obj)}
				/>
			)}
			{!isEmpty(SVGElement) && (
				<>
					<SVGFillControl
						options={SVGOptions}
						onChange={onChange}
						clientId={clientId}
						isHover={isHover}
						breakpoint={breakpoint}
					/>
					<ResponsiveTabsControl
						breakpoint={breakpoint}
						isBgLayersHover={isHover}
					>
						<SVGLayerContent
							options={SVGOptions}
							onChange={onChange}
							prefix={prefix}
							isHover={isHover}
							isLayer={isLayer}
						/>
					</ResponsiveTabsControl>
				</>
			)}
		</>
	);
};

export default SVGLayer;
