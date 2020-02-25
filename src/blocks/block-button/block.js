/**
 * External dependencies
 */
import classnames from 'classnames';
import { omit, pick } from 'lodash';
import { withState } from '@wordpress/compose';
import { RangeControl } from '@wordpress/components';
import { DimensionControl } from '@wordpress/components';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
	RichText,
	getColorClassName,
} = wp.blockEditor;

//  Import CSS.

import './style.scss';
import './editor.scss';

import edit from './edit';

const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const blockAttributes = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
	},
	title: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'title',
	},
	text: {
		type: 'array',
		source: 'children',
		selector: 'a',
	},
	backgroundColor: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	borderColor: {
		type: 'string',
	},
	borderHoverColor: {
		type: 'string',
	},
	borderWidth: {
		type: 'number',
	},
	borderRadius: {
		type: 'number',
	},
	backgroundHoverColor: {
		type: 'string',
	},
	textHoverColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},
	customBorderColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},
	animation: {
		type: 'string',
	},
	transition: {
		type: 'string',
	},
	linkTitle: {
		type: 'string',
	},
	extraClassName: {
		type: 'string',
	},
	extraStyles: {
		type: 'string',
	},
	extraHoverStyles: {
		type: 'string',
	},
	extraBeforeStyles: {
		type: 'string',
	},
	extraAfterStyles: {
		type: 'string',
	},
	extraHoverBeforeStyles: {
		type: 'string',
	},
	extraHoverAfterStyles: {
		type: 'string',
	},
	opensInNewWindow: {
		type: 'boolean',
		default: false,
	},
	addNofollow: {
		type: 'boolean',
		default: false,
	},
	addNoopener: {
		type: 'boolean',
		default: false,
	},
	addNoreferrer: {
		type: 'boolean',
		default: false,
	},
	addSponsored: {
		type: 'boolean',
		default: false,
	},
	addUgc: {
		type: 'boolean',
		default: false,
	},
	buttonShape: {
		type: 'string',
		default: 'gx-square',
	},
	buttonSize: {
		type: 'string',
		default: 'gx-normal',
	},
	fontSize: {
		type: 'number',
		default: 16,
	},
	lineHeight: {
		type: 'number',
	},
	letterSpacing: {
		type: 'number',
	},
	paddingSize: {
		type: 'string',
		default: '0',
	},
    maxWidth: {
        type: 'number',
    },
    buttonWidth: {
        type: 'number',
    },
    minWidth: {
        type: 'number',
    },
    maxHeight: {
        type: 'number',
    },
    buttonHeight: {
        type: 'number',
    },
    minHeight: {
        type: 'number',
    },
    paddingTop: {
        type: 'number',
    },
    paddingLeft: {
        type: 'number',
    },
    paddingRight: {
        type: 'number',
    },
    paddingBottom: {
        type: 'number',
    },
    marginTop: {
        type: 'number',
    },
    marginLeft: {
        type: 'number',
    },
    marginRight: {
        type: 'number',
    },
    marginBottom: {
        type: 'number',
    },
    textTransform: {
        type: 'string',
    },
    borderStyle: {
        type: 'string',
        default: 'none',
    }

};

export const name = 'gutenberg-den/block-button';

const settings = {

	title: __( 'GX Button' ),

	description: __( '' ),

	icon: <svg preserveAspectRatio="none" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"><defs><path id="GX_button1_STROKES" stroke="#00CCFF" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" fill="none" d="M 2.45 12.5 L 2.45 2.45 21.6 2.45 21.6 12.55 M 15.5 13.45 Q 15.25 13.45 15 13.55 14.9 13.2 14.6 12.95 14.3 12.75 13.95 12.75 13.65 12.75 13.35 12.9 13.25 12.6 12.95 12.4 12.65 12.25 12.3 12.25 12.1 12.25 11.9 12.3 L 11.9 10.95 Q 11.9 10.45 11.55 10.1 11.2 9.7 10.7 9.7 10.2 9.7 9.85 10.1 9.5 10.45 9.5 10.95 L 9.5 15.8 8.6 14.8 Q 8.4 14.6 8.2 14.5 8 14.4 7.75 14.4 7.5 14.4 7.25 14.5 7.05 14.6 6.9 14.75 6.55 15.05 6.55 15.5 6.5 15.9 6.8 16.4 7.15 16.95 7.55 17.6 7.75 17.95 8.2 18.7 8.85 19.7 9.1 20.05 9.3 20.4 9.85 21.5 9.9 21.65 9.95 21.65 10.1 21.75 10.2 21.75 L 15.4 21.75 Q 15.5 21.75 15.65 21.65 15.75 21.6 15.8 21.45 16.1 20.6 16.3 19.75 16.7 18.1 16.7 17.45 L 16.7 14.65 Q 16.7 14.15 16.35 13.8 16.05 13.45 15.5 13.45 Z M 2.45 12.95 L 6.6 12.85 M 17.95 13 L 21.6 12.95"/></defs><g transform="matrix( 1, 0, 0, 1, 0,0) "><use href="#GX_button1_STROKES"/></g></svg>,
	category: 'gutenberg-den-blocks',

	attributes: blockAttributes,

	supports: {
		align: true,
		alignWide: false,
		customClassName: false,
	},

	edit,

	save( { attributes } ) {

		const {
			url,
			text,
			title,
			backgroundColor,
			textColor,
			backgroundHoverColor,
			borderColor,
			borderHoverColor,
			textHoverColor,
			customBackgroundColor,
			customBorderColor,
			customTextColor,
			customfontSize,
			animation,
			transition,
			transitionType,
			extraClassName,
			linkTitle,
			extraStyles,
			extraHoverStyles,
			extraBeforeStyles,
			extraAfterStyles,
			extraHoverBeforeStyles,
			extraHoverAfterStyles,
			opensInNewWindow,
			addNofollow,
			addNoopener,
			addNoreferrer,
			addSponsored,
			addUgc,
			buttonShape,
			buttonSize,
			fontSize,
			lineHeight,
			letterSpacing,
			paddingSize,
			maxWidth,
			minWidth,
			buttonWidth,
			maxHeight,
			minHeight,
			paddingTop,
			paddingLeft,
			paddingRight,
			paddingBottom,
			marginTop,
			marginLeft,
			marginRight,
			marginBottom,
			buttonHeight,
			textTransform, 
			borderWidth,
			borderRadius,
			borderStyle,
		} = attributes;

		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );
		const borderClass = getColorClassName( 'border-color', borderColor );
		//const fontClass = getColorClassName( 'font-size', fontSize );
		const hoverClass = ( borderHoverColor ? borderHoverColor.replace( '#', '' ) + '-' : '' ) + ( backgroundHoverColor ? backgroundHoverColor.replace( '#', '' ) + '-' : '' ) + ( textHoverColor ? textHoverColor.replace( '#', '' ) : '' );
		const hoverStyles = ( borderHoverColor ? `border-color: #${borderHoverColor.replace( '#', '' )}!important;` : '' ) + ( backgroundHoverColor ? `background-color: #${backgroundHoverColor.replace( '#', '' )}!important;` : '' ) + ( textHoverColor ? `color: #${textHoverColor.replace( '#', '' )}!important;` : '' );
		const uniqueClass = extraStyles ? extraStyles.replace( /[^a-z0-9]/gi, '' ) : '';
		const uniqueHoverClass = extraHoverStyles ? extraHoverStyles.replace( /[^a-z0-9]/gi, '' ) : '';

		const buttonClasses = classnames( 'wp-block-button__link', animation, `hover-${hoverClass}`, {
			'has-text-color': textColor || customTextColor,
			[ textClass ]: textClass,
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClass ]: backgroundClass,
			'has-border': borderColor || customBorderColor,
			[ borderClass ]: borderClass,
		}, extraClassName, uniqueClass, uniqueHoverClass, buttonSize, buttonShape );

		const buttonStyles = {
			backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			color: textClass ? undefined : customTextColor,
			borderColor: borderClass ? undefined : customBorderColor,
			borderWidth: borderWidth + 'px',
			borderRadius: borderRadius + 'px',
			borderStyle: borderStyle,
			fontSize: fontSize + 'px',
			lineHeight: lineHeight + '%',
			letterSpacing: letterSpacing + 'px',
			width: buttonWidth + '%',
			maxWidth: maxWidth + 'px',
			minWidth: minWidth + 'px',
			height: buttonHeight + 'px',
			maxHeight: maxHeight + 'px',
			minHeight: minHeight + 'px',
			textTransform: textTransform,
			paddingTop: paddingTop + 'px',
			paddingLeft: paddingLeft + 'px',
			paddingRight: paddingRight + 'px',
			paddingBottom: paddingBottom + 'px',
			marginTop: marginTop + 'px',
			marginLeft: marginLeft + 'px',
			marginRight: marginRight + 'px',
			marginBottom: marginBottom + 'px',
		};

		if ( transition ) {
			buttonStyles.transition = `${transition}s ${transitionType ? transitionType : ''}`;
		}

		return (
			<div>
				{ hoverClass && <style dangerouslySetInnerHTML={{__html: `.hover-${hoverClass}:hover{${hoverStyles}}` }} /> }
				{ uniqueClass && <style dangerouslySetInnerHTML={{__html: `.${uniqueClass}{${extraStyles}}` }} /> }
				{ uniqueHoverClass && <style dangerouslySetInnerHTML={{__html: `.${uniqueHoverClass} .wp-block-button__link:hover{${extraHoverStyles}} 
					 .wp-block-button__link:after{${extraAfterStyles}}` }} /> }
				{ extraBeforeStyles && <style dangerouslySetInnerHTML={{__html: `.wp-block-button__link:before{${extraBeforeStyles}}` }} /> }
				{ extraAfterStyles && <style dangerouslySetInnerHTML={{__html: `.wp-block-button__link:after{${extraAfterStyles}}` }} /> }
				{ extraHoverBeforeStyles && <style dangerouslySetInnerHTML={{__html: `.wp-block-button__link:hover:before{${extraHoverBeforeStyles}}` }} /> }
				{ extraHoverAfterStyles && <style dangerouslySetInnerHTML={{__html: `.wp-block-button__link:hover:after{${extraHoverAfterStyles}}` }} /> }

				<RichText.Content
					tagName="a"
					className={ buttonClasses }
					href={ url }
					title={ title }
					style={ buttonStyles }
					value={ text }
					title={linkTitle}
					target={ opensInNewWindow ? '_blank' : '_self' }
					rel= { (addNofollow ? 'nofollow ' : '') + (addNoreferrer ? 'noreferrer ' : '')  + (addNoopener ? 'noopener ' : '') + (addSponsored ? 'sponsored ' : '') + (addUgc ? 'ugc' : '')}
				/>
			</div>
		);
	},
};

registerBlockType( name, settings );
