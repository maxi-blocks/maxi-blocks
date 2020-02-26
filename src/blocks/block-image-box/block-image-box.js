/**
 * BLOCK: gutenberg-den/block-image-box
 *
 * Registering an image block with Gutenberg.
 * Shows an image and a description. A test block.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import { withState } from '@wordpress/compose';
import DimensionsControl from '../../components/dimensions-control/';
import { useSelect } from '@wordpress/data';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks


const {RichText,MediaUpload,InspectorControls, URLInput} = wp.editor;
const {PanelBody, PanelRow, Button, TextControl, ToggleControl, RadioControl, RangeControl, SelectControl, TextareaControl, ColourPicker, ColourIndicator, GradientPicker, BaseControl, Text, Popover } = wp.components;
const {PanelColorSettings, PanelColorGradientSettings} = wp.blockEditor;

// Declaring placeholder variables because attributes are not async when setting them
let textDecorationTitleValue;
let textDecorationTabletValue;
let textDecorationMobileValue;
let textDecorationDesktopValue;
let fontSizeTitleValue;
let fontSizeTitleTabletValue;
let fontSizeTitleMobileValue;
let fontSizeTitleDesktopValue;
let lineHeightDesktopValue;
let lineHeightTitleValue;
let lineHeightTabletValue;
let lineHeightMobileValue;
let letterSpacingTitleValue;
let letterSpacingDesktopValue;
let letterSpacingTabletValue;
let letterSpacingMobileValue;
let fontWeightTitleValue;
let fontWeightTabletValue;
let fontWeightMobileValue;
let fontWeightDesktopValue;
let textTransformTitleValue;
let textTransformDesktopValue;
let textTransformTabletValue;
let textTransformMobileValue;
let fontStyleTitleValue;
let fontStyleDesktopValue;
let fontStyleTabletValue;
let fontStyleMobileValue;

const Divider = () => (
    <hr style={{marginBottom: '15px',}} />
);

registerBlockType( 'gutenberg-extra/block-image-box', {
	title: ( 'GX Image Box'), // Block title.
	icon: <svg preserveAspectRatio="none" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"><defs><path id="Layer2_0_1_STROKES" stroke="#00CCFF" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" fill="none" d="M 21.6 20.85 L 21.6 21.6 2.45 21.6 2.45 21.5 2.45 2.45 21.6 2.45 21.6 20.85 14.7 14.25 10.5 17.25 8.25 9.05 2.45 21.5 M 18 8.4 Q 18 9.4 17.25 10.15 16.55 10.9 15.5 10.9 14.55 10.9 13.8 10.15 13 9.4 13 8.4 13 7.4 13.8 6.65 14.55 5.95 15.5 5.95 16.55 5.95 17.25 6.65 18 7.4 18 8.4 Z"/></defs><g transform="matrix( 1, 0, 0, 1, 0,0) "><use href="#Layer2_0_1_STROKES"/></g></svg>,
	category: 'gutenberg-extra-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	supports: {
        align: true,
    },
	attributes: {
		title: {
			type: 'array',
			source: 'children',
			selector: '.gx-image-box-title',
		},
		className: {
			type: 'string',
			default: '',
		},
		mediaID: {
			type: 'number',
		},
		mediaURL: {
			type: 'string',
			source: 'attribute',
			selector: '.gx-image-box-image',
			attribute: 'src',
		},
		description: {
			type: 'array',
			source: 'children',
			selector: '.gx-image-box-description',
		},
		additionalText: {
			type: 'array',
			source: 'children',
			selector: '.gx-image-box-subtitle',
		},
		line: {
			type: 'bool',
			selector: '.gx-image-box-line',
		},
		counter: {
			type: 'bool',
			selector: '.gx-image-box-counter',
		},
		readMoreText: {
			type: 'array',
			source: 'children',
			selector: '.gx-image-box-read-more-text',
		},
		readMoreLink: {
			type: 'string',
			source: 'attribute',
			selector: 'a.gx-image-box-link',
			attribute: 'href',
		},
		counter: {
			type: 'bool',
			source: 'children',
			selector: '.gx-image-box-counter',
		},
		borderColor: {
			type: 'string',
			default: "",
		},
		borderHoverColor: {
			type: 'string',
			default: "",
		},
		titleColor: {
			type: 'string',
			default: "",
		},
		backgroundColor: {
			type: 'string',
			default: "",
		},
		backgroundGradient: {
			type: 'string',
			default: "",
		},
		subTitleColor: {
			type: 'string',
			default: "",
		},
		descriptionColor: {
			type: 'string',
			default: "",
		},
		borderType: {
			type: 'string',
			default: 'none',
		},
		hoverAnimation: {
			type: 'string',
			default: 'none',
		},
		hoverAnimationDuration: {
			type: 'string',
			default: 'normal',
		},
		buttonColor: {
			type: 'string',
			default: "",
		},
		buttonBgColor: {
			type: 'string',
			default: "",
		},
		borderWidth: {
			type: 'number',
			default: 0,
		},
		borderRadius: {
			type: 'number',
			default: 0,
		},
		linkTitle: {
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
		titlePopUpisVisible: {
			type: 'boolean',
			default: false,
		},
    blockWidth: {
      type: 'number',
    },
    minWidth: {
      type: 'number',
    },
    maxWidth: {
      type: 'number',
    },
    maxWidthUnit: {
      type: 'string',
      default: 'px',
    },
    maxHeight: {
      type: 'number',
    },
    maxHeightUnit: {
      type: 'string',
      default: 'px',
    },
    deviceTypography: {
      type: 'string',
      default: 'desktop',
    },
    minWidthUnit: {
      type: 'string',
      default: 'px',
    },
    widthUnit: {
      type: 'string',
      default: '%',
    },
    heightUnit: {
      type: 'string',
      default: '%',
    },
    minHeightUnit: {
      type: 'string',
      default: 'px',
    },
    fontSizeTitleUnit: {
      type: 'string',
      default: 'px',
    },
    letterSpacingUnit:{
      type: 'string',
      default: 'px'
    },
    fontSizeTitle: {
      type: 'number',
    },
    lineHeightTitle:{
      type: 'number',
    },
    blockHeight: {
        type: 'number',
    },
    fontWeight:{
      type: 'number',
    },
    minHeight: {
      type: 'number',
    },
    extraClassName: {
		  type: 'string',
		},
    lineHeightUnit:{
      type: 'string',
      default: 'px'
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
		imagePosition: {
			type: 'string',
			default: 'top',
		},
		titleLevel: {
			type: 'string',
			default: 'h2'
		},
		blockStyle: {
			type: 'string',
			default: 'gx-global'
		},
		defaultBlockStyle: {
			type: 'string',
			default: 'gx-def-light'
		},
		titleFontFamily: {
			type: 'string',
			default: 'inherit'
		}
	},
	edit: ( props ) => {
		const {
			className,
			attributes: {
				title,
				mediaID,
				mediaURL,
				description,
				additionalText,
				readMoreText,
				readMoreLink,
				line,
				readMore,
				counter,
				borderColor,
				borderHoverColor,
				linkTitle,
				opensInNewWindow,
				addUgc,
        fontWeight,
        fontWeightTitle,
        fontWeightMobile,
        fontWeightTablet,
        fontWeightDesktop,
				addSponsored,
				addNoreferrer,
				addNofollow,
				addNoopener,
				fontSizeTitle,
        fontSizeTitleTablet,
        fontSizeTitleDesktop,
        fontSizeTitleMobile,
				lineHeight,
        lineHeightTitle,
        lineHeightDesktop,
        lineHeightTablet,
        lineHeightMobile,
				letterSpacing,
        letterSpacingTitle,
        letterSpacingDesktop,
        letterSpacingTablet,
        letterSpacingMobile,
				maxWidth,
				maxWidthUnit,
				minWidth,
				minWidthUnit,
				blockWidth,
				widthUnit,
				maxHeight,
				maxHeightUnit,
				heightUnit,
				minHeightUnit,
				minHeight,
				fontSizeTitleUnit,
        lineHeightUnit,
        letterSpacingUnit,
				blockHeight,
				textTransform,
        textTransformTitle,
        textTransformDesktop,
        textTransformMobile,
        textTransformTablet,
        textDecoration,
        textDecorationTitle,
        textDecorationDesktop,
        textDecorationTablet,
        textDecorationMobile,
        fontStyle,
        fontStyleTitle,
        fontStyleDesktop,
        fontStyleMobile,
        fontStyleTablet,
				borderWidth,
				borderRadius,
				borderType,
				hoverAnimation,
				hoverAnimationDuration,
				paddingSetting,
				setBorderColor,
				imagePosition,
				titleColor,
				subTitleColor,
				descriptionColor,
				buttonColor,
				buttonBgColor,
				titleLevel,
				backgroundColor,
				backgroundGradient,
				blockStyle,
				defaultBlockStyle,
				deviceTypography
			},
			setAttributes,
		} = props;

		const {
			attributes,
		} = props;

		const {
			paddingBottom,
			paddingLeft,
			paddingRight,
			paddingSize,
			paddingTop,
			paddingBottomTablet,
			paddingLeftTablet,
			paddingRightTablet,
			paddingTopTablet,
			paddingBottomMobile,
			paddingLeftMobile,
			paddingRightMobile,
			paddingTopMobile,
			paddingSyncUnits,
			paddingSyncUnitsTablet,
			paddingSyncUnitsMobile,
			paddingUnit,
			marginBottom,
			marginLeft,
			marginRight,
			marginSize,
			marginTop,
			marginBottomTablet,
			marginLeftTablet,
			marginRightTablet,
			marginTopTablet,
			marginBottomMobile,
			marginLeftMobile,
			marginRightMobile,
			marginTopMobile,
			marginSyncUnits,
			marginSyncUnitsTablet,
			marginSyncUnitsMobile,
			marginUnit,
			borderRadiusBottomRight,
			borderRadiusBottomLeft,
			borderRadiusTopRight,
			borderRadiusSize,
			borderRadiusTopLeft,
			borderRadiusBottomRightTablet,
			borderRadiusBottomLeftTablet,
			borderRadiusTopRightTablet,
			borderRadiusTopLeftTablet,
			borderRadiusBottomRightMobile,
			borderRadiusBottomLeftMobile,
			borderRadiusTopRightMobile,
			borderRadiusTopLeftMobile,
			borderRadiusSyncUnits,
			borderRadiusSyncUnitsTablet,
			borderRadiusSyncUnitsMobile,
			borderRadiusUnit,
			borderWidthBottom,
			borderWidthLeft,
			borderWidthRight,
			borderWidthSize,
			borderWidthTop,
			borderWidthBottomTablet,
			borderWidthLeftTablet,
			borderWidthRightTablet,
			borderWidthTopTablet,
			borderWidthBottomMobile,
			borderWidthLeftMobile,
			borderWidthRightMobile,
			borderWidthTopMobile,
			borderWidthSyncUnits,
			borderWidthSyncUnitsTablet,
			borderWidthSyncUnitsMobile,
			borderWidthUnit,
			extraStyles,
			extraClassName,
			extraHoverStyles,
			extraBeforeStyles,
			extraAfterStyles,
			extraHoverBeforeStyles,
			extraHoverAfterStyles,
			titlePopUpisVisible,
			titleFontFamily

		} = attributes;

		function renderImagePosition(param) {
		  switch(param) {
		    case 'left':
		    	return 'left';
		    case 'right':
		    	return 'right';
		    case 'bottom':
		    	return 'none';
		    case 'top':
		    	return 'none';
		    default:
		    	return 'none';
		  }
		}

		function renderImagePosition(param) {
		  switch(param) {
		    case 'left':
		    	return 'row';
		    case 'right':
		    	return 'row-reverse';
		    case 'bottom':
		    	return 'column-reverse';
		    case 'top':
		    	return 'column';
		    default:
		    	return 'column';
		  }
		}

		const linkStyles = {
			flexDirection: renderImagePosition(imagePosition),
		}

		const titleStyles = {
			color: titleColor ? titleColor : undefined,
			fontSize: fontSizeTitleDesktop ? (fontSizeTitleDesktop + fontSizeTitleUnit) : undefined,
      lineHeight: lineHeightDesktop ? (lineHeightDesktop + lineHeightUnit) : undefined,
      letterSpacing: letterSpacingDesktop ? (letterSpacingDesktop + letterSpacingUnit) : undefined,
		}

		const subTitleStyles = {
			color: subTitleColor ? subTitleColor : undefined,
		}

		const descriptionStyles = {
			color: descriptionColor ? descriptionColor : undefined,
		}

		const buttonStyles = {
			color: buttonColor ? buttonColor : undefined,
			backgroundColor:  buttonBgColor ? buttonBgColor : undefined,
		}

		const blockStyles = {
			backgroundColor: backgroundColor ? backgroundColor : undefined,
			borderWidth: borderWidth ? borderWidth + 'px' : undefined,
			borderRadius: borderRadius ? borderRadius + 'px' : undefined,
			borderColor: borderColor ? borderColor : undefined,
			borderStyle: borderType ? borderType : undefined,
			lineHeight: lineHeight ? lineHeight + 'px' : undefined,
			letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined,
			width: blockWidth ? (blockWidth + widthUnit) : undefined,
			maxWidth: maxWidth ? (maxWidth + maxWidthUnit) : undefined,
			minWidth: minWidth ? (minWidth + minWidthUnit) : undefined,
			height: blockHeight ? (blockHeight + heightUnite) : undefined,
			maxHeight: maxHeight ? (maxHeight + maxHeightUnit) : undefined,
			minHeight: minHeight ? (minHeight + minHeightUnit) : undefined,
			textTransform: textTransformDesktop ? textTransformDesktop : undefined,
      textDecoration: textDecorationDesktop ? textDecorationDesktop : undefined,
      fontWeight: fontWeightDesktop ? fontWeightDesktop : undefined,
      fontStyle: fontStyleDesktop ? fontStyleDesktop : undefined,
			// paddingTop: paddingTop ? (paddingTop + paddingUnit) : undefined,
			// paddingRight: paddingRight ? (paddingRight + paddingUnit) : undefined,
			// paddingBottom: paddingBottom ? (paddingBottom + paddingUnit) : undefined,
			// paddingLeft: paddingLeft ? (paddingLeft + paddingUnit) : undefined,
			// marginTop: marginTop ? (marginTop + marginUnit) : undefined,
			// marginRight: marginRight ? (marginRight + marginUnit) : undefined,
			// marginBottom: marginBottom ? (marginBottom + marginUnit) : undefined,
			// marginLeft: marginLeft ? (marginLeft + marginUnit) : undefined,
			// borderTopLeftRadius: borderRadiusTopLeft ? (borderRadiusTopLeft + borderRadiusUnit) : undefined,
			// borderTopRightRadius: borderRadiusTopRight ? (borderRadiusTopRight + borderRadiusUnit) : undefined,
			// borderBottomRightRadius: borderRadiusBottomRight ? (borderRadiusBottomRight + borderRadiusUnit) : undefined,
			// borderBottomLeftRadius: borderRadiusBottomLeft ? (borderRadiusBottomLeft + borderRadiusUnit) : undefined,
		};

// General function to create responsive css
    const saveMeta = () => {
      const head = document.head || document.getElementsByTagName( 'head' )[ 0 ];
      while (head.firstChild) {
        head.removeChild(head.lastChild);
      }
      const style = document.createElement( 'style' );
      let responsiveCss = '';
      style.type = 'text/css';
      //add responsive styling
        responsiveCss += '@media only screen and (max-width: 768px) {';
        responsiveCss += '.gx-image-box-title{';
        if(typeof fontSizeTitleTabletValue !== 'undefined'){
        responsiveCss += 'font-size: ' + fontSizeTitleTabletValue + fontSizeTitleUnit + ' !important;';
        }
        if(typeof lineHeightTabletValue !== 'undefined'){
          responsiveCss += 'line-height: ' + lineHeightTabletValue + lineHeightUnit + ' !important;';
        }
        if(typeof letterSpacingTabletValue !== 'undefined'){
          responsiveCss += 'letter-spacing: ' + letterSpacingTabletValue + letterSpacingUnit + ' !important;';
        }
        if(typeof fontWeightTabletValue !== 'undefined'){
          responsiveCss += 'font-weight: ' + fontWeightTabletValue + ' !important;';
        }
        if(typeof textTransformTabletValue !== 'undefined'){
          responsiveCss += 'text-transform: ' + textTransformTabletValue + ' !important;';
        }
        if(typeof fontStyleTabletValue !== 'undefined'){
          responsiveCss += 'font-style: ' + fontStyleTabletValue + ' !important;';
        }
        if(typeof textDecorationTabletValue !== 'undefined'){
          responsiveCss += 'text-decoration: ' + textDecorationTabletValue + ' !important;';
        }
        responsiveCss += '}';
        responsiveCss += '}';

        responsiveCss += '@media only screen and (max-width: 514px) {';
        responsiveCss += '.gx-image-box-title{';
        if(typeof fontSizeTitleMobileValue !== 'undefined'){
        responsiveCss += 'font-size: ' + fontSizeTitleMobileValue + fontSizeTitleUnit + ' !important;';
        }
        if(typeof lineHeightMobileValue !== 'undefined'){
          responsiveCss += 'line-height: ' + lineHeightMobileValue + lineHeightUnit + ' !important;';
        }
        if(typeof letterSpacingMobileValue !== 'undefined'){
          responsiveCss += 'letter-spacing: ' + letterSpacingMobileValue + letterSpacingUnit + ' !important;';
        }
        if(typeof fontWeightMobileValue !== 'undefined'){
          responsiveCss += 'font-weight: ' + fontWeightMobileValue + ' !important;';
        }
        if(typeof textTransformMobileValue !== 'undefined'){
          responsiveCss += 'text-transform:  ' + textTransformMobileValue + ' !important;';
        }
        if(typeof fontStyleMobileValue !== 'undefined'){
          responsiveCss += 'font-style: ' + fontStyleMobileValue + ' !important;';
        }
        if(typeof textDecorationMobileValue !== 'undefined'){
          responsiveCss += 'text-decoration: ' + textDecorationMobileValue + ' !important;';
        }
        responsiveCss += '}';
        responsiveCss += '}';

      if ( style.styleSheet ) {
        style.innerHTML = responsiveCss;
      } else {
        style.appendChild( document.createTextNode( responsiveCss ) );
      }
      head.appendChild( style );
    };

// When font size is changed
    const onChangeFontSize = (value) => {
      setAttributes({fontSizeTitle: value });
      fontSizeTitleValue = value;
      if(deviceTypography == 'tablet'){
        setAttributes({fontSizeTitleTablet: value});
        fontSizeTitleTabletValue = value;
      }else if(deviceTypography == 'desktop'){
        setAttributes({fontSizeTitleDesktop: value});
        fontSizeTitleDesktopValue = value;
      }else if(deviceTypography == 'mobile'){
        setAttributes({fontSizeTitleMobile: value});
        fontSizeTitleMobileValue = value;
      }
      saveMeta();
    }

// When line height is changed
    const onChangeLineHeight = (value) => {
      setAttributes({ lineHeightTitle: value });
      lineHeightTitleValue = value;
      if(deviceTypography == 'tablet'){
        setAttributes({lineHeightTablet : value});
        lineHeightTabletValue = value;
      }else if(deviceTypography == 'desktop'){
        setAttributes({lineHeightDesktop : value});
        lineHeightDesktopValue = value;
      }else if(deviceTypography == 'mobile'){
        setAttributes({lineHeightMobile : value})
        lineHeightMobileValue = value;
      }
      saveMeta();
    }

// When letter spacing is changed
    const onChangeLetterSpacing = (value) => {
      setAttributes({ letterSpacingTitle: value });
      letterSpacingTitleValue = value;
      if(deviceTypography == 'tablet'){
        setAttributes({letterSpacingTablet : value});
        letterSpacingTabletValue = value;
      }else if(deviceTypography == 'desktop'){
        setAttributes({letterSpacingDesktop : value});
        letterSpacingDesktopValue = value;
      }else if(deviceTypography == 'mobile'){
        setAttributes({letterSpacingMobile : value})
        letterSpacingMobileValue = value;
      }
      saveMeta();
    }

  // When weight is changed
  const onChangeWeight = (value) => {
    setAttributes({ fontWeightTitle: value });
    fontWeightTitleValue = value;
    if(deviceTypography == 'tablet'){
      setAttributes({fontWeightTablet : value});
      fontWeightTabletValue = value;
    }else if(deviceTypography == 'desktop'){
      setAttributes({fontWeightDesktop : value});
      fontWeightDesktopValue = value;
    }else if(deviceTypography == 'mobile'){
      setAttributes({fontWeightMobile : value})
      fontWeightMobileValue = value;
    }
    saveMeta();
  }

// When text transform is changed
  const onChangeTextTransform = (value) => {
    setAttributes({ textTransformTitle: value });
    textTransformTitleValue = value;
    if(deviceTypography == 'tablet'){
      setAttributes({textTransformTablet : value});
      textTransformTabletValue = value;
    }else if(deviceTypography == 'desktop'){
      setAttributes({textTransformDesktop : value});
      textTransformDesktopValue = value;
    }else if(deviceTypography == 'mobile'){
      setAttributes({textTransformMobile : value})
      textTransformMobileValue = value;
    }
    saveMeta();
  }

// When text style is changed
  const onChangeFontStyle = (value) => {
    setAttributes({ fontStyle: value });
    fontStyleTitleValue = value;
    if(deviceTypography == 'tablet'){
      setAttributes({fontStyleTablet : value});
      fontStyleTabletValue = value;
    }else if(deviceTypography == 'desktop'){
      setAttributes({fontStyleDesktop : value});
      fontStyleDesktopValue = value;
    }else if(deviceTypography == 'mobile'){
      setAttributes({fontStyleMobile : value})
      fontStyleMobileValue = value;
    }
    saveMeta();
  }

// When Text Decoration is changed


  const onChangeTextDecoration = (value) => {
    setAttributes({ textDecorationTitle: value });
    textDecorationTitleValue = value;
    if(deviceTypography == 'tablet'){
      setAttributes({textDecorationTablet : value});
      textDecorationTabletValue = value;
    }else if(deviceTypography == 'desktop'){
      setAttributes({textDecorationDesktop : value});
      textDecorationDesktopValue = value;
    }else if(deviceTypography == 'mobile'){
      setAttributes({textDecorationMobile : value})
      textDecorationMobileValue = value;
    }
    saveMeta();
  }


// When device is changed
    const onChangeDevice = (value) => {
      setAttributes({ deviceTypography: value });
    }


		const onSelectImage = ( media ) => {
			setAttributes( {
				mediaURL: media.url,
				mediaID: media.id,
			} );
		};

		const gradients = "";
		const disableCustomGradients = false;


		return (
			<div
			className={ 'gx-block ' + blockStyle+ ' gx-image-box ' + className }
			data-gx_initial_block_class = {defaultBlockStyle}
			style={blockStyles}>
			<div className="gx-image-box-link" style={linkStyles}>
				<div className="gx-image-box-image">
					<MediaUpload
						onSelect={ onSelectImage }
						allowedTypes="image"
						value={ mediaID }
						render={ ( { open } ) => (
							<Button className={ mediaID ? 'image-button' : 'button button-large' } onClick={ open }>
								{ ! mediaID ? __( 'Upload Image', 'gutenberg-den' ) : <img src={ mediaURL } alt={ __( 'Upload Image', 'gutenberg-den' ) } /> }
							</Button>
						) }
					/>
				</div>
				<div class='gx-image-box-text'>
				<RichText
					tagName={titleLevel}
					style={ titleStyles}
					placeholder={ __( 'Write title…', 'gutenberg-den' ) }
					value={ title }
					onChange={ ( value ) => setAttributes({ title: value }) }
					className="gx-image-box-title"
				/>
				<RichText
					tagName="p"
					style={ subTitleStyles }
					placeholder={ __( 'Write sub-title…', 'gutenberg-den' ) }
					value={ additionalText }
					onChange={ ( value ) => setAttributes({ additionalText: value }) }
					className="gx-image-box-subtitle"
				/>
				<RichText
					tagName="p"
					style={descriptionStyles}
					multiline="br"
					placeholder={ __( 'Write some text…', 'gutenberg-den' ) }
					value={ description }
					onChange={ ( value ) => setAttributes({ description: value }) }
					className="gx-image-box-description"
				/>
				<RichText
					tagName="span"
					style={ buttonStyles}
					placeholder={ __( 'Read more text…', 'gutenberg-den' ) }
					value={ readMoreText }
					onChange={ ( value ) => setAttributes({ readMoreText: value }) }
					className="gx-image-box-read-more-text"
				/>
				<URLInput
					value={ readMoreLink}
					placeholder={ __( 'Read more link…', 'gutenberg-den' ) }
					onChange={ ( value ) => setAttributes( { readMoreLink: value } ) }
					className="gx-image-box-read-more-link"
				/>
				</div>
				</div>
			{/* Sidebar Settings */}
			<InspectorControls>
				<PanelBody className="gx-panel gx-image-setting gx-content-tab-setting" initialOpen={ true } title={ __( 'Image Settings' ) }>
					<SelectControl
					  	label="Block Style"
					    className="gx-block-style"
					    value={ blockStyle }
					    options={ [
					        	{ label: 'Global', value: 'gx-global' },
					            { label: 'Dark', value: 'gx-dark' },
					            { label: 'Light', value: 'gx-light' },
					    ] }
					    onChange={ ( value ) => props.setAttributes({ blockStyle : value }) }
					/>
					<SelectControl
					  	label="Default Block Style"
					    className="gx--default-block-style"
					    value={ defaultBlockStyle }
					    options={ [
					            { label: 'Dark', value: 'gx-def-dark' },
					            { label: 'Light', value: 'gx-def-light' },
					    ] }
					    onChange={ ( value ) => props.setAttributes({ defaultBlockStyle : value }) }
					/>
					<SelectControl
					  	label="Image Position"
					    className="gx-image-position"
					    value={ imagePosition }
					    options={ [
					        	{ label: 'Before', value: 'top' },
					            { label: 'After', value: 'bottom' },
					            { label: 'Left', value: 'left' },
					            { label: 'Right', value: 'right' },
					    ] }
					    onChange={ ( value ) => props.setAttributes({ imagePosition: value }) }
					/>
				</PanelBody>
				<PanelBody className="gx-panel gx-text-setting gx-content-tab-setting" initialOpen={ true } title={ __( 'Text settings' ) }>
				<SelectControl
					label="Title Level"
					className="gx-title-level"
					value={titleLevel }
					options={ [
					    { label: 'H1', value: 'h1' },
					    { label: 'H2', value: 'h2' },
					    { label: 'H3', value: 'h3' },
					    { label: 'H4', value: 'h4' },
					    { label: 'H5', value: 'h5' },
					    { label: 'H6', value: 'h6' },
					        ] }
					        onChange={ ( value ) => props.setAttributes({ titleLevel: value }) }
						/>
				</PanelBody>
				<PanelBody className="gx-panel gx-link-setting gx-content-tab-setting" initialOpen={ true } title={ __( 'Link Settings' ) }>
                    <TextControl
						label={ __( 'Link\'s Title' ) }
						value={ linkTitle || '' }
						onChange={ (e) => {
						setAttributes( {
							linkTitle: e,
							} );
						} }
						/>
                    <ToggleControl
						label={ __( 'Open in New Window' ) }
						id='gx-new-window'
						checked={ opensInNewWindow }
						onChange={ () => setAttributes( { opensInNewWindow: ! opensInNewWindow } ) }
						/>
					<ToggleControl
						label={ __( 'Add "nofollow" attribute' ) }
						checked={ addNofollow }
						onChange={ () => setAttributes( { addNofollow: ! addNofollow } ) }
						/>

					<ToggleControl
						label={ __( 'Add "noopener" attribute' ) }
						checked={ addNoopener }
						onChange={ () => setAttributes( { addNoopener : ! addNoopener  } ) }
						/>

					<ToggleControl
						label={ __( 'Add "noreferrer" attribute' ) }
						checked={ addNoreferrer  }
						onChange={ () => setAttributes( {addNoreferrer: ! addNoreferrer } ) }
						/>

					<ToggleControl
						label={ __( 'Add "sponsored" attribute' ) }
						checked={ addSponsored }
						onChange={ () => setAttributes( { addSponsored: ! addSponsored } ) }
						/>

					<ToggleControl
						label={ __( 'Add "ugc" attribute' ) }
						checked={ addUgc }
						onChange={ () => setAttributes( { addUgc: ! addUgc } ) }
						/>
				</PanelBody>
				<PanelBody className="gx-panel gx-color-setting gx-style-tab-setting" initialOpen={ true } title={ __( 'Colour settings' ) }>
					<BaseControl
					className={"gx-settings-button"}
					>
						<BaseControl.VisualLabel>Title Typography</BaseControl.VisualLabel>
						<Button
						isSecondary
						onClick={() => { setAttributes({  titlePopUpisVisible: ! titlePopUpisVisible }) }}
						>
						Typography</Button>
					</BaseControl>
					{ titlePopUpisVisible && (
					    <Popover
					    className="gx-popover"
					    onFocusOutside = {() => { setAttributes({  titlePopUpisVisible: ! titlePopUpisVisible }) }}
					    noArrow = {true}
					    >
					       <SelectControl
						        label="Family"
						        className="gx-title-typography-setting"
						        value={ titleFontFamily }
						        options={ [
						        	{ label: 'Default', value: 'inherit' },
						        	{ label: 'Placeholder', value: 'inherit' },
						        ] }
						        onChange={ ( value ) => props.setAttributes({ titleFontFamily: value }) }
							/>
							<RadioControl
								className={'gx-device-control'}
						        selected={deviceTypography }
						        options={ [
						            { label: '', value: 'desktop' },
						            { label: '', value: 'tablet' },
						            { label: '', value: 'mobile' },
						        ] }
						        onChange={ onChangeDevice }
						    />
							<RadioControl
								className={'gx-unit-control'}
						        selected={fontSizeTitleUnit }
						        options={ [
						            { label: 'PX', value: 'px' },
						            { label: 'EM', value: 'em' },
						            { label: 'VW', value: 'vw' },
						            { label: '%', value: '%' },
						        ] }
						        onChange={ ( value ) => props.setAttributes({ fontSizeTitleUnit: value }) }
						    />
						    <RangeControl
                label="Size"
                className={'gx-with-unit-control'}
                value={fontSizeTitle}
                onChange={ onChangeFontSize }
                id={'size-control'}
								min={ 0 }
								step={0.1}
								allowReset = {true}
                        	/>
              <RadioControl
  							className={'gx-unit-control'}
  					        selected={lineHeightUnit }
  					        options={ [
  					            { label: 'PX', value: 'px' },
  					            { label: 'EM', value: 'em' },
  					            { label: 'VW', value: 'vw' },
  					            { label: '%', value: '%' },
  					        ] }
  					        onChange={ ( value ) => props.setAttributes({ lineHeightUnit: value }) }
  					    />
                <RangeControl
                label="Line Height"
                className={'gx-with-unit-control'}
                value={lineHeightTitle}
                onChange={ onChangeLineHeight }
								min={ 0 }
								step={0.1}
								allowReset = {true}
                        	/>

                <RadioControl
    							className={'gx-unit-control'}
    					        selected={letterSpacingUnit }
    					        options={ [
    					            { label: 'PX', value: 'px' },
    					            { label: 'EM', value: 'em' },
    					            { label: 'VW', value: 'vw' },
    					            { label: '%', value: '%' },
    					        ] }
    					        onChange={ ( value ) => props.setAttributes({ letterSpacingUnit: value }) }
    					    />
                <RangeControl
                label="Letter Spacing"
                className={'gx-with-unit-control'}
                value={letterSpacingTitle}
                onChange={ onChangeLetterSpacing }
  							min={ 0 }
  							step={0.1}
  							allowReset = {true}
                        	/>
                <Divider/>
                <SelectControl
                   label="Weight"
                   className="gx-title-typography-setting"
                   value={ fontWeightTitle }
                   options={ [
                     { label: 'Thin (Hairline)', value: 100 },
                     { label: 'Extra Light (Ultra Light)', value: 200 },
                     { label: 'Light', value: 300 },
                     { label: 'Normal (Regular)', value: 400 },
                     { label: 'Medium', value: 500 },
                     { label: 'Semi Bold (Demi Bold)', value: 600 },
                     { label: 'Bold', value: 700 },
                     { label: 'Extra Bold (Ultra Bold)', value: 800 },
                     { label: 'Black (Heavy)', value: 900 },
                     { label: 'Extra Black (Ultra Black)', value: 950 },
                   ] }
                   onChange={ onChangeWeight }
                />
                <SelectControl
                   label="Transform"
                   className="gx-title-typography-setting"
                   value={ textTransform }
                   options={ [
                     { label: 'Default', value: 'none' },
                     { label: 'Capitilize', value: 'capitalize' },
                     { label: 'Uppercase', value: 'uppercase' },
                     { label: 'Lowercase', value: 'lowercase' },
                     { label: 'Full Width', value: 'full-width' },
                     { label: 'Full Size Kana', value: 'full-size-kana' },
                   ] }
                   onChange={ onChangeTextTransform }
                />
                <SelectControl
                   label="Style"
                   className="gx-title-typography-setting"
                   value={ fontStyle }
                   options={ [
                     { label: 'Default', value: 'normal' },
                     { label: 'Italic', value: 'italic' },
                     { label: 'Oblique', value: 'oblique' },
                     { label: 'Oblique (40 deg)', value: 'oblique 40deg' },
                   ] }
                   onChange={ onChangeFontStyle }
                />
                <SelectControl
                   label="Decoration"
                   className="gx-title-typography-setting"
                   value={ textDecorationTitle }
                   options={ [
                     { label: 'Default', value: 'none' },
                     { label: 'Overline', value: 'overline' },
                     { label: 'Line Through ', value: 'line-through' },
                     { label: 'Underline ', value: 'underline' },
                     { label: 'Underline Overline ', value: 'underline overline' },
                   ] }
                   onChange={ onChangeTextDecoration }
                />

					     </Popover>
					) }

					<PanelColorSettings
							title={ __( 'Background Colour Settings' ) }
							colorSettings={ [
								{
									value: backgroundColor,
									onChange: ( value ) => props.setAttributes({ backgroundColor: value }),
									label: __( 'Background Colour' ),
								},
							] }
					/>
					<PanelColorSettings
							title={ __( 'Title Colour Settings' ) }
							colorSettings={ [
								{
									value: titleColor,
									onChange: ( value ) => props.setAttributes({ titleColor: value }),
									label: __( 'Title Colour' ),
								},
							] }
					/>
					<PanelColorSettings
							title={ __( 'Sub-title Colour Settings' ) }
							colorSettings={ [
								{
									value: subTitleColor,
									onChange: ( value ) => props.setAttributes({ subTitleColor: value }),
									label: __( 'Sub-title Colour' ),
								},
							] }
					/>
					<PanelColorSettings
							title={ __( 'Description Colour Settings' ) }
							colorSettings={ [
								{
									value: descriptionColor,
									onChange: ( value ) => props.setAttributes({ descriptionColor: value }),
									label: __( 'Description  Colour' ),
								},
							] }
					/>
					<PanelColorSettings
							title={ __( 'Button Settings' ) }
							colorSettings={ [
								{
									value: buttonColor,
									onChange: ( value ) => props.setAttributes({ buttonColor: value }),
									label: __( 'Button Text Colour' ),
								},
							] }
					/>
					<PanelColorSettings
							title={ __( 'Button Settings' ) }
							colorSettings={ [
								{
									value: buttonBgColor,
									onChange: ( value ) => props.setAttributes({ buttonBgColor: value }),
									label: __( 'Button Background Colour' ),
								},
							] }
					/>
	            </PanelBody>
				<PanelBody className="gx-panel gx-border-setting gx-style-tab-setting" initialOpen={ true } title={ __( 'Border settings' ) }>
					<PanelColorSettings
							title={ __( 'Color Settings' ) }
							colorSettings={ [
								{
									value: borderColor,
									onChange: ( value ) => props.setAttributes({ borderColor: value }),
									label: __( 'Border Colour' ),
								},
							] }
						/>
						<SelectControl
					        label="Border Type"
					        className="gx-border-type"
					        value={ borderType }
					        options={ [
					        	{ label: 'None', value: 'none' },
					            { label: 'Dotted', value: 'dotted' },
					            { label: 'Dashed', value: 'dashed' },
					            { label: 'Solid', value: 'solid' },
					            { label: 'Double', value: 'double' },
					            { label: 'Groove', value: 'groove' },
					            { label: 'Ridge', value: 'ridge' },
					            { label: 'Inset', value: 'inset' },
					            { label: 'Outset', value: 'outset' },
					        ] }
					        onChange={ ( value ) => props.setAttributes({ borderType: value }) }
						/>
						<DimensionsControl { ...props }
							type={ 'borderRadius' }
							className={'gx-border-radius-control'}
							label={ __( 'Border Radius', 'gx' ) }
							valueTop={ borderRadiusTopLeft }
							valueRight={ borderRadiusTopRight }
							valueBottom={ borderRadiusBottomRight }
							valueLeft={ borderRadiusBottomLeft }
							valueTopTablet={ borderRadiusTopLeftTablet }
							valueRightTablet={ borderRadiusTopRightTablet }
							valueBottomTablet={ borderRadiusBottomRightTablet }
							valueLeftTablet={ borderRadiusBottomLeftTablet }
							valueTopMobile={ borderRadiusTopLeftMobile }
							valueRightMobile={ borderRadiusTopRightMobile }
							valueBottomMobile={ borderRadiusBottomRightMobile }
							valueLeftMobile={ borderRadiusBottomLeftMobile }
							unit={ borderRadiusUnit }
							syncUnits={ borderRadiusSyncUnits }
							syncUnitsTablet={ borderRadiusSyncUnitsTablet }
							syncUnitsMobile={ borderRadiusSyncUnitsMobile }
							dimensionSize={ borderRadiusSize }
						/>
						<DimensionsControl { ...props }
							type={ 'borderWidth' }
							className={'gx-border-width-control'}
							label={ __( 'Border Width', 'gx' ) }
							valueTop={ borderWidthTop }
							valueRight={ borderWidthRight }
							valueBottom={ borderWidthBottom }
							valueLeft={ borderWidthLeft }
							valueTopTablet={ borderWidthTopTablet }
							valueRightTablet={ borderWidthRightTablet }
							valueBottomTablet={ borderWidthBottomTablet }
							valueLeftTablet={ borderWidthLeftTablet }
							valueTopMobile={ borderWidthTopMobile }
							valueRightMobile={ borderWidthRightMobile }
							valueBottomMobile={ borderWidthBottomMobile }
							valueLeftMobile={ borderWidthLeftMobile }
							unit={ borderWidthUnit }
							syncUnits={ borderWidthSyncUnits }
							syncUnitsTablet={ borderWidthSyncUnitsTablet }
							syncUnitsMobile={ borderWidthSyncUnitsMobile }
							dimensionSize={ borderWidthSize }
						/>
	                    </PanelBody>
						<PanelBody className="gx-panel gx-size-setting gx-style-tab-setting" initialOpen={ true } title={ __( 'Size Settings' ) }>
							<RadioControl
								className={'gx-unit-control'}
						        selected={maxWidthUnit }
						        options={ [
						            { label: 'PX', value: 'px' },
						            { label: 'EM', value: 'em' },
						            { label: 'VW', value: 'vw' },
						            { label: '%', value: '%' },
						        ] }
						        onChange={ ( value ) => props.setAttributes({ maxWidthUnit: value }) }
						    />
						    <RangeControl
                            label="Max Width"
                            className={'gx-with-unit-control'}
                            value={maxWidth}
                            onChange={ ( value ) => props.setAttributes({ maxWidth: value }) }
							min={ 0 }
							allowReset = {true}
							initialPosition = { 0 }
                        	/>
                        	<RadioControl
								className={'gx-unit-control'}
						        selected={widthUnit }
						        options={ [
						            { label: 'PX', value: 'px' },
						            { label: 'EM', value: 'em' },
						            { label: 'VW', value: 'vw' },
						            { label: '%', value: '%' },
						        ] }
						        onChange={ ( value ) => props.setAttributes({ widthUnit: value }) }
						    />
                        	<RangeControl
                            label="Width"
                            className={'gx-with-unit-control'}
                            value={blockWidth}
                            onChange={ ( value ) => props.setAttributes({ blockWidth: value }) }
							min={ 0 }
                            allowReset = {true}
                        	/>
                        	<RadioControl
								className={'gx-unit-control'}
						        selected={minWidthUnit }
						        options={ [
						            { label: 'PX', value: 'px' },
						            { label: 'EM', value: 'em' },
						            { label: 'VW', value: 'vw' },
						            { label: '%', value: '%' },
						        ] }
						        onChange={ ( value ) => props.setAttributes({ minWidthUnit: value }) }
						    />
                        	<RangeControl
                            label="Min Width"
                            className={'gx-with-unit-control'}
                            value={minWidth}
                            onChange={ ( value ) => props.setAttributes({ minWidth: value }) }
							min={ 0 }
							allowReset = {true}
                        	/>
                        	<RadioControl
								className={'gx-unit-control'}
						        selected={maxHeightUnit }
						        options={ [
						            { label: 'PX', value: 'px' },
						            { label: 'EM', value: 'em' },
						            { label: 'VH', value: 'vh' },
						            { label: '%', value: '%' },
						        ] }
						        onChange={ ( value ) => props.setAttributes({ maxHeightUnit: value }) }
						    />
                        	<RangeControl
                            label="Max Height"
                            className={'gx-with-unit-control'}
                            value={maxHeight}
                            onChange={ ( value ) => props.setAttributes({ maxHeight: value }) }
							min={ 0 }
							allowReset = {true}
                        	/>
                        	<RadioControl
								className={'gx-unit-control'}
						        selected={heightUnit }
						        options={ [
						            { label: 'PX', value: 'px' },
						            { label: 'EM', value: 'em' },
						            { label: 'VH', value: 'vh' },
						            { label: '%', value: '%' },
						        ] }
						        onChange={ ( value ) => props.setAttributes({ heightUnit: value }) }
						    />
                        	<RangeControl
                            label="Height"
                            className={'gx-with-unit-control'}
                            value={blockHeight}
                            onChange={ ( value ) => props.setAttributes({ blockHeight: value }) }
                            allowReset = {true}
                        	/>
                        	<RadioControl
								className={'gx-unit-control'}
						        selected={minHeightUnit }
						        options={ [
						            { label: 'PX', value: 'px' },
						            { label: 'EM', value: 'em' },
						            { label: 'VH', value: 'vh' },
						            { label: '%', value: '%' },
						        ] }
						        onChange={ ( value ) => props.setAttributes({ minHeightUnit: value }) }
						    />
                        	<RangeControl
                            label="Min Height"
                            className={'gx-with-unit-control'}
                            value={minHeight}
                            onChange={ ( value ) => props.setAttributes({ minHeight: value }) }
							min={ 0 }
							allowReset = {true}
                        	/>
					</PanelBody>
					<PanelBody className="gx-panel gx-space-setting gx-style-tab-setting" initialOpen={ true } title={ __( 'Space Settings' ) }>
					<DimensionsControl { ...props }
							type={ 'padding' }
							label={ __( 'Padding', 'gx' ) }
							valueTop={ paddingTop }
							valueRight={ paddingRight }
							valueBottom={ paddingBottom }
							valueLeft={ paddingLeft }
							valueTopTablet={ paddingTopTablet }
							valueRightTablet={ paddingRightTablet }
							valueBottomTablet={ paddingBottomTablet }
							valueLeftTablet={ paddingLeftTablet }
							valueTopMobile={ paddingTopMobile }
							valueRightMobile={ paddingRightMobile }
							valueBottomMobile={ paddingBottomMobile }
							valueLeftMobile={ paddingLeftMobile }
							unit={ paddingUnit }
							syncUnits={ paddingSyncUnits }
							syncUnitsTablet={ paddingSyncUnitsTablet }
							syncUnitsMobile={ paddingSyncUnitsMobile }
							dimensionSize={ paddingSize }
						/>
					<DimensionsControl { ...props }
							type={ 'margin' }
							label={ __( 'Margin', 'gx' ) }
							valueTop={ marginTop }
							valueRight={ marginRight }
							valueBottom={ marginBottom }
							valueLeft={ marginLeft }
							valueTopTablet={ marginTopTablet }
							valueRightTablet={ marginRightTablet }
							valueBottomTablet={ marginBottomTablet }
							valueLeftTablet={ marginLeftTablet }
							valueTopMobile={ marginTopMobile }
							valueRightMobile={ marginRightMobile }
							valueBottomMobile={ marginBottomMobile }
							valueLeftMobile={ marginLeftMobile }
							unit={ marginUnit }
							syncUnits={ marginSyncUnits }
							syncUnitsTablet={ marginSyncUnitsTablet }
							syncUnitsMobile={ marginSyncUnitsMobile }
							dimensionSize={ marginSize }
						/>

					</PanelBody>
					<PanelBody initialOpen={ true } className="gx-panel gx-advanced-setting gx-advanced-tab-setting"  title={ __( 'Advanced Settings' ) }>
							<SelectControl
					        label="Hover Animation"
					        className="gx-hover-animation"
					        value={ hoverAnimation }
					        options={ [
					        	{ label: 'None', value: 'none' },
					            { label: 'Other', value: 'other' },
					        ] }
					        onChange={ ( value ) => props.setAttributes({ hoverAnimation: value }) }
							/>
							<SelectControl
					        label="Animation Duration"
					        className="gx-hover-animation-duration"
					        value={ hoverAnimationDuration }
					        options={ [
					        	{ label: 'Shorter', value: 'shorter' },
					        	{ label: 'Short', value: 'short' },
					        	{ label: 'Normal', value: 'normal' },
					        	{ label: 'Long', value: 'long' },
					        	{ label: 'Longer', value: 'longer' },

					        ] }
					        onChange={ ( value ) => props.setAttributes({ hoverAnimationDuration: value }) }
							/>
							<TextControl
								label={ __( 'Additional CSS Classes' ) }
								className="gx-additional-css"
								value={ extraClassName || '' }
								onChange={ (e) => {
									setAttributes( {
										extraClassName: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS Styles' ) }
								className="gx-additional-css"
								value={ extraStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraStyles: e,
									} );
								} }
							/>

							{/*<TextareaControl
								label={ __( 'Additional CSS Hover Styles' ) }
								value={ extraHoverStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraHoverStyles: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS Before Styles' ) }
								value={ extraBeforeStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraBeforeStyles: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS After Styles' ) }
								value={ extraAfterStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraAfterStyles: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS Hover Before Styles' ) }
								value={ extraHoverBeforeStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraHoverBeforeStyles: e,
									} );
								} }
							/>
							<TextareaControl
								label={ __( 'Additional CSS Hover After Styles' ) }
								value={ extraHoverAfterStyles || '' }
								onChange={ (e) => {
									setAttributes( {
										extraHoverAfterStyles: e,
									} );
								} }
							/>*/}
						</PanelBody>
			</InspectorControls>
			</div>
		);
	},
	save: ( props ) => {
		const {
			className,
			attributes: {
				title,
				mediaID,
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
				line,
				readMore,
				counter,
				lineHeight,
        lineHeightDesktop,
        lineHeightTablet,
        lineHeightMobile,
				letterSpacing,
        letterSpacingDesktop,
        letterSpacingMobile,
        letterSpacingTablet,
        letterSpacingTitle,
				maxWidth,
				maxWidthUnit,
				minWidth,
				minWidthUnit,
				blockWidth,
				widthUnit,
				maxHeight,
				maxHeightUnit,
				heightUnit,
				minHeightUnit,
				minHeight,
				fontSizeTitle,
				fontSizeTitleUnit,
        fontSizeTitleTablet,
        fontSizeTitleDesktop,
        fontSizeTitleMobile,
        lineHeightTitle,
				blockHeight,
				textTransform,
        textTransformTitle,
        textTransformDesktop,
        textTransformTablet,
        textTransformMobile,
        textDecoration,
        textDecorationTitle,
        textDecorationDesktop,
        textDecorationTablet,
        textDecorationMobile,
        fontWeight,
        fontWeightTitle,
        fontWeightDesktop,
        fontWeightMobile,
        fontWeightTablet,
        fontStyle,
        fontStyleTitle,
        fontStyleDesktop,
        fontStyleMobile,
        fontStyleTablet,
				borderWidth,
				borderRadius,
				borderType,
				hoverAnimation,
				hoverAnimationDuration,
				setBorderColor,
				borderColor,
				imagePosition,
				titleColor,
				subTitleColor,
				descriptionColor,
				buttonColor,
				buttonBgColor,
				titleLevel,
				backgroundColor,
				backgroundGradient,
				blockStyle,
				defaultBlockStyle,
				deviceTypography
			},
		} = props;

		const {
			attributes,
		} = props;

		const {
			paddingBottom,
			paddingLeft,
			paddingRight,
			paddingSize,
			paddingTop,
			paddingBottomTablet,
			paddingLeftTablet,
			paddingRightTablet,
			paddingTopTablet,
			paddingBottomMobile,
			paddingLeftMobile,
			paddingRightMobile,
			paddingTopMobile,
			paddingSyncUnits,
			paddingSyncUnitsTablet,
			paddingSyncUnitsMobile,
			paddingUnit,
			marginBottom,
			marginLeft,
			marginRight,
			marginSize,
			marginTop,
			marginBottomTablet,
			marginLeftTablet,
			marginRightTablet,
			marginTopTablet,
			marginBottomMobile,
			marginLeftMobile,
			marginRightMobile,
			marginTopMobile,
			marginSyncUnits,
			marginSyncUnitsTablet,
			marginSyncUnitsMobile,
			marginUnit,
			borderRadiusBottomRight,
			borderRadiusBottomLeft,
			borderRadiusTopRight,
			borderRadiusSize,
			borderRadiusTopLeft,
			borderRadiusBottomRightTablet,
			borderRadiusBottomLeftTablet,
			borderRadiusTopRightTablet,
			borderRadiusTopLeftTablet,
			borderRadiusBottomRightMobile,
			borderRadiusBottomLeftMobile,
			borderRadiusTopRightMobile,
			borderRadiusTopLeftMobile,
			borderRadiusSyncUnits,
			borderRadiusSyncUnitsTablet,
			borderRadiusSyncUnitsMobile,
			borderRadiusUnit,
			borderWidthBottom,
			borderWidthLeft,
			borderWidthRight,
			borderWidthSize,
			borderWidthTop,
			borderWidthBottomTablet,
			borderWidthLeftTablet,
			borderWidthRightTablet,
			borderWidthTopTablet,
			borderWidthBottomMobile,
			borderWidthLeftMobile,
			borderWidthRightMobile,
			borderWidthTopMobile,
			borderWidthSyncUnits,
			borderWidthSyncUnitsTablet,
			borderWidthSyncUnitsMobile,
			borderWidthUnit,
			extraStyles,
			extraClassName,
			extraHoverStyles,
			extraBeforeStyles,
			extraAfterStyles,
			extraHoverBeforeStyles,
			extraHoverAfterStyles,
			titlePopUpisVisible,
			titleFontFamily,
		} = attributes;

		function renderImagePosition(param) {
		  switch(param) {
		    case 'left':
		    	return 'row';
		    case 'right':
		    	return 'row-reverse';
		    case 'bottom':
		    	return 'column-reverse';
		    case 'top':
		    	return 'column';
		    default:
		    	return 'column';
		  }
		}

		const linkStyles = {
			flexDirection: renderImagePosition(imagePosition),
		}

		const titleStyles = {
			color: titleColor ? titleColor : undefined,
			fontSize: fontSizeTitleDesktop ? (fontSizeTitleDesktop + fontSizeTitleUnit) : undefined,
      lineHeight: lineHeightDesktop ? (lineHeightDesktop + lineHeightUnit) : undefined,
      letterSpacing: letterSpacingDesktop ? (letterSpacingDesktop + letterSpacingUnit) : undefined
		}

		const subTitleStyles = {
			color: subTitleColor ? subTitleColor : undefined,
		}

		const descriptionStyles = {
			color: descriptionColor ? descriptionColor : undefined,
		}

		const buttonStyles = {
			color: buttonColor ? buttonColor : undefined,
			backgroundColor:  buttonBgColor ? buttonBgColor : undefined,
		}


		const blockStyles = {
			backgroundColor: backgroundColor ? backgroundColor : undefined,
			borderWidth: borderWidth ? borderWidth + 'px' : undefined,
			borderRadius: borderRadius ? borderRadius + 'px' : undefined,
			borderColor: borderColor ? borderColor : undefined,
			borderStyle: borderType ? borderType : undefined,
			lineHeight: lineHeight ? lineHeight + 'px' : undefined,
			letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined,
			width: blockWidth ? (blockWidth + widthUnit) : undefined,
			maxWidth: maxWidth ? (maxWidth + maxWidthUnit) : undefined,
			minWidth: minWidth ? (minWidth + minWidthUnit) : undefined,
			height: blockHeight ? (blockHeight + heightUnite) : undefined,
			maxHeight: maxHeight ? (maxHeight + maxHeightUnit) : undefined,
			minHeight: minHeight ? (minHeight + minHeightUnit) : undefined,
			textTransform: textTransformDesktop ? textTransformDesktop : undefined,
      textDecoration: textDecorationDesktop ? textDecorationDesktop : undefined,
      fontWeight: fontWeight ? fontWeight: undefined,
      fontStyle: fontStyle ? fontStyle: undefined,
			// paddingTop: paddingTop ? (paddingTop + paddingUnit) : undefined,
			// paddingRight: paddingRight ? (paddingRight + paddingUnit) : undefined,
			// paddingBottom: paddingBottom ? (paddingBottom + paddingUnit) : undefined,
			// paddingLeft: paddingLeft ? (paddingLeft + paddingUnit) : undefined,
			// marginTop: marginTop ? (marginTop + marginUnit) : undefined,
			// marginRight: marginRight ? (marginRight + marginUnit) : undefined,
			// marginBottom: marginBottom ? (marginBottom + marginUnit) : undefined,
			// marginLeft: marginLeft ? (marginLeft + marginUnit) : undefined,
			// borderTopLeftRadius: borderRadiusTopLeft ? (borderRadiusTopLeft + borderRadiusUnit) : undefined,
			// borderTopRightRadius: borderRadiusTopRight ? (borderRadiusTopRight + borderRadiusUnit) : undefined,
			// borderBottomRightRadius: borderRadiusBottomRight ? (borderRadiusBottomRight + borderRadiusUnit) : undefined,
			// borderBottomLeftRadius: borderRadiusBottomLeft ? (borderRadiusBottomLeft + borderRadiusUnit) : undefined,
		};
		return (
			<div
			className= { 'gx-block ' + blockStyle+ ' gx-image-box ' + className }
			data-gx_initial_block_class = {defaultBlockStyle}
			style={blockStyles}>
				<a className="gx-image-box-link"
					style={linkStyles}
					href={ readMoreLink}
					title={ title }
					target={ opensInNewWindow ? '_blank' : '_self' }
					rel= { (addNofollow ? 'nofollow ' : '') + (addNoreferrer ? 'noreferrer ' : '')  + (addNoopener ? 'noopener ' : '') + (addSponsored ? 'sponsored ' : '') + (addUgc ? 'ugc' : '')}
				>

				{
					mediaURL && (
						<img className="gx-image-box-image" src={ mediaURL } alt={title +  __( ' Image', 'gutenberg-den' )}/>
					)
				}

				<div class='gx-image-box-text'>

				<RichText.Content tagName={titleLevel} style={ titleStyles } className="gx-image-box-title" value={ title } />

				<RichText.Content tagName="p" style={ subTitleStyles } className="gx-image-box-subtitle" value={ additionalText } />

				<RichText.Content tagName="p" style={ descriptionStyles } className="gx-image-box-description" value={ description } />

				<RichText.Content
					className="gx-image-box-read-more-text gx-image-box-read-more-link"
					style={buttonStyles}
					tagName="span"
					value={ readMoreText }
				/>
				</div>
				</a>

			</div>
		);
	},
} );
