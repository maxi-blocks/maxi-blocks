/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalLinkControl as NativeLinkControl } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import TextControl from '@components/text-control';
import ToggleSwitch from '@components/toggle-switch';

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
	isDCLinkActive,
	disableOpenInNewTab,
	onChangeLink,
	onRemoveLink,
	showRemoveLink = true,
	showAccessibility = true,
}) => {
	// Add effect to disable browser autocomplete
	useEffect(() => {
		const timer = setTimeout(() => {
			const linkInputs = document.querySelectorAll(
				'.maxi-link-control input[type="text"]'
			);
			linkInputs.forEach(input => {
				input.setAttribute('autocomplete', 'off');
				input.setAttribute('autocorrect', 'off');
				input.setAttribute('autocapitalize', 'off');
				input.setAttribute('spellcheck', 'false');
			});
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	const onChangeNativeLink = value => {
		const isUrlChanged = value.url !== linkValue.url;
		const title =
			isUrlChanged && linkValue.title === linkValue.url
				? ''
				: linkValue.title;

		onChangeLink({
			...value,
			title,
			ariaLabel: linkValue.ariaLabel,
		});
	};

	return (
		<div
			className={classnames(
				'maxi-link-control',
				isDCLinkActive && 'maxi-link-control--dc'
			)}
		>
			<NativeLinkControl
				searchInputPlaceholder={__('Search or type URL', 'maxi-blocks')}
				value={linkValue}
				forceIsEditingLink={isDCLinkActive ? false : undefined}
				onChange={onChangeNativeLink}
				settings={[]}
			/>
			{(isDCLinkActive || !isEmpty(linkValue.url)) && (
				<>
					<TextControl
						label={__('Title', 'maxi-blocks')}
						newStyle
						value={linkValue.title || ''}
						onChange={title =>
							onChangeLink({
								...linkValue,
								title,
							})
						}
					/>
					<div className='maxi-link-control__options'>
						{[
							[
								{
									label: __('Open in new tab', 'maxi-blocks'),
									id: 'opensInNewTab',
									disabled: disableOpenInNewTab,
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
								{options.map(({ label, id, disabled }) => (
									<ToggleSwitch
										key={id}
										label={label}
										disabled={disabled}
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
					{showAccessibility && (
						<div className='maxi-link-control__accessibility'>
							<span className='maxi-link-control__section-title'>
								{__('Accessibility', 'maxi-blocks')}
							</span>
							<TextControl
								label={__('Aria label', 'maxi-blocks')}
								newStyle
								value={linkValue.ariaLabel || ''}
								onChange={ariaLabel =>
									onChangeLink({
										...linkValue,
										ariaLabel,
									})
								}
							/>
						</div>
					)}
					{showRemoveLink && !isDCLinkActive && (
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
