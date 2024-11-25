/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	library,
	help,
	closeIcon,

} from '../icons';

/**
 * External dependencies
 */
import classnames from 'classnames';
import React from 'react';

/**
 * Component
 */
const ToolbarButton = props => {
	const { label, onClick, icon, className, isSelected } = props;

	const classes = classnames('maxi-cloud-toolbar__button', className);

	return (
		<button
			type='button'
			className={classes}
			onClick={onClick}
			aria-pressed={isSelected}
		>
			{icon}
			<span>{label}</span>
		</button>
	);
};

const LibraryToolbar = props => {
	const {
		type,
		onChange,
		onRequestClose,
		title = '',
		cost = '',
	} = props;

	function addClass(elements, className) {
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element.classList) {
				element.classList.add(className);
			} else {
				element.className += ' ' + className;
			}
		}
	}

	function removeClass(elements, className) {
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element.classList) {
				element.classList.remove(className);
			} else {
				element.className = element.className.replace(
					new RegExp(
						'(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
						'gi'
					),
					' '
				);
			}
		}
	}

	document.addEventListener('fullscreenchange', event => {
		if (!document.fullscreenElement) {
			removeClass(
				document.getElementsByClassName('maxi-cloud-toolbar'),
				'maxi-cloud-toolbar__fullwidth'
			);
			removeClass(
				document.getElementsByClassName(
					'maxi-cloud-toolbar__button-fullwidth'
				),
				'maxi-cloud-toolbar__button_active'
			);
		} else {
			addClass(
				document.getElementsByClassName('maxi-cloud-toolbar'),
				'maxi-cloud-toolbar__fullwidth'
			);
			addClass(
				document.getElementsByClassName(
					'maxi-cloud-toolbar__button-fullwidth'
				),
				'maxi-cloud-toolbar__button_active'
			);
		}
	});

	return (
		<div className='maxi-cloud-toolbar'>
			{type !== 'preview' && (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a
					href='https://maxiblocks.com/demo/'
					target='_blank'
					rel='noreferrer'
					className='maxi-cloud-toolbar__logo'
				>
					{library}

					{type === 'starter-sites' && __('Starter sites', 'maxi-blocks')}
				</a>
			)}
			{type === 'preview' && (
				<>
					<div className='maxi-cloud-toolbar__buttons-group'>
						<ToolbarButton
							label={__('Back', 'maxi-blocks')}
							onClick={onRequestClose}
						/>
						<h2>{title}</h2>
						<span className='maxi-cloud-toolbar__line'>|</span>
						<span>{cost}</span>
					</div>
				</>
			)}
			{type !== 'preview' && (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a
					className='maxi-cloud-toolbar__help-button'
					href='https://maxiblocks.com/go/help-desk'
					rel='noreferrer'
					target='_blank'
				>
					{help}
					{__('Help', 'maxi-blocks')}
				</a>
			)}

			{(type === 'preview') && (
				<div className='maxi-cloud-toolbar__buttons-group_close'>
					<ToolbarButton onClick={onRequestClose} icon={closeIcon} />
				</div>
			)}
		</div>
	);
};

export default LibraryToolbar;
