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
const MaxiModal = (props) => {
    const {
        type,
        onOpen = null,
        onClose,
        url,
        title,
        cost,
        toneUrl,
        cardId,
        prefix = '',
    } = props;

    const [isOpen, changeIsOpen] = useState(false);

    const onClick = () => {
        changeIsOpen(!isOpen);

        if (onOpen) onOpen({ openFirstTime: !isOpen });
        if (onClose) onClose();
    };

    return (
        <>
            {type !== 'switch-tone' && (
                <div className='maxi-library-modal__action-section'>
                    <div className='maxi-library-modal__action-section__buttons'>
                        {type === 'preview' && (
                            <button
                                className='maxi-cloud-masonry-card__button'
                                onClick={onClick}
                            >
                                {__('Preview', 'maxi-blocks')}
                            </button>
                        )}
                        {isOpen && (
                            <div
                                className='components-modal__screen-overlay maxi-open-preview'
                                id='maxi-modal'
                            >
                                <div className='maxi-library-modal maxi-preview'>
                                    <CloudLibrary
                                        cloudType={type}
                                        onClose={onClick}
                                        blockStyle='light'
                                        url={url}
                                        title={title}
                                        cost={cost}
                                        toneUrl={toneUrl}
                                        cardId={cardId}
                                        prefix={prefix}
                                        className={`maxi-library-modal__${type}`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {type === 'switch-tone' && (
                <div className='components-modal__screen-overlay maxi-open-preview maxi-switch-tone'>
                    <div className='maxi-library-modal maxi-preview'>
                        <CloudLibrary
                            cloudType={type}
                            onClose={onClick}
                            blockStyle='light'
                            url={url}
                            title={title}
                            cost={cost}
                            toneUrl={toneUrl}
                            cardId={cardId}
                            prefix={prefix}
                            className={`maxi-library-modal__${type}`}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default MaxiModal;
