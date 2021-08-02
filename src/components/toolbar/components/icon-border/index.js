/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BorderControl from '../../../border-control';
import ToolbarPopover from '../toolbar-popover';
import Icon from '../../../icon';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getBlockStyle,
} from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarBorder } from '../../../../icons';

/**
 * Component
 */
const IconBorder = props => {
	const { blockName, onChange, clientId, breakpoint } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__border'
			tooltip={__('Icon Border', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__border__icon'
					style={{
						borderStyle: getLastBreakpointAttribute(
							'icon-border-style',
							breakpoint,
							props
						),
						background:
							getLastBreakpointAttribute(
								'icon-border-style',
								breakpoint,
								props
							) === 'none'
								? 'transparent'
								: getLastBreakpointAttribute(
										'icon-border-style',
										breakpoint,
										props
								  ),
						borderWidth: '1px',
						borderColor: props[
							`icon-border-palette-color-status-${breakpoint}`
						]
							? `var(--maxi-${getBlockStyle(clientId)}-color-${
									props[
										`icon-border-palette-color-${breakpoint}`
									]
							  })`
							: props[`icon-border-color-${breakpoint}`],
					}}
				>
					<Icon
						className='toolbar-item__border__inner-icon'
						icon={toolbarBorder}
					/>
				</div>
			}
		>
			<div className='toolbar-item__icon-border__popover'>
				<BorderControl
					{...getGroupAttributes(props, [
						'iconBorder',
						'iconBorderWidth',
						'iconBorderRadius',
					])}
					prefix='icon-'
					disableAdvanced
					onChange={obj => onChange(obj)}
					breakpoint={breakpoint}
					clientId={clientId}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default IconBorder;
