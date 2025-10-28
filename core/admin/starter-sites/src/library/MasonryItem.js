/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import MaxiModal from './modal';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

const MasonryItem = props => {
	const {
		type,
		target,
		isPro,
		serial,
		title,
		previewIMG,
		demoUrl,
		cost,
		className,
		templates,
		pages,
		patterns,
		sc,
		contentXML,
		isMaxiProActive,
		onClickConnect,
		onLogOut,
		isQuickStart,
		description,
	} = props;

	const masonryCardClasses = classnames(
		'maxi-cloud-masonry-card',
		`maxi-cloud-masonry-card__${target}`,
		type === 'starter-sites' &&
			`maxi-cloud-masonry-card__patterns ${serial} maxi-open-preview`,
		className
	);

	const masonryCardId = `maxi-cloud-masonry-card__pattern-${serial}`;

	const starterSitesContent = () => {
		return (
			<>
				<div className='maxi-cloud-masonry-card__container maxi-open-preview'>
					<div className='maxi-cloud-masonry-card__container__top-bar maxi-open-preview'>
						<div className='maxi-cloud-masonry__serial-tag maxi-open-preview'>
							{title}
						</div>
					</div>
				</div>
				<div className='maxi-cloud-masonry-card__image maxi-open-preview'>
					<img
						src={previewIMG}
						alt={`Preview for ${title}`}
						className='maxi-cloud-masonry-card__image-picture maxi-open-preview'
					/>
				</div>
				<div className='maxi-cloud-masonry-card__buttons maxi-open-preview'>
					{type === 'starter-sites' && (
						<>
							<MaxiModal
								type='preview'
								url={demoUrl}
								title={title}
								serial={serial}
								cost={cost}
								cardId={masonryCardId}
								templates={templates}
								pages={pages}
								patterns={patterns}
								sc={sc}
								contentXML={contentXML}
								isMaxiProActive={isMaxiProActive}
								isPro={isPro}
								onClickConnect={onClickConnect}
								onLogOut={onLogOut}
								isQuickStart={isQuickStart}
								description={description}
							/>
						</>
					)}
					<div className='maxi-cloud-masonry-card__tags maxi-open-preview'>
						{!isPro && (
							<span className='maxi-cloud-masonry-card__tags__tag maxi-cloud-masonry-card__tags__tag-free'>
								{__('Free', 'maxi-blocks')}
							</span>
						)}
						{isPro && (
							<span className='maxi-cloud-masonry-card__tags__tag maxi-cloud-masonry-card__tags__tag-pro'>
								{__('Cloud', 'maxi-blocks')}
							</span>
						)}
					</div>
				</div>
			</>
		);
	};

	return (
		<div
			className={masonryCardClasses}
			id={masonryCardId}
			onClick={event => {
				if (type !== 'starter-sites') return;

				const button = document.querySelector(
					`#${masonryCardId} .maxi-library-modal__action-section__buttons button.maxi-cloud-masonry-card__button`
				);

				const classes = event.target.classList;

				if (
					!isEmpty(classes) &&
					classes?.contains('maxi-open-preview')
				) {
					button?.click();
				}
			}}
		>
			{type === 'starter-sites' && starterSitesContent()}
		</div>
	);
};

export default MasonryItem;
