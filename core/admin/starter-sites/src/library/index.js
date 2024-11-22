/**
 * Internal dependencies
 */
import LibraryToolbar from './toolbar';
import LibraryContainer from './container';
/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 *
 * @param {string} cloudType Type of the data to get from the Cloud, values: patterns, svg, sc
 */
const CloudLibrary = (props) => {
    const {
        cloudType,
        blockStyle,
        url,
        title,
        cost,
        toneUrl,
        cardId,
        prefix = '',
        onClose,
    } = props;

    const [type, setType] = useState(cloudType);

    useEffect(() => {
        setType(cloudType);
    }, [cloudType]);

    document.addEventListener('keypress', (e) => {
        if (e.key === 40) {
            window.scrollBy({ top: -30, behavior: 'smooth' });
        } else if (e.key === 38) {
            window.scrollBy({ top: 30, behavior: 'smooth' });
        }
    });

    return (
        <div className='components-modal__content'>
            <LibraryToolbar
                type={cloudType}
                onRequestClose={onClose}
            />
            <LibraryContainer
                type={cloudType}
                blockStyle={blockStyle}
                url={url}
                title={title}
                prefix={prefix}
                isPro
            />
        </div>
    );
};

export default CloudLibrary;
