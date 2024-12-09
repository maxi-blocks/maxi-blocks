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
        url,
        title,
        cost,
        prefix = '',
        onClose,
        templates,
        pages,
        patterns,
        isImport,
        sc,
        contentXML,
    } = props;

    return (
        <div className='components-modal__content'>
            <LibraryToolbar
                type={cloudType}
                onRequestClose={onClose}
                title={title}
                cost={cost}
            />
            <LibraryContainer
                type={cloudType}
                url={url}
                title={title}
                prefix={prefix}
                isPro
                templates={templates}
                pages={pages}
                patterns={patterns}
                isImport={isImport}
                onRequestClose={onClose}
                sc={sc}
                contentXML={contentXML}
            />
        </div>
    );
};

export default CloudLibrary;