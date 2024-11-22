/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';

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
        svgCode,
        isPro,
        serial,
        previewIMG,
        demoUrl,
        cost,
        toneUrl,
        currentItemColorStatus = false,
        className,
    } = props;

    const cardSerial = serial
        ?.substring(serial?.lastIndexOf(' ') + 1)
        ?.toLowerCase();

    const masonryCardClasses = classnames(
        'maxi-cloud-masonry-card',
        `maxi-cloud-masonry-card__${target}`,
        type === 'patterns' &&
            `maxi-cloud-masonry-card__pattern-${cardSerial} maxi-open-preview`,
        type === 'svg' &&
            currentItemColorStatus &&
            'maxi-cloud-masonry-card__light',
        className
    );

    const masonryCardId = `maxi-cloud-masonry-card__pattern-${cardSerial}`;

    const patternsScContent = () => {
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
                    {type === 'patterns' && (
                        <>
                            <MaxiModal
                                type='preview'
                                url={demoUrl}
                                title={serial}
                                serial={cardSerial}
                                cost={cost}
                                toneUrl={toneUrl}
                                cardId={masonryCardId}
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
            {type === 'patterns' && patternsScContent()}
            {type === 'sc' && (
                <div className='maxi-components-button'>
                    {patternsScContent()}
                </div>
            )}
            {type === 'svg' && (
                <div className='maxi-cloud-masonry-card__svg-container'>
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
                        {target === 'button-icon' || target.includes('Line')
                            ? serial.replace(' Line', '')
                            : [
                                  'image-shape',
                                  'bg-shape',
                                  'sidebar-block-shape',
                                  'video-icon',
                              ].includes(target) || target.includes('Shape')
                            ? serial.replace(' shape', '')
                            : serial}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasonryItem;
