/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalLinkControl } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * Link
 */
const Link = props => {
	const { blockName, onChange, linkSettings } = props;

	if (
		blockName === 'maxi-blocks/divider-maxi' ||
		blockName === 'maxi-blocks/text-maxi'
	)
		return null;

	const ref = useRef();

	const removeLinkHandle = () => {
		onChange({
			url: '',
		});

		if (ref.current) ref.current.node.state.isOpen = false;
	};

	return (
		<ToolbarPopover
			ref={ref}
			icon={toolbarLink}
			tooltip={__('Link', 'maxi-blocks')}
			className={
				!isNil(linkSettings) &&
				!isEmpty(linkSettings.url) &&
				'toolbar-item__link--active'
			}
		>
			<>
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
				{!isNil(linkSettings) && !isEmpty(linkSettings.url) && (
					<Button
						className='toolbar-popover-link-destroyer'
						onClick={() => removeLinkHandle()}
					>
						{__('Remove link', 'maxi-blocks')}
					</Button>
				)}
			</>
		</ToolbarPopover>
	);
};

export default Link;
