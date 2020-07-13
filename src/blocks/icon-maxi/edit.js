/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Placeholder } = wp.components;

import {
    MaxiBlock,
    __experimentalToolbar
} from '../../components';
import MaxiModal from './modal';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add( fas, fab, far );

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
} from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
    render() {
        const {
            className,
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                extraClassName,
                fullWidth,
                size,
                width,
                content
            },
            setAttributes,
            clientId,
            attributes,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-icon-block',
            blockStyle,
            extraClassName,
            uniqueID,
            className
        );

        return [
               <Fragment key={ this.props.clientId }>
                <Placeholder
                    key="placeholder"
                    label={ __( 'Cloud Library Maxi', 'gutenberg-extra-blocks' ) }
                    instructions={ __( 'Launch the library to browse pre-designed blocks and templates.', 'gutenberg-extra-blocks' ) }
                    className={ 'maxi-block-library__placeholder' }
                >
                    <MaxiModal clientId={ clientId } />
                </Placeholder>
            </Fragment>
        ];
    }
}

export default edit;