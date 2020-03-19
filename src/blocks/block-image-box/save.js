import classnames from 'classnames';

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const {
	RichText,
} = wp.blockEditor;

/**
 * External dependencies
 */
 import { Link } from '../../components/link-options/index';
import {
    setLinkStyles,
    setTitleStyles,
    setSubTitleStyles,
    setDescriptionStyles,
    setButtonStyles,
    setBlockStyles,
} from './data';

const save = ( props ) => {
    const {
        className,
        attributes: {
            title,
            mediaURL,
            description,
            opensInNewWindow,
            addNofollow,
            addUgc,
            addSponsored,
            addNoreferrer,
            addNoopener,
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
            linkTitle
        },
    } = props;

    const linkStyles = setLinkStyles ( props );
    const titleStyles = setTitleStyles ( props );
    const subTitleStyles = setSubTitleStyles ( props );
    const descriptionStyles = setDescriptionStyles ( props );
    const buttonStyles = setButtonStyles ( props );
    const blockStyles = setBlockStyles ( props );

    let classes = classnames( className );
   if ( uniqueID && (typeof uniqueID !== 'undefined') ) {
       classes = classnames( classes, uniqueID )
   }

    return (
        <div
        className= { 'gx-block ' + blockStyle+ ' gx-image-box ' + classes }
        data-gx_initial_block_class = {defaultBlockStyle}
        style={blockStyles}>
            <Link value={readMoreLink}
                linkOptions={linkOptions}
                className="gx-image-box-link"
                style={linkStyles}
                title={linkTitle}
            >

            {
                mediaURL && (
                    <img className="gx-image-box-image" src={ mediaURL } alt={title +  __( ' Image', 'gutenberg-extra' )}/>
                )
            }

            <div class='gx-image-box-text'>

            <RichText.Content tagName={titleLevel} style={ titleStyles } className="gx-image-box-title" value={ title } font={titleFontFamily} />

            <RichText.Content tagName="p" style={ subTitleStyles } className="gx-image-box-subtitle" value={ additionalText } />

            <RichText.Content tagName="p" style={ descriptionStyles } className="gx-image-box-description" value={ description } />

            <RichText.Content
                className="gx-image-box-read-more-text gx-image-box-read-more-link"
                style={buttonStyles}
                tagName="span"
                value={ readMoreText }
            />
            </div>
            </Link>

        </div>
    );
}

export default save;