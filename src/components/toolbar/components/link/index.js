/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { __experimentalLinkControl } = wp.blockEditor;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * Link
 */
const Link = props => {
	const { blockName, onChange } = props;

	if (
		blockName === 'maxi-blocks/divider-maxi' ||
		blockName === 'maxi-blocks/text-maxi'
	)
		return null;

	const linkSettings = { ...props.linkSettings };

	return (
		<ToolbarPopover
			icon={toolbarLink}
			tooltip={__('Link', 'maxi-blocks')}
			className={
				!isEmpty(linkSettings.url) && 'toolbar-item__link--active'
			}
			content={
				<__experimentalLinkControl
					value={linkSettings}
					onChange={value => onChange(value)}
					settings={[
						{
							id: 'opensInNewTab',
							title: __('Open in new tab', 'maxi-blocks'),
						},
						{
							id: 'noFollow',
							title: __('Add "nofollow" rel', 'maxi-blocks'),
						},
						{
							id: 'sponsored',
							title: __('Add "sponsored" rel', 'maxi-blocks'),
						},
						{
							id: 'ugc',
							title: __('Add "sponsored" rel', 'maxi-blocks'),
						},
					]}
				/>
			}
		/>
	);
};

export default Link;
