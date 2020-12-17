/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon } = wp.components;

/**
 * Internal dependencies
 */
import BorderControl from '../../../border-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarBorder } from '../../../../icons';
import { getLastBreakpointValue } from '../../../../utils';

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
		defaultBorder,
		onChange,
		breakpoint,
		disableColor = false,
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const border = { ...props.border };

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
							border,
							'border-style',
							breakpoint
						),
						background:
							getLastBreakpointValue(
								border,
								'border-style',
								breakpoint
							) === 'none'
								? 'transparent'
								: getLastBreakpointValue(
										border,
										'border-style',
										breakpoint
								  ),
						borderWidth: '1px',
						borderColor: getLastBreakpointValue(
							border,
							'border-color',
							breakpoint
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
						border={border}
						defaultBorder={defaultBorder}
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
