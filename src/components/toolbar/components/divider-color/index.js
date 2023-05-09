/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../../../color-control';
import Icon from '../../../icon';
import ToolbarPopover from '../toolbar-popover';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarShapeLineColor } from '../../../../icons';

/**
 * DividerColor
 */
const DividerColor = props => {
	const { blockName, onChangeInline, onChange, breakpoint } = props;

	if (blockName !== 'maxi-blocks/divider-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__divider'
			tooltip={__('Divider line colour', 'maxi-blocks')}
			icon={
				<div className='toolbar-item__divider__icon'>
					<Icon
						className='toolbar-item__divider-icon'
						icon={toolbarShapeLineColor}
					/>
				</div>
			}
			advancedOptions='line settings'
		>
			<div className='toolbar-item__divider-color__popover'>
				<ColorControl
					label={__('Divider line', 'maxi-blocks')}
					color={getLastBreakpointAttribute({
						target: 'di-bo_cc',
						breakpoint,
						attributes: props,
					})}
					prefix='di-bo-'
					paletteColor={getLastBreakpointAttribute({
						target: 'di-bo_pc',
						breakpoint,
						attributes: props,
					})}
					paletteOpacity={getLastBreakpointAttribute({
						target: 'di-bo_po',
						breakpoint,
						attributes: props,
					})}
					paletteStatus={getLastBreakpointAttribute({
						target: 'di-bo_ps',
						breakpoint,
						attributes: props,
					})}
					onChangeInline={({ color }) =>
						onChangeInline({ 'border-color': color })
					}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) => {
						onChange({
							[getAttributeKey(
								'_cc',
								false,
								'di-bo-',
								breakpoint
							)]: color,
							[getAttributeKey(
								'_pc',
								false,
								'di-bo-',
								breakpoint
							)]: paletteColor,
							[getAttributeKey(
								'_po',
								false,
								'di-bo-',
								breakpoint
							)]: paletteOpacity,
							[getAttributeKey(
								'_ps',
								false,
								'di-bo-',
								breakpoint
							)]: paletteStatus,
						});
					}}
					deviceType={breakpoint}
					disableGradient
					globalProps={{ target: '', type: 'divider' }}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default DividerColor;
