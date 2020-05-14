/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    RichText,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import {
    ButtonSaver,
    Image,
    Link
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { setLinkStyles } from './utils';

const save = props => {
    const {
        className,
        attributes: {
            uniqueID,
            blockStyle,
            defaultBlockStyle,
            linkTitle,
            linkOptions,
            imageSettings,
            mediaID,
            titleLevel,
            title,
            additionalText,
            description,
            buttonSettings,
        },
    } = props;

    const linkStyles = setLinkStyles(props);

    let classes = classnames(className);
    if (uniqueID && (typeof uniqueID !== 'undefined'))
        classes = classnames(classes, uniqueID);

    return (
        <div
            className={'gx-block ' + blockStyle + ' gx-image-box ' + classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <Link
                link={linkTitle}
                linkOptions={linkOptions}
                className="gx-image-box-link"
                style={linkStyles}
            >
                {mediaID &&
                    <Image
                        className="gx-image-box-image"
                        imageSettings={imageSettings}
                        mediaID={mediaID}
                    />
                }
                <div class='gx-image-box-text'>
                    <RichText.Content
                        tagName={titleLevel}
                        className="gx-image-box-title"
                        value={title}
                    />
                    <RichText.Content
                        tagName="p"
                        className="gx-image-box-subtitle"
                        value={additionalText}
                    />
                    <RichText.Content
                        tagName="p"
                        className="gx-image-box-description"
                        value={description}
                    />
                    <ButtonSaver
                        buttonSettings={buttonSettings}
                    />
                </div>
            </Link>
        </div>
    );
}

export default save;