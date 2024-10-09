/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ManageHoverTransitions from '../../../../components/manage-hover-transitions';
import SettingTabsControl from '../../../../components/setting-tabs-control';
import ToggleSwitch from '../../../../components/toggle-switch';
import SvgColor from '../../../../components/svg-color';

const SvgColorControl = props => {
	const {
		onChangeInline,
		svgType,
		maxiSetAttributes,
		cleanInlineStyles,
		disableHover = false,
	} = props;
	const hoverStatus = props['svg-status-hover'];

	const onChangeProps = {
		onChangeFill: obj => {
			maxiSetAttributes(obj);

			if (cleanInlineStyles && svgType !== 'Line')
				cleanInlineStyles('[data-fill]');
		},
		onChangeStroke: obj => {
			maxiSetAttributes(obj);

			if (cleanInlineStyles && svgType !== 'Shape')
				cleanInlineStyles('[data-stroke]');
		},
		onChangeHoverFill: obj => {
			maxiSetAttributes(obj);
		},
		onChangeHoverStroke: obj => {
			maxiSetAttributes(obj);
		},
	};
	const normalSvgColor = (
		<>
			{svgType !== 'Line' && (
				<SvgColor
					{...props}
					{...onChangeProps}
					type='fill'
					label={__('Icon fill', 'maxi-blocks')}
					onChangeInline={obj => onChangeInline(obj, '[data-fill]')}
				/>
			)}
			{svgType !== 'Shape' && (
				<SvgColor
					{...props}
					{...onChangeProps}
					type='line'
					label={__('Icon line', 'maxi-blocks')}
					onChangeInline={obj => onChangeInline(obj, '[data-stroke]')}
				/>
			)}
		</>
	);

	return !disableHover ? (
		<SettingTabsControl
			hasMarginBottom
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: normalSvgColor,
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: (
						<>
							<ManageHoverTransitions />

							<ToggleSwitch
								label={__('Enable hover colour', 'maxi-blocks')}
								selected={hoverStatus}
								className='maxi-svg-status-hover'
								onChange={val => {
									maxiSetAttributes({
										'svg-status-hover': val,
									});
								}}
							/>
							{hoverStatus && (
								<>
									{svgType !== 'Line' && (
										<SvgColor
											{...props}
											{...onChangeProps}
											type='fill'
											label={__(
												'Icon fill hover',
												'maxi-blocks'
											)}
											onChangeInline={null}
											isHover
										/>
									)}
									{svgType !== 'Shape' && (
										<SvgColor
											{...props}
											{...onChangeProps}
											type='line'
											label={__(
												'Icon line hover',
												'maxi-blocks'
											)}
											onChangeInline={null}
											isHover
										/>
									)}
								</>
							)}
						</>
					),
				},
			]}
		/>
	) : (
		normalSvgColor
	);
};

export default SvgColorControl;
