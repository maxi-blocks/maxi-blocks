/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BorderControl from '../../../border-control';
import Icon from '../../../icon';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarBorder } from '../../../../icons';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getBlockStyle,
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
							`var(--maxi-${getBlockStyle(clientId)}-color-${
								props['palette-preset-border-color']
							})`,
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
					clientId={clientId}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default Border;
