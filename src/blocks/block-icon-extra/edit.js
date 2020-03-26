/**
 * WordPress dependencies
 */

import icon from './icon';
import classnames from 'classnames';
const { __ } = wp.i18n;

const {
  InspectorControls,
  PanelColorSettings,
  RichText,
} = wp.blockEditor;
const {
    PanelBody,
    Button,
    Popover,
    RangeControl,
    RadioControl,
    BaseControl
} = wp.components;
/**
 * External dependencies
 */

 import {
     Accordion,
     AccordionItem,
     AccordionItemHeading,
     AccordionItemButton,
     AccordionItemPanel,
 } from 'react-accessible-accordion';

import { FontLevel } from '../../components/font-level/index';
import Icon from '../../components/icon/index';
import { BlockStyles } from '../../components/block-styles/index';
import IconPopover from '../../components/icon-popover/index';
import { HideTitle } from '../../components/hide-title/index';
import { HideSubtitle } from '../../components/hide-subtitle/index';
import { HideDescription } from '../../components/hide-description/index';
import { ContentDirection } from '../../components/content-direction/index';
import { SubtitleAlign } from '../../components/icon-extra-subtitle-align/index';
import { TitleAlign } from '../../components/title-align/index';
import { DescriptionAlign } from '../../components/description-align/index';
import Divider from '../../components/divider/index';
import Typography from '../../components/typography/index';
import IconSettings from '../../components/icon-settings/index';
const Line = () => (
  <hr/>
);

const edit = (props) => {
    const {
        className,
        attributes: {
          title,
          subtitle,
          description,
          titleLevel,
          subtitleLevel,
          hideTitle,
          hideSubtitle,
          titleTextAlign,
          iconColor,
          subtitleAlign,
          iconBackgroundColor,
          iconSizeUnit,
          iconSize,
          iconRotationUnit,
          iconRotate,
          fontOptions,
          hideDescription,
          descriptionTextAlign,
          defaultBlockStyle,
          extraClassName,
          uniqueID
        },
        setAttributes,
    } = props;

    this.state = {
      selector: 'normal',
    }

    const {
      selector,
    } = this.state;

    const titleStyles = {
      display: hideTitle ? 'none' : undefined,
      fontWeight: '400',
      textAlign: titleTextAlign,
    };

    const subtitleStyles = {
      display: hideSubtitle ? 'none' : undefined,
      fontWeight: '400',
      textAlign: subtitleAlign,
    };

    const descriptionStyles = {
      display: hideDescription ? 'none' : undefined,
      fontWeight: '400',
      textAlign: descriptionTextAlign,
    };

    const blockStyle = {};

    let classes = classnames( className );
    if ( className.indexOf(uniqueID) === -1 ) {
        classes = classnames( classes, uniqueID )
    }

    return [
      <div>
      <InspectorControls>
          <PanelBody className="gx-panel gx-image-setting gx-content-tab-setting" initialOpen={true} title={__('Icons', 'gutenberg-extra')}>
            <BlockStyles {...props} />
            <FontLevel
              label={__('Title level', 'gutenberg-extra')}
              value={titleLevel}
              onChange={value => setAttributes({ titleLevel: value })}
            />
            <FontLevel
              label={__('Subtitle level', 'gutenberg-extra')}
              value={subtitleLevel}
              onChange={value => setAttributes({ subtitleLevel: value })}
            />
            <HideTitle {...props}/>
            <HideSubtitle {...props}/>
            <HideDescription {...props}/>
            <Line/>
            <ContentDirection {...props}/>
            <TitleAlign {...props}/>
            <SubtitleAlign {...props}/>
            <DescriptionAlign {...props}/>
          </PanelBody>
          <Accordion
              className = {'gx-style-tab-setting gx-accordion'}
              allowMultipleExpanded = {true}
              allowZeroExpanded = {true}
          >
          <AccordionItem>
            <AccordionItemHeading className={'gx-accordion-tab gx-icon-tab'}>
              <AccordionItemButton className='components-base-control__label'>
               {__('Icon', 'gutenberg-extra' )}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
                <PanelBody className="gx-panel gx-color-setting gx-style-tab-setting" initialOpen={true} title={__('Colour settings', 'gutenberg-extra')}>
                  <IconSettings {...props}/>
                </PanelBody>
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
          <Accordion
              className = {'gx-style-tab-setting gx-accordion'}
              allowMultipleExpanded = {true}
              allowZeroExpanded = {true}
          >
          <AccordionItem>
            <AccordionItemHeading className={'gx-accordion-tab gx-typography-tab'}>
              <AccordionItemButton className='components-base-control__label'>
               {__('Typography', 'gutenberg-extra' )}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
            <PanelBody className="gx-panel gx-color-setting gx-style-tab-setting" initialOpen={true} title={__('Colour settings', 'gutenberg-extra')}>
            <Typography
              fontOptions={props.attributes.fontOptions}
              onChange={value => { setAttributes({ fontOptions: value})}}
              label={__('Title', 'gutenberg-extra')}
              className="components-panel__body editor-panel-color-settings block-editor-panel-color-settings is-opened"
              target="gx-icon-extra-title"
                />
            <Typography
              fontOptions={props.attributes.fontOptions}
              onChange={value => { setAttributes({ fontOptions: value})}}
              label={__('Subtitle', 'gutenberg-extra')}
              className="components-panel__body editor-panel-color-settings block-editor-panel-color-settings is-opened"
              target="gx-icon-extra-subtitle"
                />
            <Typography
              fontOptions={props.attributes.fontOptions}
              onChange={value => { setAttributes({ fontOptions: value})}}
              label={__('Description', 'gutenberg-extra')}
              className="components-panel__body editor-panel-color-settings block-editor-panel-color-settings is-opened"
              target="gx-icon-extra-description"
                />
              </PanelBody>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
        <PanelBody className="gx-panel gx-text-advanced gx-advanced-tab-setting" initialOpen={true} title={__('Text settings', 'gutenberg-extra')}>
        </PanelBody>
        </InspectorControls>
        <div
          className={blockStyle + ' gx-block gx-icon-extra ' + classes + ' ' + extraClassName}
          data-gx_initial_block_class={defaultBlockStyle}
        >
        <div class='gx-icon-extra-icon'>
        </div>
          <div class='gx-icon-extra-title-wrapper'>
              <RichText
                  tagName={titleLevel}
                  style={titleStyles}
                  placeholder={__('Write title…', 'gutenberg-extra')}
                  value={title}
                  onChange={(value) => setAttributes({ title: value })}
                  className="gx-icon-extra-title"
              />
          </div>
          <div class='gx-icon-extra-subtitle-wrapper'>
              <RichText
                  tagName={subtitleLevel}
                  style={subtitleStyles}
                  placeholder={__('Write subtitle…', 'gutenberg-extra')}
                  value={subtitle}
                  onChange={(value) => setAttributes({ subtitle: value })}
                  className="gx-icon-extra-subtitle"
              />
          </div>
          <Divider {...props}/>
          <div class='gx-icon-extra-description-wrapper'>
              <RichText
                  tagName='h6'
                  style={descriptionStyles}
                  placeholder={__('Write description…', 'gutenberg-extra')}
                  value={description}
                  onChange={(value) => setAttributes({ description: value })}
                  className="gx-icon-extra-description"
              />
          </div>
        </div>
        </div>
    ];
}

export default edit;
