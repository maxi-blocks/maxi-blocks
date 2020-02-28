/**
 * Styles and icons
 */

import fonts from '../../../customizer/dist/fonts.json';

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n; 
const {
	RichText,
	MediaUpload,
	InspectorControls,
	URLInput
} = wp.editor;
const {
	PanelBody, 
	PanelRow, 
	Button, 
	TextControl, 
	ToggleControl, 
	RadioControl, 
	RangeControl, 
	SelectControl, 
	TextareaControl,
} = wp.components;
const {
	PanelColorSettings, 
	PanelColorGradientSettings
} = wp.blockEditor;

/**
 * External dependencies
 */

import DimensionsControl from '../../components/dimensions-control/';
import { fontFamilyinit } from '../../includes/utils/utils';
import FontPopover from '../../components/font-popover/index';
import { 
    setLinkStyles,
    setTitleStyles,
    setSubTitleStyles,
    setDescriptionStyles,
    setButtonStyles,
    setBlockStyles,
} from './utils';

const edit = (props) => {
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
            blockBorderColor,
            borderHoverColor,
            linkTitle,
            opensInNewWindow,
            addUgc,
            addSponsored,
            addNoreferrer,
            addNofollow,
            addNoopener,
            fontSizeTitle,
            lineHeight,
            letterSpacing,
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
            blockHeight,
            textTransform,
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
        },
        setAttributes,
    } = props;

    const linkStyles = setLinkStyles ( props );
    const titleStyles = setTitleStyles ( props );
    const subTitleStyles = setSubTitleStyles ( props );
    const descriptionStyles = setDescriptionStyles ( props );
    const buttonStyles = setButtonStyles ( props );
    const blockStyles = setBlockStyles ( props );

    const onSelectImage = (media) => {
        setAttributes({
            mediaURL: media.url,
            mediaID: media.id,
        });
    };

    const gradients = "";
    const disableCustomGradients = false;

    // Init the saved fonts
    const blockFonts = [
        titleFontFamily
    ];
    fontFamilyinit(blockFonts, fonts);

    return [
        <InspectorControls>
            <PanelBody className="gx-panel gx-image-setting gx-content-tab-setting" initialOpen={true} title={__('Image Settings')}>
                <SelectControl
                    label="Block Style"
                    className="gx-block-style"
                    value={blockStyle}
                    options={[
                        { label: 'Global', value: 'gx-global' },
                        { label: 'Dark', value: 'gx-dark' },
                        { label: 'Light', value: 'gx-light' },
                    ]}
                    onChange={(value) => setAttributes({ blockStyle: value })}
                />
                <SelectControl
                    label="Default Block Style"
                    className="gx--default-block-style"
                    value={defaultBlockStyle}
                    options={[
                        { label: 'Dark', value: 'gx-def-dark' },
                        { label: 'Light', value: 'gx-def-light' },
                    ]}
                    onChange={(value) => setAttributes({ defaultBlockStyle: value })}
                />
                <SelectControl
                    label="Image Position"
                    className="gx-image-position"
                    value={imagePosition}
                    options={[
                        { label: 'Before', value: 'top' },
                        { label: 'After', value: 'bottom' },
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                    ]}
                    onChange={(value) => setAttributes({ imagePosition: value })}
                />
            </PanelBody>
            <PanelBody className="gx-panel gx-text-setting gx-content-tab-setting" initialOpen={true} title={__('Text settings')}>
                <SelectControl
                    label="Title Level"
                    className="gx-title-level"
                    value={titleLevel}
                    options={[
                        { label: 'H1', value: 'h1' },
                        { label: 'H2', value: 'h2' },
                        { label: 'H3', value: 'h3' },
                        { label: 'H4', value: 'h4' },
                        { label: 'H5', value: 'h5' },
                        { label: 'H6', value: 'h6' },
                    ]}
                    onChange={(value) => setAttributes({ titleLevel: value })}
                />
            </PanelBody>
            <PanelBody className="gx-panel gx-link-setting gx-content-tab-setting" initialOpen={true} title={__('Link Settings')}>
                <TextControl
                    label={__('Link\'s Title')}
                    value={linkTitle || ''}
                    onChange={(e) => {
                        setAttributes({
                            linkTitle: e,
                        });
                    }}
                />
                <ToggleControl
                    label={__('Open in New Window')}
                    id='gx-new-window'
                    checked={opensInNewWindow}
                    onChange={() => setAttributes({ opensInNewWindow: !opensInNewWindow })}
                />
                <ToggleControl
                    label={__('Add "nofollow" attribute')}
                    checked={addNofollow}
                    onChange={() => setAttributes({ addNofollow: !addNofollow })}
                />

                <ToggleControl
                    label={__('Add "noopener" attribute')}
                    checked={addNoopener}
                    onChange={() => setAttributes({ addNoopener: !addNoopener })}
                />

                <ToggleControl
                    label={__('Add "noreferrer" attribute')}
                    checked={addNoreferrer}
                    onChange={() => setAttributes({ addNoreferrer: !addNoreferrer })}
                />

                <ToggleControl
                    label={__('Add "sponsored" attribute')}
                    checked={addSponsored}
                    onChange={() => setAttributes({ addSponsored: !addSponsored })}
                />

                <ToggleControl
                    label={__('Add "ugc" attribute')}
                    checked={addUgc}
                    onChange={() => setAttributes({ addUgc: !addUgc })}
                />
            </PanelBody>
            <PanelBody className="gx-panel gx-color-setting gx-style-tab-setting" initialOpen={true} title={__('Colour settings')}>
                <FontPopover
                    title='Title Typography'
                    font={titleFontFamily}
                    onFontFamilyChange={value => { setAttributes({ titleFontFamily: value }); }}
                    fontSizeUnit={fontSizeTitleUnit}
                    onFontSizeUnitChange={value => setAttributes({ fontSizeTitleUnit: value })}
                    fontSize={fontSizeTitle}
                    onFontSizeChange={value => setAttributes({ fontSizeTitle: value })}
                />
                <PanelColorSettings
                    title={__('Background Colour Settings')}
                    colorSettings={[
                        {
                            value: backgroundColor,
                            onChange: (value) => setAttributes({ backgroundColor: value }),
                            label: __('Background Colour'),
                        },
                    ]}
                />
                <PanelColorSettings
                    title={__('Title Colour Settings')}
                    colorSettings={[
                        {
                            value: titleColor,
                            onChange: (value) => setAttributes({ titleColor: value }),
                            label: __('Title Colour'),
                        },
                    ]}
                />
                <PanelColorSettings
                    title={__('Sub-title Colour Settings')}
                    colorSettings={[
                        {
                            value: subTitleColor,
                            onChange: (value) => setAttributes({ subTitleColor: value }),
                            label: __('Sub-title Colour'),
                        },
                    ]}
                />
                <PanelColorSettings
                    title={__('Description Colour Settings')}
                    colorSettings={[
                        {
                            value: descriptionColor,
                            onChange: (value) => setAttributes({ descriptionColor: value }),
                            label: __('Description  Colour'),
                        },
                    ]}
                />
                <PanelColorSettings
                    title={__('Button Settings')}
                    colorSettings={[
                        {
                            value: buttonColor,
                            onChange: (value) => setAttributes({ buttonColor: value }),
                            label: __('Button Text Colour'),
                        },
                    ]}
                />
                <PanelColorSettings
                    title={__('Button Settings')}
                    colorSettings={[
                        {
                            value: buttonBgColor,
                            onChange: (value) => setAttributes({ buttonBgColor: value }),
                            label: __('Button Background Colour'),
                        },
                    ]}
                />
            </PanelBody>
            <PanelBody className="gx-panel gx-border-setting gx-style-tab-setting" initialOpen={true} title={__('Border settings')}>
                <PanelColorSettings
                    title={__('Color Settings')}
                    colorSettings={[
                        {
                            value: blockBorderColor,
                            onChange: (value) => setAttributes({ blockBorderColor: value }),
                            label: __('Border Colour'),
                        },
                    ]}
                />
                <SelectControl
                    label="Border Type"
                    className="gx-border-type"
                    value={borderType}
                    options={[
                        { label: 'None', value: 'none' },
                        { label: 'Dotted', value: 'dotted' },
                        { label: 'Dashed', value: 'dashed' },
                        { label: 'Solid', value: 'solid' },
                        { label: 'Double', value: 'double' },
                        { label: 'Groove', value: 'groove' },
                        { label: 'Ridge', value: 'ridge' },
                        { label: 'Inset', value: 'inset' },
                        { label: 'Outset', value: 'outset' },
                    ]}
                    onChange={(value) => setAttributes({ borderType: value })}
                />
                <DimensionsControl {...props}
                    type={'borderRadius'}
                    className={'gx-border-radius-control'}
                    label={__('Border Radius', 'gx')}
                    valueTop={borderRadiusTopLeft}
                    valueRight={borderRadiusTopRight}
                    valueBottom={borderRadiusBottomRight}
                    valueLeft={borderRadiusBottomLeft}
                    valueTopTablet={borderRadiusTopLeftTablet}
                    valueRightTablet={borderRadiusTopRightTablet}
                    valueBottomTablet={borderRadiusBottomRightTablet}
                    valueLeftTablet={borderRadiusBottomLeftTablet}
                    valueTopMobile={borderRadiusTopLeftMobile}
                    valueRightMobile={borderRadiusTopRightMobile}
                    valueBottomMobile={borderRadiusBottomRightMobile}
                    valueLeftMobile={borderRadiusBottomLeftMobile}
                    unit={borderRadiusUnit}
                    syncUnits={borderRadiusSyncUnits}
                    syncUnitsTablet={borderRadiusSyncUnitsTablet}
                    syncUnitsMobile={borderRadiusSyncUnitsMobile}
                    dimensionSize={borderRadiusSize}
                />
                <DimensionsControl {...props}
                    type={'borderWidth'}
                    className={'gx-border-width-control'}
                    label={__('Border Width', 'gx')}
                    valueTop={borderWidthTop}
                    valueRight={borderWidthRight}
                    valueBottom={borderWidthBottom}
                    valueLeft={borderWidthLeft}
                    valueTopTablet={borderWidthTopTablet}
                    valueRightTablet={borderWidthRightTablet}
                    valueBottomTablet={borderWidthBottomTablet}
                    valueLeftTablet={borderWidthLeftTablet}
                    valueTopMobile={borderWidthTopMobile}
                    valueRightMobile={borderWidthRightMobile}
                    valueBottomMobile={borderWidthBottomMobile}
                    valueLeftMobile={borderWidthLeftMobile}
                    unit={borderWidthUnit}
                    syncUnits={borderWidthSyncUnits}
                    syncUnitsTablet={borderWidthSyncUnitsTablet}
                    syncUnitsMobile={borderWidthSyncUnitsMobile}
                    dimensionSize={borderWidthSize}
                />
            </PanelBody>
            <PanelBody className="gx-panel gx-size-setting gx-style-tab-setting" initialOpen={true} title={__('Size Settings')}>
                <RadioControl
                    className={'gx-unit-control'}
                    selected={maxWidthUnit}
                    options={[
                        { label: 'PX', value: 'px' },
                        { label: 'EM', value: 'em' },
                        { label: 'VW', value: 'vw' },
                        { label: '%', value: '%' },
                    ]}
                    onChange={(value) => setAttributes({ maxWidthUnit: value })}
                />
                <RangeControl
                    label="Max Width"
                    className={'gx-with-unit-control'}
                    value={maxWidth}
                    onChange={(value) => setAttributes({ maxWidth: value })}
                    min={0}
                    allowReset={true}
                    initialPosition={0}
                />
                <RadioControl
                    className={'gx-unit-control'}
                    selected={widthUnit}
                    options={[
                        { label: 'PX', value: 'px' },
                        { label: 'EM', value: 'em' },
                        { label: 'VW', value: 'vw' },
                        { label: '%', value: '%' },
                    ]}
                    onChange={(value) => setAttributes({ widthUnit: value })}
                />
                <RangeControl
                    label="Width"
                    className={'gx-with-unit-control'}
                    value={blockWidth}
                    onChange={(value) => setAttributes({ blockWidth: value })}
                    min={0}
                    allowReset={true}
                />
                <RadioControl
                    className={'gx-unit-control'}
                    selected={minWidthUnit}
                    options={[
                        { label: 'PX', value: 'px' },
                        { label: 'EM', value: 'em' },
                        { label: 'VW', value: 'vw' },
                        { label: '%', value: '%' },
                    ]}
                    onChange={(value) => setAttributes({ minWidthUnit: value })}
                />
                <RangeControl
                    label="Min Width"
                    className={'gx-with-unit-control'}
                    value={minWidth}
                    onChange={(value) => setAttributes({ minWidth: value })}
                    min={0}
                    allowReset={true}
                />
                <RadioControl
                    className={'gx-unit-control'}
                    selected={maxHeightUnit}
                    options={[
                        { label: 'PX', value: 'px' },
                        { label: 'EM', value: 'em' },
                        { label: 'VH', value: 'vh' },
                        { label: '%', value: '%' },
                    ]}
                    onChange={(value) => setAttributes({ maxHeightUnit: value })}
                />
                <RangeControl
                    label="Max Height"
                    className={'gx-with-unit-control'}
                    value={maxHeight}
                    onChange={(value) => setAttributes({ maxHeight: value })}
                    min={0}
                    allowReset={true}
                />
                <RadioControl
                    className={'gx-unit-control'}
                    selected={heightUnit}
                    options={[
                        { label: 'PX', value: 'px' },
                        { label: 'EM', value: 'em' },
                        { label: 'VH', value: 'vh' },
                        { label: '%', value: '%' },
                    ]}
                    onChange={(value) => setAttributes({ heightUnit: value })}
                />
                <RangeControl
                    label="Height"
                    className={'gx-with-unit-control'}
                    value={blockHeight}
                    onChange={(value) => setAttributes({ blockHeight: value })}
                    allowReset={true}
                />
                <RadioControl
                    className={'gx-unit-control'}
                    selected={minHeightUnit}
                    options={[
                        { label: 'PX', value: 'px' },
                        { label: 'EM', value: 'em' },
                        { label: 'VH', value: 'vh' },
                        { label: '%', value: '%' },
                    ]}
                    onChange={(value) => setAttributes({ minHeightUnit: value })}
                />
                <RangeControl
                    label="Min Height"
                    className={'gx-with-unit-control'}
                    value={minHeight}
                    onChange={(value) => setAttributes({ minHeight: value })}
                    min={0}
                    allowReset={true}
                />
            </PanelBody>
            <PanelBody className="gx-panel gx-space-setting gx-style-tab-setting" initialOpen={true} title={__('Space Settings')}>
                <DimensionsControl {...props}
                    type={'padding'}
                    label={__('Padding', 'gx')}
                    valueTop={paddingTop}
                    valueRight={paddingRight}
                    valueBottom={paddingBottom}
                    valueLeft={paddingLeft}
                    valueTopTablet={paddingTopTablet}
                    valueRightTablet={paddingRightTablet}
                    valueBottomTablet={paddingBottomTablet}
                    valueLeftTablet={paddingLeftTablet}
                    valueTopMobile={paddingTopMobile}
                    valueRightMobile={paddingRightMobile}
                    valueBottomMobile={paddingBottomMobile}
                    valueLeftMobile={paddingLeftMobile}
                    unit={paddingUnit}
                    syncUnits={paddingSyncUnits}
                    syncUnitsTablet={paddingSyncUnitsTablet}
                    syncUnitsMobile={paddingSyncUnitsMobile}
                    dimensionSize={paddingSize}
                />
                <DimensionsControl {...props}
                    type={'margin'}
                    label={__('Margin', 'gx')}
                    valueTop={marginTop}
                    valueRight={marginRight}
                    valueBottom={marginBottom}
                    valueLeft={marginLeft}
                    valueTopTablet={marginTopTablet}
                    valueRightTablet={marginRightTablet}
                    valueBottomTablet={marginBottomTablet}
                    valueLeftTablet={marginLeftTablet}
                    valueTopMobile={marginTopMobile}
                    valueRightMobile={marginRightMobile}
                    valueBottomMobile={marginBottomMobile}
                    valueLeftMobile={marginLeftMobile}
                    unit={marginUnit}
                    syncUnits={marginSyncUnits}
                    syncUnitsTablet={marginSyncUnitsTablet}
                    syncUnitsMobile={marginSyncUnitsMobile}
                    dimensionSize={marginSize}
                />

            </PanelBody>
            <PanelBody initialOpen={true} className="gx-panel gx-advanced-setting gx-advanced-tab-setting" title={__('Advanced Settings')}>
                <SelectControl
                    label="Hover Animation"
                    className="gx-hover-animation"
                    value={hoverAnimation}
                    options={[
                        { label: 'None', value: 'none' },
                        { label: 'Other', value: 'other' },
                    ]}
                    onChange={(value) => setAttributes({ hoverAnimation: value })}
                />
                <SelectControl
                    label="Animation Duration"
                    className="gx-hover-animation-duration"
                    value={hoverAnimationDuration}
                    options={[
                        { label: 'Shorter', value: 'shorter' },
                        { label: 'Short', value: 'short' },
                        { label: 'Normal', value: 'normal' },
                        { label: 'Long', value: 'long' },
                        { label: 'Longer', value: 'longer' },

                    ]}
                    onChange={(value) => setAttributes({ hoverAnimationDuration: value })}
                />
                <TextControl
                    label={__('Additional CSS Classes')}
                    className="gx-additional-css"
                    value={extraClassName || ''}
                    onChange={(e) => {
                        setAttributes({
                            extraClassName: e,
                        });
                    }}
                />
                <TextareaControl
                    label={__('Additional CSS Styles')}
                    className="gx-additional-css"
                    value={extraStyles || ''}
                    onChange={(e) => {
                        setAttributes({
                            extraStyles: e,
                        });
                    }}
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
        </InspectorControls>,
        <div
            className={'gx-block ' + blockStyle + ' gx-image-box ' + className}
            data-gx_initial_block_class={defaultBlockStyle}
            style={blockStyles}
        >
            <div className="gx-image-box-link" style={linkStyles}>
                <div className="gx-image-box-image">
                    <MediaUpload
                        onSelect={onSelectImage}
                        allowedTypes="image"
                        value={mediaID}
                        render={({ open }) => (
                            <Button className={mediaID ? 'image-button' : 'button button-large'} onClick={open}>
                                {!mediaID ? __('Upload Image', 'gutenberg-extra') : <img src={mediaURL} alt={__('Upload Image', 'gutenberg-extra')} />}
                            </Button>
                        )}
                    />
                </div>
                <div class='gx-image-box-text'>
                    <RichText
                        tagName={titleLevel}
                        style={titleStyles}
                        placeholder={__('Write title…', 'gutenberg-extra')}
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        className="gx-image-box-title"
                    />
                    <RichText
                        tagName="p"
                        style={subTitleStyles}
                        placeholder={__('Write sub-title…', 'gutenberg-extra')}
                        value={additionalText}
                        onChange={(value) => setAttributes({ additionalText: value })}
                        className="gx-image-box-subtitle"
                    />
                    <RichText
                        tagName="p"
                        style={descriptionStyles}
                        multiline="br"
                        placeholder={__('Write some text…', 'gutenberg-extra')}
                        value={description}
                        onChange={(value) => setAttributes({ description: value })}
                        className="gx-image-box-description"
                    />
                    <RichText
                        tagName="span"
                        style={buttonStyles}
                        placeholder={__('Read more text…', 'gutenberg-extra')}
                        value={readMoreText}
                        onChange={(value) => setAttributes({ readMoreText: value })}
                        className="gx-image-box-read-more-text"
                    />
                    <URLInput
                        value={readMoreLink}
                        placeholder={__('Read more link…', 'gutenberg-extra')}
                        onChange={(value) => setAttributes({ readMoreLink: value })}
                        className="gx-image-box-read-more-link"
                    />
                </div>
            </div>
        </div>
    ];
}

export default edit;