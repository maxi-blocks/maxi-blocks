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
		sc,
		contentXML,
	} = props;

	const [isOpenDetails, changeIsOpenDetails] = useState(false);
	const [isOpenImport, changeIsOpenImport] = useState(false);

	const onClickOpenModalDetails = () => {
		changeIsOpenDetails(!isOpenDetails);
		if (onOpen) onOpen({ openFirstTime: !isOpenDetails });
		if (onClose) onClose();
	};

	const onClickOpenModalImport = () => {
		console.log('onClickOpenModalImport');
		console.log(isOpenImport);
		changeIsOpenImport(!isOpenImport);
		if (onOpen) onOpen({ openFirstTime: !isOpenImport });
		if (onClose) onClose();
	};

	const onClickLiveDemo = () => {
		window.open(url, '_blank');
	};

	return (
		<div className='maxi-library-modal__action-section'>
			<div className='maxi-library-modal__action-section__buttons'>
				{type === 'preview' && (
					<>
						<button
							type='button'
							className='maxi-cloud-masonry-card__button'
							onClick={onClickOpenModalDetails}
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
							onClick={onClickOpenModalImport}
						>
							{__('Import', 'maxi-blocks')}
						</button>
					</>
				)}
				{isOpenDetails && (
					<div
						className='components-modal__screen-overlay maxi-open-preview'
						id='maxi-modal'
					>
						<div className='maxi-library-modal maxi-preview'>
							<CloudLibrary
								cloudType={type}
								onClose={onClickOpenModalDetails}
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
				{isOpenImport && (
					<div
						className='components-modal__screen-overlay maxi-open-preview'
						id='maxi-modal-import'
					>
						<div className='maxi-library-modal maxi-preview maxi-modal-import'>
							<CloudLibrary
								cloudType={type}
								onClose={onClickOpenModalImport}
								url={url}
								title={title}
								cost={cost}
								cardId={cardId}
								prefix={prefix}
								className={`maxi-library-modal__${type}`}
								templates={templates}
								pages={pages}
								patterns={patterns}
								isImport={true}
								sc={sc}
								contentXML={contentXML}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MaxiModal;
