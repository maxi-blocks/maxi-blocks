/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { PanelColorSettings } = wp.blockEditor;
const { Component } = wp.element;

import { IconColor } from '../../components/icon-color/index';
import { IconHoverColor } from '../../components/icon-hover-color/index';
import { IconBackgroundColor } from '../../components/icon-background-color/index';
import { IconHoverBackgroundColor } from '../../components/icon-hover-background-color/index';
import { IconSize } from '../../components/icon-size/index';
import { IconRotate } from '../../components/icon-rotate/index';
import { IconHoverAnimation } from '../../components/icon-hover-animation/index';
import { IconHoverSize } from '../../components/icon-hover-size/index';
import { IconHoverRotate } from '../../components/icon-hover-rotate/index';

import { iconColorAttributes } from '../../components/icon-color/index';
import { iconHoverColorAttributes } from '../../components/icon-hover-color/index';
import { iconBackgroundColorAttributes } from '../../components/icon-background-color/index';
import { iconHoverBackgroundColorAttributes } from '../../components/icon-hover-background-color/index';
import { iconSizeAttributes } from '../../components/icon-size/index';
import { iconRotateAttributes } from '../../components/icon-rotate/index';
import { iconHoverAnimationAttributes } from '../../components/hover-animation/index';
import { iconHoverSizeAttributes } from '../../components/icon-hover-size/index';
import { iconHoverRotateAttributes } from '../../components/icon-hover-rotate/index';

const {
    SelectControl,
    RadioControl,
    RangeControl,
    TextControl,
} = wp.components;

/**
 * External dependencies
 */


/**
 * Styles
 */
import './editor.scss';

/**
 * Default attributes
 */
export const iconSettingsAttributes = {
  ...iconColorAttributes,
  ...iconBackgroundColorAttributes,
  ...iconSizeAttributes,
  ...iconRotateAttributes,
  ...iconHoverAnimationAttributes,
  ...iconHoverColorAttributes,
  ...iconHoverBackgroundColorAttributes,
  ...iconHoverSizeAttributes,
  ...iconHoverRotateAttributes
}

/**
* Block
*/
export default class IconSettings extends Component {

  state = {
      selector: 'normal',
  }

render() {
  const {
    iconColor,
    iconBackgroundColor,
    iconSizeUnit,
    iconSize,
    iconRotationUnit,
    iconRotate,
    iconColorHover,
    iconHoverBackgroundColor,
    iconHoverSizeUnit,
    iconHoverSize,
    iconHoverRotationUnit,
    iconHoverRotate,
  } = this.props;

 const {
     selector,
 } = this.state;

   return (
     <div className={'gx-icon-settings'}>
     <RadioControl
         className="gx-image settings-selector-control state"
         selected={selector}
         options={[
             { label: 'Normal', value: 'normal' },
             { label: 'Hover', value: 'hover' },
         ]}
         onChange={(selector) => {
             this.setState({ selector });
         }}
     />


     {selector == 'hover' ?
     <div>
        <IconHoverColor {...this.props}/>
        <IconHoverBackgroundColor {...this.props}/>
        <IconHoverSize {...this.props}/>
        <IconHoverRotate {...this.props}/>
        <IconHoverAnimation {...this.props}/>
      </div> :
      <div>
        <IconColor {...this.props}/>
        <IconBackgroundColor {...this.props}/>
        <IconSize {...this.props}/>
        <IconRotate {...this.props}/>
      </div>
     }
     </div>
   )
  }
}
