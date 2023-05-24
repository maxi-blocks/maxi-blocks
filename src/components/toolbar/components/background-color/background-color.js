/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorLayer from '../../../background-control/colorLayer';
import {
	getAttributeKey,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';
import ToggleSwitch from '../../../toggle-switch';

/**
 * Styles
 */
import './editor.scss';

/**
 * Icons
 */
import { backgroundColor } from '../../../../icons';

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

	if (!ALLOWED_BLOCKS.includes(blockName) || props._pt === 'video')
		return null;

	const activeMedia = getLastBreakpointAttribute({
		target: 'b_am',
		prefix,
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
							[getAttributeKey({
								key: 'b_am',
								prefix,
								breakpoint,
							})]: val ? 'color' : 'none',
						});
					}}
				/>
				{isBackgroundColor && (
					<ColorLayer
						colorOptions={{
							...getGroupAttributes(
								props,
								'backgroundColor',
								false,
								prefix
							),
							type: 'color',
						}}
						key={`background-color-layer--${clientId}`}
						onChangeInline={onChangeInline}
						onChange={onChange}
						breakpoint={breakpoint}
						globalProps={globalProps}
						prefix={prefix}
						clientId={clientId}
						disableClipPath
						isToolbar
						disableResponsiveTabs
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default BackgroundColor;
