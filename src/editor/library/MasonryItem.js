/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */

// eslint-disable-next-line import/no-cycle
import MaxiModal from './modal';
import Button from '@components/button';

const MasonryItem = props => {
	const {
		type,
		target,
		svgCode,
		serial,
		title,
		previewIMG,
		demoUrl,
		cost,
		beta,
		toneUrl,
		currentItemColorStatus = false,
		className,
		onRequestInsert,
		isSaved = false,
		isMaxiProActive,
		isPro,
		isBeta,
		isSwapChecked,
		onSelect,
		gutenbergCode,
	} = props;

	const getCardSerial = (string = title) => {
		const sub = string?.lastIndexOf(' ');
		const response = string?.substring(sub + 1);
		return response?.toLowerCase();
	};

	const masonryCardClasses = classnames(
		'maxi-cloud-masonry-card',
		`maxi-cloud-masonry-card__${target}`,
		type === 'patterns' &&
			`maxi-cloud-masonry-card__pattern-${getCardSerial()} maxi-open-preview`,
		type === 'svg' &&
			currentItemColorStatus &&
			'maxi-cloud-masonry-card__light',
		className
	);

	const masonryCardId = `maxi-cloud-masonry-card__pattern-${getCardSerial()}`;

	const patternsScContent = () => {
		return (
			<>
				<div className='maxi-cloud-masonry-card__container maxi-open-preview'>
					<div className='maxi-cloud-masonry-card__container__top-bar maxi-open-preview'>
						<div className='maxi-cloud-masonry__serial-tag maxi-open-preview'>
							{title || serial}
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
					{type === 'patterns' && (
						<>
							<MaxiModal
								type='preview'
								url={demoUrl}
								title={title}
								cost={cost}
								beta={beta}
								toneUrl={toneUrl}
								cardId={masonryCardId}
								isPro={isPro}
								isBeta={isBeta}
								onSelect={onSelect}
								isSwapChecked={isSwapChecked}
								gutenbergCode={gutenbergCode}
							/>
							{(!isPro || isBeta || isMaxiProActive) && (
								<Button
									className='maxi-cloud-masonry-card__button maxi-cloud-masonry-card__button-load'
									onClick={() => {
										onRequestInsert();
									}}
								>
									{__('Insert', 'maxi-blocks')}
								</Button>
							)}
							{isPro && !isBeta && !isMaxiProActive && (
								<Button
									className='maxi-cloud-masonry-card__button maxi-cloud-masonry-card__button-go-pro'
									href='https://maxiblocks.com/go/pro-library'
									target='_blank'
								>
									{__('Get Cloud', 'maxi-blocks')}
								</Button>
							)}
						</>
					)}
					{type === 'sc' && (
						<span
							className={classnames(
								'maxi-cloud-masonry-card__button',
								'maxi-cloud-masonry-card__button-load',
								isSaved && 'maxi-cloud-masonry-card__saved'
							)}
						>
							{!isSaved
								? __('Preview', 'maxi-blocks')
								: __('Saved', 'maxi-blocks')}
						</span>
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
				if (type !== 'patterns') return;

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
			{type === 'sc' && (
				<Button onClick={onRequestInsert}>{patternsScContent()}</Button>
			)}
			{type === 'patterns' && patternsScContent()}
			{type === 'svg' && (
				<div
					className='maxi-cloud-masonry-card__svg-container'
					onClick={onRequestInsert}
				>
					<RawHTML
						style={{
							backgroundColor: currentItemColorStatus
								? '#000000'
								: '#ffffff',
						}}
						className='maxi-cloud-masonry-card__svg-container__code'
					>
						{svgCode}
					</RawHTML>
					<div className='maxi-cloud-masonry-card__svg-container__title'>
						{serial
							.replace(' Line', '')
							.replace(' line', '')
							.replace(' shape', '')}
					</div>
					<span>{__('Insert', 'maxi-blocks')}</span>
				</div>
			)}
		</div>
	);
};

export default MasonryItem;
