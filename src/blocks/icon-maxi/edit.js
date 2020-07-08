/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add(fas, fab, far);

/**
 * Content
 */
function edit() {
    return [
        <Fragment>
            <Fragment><FontAwesomeIcon icon={['fab', 'google']} /></Fragment>
            <Fragment><FontAwesomeIcon icon={['fab', '500px']} /></Fragment>
            <Fragment><FontAwesomeIcon icon={['fab', 'android']} /></Fragment>
        </Fragment>
    ];}

export default edit;