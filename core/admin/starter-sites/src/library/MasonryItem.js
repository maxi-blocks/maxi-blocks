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

const MasonryItem = (props) => {
    const {
        type,
        target,
        isPro,
        serial,
        previewIMG,
        demoUrl,
        cost,
        className,
        templates,
        pages,
        patterns,
		sc,
		contentXML,
    } = props;

    const cardSerial = serial.toLowerCase().replace(/\s+/g, '-');

    const masonryCardClasses = classnames(
        'maxi-cloud-masonry-card',
        `maxi-cloud-masonry-card__${target}`,
        type === 'starter-sites' &&
            `maxi-cloud-masonry-card__patterns ${cardSerial} maxi-open-preview`,
        className
    );

    const masonryCardId = `maxi-cloud-masonry-card__pattern-${cardSerial}`;

    const starterSitesContent = () => {
        return (
            <>
                <div className='maxi-cloud-masonry-card__container maxi-open-preview'>
                    <div className='maxi-cloud-masonry-card__container__top-bar maxi-open-preview'>
                        <div className='maxi-cloud-masonry__serial-tag maxi-open-preview'>
                            {serial}
                        </div>
                    </div>
                </div>
                <div className='maxi-cloud-masonry-card__image maxi-open-preview'>
                    <img
                        src={previewIMG}
                        alt={`Preview for ${serial}`}
                        className='maxi-cloud-masonry-card__image-picture maxi-open-preview'
                    />
                </div>
                <div className='maxi-cloud-masonry-card__buttons maxi-open-preview'>
                    {type === 'starter-sites' && (
                        <>
                            <MaxiModal
                                type='preview'
                                url={demoUrl}
                                title={serial}
                                serial={cardSerial}
                                cost={cost}
                                cardId={masonryCardId}
                                templates={templates}
                                pages={pages}
                                patterns={patterns}
								sc={sc}
								contentXML={contentXML}
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
                                {__('Pro', 'maxi-blocks')}
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
            onClick={(event) => {
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
