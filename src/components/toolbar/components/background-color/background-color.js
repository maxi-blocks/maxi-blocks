/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import ColorLayer from '@components/background-control/colorLayer';
import {
	getAttributeKey,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import ToggleSwitch from '@components/toggle-switch';

/**
 * Styles
 */
import './editor.scss';

/**
 * Icons
 */
import { backgroundColor } from '@maxi-icons';

/**
 * BackgroundColor
 */

const ALLOWED_BLOCKS = ['maxi-blocks/button-maxi', 'maxi-blocks/video-maxi'];

const BackgroundColor = props => {
	const {
		blockName,
		onChangeInline,
		onChange,
		clientId,
		breakpoint,
		prefix = '',
		globalProps,
		advancedOptions = 'background',
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName) || props.playerType === 'video')
		return null;

	const activeMedia = getLastBreakpointAttribute({
		target: `${prefix}background-active-media`,
		breakpoint,
		attributes: props,
	});
	const isBackgroundColor = activeMedia === 'color';

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions={advancedOptions}
			tooltip={
				!isBackgroundColor
					? __('Background colour disabled', 'maxi-blocks')
					: __('Background colour', 'maxi-blocks')
			}
			icon={backgroundColor}
		>
			<div className='toolbar-item__background__popover'>
				<ToggleSwitch
					label={__('Enable background colour', 'maxi-blocks')}
					selected={isBackgroundColor}
					onChange={val => {
						onChange({
							[getAttributeKey(
								'background-active-media',
								false,
								prefix,
								breakpoint
							)]: val ? 'color' : 'none',
						});
					}}
				/>
				{isBackgroundColor && (
					<ColorLayer
						colorOptions={useMemo(() => ({
							...getGroupAttributes(
								props,
								'backgroundColor',
								false,
								prefix
							),
						}), [props, prefix])}
						key={`background-color-layer--${clientId}`}
						onChangeInline={onChangeInline}
						onChange={onChange}
						breakpoint={breakpoint}
						globalProps={globalProps}
						prefix={prefix}
						clientId={clientId}
						disableClipPath
						isToolbar
						disableRTC
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default memo(BackgroundColor);
