/**
 * WordPress dependencies
 */

import icon from './icon';
const { __ } = wp.i18n;

const {
  InspectorControls,
  RichText,
} = wp.blockEditor;
const {
    PanelBody,
    Button,
    Popover,
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
const Line = () => (
  <hr/>
);

const edit = (props) => {
    const {
        className,
        attributes: {
          title,
          subtitle,
          titleLevel,
          subtitleLevel,
          hideTitle,
          hideSubtitle,
          titleTextAlign,
          subtitleAlign,
          defaultBlockStyle
        },
        setAttributes,
    } = props;

    const titleStyles = {
      display: hideTitle ? 'none' : undefined,
      textAlign: titleTextAlign,
    };

    const subtitleStyles = {
      display: hideSubtitle ? 'none' : undefined,
      textAlign: subtitleAlign,
    };


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
            <Line/>
            <ContentDirection {...props}/>
            <TitleAlign {...props}/>
            <SubtitleAlign {...props}/>
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
                  <IconPopover/>
                </PanelBody>
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
          <PanelBody className="gx-panel gx-text-advanced gx-advanced-tab-setting" initialOpen={true} title={__('Text settings', 'gutenberg-extra')}>
          </PanelBody>
        </InspectorControls>
        <div
          className={'gx-block gx-icon-extra'}
          data-gx_initial_block_class={defaultBlockStyle}
        >
        <div class='gx-icon-extra-icon'>
        </div>
          <div class='gx-icon-extra-title'>
              <RichText
                  tagName={titleLevel}
                  style={titleStyles}
                  placeholder={__('Write title…', 'gutenberg-extra')}
                  value={title}
                  onChange={(value) => setAttributes({ title: value })}
                  className="gx-icon-extra-title"
              />
          </div>
          <div class='gx-icon-extra-subtitle'>
              <RichText
                  tagName={subtitleLevel}
                  style={subtitleStyles}
                  placeholder={__('Write title…', 'gutenberg-extra')}
                  value={subtitle}
                  onChange={(value) => setAttributes({ subtitle: value })}
                  className="gx-icon-extra-subtitle"
              />
          </div>
        </div>
        </div>
    ];
}

export default edit;
