/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { library, help, closeIcon } from '../icons';
import MaxiImportPopUp from './maxiImportPopUp';

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
		onRequestClose,
		title = '',
		cost = '',
		isImport = false,
		url,
		templates,
		pages,
		patterns,
		sc,
		contentXML,
		onImportClick,
	} = props;

	const handleClose = () => {
		console.log('Toolbar close clicked');
		if (onRequestClose) {
			onRequestClose();
		}
	};

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

					{type === 'starter-sites' &&
						__('Starter sites', 'maxi-blocks')}
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
						{!isImport && (
							<button
								type='button'
								className='maxi-cloud-masonry-card__button'
								onClick={onImportClick}
							>
								{__('Import', 'maxi-blocks')}
							</button>
						)}
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

			{type === 'preview' && (
				<div className='maxi-cloud-toolbar__buttons-group_close'>
					<ToolbarButton onClick={handleClose} icon={closeIcon} />
				</div>
			)}
		</div>
	);
};

export default LibraryToolbar;
