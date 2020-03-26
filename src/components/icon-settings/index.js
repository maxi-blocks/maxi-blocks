/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { PanelColorSettings } = wp.blockEditor;
const { Component } = wp.element;

import { IconColor } from '../../components/icon-color/index';
import { IconBackgroundColor } from '../../components/icon-background-color/index';
import { IconSize } from '../../components/icon-size/index';
import { IconRotate } from '../../components/icon-rotate/index';

import { iconColorAttributes } from '../../components/icon-color/index';
import { iconBackgroundColorAttributes } from '../../components/icon-background-color/index';
import { iconSizeAttributes } from '../../components/icon-size/index';
import { iconRotateAttributes } from '../../components/icon-rotate/index';

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
  } = this.props;

 const {
     selector,
 } = this.state;

   return (
     <div className={'gx-icon-tab'}>
     <RadioControl
         className="gx-image settings-selector-control"
         selected={selector}
         options={[
             { label: 'Normal', value: 'normal' },
             { label: 'Hover', value: 'hover' },
         ]}
         onChange={(selector) => {
             this.setState({ selector });
         }}
     />
     <IconColor {...this.props}/>
     <IconBackgroundColor {...this.props}/>
     <IconSize {...this.props}/>
     <IconRotate {...this.props}/>
     </div>
   )
  }
}
