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
import { Link } from '../../components/link-options/index';
import { Image } from '../../components/image-settings';
import { ButtonSaver } from '../../components/button-styles/';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { setLinkStyles } from './data';

const save = (props) => {
    const {
        className,
        attributes: {
            title,
            mediaID,
            imageSettings,
            description,
            additionalText,
            readMoreText,
            readMoreLink,
            titleLevel,
            blockStyle,
            defaultBlockStyle,
            titleFontFamily,
            uniqueID,
            backgroundImage,
            backgroundGradient,
            linkOptions,
            linkTitle,
            buttonStyles,
        },
    } = props;

    const linkStyles = setLinkStyles(props);

    let classes = classnames(className);
    if (uniqueID && (typeof uniqueID !== 'undefined')) {
        classes = classnames(classes, uniqueID)
    }

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
                        buttonSettings={buttonStyles}
                    />
                </div>
            </Link>
        </div>
    );
}

export default save;