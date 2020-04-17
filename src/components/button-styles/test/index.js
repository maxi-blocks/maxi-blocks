/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    RadioControl,
    Button
} = wp.components;
const { dispatch } = wp.data;

/**
 * Internal dependencies
 */
import GXComponent from '../../../extensions/gx-component';
import AlignmentControl from '../../alignment-control/';
import SizeControlTest from '../../size-control/test/';
import ColorControl from '../../color-control/';
import { PopoverControl } from '../../popover/';
import { BoxShadow } from '../../box-shadow/index';
import Typography from '../../typography/';
import { BlockBorder } from '../../block-border/';
import DimensionsControl from '../../dimensions-control/index';
import LinkedButton from '../../linked-button';

/**
 * External dependencies
 */
import {
    isEmpty,
    isNil,
} from 'lodash';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

/**
 * Styles
 */
import '../editor.scss';

/**
 * Attributes
 */
export const buttonStyleAttributes = {
    buttonStyles: {
        type: 'string',
        default: '{"label":"Button Styles","buttonText":"","linkOptions":{},"alignment":"","size":{"label":"Size","general":{"max-widthUnit":"px","max-width":"","widthUnit":"px","width":"","min-widthUnit":"px","min-width":"","max-heightUnit":"px","max-height":"","heightUnit":"px","height":"","min-heightUnit":"px","min-height":""}},"normal":{"color":"","backgroundColor":"","boxShadow":{"label":"Box Shadow","shadowColor":"","shadowHorizontal":"0","shadowVertical":"0","shadowBlur":"0","shadowSpread":"0"},"typography":{"label":"Typography","font":"Roboto","options":{"100":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf","300":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf","400":"http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf","500":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf","700":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf","900":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf","100italic":"http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf","300italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf","italic":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf","500italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf","700italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf","900italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"},"general":{"color":"#9b9b9b"},"desktop":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":26,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}},"borderSettings":{"borderColor":"","borderType":"solid","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}},"padding":{"label":"Padding","unit":"px","desktop":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"tablet":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"mobile":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true}},"margin":{"label":"Margin","min":"none","unit":"px","desktop":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"tablet":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"mobile":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true}},"opacity":""},"hover":{"color":"","backgroundColor":"","boxShadow":{"label":"Box Shadow","shadowColor":"","shadowHorizontal":"0","shadowVertical":"0","shadowBlur":"0","shadowSpread":"0"},"typography":{"label":"Typography","font":"Roboto","options":{"100":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf","300":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf","400":"http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf","500":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf","700":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf","900":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf","100italic":"http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf","300italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf","italic":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf","500italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf","700italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf","900italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"},"general":{"color":"#9b9b9b"},"desktop":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":26,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}},"borderSettings":{"borderColor":"","borderType":"solid","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}},"padding":{"label":"Padding","unit":"px","desktop":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"tablet":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"mobile":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true}},"margin":{"label":"Margin","min":"none","unit":"px","desktop":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"tablet":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"mobile":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true}},"opacity":""}}'
    }
}

/**
 * Block
 */
export class ButtonStylesTest extends GXComponent {

    target = this.props.target ? this.props.target : 'gx-buttoneditor-button';

    state = {
        selector1: 'normal',
        selector2: 'normal',
        selector3: 'normal',
    }

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    get getObject() {
        if (this.type === 'normal')
            return this.getNormalStylesObject;
        if (this.type === 'hover')
            return this.getHoverStylesObject;
    }


    get getNormalStylesObject() {
        const response = {
            label: this.object.label,
            general: {}
        }
        if (!isNil(this.object.alignment)) {
            switch (this.object.alignment) {
                case 'left':
                    response.general['margin-right'] = 'auto';
                    break;
                case 'center':
                case 'justify':
                    response.general['margin-right'] = 'auto';
                    response.general['margin-left'] = 'auto';
                    break;
                case 'right':
                    response.general['margin-left'] = 'auto';
                    break;
            }
        }
        if (!isEmpty(this.object.normal.color)) {
            response.general['color'] = this.object.normal.color;
        }
        if (!isEmpty(this.object.normal.backgroundColor)) {
            response.general['background-color'] = this.object.normal.backgroundColor;
        }
        if (!isEmpty(this.object.normal.borderSettings.borderColor)) {
            response.general['border-color'] = this.object.normal.borderSettings.borderColor;
        }
        if (!isEmpty(this.object.normal.borderSettings.borderType)) {
            response.general['border-style'] = this.object.normal.borderSettings.borderType;
        }
        return response;
    }

    get getHoverStylesObject(){
        const response = {
            label: this.object.label,
            general: {}
        }
        if (!isEmpty(this.object.hover.color)) {
            response.general['color'] = this.object.hover.color;
        }
        if (!isEmpty(this.object.hover.backgroundColor)) {
            response.general['background-color'] = this.object.hover.backgroundColor;
        }
        if (!isEmpty(this.object.hover.borderSettings.borderColor)) {
            response.general['border-color'] = this.object.hover.borderSettings.borderColor;
        }
        if (!isEmpty(this.object.hover.borderSettings.borderType)) {
            response.general['border-style'] = this.object.hover.borderSettings.borderType;
        }
        return response;
    }

    /**
    * Saves and send the data. Also refresh the styles on Editor
    */
    saveAndSend(value) {
        this.save(value);

        this.target = this.props.target ? this.props.target : 'gx-buttoneditor-button';
        this.saveMeta(value, 'normal');

        this.target = `${this.target}:hover`;
        this.saveMeta(value, 'hover');

        new BackEndResponsiveStyles(this.getMeta);
    }

    save(value) {
        this.props.onChange(JSON.stringify(value));
    }

    saveMeta(value, type) {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(value, type),
            },
        });
    }

    render() {
        const {
            className = 'gx-buttonstyles-control',
            buttonSettings,
            target = 'gx-buttoneditor-button'
        } = this.props;

        const {
            selector1,
            selector2,
            selector3
        } = this.state;

        const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);

        return (
            <div className={className}>
                <Accordion
                    className={'gx-style-tab-setting gx-accordion'}
                    allowMultipleExpanded={true}
                    allowZeroExpanded={true}
                >
                    <AccordionItem>
                        <AccordionItemHeading
                            className={'gx-accordion-tab gx-typography-tab'}
                        >
                            <AccordionItemButton
                                className='components-base-control__label'
                            >
                                {__('Typography & Colors', 'gutenberg-extra')}
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <RadioControl
                                className="gx-buttonstyles-selector-control"
                                selected={selector1}
                                options={[
                                    { label: 'Normal', value: 'normal' },
                                    { label: 'Hover', value: 'hover' },
                                ]}
                                onChange={selector1 => {
                                    this.setState({ selector1 });
                                }}
                            />
                            <Typography
                                fontOptions={value[selector1].typography}
                                onChange={val => {
                                    value[selector1].typography = val;
                                    this.saveAndSend(value);
                                }}
                                target={target}
                            />
                            <ColorControl
                                label={__('Background Colour', 'gutenberg-extra')}
                                color={value[selector1].backgroundColor}
                                onColorChange={val => {
                                    value[selector1].backgroundColor = val;
                                    this.saveAndSend(value);
                                }}
                                disableGradient
                            />
                        </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemHeading
                            className={'gx-accordion-tab gx-typography-tab'}
                        >
                            <AccordionItemButton
                                className='components-base-control__label'
                            >
                                {__('Box Settings', 'gutenberg-extra')}
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <AlignmentControl
                                value={value.alignment}
                                onChange={val => {
                                    value.alignment = val;
                                    this.saveAndSend(value)
                                }}
                                disableJustify
                            />
                            <RadioControl
                                className="gx-buttonstyles-selector-control"
                                selected={selector2}
                                options={[
                                    { label: 'Normal', value: 'normal' },
                                    { label: 'Hover', value: 'hover' },
                                ]}
                                onChange={selector2 => {
                                    this.setState({ selector2 });
                                }}
                            />
                            <PopoverControl
                                label={__('Box shadow', 'gutenberg-extra')}
                                popovers={[
                                    {
                                        content: (
                                            <BoxShadow
                                                boxShadowOptions={value[selector2].boxShadow}
                                                onChange={val => {
                                                    value[selector2].boxShadow = JSON.parse(val);
                                                    this.saveAndSend(value)
                                                }}
                                                target={
                                                    selector2 != 'hover' ?
                                                        `${target}` :
                                                        `${target}:hover`
                                                }
                                            />
                                        )
                                    }
                                ]}
                            />
                            <BlockBorder
                                borderColor={value[selector2].borderSettings.borderColor}
                                onChangeBorderColor={val => {
                                    value[selector2].borderSettings.borderColor = val;
                                    this.saveAndSend(value);
                                }}
                                borderType={value[selector2].borderSettings.borderType}
                                onChangeBorderType={val => {
                                    value[selector2].borderSettings.borderType = val;
                                    this.saveAndSend(value);
                                }}
                                borderRadius={value[selector2].borderSettings.borderRadius}
                                onChangeBorderRadius={val => {
                                    value[selector2].borderSettings.borderRadius = val;
                                    this.saveAndSend(value);
                                }}
                                borderWidth={value[selector2].borderSettings.borderWidth}
                                onChangeBorderWidth={val => {
                                    value[selector2].borderSettings.borderWidth = val;
                                    this.saveAndSend(value);
                                }}
                                borderRadiusTarget={target}
                                borderWidthTarget={target}
                            />
                        </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemHeading
                            className={'gx-accordion-tab gx-typography-tab'}
                        >
                            <AccordionItemButton
                                className='components-base-control__label'
                            >
                                {__('Width and Height', 'gutenberg-extra')}
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <SizeControlTest
                                sizeSettings={value.size}
                                onChange={val => {
                                    value.size = val;
                                    this.saveAndSend(value);
                                }}
                                target={target}
                            />
                        </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemHeading
                            className={'gx-accordion-tab gx-typography-tab'}
                        >
                            <AccordionItemButton
                                className='components-base-control__label'
                            >
                                {__('Padding and Margin', 'gutenberg-extra')}
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <RadioControl
                                className="gx-buttonstyles-selector-control"
                                selected={selector3}
                                options={[
                                    { label: 'Normal', value: 'normal' },
                                    { label: 'Hover', value: 'hover' },
                                ]}
                                onChange={selector3 => {
                                    this.setState({ selector3 });
                                }}
                            />
                            <DimensionsControl
                                value={value[selector3].padding}
                                onChange={val => {
                                    value[selector3].padding = val;
                                    this.saveAndSend(value)
                                }}
                                target={target}
                            />
                            <DimensionsControl
                                value={value[selector3].margin}
                                onChange={val => {
                                    value[selector3].margin = val;
                                    this.saveAndSend(value)
                                }}
                                target={target}
                            />
                        </AccordionItemPanel>
                    </AccordionItem>
                </Accordion>
            </div>
        )
    }
}

/**
 * Backend editor
 */
export const ButtonEditor = props => {
    const {
        className = 'gx-buttoneditor-button',
        buttonSettings,
        onChange,
        placeholder = __('Read more text...', 'gutenberg-extra')
    } = props;

    const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);

    return (
        <LinkedButton
            className={className}
            placeholder={placeholder}
            buttonText={value.buttonText}
            onTextChange={val => {
                value.buttonText = val;
                onChange(JSON.stringify(value));
            }}
            externalLink={value.linkOptions}
            onLinkChange={val => {
                value.linkOptions = val;
                onChange(JSON.stringify(value));
            }}
        />
    )
}

/**
 * FrontEnd
 */
export const ButtonSaver = props => {
    const {
        className = 'gx-buttoneditor-button',
        buttonSettings,
    } = props;

    const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);

    return (
        <Fragment>
            {value.buttonText &&
                <Button
                    className={className}
                    href={value.linkOptions.url}
                >
                    {value.buttonText}
                </Button>
            }
        </Fragment>
    )
}