/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon } = wp.components;

/**
 * Internal dependencies
 */
import BorderControl from '../../../border-control/newBorderControl';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarBorder } from '../../../../icons';
import getLastBreakpointValue from '../../../../extensions/styles/getLastBreakpointValue';
import getGroupAttributes from '../../../../extensions/styles/getGroupAttributes';

/**
 * Border
 */
const ALLOWED_BLOCKS = ['maxi-blocks/button-maxi', 'maxi-blocks/image-maxi'];

/**
 * Component
 */
const Border = props => {
	const { blockName, onChange, breakpoint, disableColor = false } = props;

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
						borderStyle: getLastBreakpointValue(
							'border-style',
							breakpoint,
							props
						),
						background:
							getLastBreakpointValue(
								'border-style',
								breakpoint,
								props
							) === 'none'
								? 'transparent'
								: getLastBreakpointValue(
										'border-style',
										breakpoint,
										props
								  ),
						borderWidth: '1px',
						borderColor: getLastBreakpointValue(
							'border-color',
							breakpoint,
							props
						),
					}}
				>
					<Icon
						className='toolbar-item__border__inner-icon'
						icon={toolbarBorder}
					/>
				</div>
			}
			content={
				<div className='toolbar-item__border__popover'>
					<BorderControl
						{...getGroupAttributes(props, [
							'border',
							'borderWidth',
							'borderRadius',
						])}
						onChange={value => onChange(value)}
						breakpoint={breakpoint}
						disableAdvanced
						disableColor={disableColor}
					/>
				</div>
			}
		/>
	);
};

export default Border;
