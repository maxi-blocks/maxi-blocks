/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalLinkControl as NativeLinkControl } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Button from '../button';
import ToggleSwitch from '../toggle-switch';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

const LinkControl = ({
	linkValue = {},
	dcLinkStatus,
	onChangeLink,
	onRemoveLink,
}) => {
	return (
		<div
			className={classnames(
				'maxi-link-control',
				dcLinkStatus && 'maxi-link-control--dc'
			)}
		>
			<NativeLinkControl
				searchInputPlaceholder={__('Search or type URL', 'maxi-blocks')}
				value={linkValue}
				onChange={onChangeLink}
				settings={[]}
			/>
			{!isEmpty(linkValue.url) && (
				<>
					<div className='maxi-link-control__options'>
						{[
							[
								{
									label: __('Open in new tab', 'maxi-blocks'),
									id: 'opensInNewTab',
								},
								{
									label: __('"nofollow"', 'maxi-blocks'),
									id: 'noFollow',
								},
							],
							[
								{
									label: __('"sponsored"', 'maxi-blocks'),
									id: 'sponsored',
								},
								{
									label: __('"UGC"', 'maxi-blocks'),
									id: 'ugc',
								},
							],
						].map((options, index) => (
							<div
								// eslint-disable-next-line react/no-array-index-key
								key={index}
								className='maxi-link-control__options-row'
							>
								{options.map(({ label, id }) => (
									<ToggleSwitch
										key={id}
										label={label}
										selected={linkValue[id]}
										onChange={checked =>
											onChangeLink({
												...linkValue,
												[id]: checked,
											})
										}
									/>
								))}
							</div>
						))}
					</div>
					{!dcLinkStatus && (
						<Button
							className='maxi-link-control__link-destroyer'
							onClick={onRemoveLink}
						>
							{__('Remove link', 'maxi-blocks')}
						</Button>
					)}
				</>
			)}
		</div>
	);
};

export default LinkControl;
