/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import {
	getDefaultAttribute,
	getGroupAttributes,
} from '../../../../extensions/styles';
import getBlockStyle from '../../../../extensions/styles/getBlockStyle';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarDividerSetting } from '../../../../icons';

/**
 * DividerColor
 */
const DividerColor = props => {
	const { blockName, onChange, blockStyle, breakpoint, clientId } = props;

	if (blockName !== 'maxi-blocks/divider-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__text-options'
			tooltip={__('Divider color', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__text-options__icon'
					style={{
						background:
							props['divider-border-color'] ||
							`var(--maxi-${getBlockStyle(
								blockStyle,
								clientId
							)}-color-${props['palette-preset-divider-color']})`,
						borderWidth: '1px',
						borderColor: '#fff',
						borderStyle: 'solid',
					}}
				>
					<Icon
						className='toolbar-item__text-options__inner-icon'
						icon={toolbarDividerSetting}
					/>
				</div>
			}
		>
			<div className='toolbar-item__divider-color__popover'>
				<ColorControl
					label={__('Divider', 'maxi-blocks')}
					color={props['divider-border-color']}
					defaultColor={getDefaultAttribute('border-color')}
					onChange={val => onChange({ 'divider-border-color': val })}
					disableGradient
					showPalette
					blockStyle={blockStyle}
					palette={{ ...getGroupAttributes(props, 'palette') }}
					colorPaletteType='divider'
					onChangePalette={val => onChange(val)}
					deviceType={breakpoint}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default DividerColor;
