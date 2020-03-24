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

import Icon from '../../components/icon/index';
import { BlockStyles } from '../../components/block-styles/index';
import IconPopover from '../../components/icon-popover/index';

const edit = (props) => {
    const {
        className,
        attributes: {
            title,
            defaultBlockStyle
        },
        setAttributes,
    } = props;

    const titleStyles = {};

    return [
      <div>
      <InspectorControls>
          <PanelBody className="gx-panel gx-image-setting gx-content-tab-setting" initialOpen={true} title={__('Icons', 'gutenberg-extra')}>
            <IconPopover/>
          </PanelBody>
          <PanelBody className="gx-panel gx-color-setting gx-style-tab-setting" initialOpen={true} title={__('Colour settings', 'gutenberg-extra')}>
          </PanelBody>
          <PanelBody className="gx-panel gx-text-advanced gx-content-tab-advanced" initialOpen={true} title={__('Text settings', 'gutenberg-extra')}>
          </PanelBody>
        </InspectorControls>
        <div
          className={'gx-block gx-icon-extra'}
          data-gx_initial_block_class={defaultBlockStyle}
        >
        <div class='gx-icon-extra-icon'>
        <Icon iconName='Fa500Px'/>
        </div>
          <div class='gx-icon-extra-text'>
              <RichText
                  tagName='p'
                  style={titleStyles}
                  placeholder={__('Write title…', 'gutenberg-extra')}
                  value={title}
                  onChange={(value) => setAttributes({ title: value })}
                  className="gx-icon-extra-title"
              />
          </div>
        </div>
        </div>
    ];
}

export default edit;
