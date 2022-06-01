/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getColorRGBAString,
} from '../../extensions/styles';
import MaxiModal from '../../editor/library/modal';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import { setSVGContent } from '../../extensions/svg';
import AdvancedNumberControl from '../advanced-number-control';

const VideoIconControl = props => {
	const { blockStyle, onChange, breakpoint, clientId, prefix, label } = props;

	const minMaxSettings = {
		px: {
			min: 0,
			max: 99,
		},
		em: {
			min: 0,
			max: 99,
		},
		vw: {
			min: 0,
			max: 99,
		},
		'%': {
			min: 0,
			max: 100,
		},
		'-': {
			min: 0,
			max: 16,
		},
	};

	return (
		<>
			<MaxiModal
				type='video-shape'
				prefix={prefix}
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={props['close-icon-content']}
			/>
			{!isEmpty(props['close-icon-content']) && (
				<>
					<ColorControl
						className='maxi-video-options-control__close-icon-colour'
						label={label}
						color={props[`${prefix}icon-fill-color`]}
						defaultColor={getDefaultAttribute(
							`${prefix}icon-fill-color`
						)}
						paletteStatus={
							props[`${prefix}icon-fill-palette-status`]
						}
						paletteColor={props[`${prefix}icon-fill-palette-color`]}
						paletteOpacity={
							props[`${prefix}icon-fill-palette-opacity`]
						}
						// onChangeInline={({ color }) => {
						// 	onChangeInline &&
						// 		onChangeInline({
						// 			'border-color': color,
						// 		});
						// }}
						onChange={({
							paletteColor,
							paletteStatus,
							paletteOpacity,
							color,
						}) => {
							const fillColorStr = getColorRGBAString({
								firstVar: 'icon-fill',
								secondVar: `color-${paletteColor}`,
								opacity: paletteOpacity,
								blockStyle,
							});

							onChange({
								[`${prefix}icon-fill-palette-status`]:
									paletteStatus,
								[`${prefix}icon-fill-palette-color`]:
									paletteColor,
								[`${prefix}icon-fill-palette-opacity`]:
									paletteOpacity,
								[`${prefix}icon-fill-color`]: color,
								[`${prefix}icon-content`]: setSVGContent(
									props[`${prefix}icon-content`],
									paletteStatus ? fillColorStr : color,
									'fill'
								),
							});
						}}
						disableImage
						disableVideo
						disableGradient
						deviceType={breakpoint}
						clientId={clientId}
						prefix={`${prefix}icon-`}
					/>
					<AdvancedNumberControl
						label='Icon height'
						optionType='string'
						value={getLastBreakpointAttribute({
							target: `${prefix}icon-height`,
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val =>
							onChange({
								[`${prefix}icon-height-${breakpoint}`]: val,
							})
						}
						defaultValue={getDefaultAttribute(
							`${prefix}icon-height-${breakpoint}`
						)}
						enableUnit
						unit={getLastBreakpointAttribute({
							target: `${prefix}icon-height-unit`,
							breakpoint,
							attributes: props,
						})}
						defaultUnit={getDefaultAttribute(
							`${prefix}icon-height-unit-${breakpoint}`
						)}
						onChangeUnit={val =>
							onChange({
								[`${prefix}icon-height-unit-${breakpoint}`]:
									val,
							})
						}
						onReset={() =>
							onChange({
								[`${prefix}icon-height-${breakpoint}`]:
									getDefaultAttribute(`${prefix}icon-height`),
								[`${prefix}icon-height-unit-${breakpoint}`]:
									getDefaultAttribute(
										`${prefix}icon-height-unit`
									),
							})
						}
						minMaxSettings={minMaxSettings}
						allowedUnits={['px', 'em', 'vw', '%']}
					/>
				</>
			)}
		</>
	);
};

export default VideoIconControl;
