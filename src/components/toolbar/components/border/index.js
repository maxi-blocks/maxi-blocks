/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BorderControl from '../../../border-control';
import ToolbarPopover from '../toolbar-popover';
import getBlockStyle from '../../../../extensions/styles/getBlockStyle';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarBorder } from '../../../../icons';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

/**
 * Border
 */
const ALLOWED_BLOCKS = ['maxi-blocks/button-maxi', 'maxi-blocks/image-maxi'];

/**
 * Component
 */
const Border = props => {
	const {
		blockName,
		onChange,
		breakpoint,
		disableColor = false,
		blockStyle,
		clientId,
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	return (
		<ToolbarPopover
			className='toolbar-item__border'
			advancedOptions='border'
			tooltip={__('Border', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__border__icon'
					style={{
						borderStyle: getLastBreakpointAttribute(
							'border-style',
							breakpoint,
							props
						),
						background:
							getLastBreakpointAttribute(
								'border-style',
								breakpoint,
								props
							) === 'none'
								? 'transparent'
								: getLastBreakpointAttribute(
										'border-style',
										breakpoint,
										props
								  ),
						borderWidth: '1px',
						borderColor:
							getLastBreakpointAttribute(
								'border-color',
								breakpoint,
								props
							) ||
							`var(--maxi-${getBlockStyle(
								blockStyle,
								clientId
							)}-color-${props['palette-preset-border-color']})`,
					}}
				>
					<Icon
						className='toolbar-item__border__inner-icon'
						icon={toolbarBorder}
					/>
				</div>
			}
		>
			<div className='toolbar-item__border__popover'>
				<BorderControl
					{...getGroupAttributes(props, [
						'border',
						'borderWidth',
						'borderRadius',
						'palette',
					])}
					onChange={value => onChange(value)}
					breakpoint={breakpoint}
					disableAdvanced
					disableColor={disableColor}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default Border;
