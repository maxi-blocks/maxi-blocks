/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	SelectControl,
	SettingTabsControl,
	ColorControl,
	ToggleSwitch,
	ResponsiveTabsControl,
} from '../../../../components';
import MaxiModal from '../../../../editor/library/modal';
import {
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';
import { getColorRGBAString } from '../../../../extensions/styles';
import { setSVGContent, setSVGContentHover } from '../../../../extensions/svg';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const IconSettings = props => {
	const {
		isHover = false,
		prefix,
		onChangeInline,
		onChange,
		blockStyle,
		label,
		breakpoint,
		clientId,
	} = props;
	const [iconHoverStatus, iconContent, iconPosition] = getAttributesValue({
		target: ['i.sh', 'i_c', 'i_pos'],
		props,
		prefix,
	});

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 100,
		},
		vw: {
			min: 0,
			max: 100,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const showSettings = !isHover || iconHoverStatus;

	return (
		<>
			{isHover && (
				<ToggleSwitch
					className='maxi-video-icon-control__hover-status'
					label={__('Enable icon hover', 'maxi-blocks')}
					selected={iconHoverStatus}
					onChange={val => onChange({ [`${prefix}i.sh`]: val })}
				/>
			)}
			{showSettings && (
				<>
					<ColorControl
						className='maxi-video-icon-control__icon-colour'
						label={label}
						color={getAttributesValue({
							target: 'i-f_cc',
							isHover,
							prefix,
							props,
						})}
						defaultColor={getDefaultAttribute(
							getAttributeKey({ key: 'i-f_cc', isHover, prefix })
						)}
						paletteStatus={getAttributesValue({
							target: 'i-f_ps',
							isHover,
							prefix,
							props,
						})}
						paletteColor={getAttributesValue({
							target: 'i-f_pc',
							isHover,
							prefix,
							props,
						})}
						paletteOpacity={getAttributesValue({
							target: 'i-f_po',
							isHover,
							prefix,
							props,
						})}
						onChangeInline={({ color }) => {
							onChangeInline &&
								!isHover &&
								onChangeInline({
									fill: color,
								});
						}}
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
							const icon = isHover
								? setSVGContentHover(
										iconContent,
										paletteStatus ? fillColorStr : color,
										'fill'
								  )
								: setSVGContent(
										iconContent,
										paletteStatus ? fillColorStr : color,
										'fill'
								  );

							onChange({
								[getAttributeKey({
									key: 'i-f_ps',
									isHover,
									prefix,
								})]: paletteStatus,
								[getAttributeKey({
									key: 'i-f_pc',
									isHover,
									prefix,
								})]: paletteColor,
								[getAttributeKey({
									key: 'i-f_po',
									isHover,
									prefix,
								})]: paletteOpacity,
								[getAttributeKey({
									key: 'i-f_cc',
									isHover,
									prefix,
								})]: color,
								...(!isHover && {
									[`${prefix}i_c`]: icon,
								}),
							});
						}}
						disableImage
						disableVideo
						disableGradient
						isHover={isHover}
						deviceType={breakpoint}
						clientId={clientId}
						prefix={`${prefix}i-`}
					/>
					{prefix === 'cl-' && (
						<SelectControl
							label={__('Icon position', 'maxi-blocks')}
							className='maxi-video-icon-control__icon-position'
							value={iconPosition}
							defaultValue={getDefaultAttribute(`${prefix}i_pos`)}
							onReset={() =>
								onChange({
									[`${prefix}i_pos`]: getDefaultAttribute(
										`${prefix}i_pos`
									),
									isReset: true,
								})
							}
							options={[
								{
									label: __(
										'Top screen right',
										'maxi-blocks'
									),
									value: 'top-screen-right',
								},
								{
									label: __(
										'Top right above video',
										'maxi-blocks'
									),
									value: 'top-right-above-video',
								},
							]}
							onChange={val =>
								onChange({
									[`${prefix}i_pos`]: val,
								})
							}
						/>
					)}
					<ResponsiveTabsControl breakpoint={breakpoint}>
						<>
							<AdvancedNumberControl
								label='Icon height'
								className='maxi-video-icon-control__icon-height'
								optionType='string'
								value={getLastBreakpointAttribute({
									target: 'i_h',
									prefix,
									breakpoint,
									isHover,
									attributes: props,
								})}
								onChangeValue={val =>
									onChange({
										[getAttributeKey({
											key: 'i_h',
											isHover,
											prefix,
											breakpoint,
										})]: val,
									})
								}
								defaultValue={getDefaultAttribute(
									`${prefix}i_h-${breakpoint}`
								)}
								enableUnit
								unit={getLastBreakpointAttribute({
									target: getAttributeKey({
										key: 'i_h.u',
										isHover,
										prefix,
									}),
									breakpoint,
									attributes: props,
								})}
								defaultUnit={getDefaultAttribute(
									`${prefix}i_h.u-${breakpoint}`
								)}
								onChangeUnit={val =>
									onChange({
										[getAttributeKey({
											key: 'i_h.u',
											isHover,
											prefix,
											breakpoint,
										})]: val,
									})
								}
								onReset={() =>
									onChange({
										[getAttributeKey({
											key: 'i_h',
											isHover,
											prefix,
											breakpoint,
										})]: getDefaultAttribute(
											`${prefix}i_h`
										),
										[getAttributeKey({
											key: 'i_h.u',
											isHover,
											prefix,
											breakpoint,
										})]: getDefaultAttribute(
											`${prefix}i_h.u`
										),
										isReset: true,
									})
								}
								minMaxSettings={minMaxSettings}
								allowedUnits={['px', 'em', 'vw', '%']}
							/>
							{prefix === 'close-' && (
								<AdvancedNumberControl
									label={__('Icon spacing', 'maxi-blocks')}
									className='maxi-video-icon-control__icon-spacing'
									placeholder={0}
									value={getLastBreakpointAttribute({
										target: 'i_spa',
										prefix,
										breakpoint,
										attributes: props,
									})}
									onChangeValue={val =>
										onChange({
											[`${prefix}i_spa-${breakpoint}`]:
												val,
										})
									}
									enableUnit
									unit={getLastBreakpointAttribute({
										target: 'i_spa.u',
										prefix,
										breakpoint,
										attributes: props,
									})}
									minMaxSettings={{
										px: {
											min: -999,
											max: 999,
										},
										em: {
											min: -99,
											max: 99,
										},
										vw: {
											min: -99,
											max: 99,
										},
										'%': {
											min: -100,
											max: 100,
										},
									}}
									onChangeUnit={val =>
										onChange({
											[`${prefix}i_spa.u-${breakpoint}`]:
												val,
										})
									}
									onReset={() => {
										onChange({
											[`${prefix}i_spa-${breakpoint}`]:
												getDefaultAttribute(
													`${prefix}i_spa-${breakpoint}`
												),
											[`${prefix}i_spa.u-${breakpoint}`]:
												getDefaultAttribute(
													`${prefix}i_spa.u-${breakpoint}`
												),
											isReset: true,
										});
									}}
								/>
							)}
						</>
					</ResponsiveTabsControl>
				</>
			)}
		</>
	);
};

const VideoIconControl = props => {
	const { blockStyle, onChange, prefix, label, type } = props;
	const iconContent = getAttributesValue({
		target: 'i_c',
		props,
		prefix,
	});

	return (
		<>
			<MaxiModal
				type={type}
				prefix={prefix}
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={iconContent}
				label={label}
			/>
			{!isEmpty(iconContent) && (
				<SettingTabsControl
					items={[
						{
							label: __('Normal state', 'maxi-blocks'),
							content: <IconSettings {...props} />,
						},
						{
							label: __('Hover state', 'maxi-blocks'),
							content: <IconSettings {...props} isHover />,
						},
					]}
					depth={2}
				/>
			)}
		</>
	);
};

export default VideoIconControl;
