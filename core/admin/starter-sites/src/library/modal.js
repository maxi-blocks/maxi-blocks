/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import CloudLibrary from '.';

/**
 * External dependencies
 */
import React, { useState } from 'react';

/**
 * Layout modal window with tab panel.
 */
const MaxiModal = props => {
	const {
		type,
		onOpen = null,
		onClose,
		url,
		title,
		cost,
		cardId,
		prefix = '',
		templates,
		pages,
		patterns,
	} = props;

	const [isOpen, changeIsOpen] = useState(false);

	const onClickOpenModal = () => {
		changeIsOpen(!isOpen);
		if (onOpen) onOpen({ openFirstTime: !isOpen });
		if (onClose) onClose();
	};

	const onClickLiveDemo = () => {
		window.open(url, '_blank');
	};

	const onClickImport = () => {
		console.log('import');
	};

	return (
		<div className='maxi-library-modal__action-section'>
			<div className='maxi-library-modal__action-section__buttons'>
				{type === 'preview' && (
					<>
						<button
							type='button'
							className='maxi-cloud-masonry-card__button'
							onClick={onClickOpenModal}
						>
							{__('Details', 'maxi-blocks')}
						</button>
						<button
							type='button'
							className='maxi-cloud-masonry-card__button'
							onClick={onClickLiveDemo}
						>
							{__('Live Demo', 'maxi-blocks')}
						</button>
						<button
							type='button'
							className='maxi-cloud-masonry-card__button'
							onClick={onClickImport}
						>
							{__('Import', 'maxi-blocks')}
						</button>
					</>
				)}
				{isOpen && (
					<div
						className='components-modal__screen-overlay maxi-open-preview'
						id='maxi-modal'
					>
						<div className='maxi-library-modal maxi-preview'>
							<CloudLibrary
								cloudType={type}
								onClose={onClickOpenModal}
								url={url}
								title={title}
								cost={cost}
								cardId={cardId}
								prefix={prefix}
								className={`maxi-library-modal__${type}`}
								templates={templates}
								pages={pages}
								patterns={patterns}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MaxiModal;
