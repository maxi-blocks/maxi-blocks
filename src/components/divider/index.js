const { __ } = wp.i18n;
import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/compose';

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

const {
  InspectorControls,
  PanelColorSettings,
  URLInput,
  RichText,
  MediaUpload,
} = wp.blockEditor;

const {
  PanelBody,
  Button,
  RangeControl,
  RadioControl,
  CheckboxControl,
  SelectControl,
  ToggleControl
} = wp.components;

import { HideDivider } from '../divider-settings/hide-divider/index';
import { VerticalDivider } from '../divider-settings/vertical-divider/index';
import { RoundedDivider } from '../divider-settings/rounded-divider/index';
import { AdditionalDivider } from '../divider-settings/additional-divider/index';
import { AlignDivider } from '../divider-settings/align-divider/index';
import { DividerPosition } from '../divider-settings/divider-position/index';
import { DividerWidth } from '../divider-settings/divider-width/index';
import { DividerHeight } from '../divider-settings/divider-height/index';
import { DividerColor } from '../divider-settings/divider-color/index';

import { hideDividerAttributes } from '../divider-settings/hide-divider/index';
import { verticalDividerAttributes } from '../divider-settings/vertical-divider/index';
import { roundedDividerAttributes } from '../divider-settings/rounded-divider/index';
import { additionalDividerAttributes} from '../divider-settings/additional-divider/index';
import { alignDividerAttributes } from '../divider-settings/align-divider/index';
import { dividerPositionAttributes } from '../divider-settings/divider-position/index';
import { dividerWidthAttributes } from '../divider-settings/divider-width/index';
import { dividerHeightAttributes } from '../divider-settings/divider-height/index';
import { dividerColorAttributes } from '../divider-settings/divider-color/index';

export const dividerAttributes = {
  dividerThicknessUnit:{
    type: 'string',
    default: 'px'
  },
  dividerThickness:{
    type: 'number',
    default: 1
  },
  isMultiple:{
    type: 'boolean',
    default: false
  },
  ...hideDividerAttributes,
  ...verticalDividerAttributes,
  ...roundedDividerAttributes,
  ...additionalDividerAttributes,
  ...alignDividerAttributes,
  ...dividerPositionAttributes,
  ...dividerWidthAttributes,
  ...dividerHeightAttributes,
  ...dividerColorAttributes
}



class Divider extends Component {
  constructor( props ) {
		super( ...arguments );
  }

  render() {
    // Declaring placeholder variables
    let dividerColorValue;
    let dividerAlignmentValue;
    let dividerHeightValue;
    let dividerWidthValue;
    let dividerHeightUnitValue;
    let dividerWidthUnitValue;
    let dividerThicknessValue;
    let dividerThicknessUnitValue;
    let isMultipleValue;
    const {
			help,
			instanceId,
			label = __( 'Margin', 'gx' ),
			type = 'margin',
      setAttributes,
		} = this.props;
    const {
      dividerColor,
      dividerWidth,
      dividerHeight,
      dividerWidthUnit,
      dividerHeightUnit,
      dividerOrder,
      dividerAlignment,
      dividerThickness,
      dividerThicknessUnit,
      isVertical,
      isHidden,
      isRounded,
      isMultiple,
      isBehindTheSubtitle,
      isPreappendedToSubtitle,
      isAppendedToSubtitle,
      subtitleTextAlign,
      contentDirection
     } = this.props.attributes;
     dividerColorValue = this.props.attributes.dividerColor;
     dividerAlignmentValue = this.props.attributes.dividerAlignment;
     dividerHeightValue = this.props.attributes.dividerHeight;
     dividerWidthValue = this.props.attributes.dividerWidth;
     dividerHeightUnitValue = this.props.attributes.dividerHeightUnit;
     dividerWidthUnitValue = this.props.attributes.dividerWidthUnit;
     dividerThicknessValue = this.props.attributes.dividerThickness;
     dividerThicknessUnitValue = this.props.attributes.dividerThicknessUnit;

     const dividerStyles =  {
       border: dividerColor ? '1px solid ' + dividerColor : '1px solid rgb(152, 152, 152)',
       margin: dividerAlignment,
       borderColor: dividerColor,
       height: dividerHeight ? dividerHeight + dividerHeightUnit : undefined,
       width: dividerWidth ? dividerWidth + dividerWidthUnit : undefined,
       borderWidth: dividerThickness ? dividerThickness + dividerThicknessUnit : undefined,
       display: isHidden ? 'none' : undefined,
       borderRadius: isRounded ? '2rem' : undefined,
       position: isBehindTheSubtitle || contentDirection == 'row' ? 'absolute' : undefined,
       top: isBehindTheSubtitle ? '1.5rem' : undefined,
       left: isBehindTheSubtitle ? dividerAlignment == 'auto' ? '0' : dividerAlignment == '0 auto 0 0' ? '0' : undefined  : undefined,
       right: isBehindTheSubtitle ? dividerAlignment == 'auto' ? '0' : dividerAlignment == '0 0 0 auto' ? '0' : undefined : undefined,
       bottom: contentDirection == 'row' ? '0' : undefined,
       zIndex: isBehindTheSubtitle ? -1 : undefined,
     };

     const dividerWrapperStyles = {
       order: dividerOrder,
     }

     console.log(this.isMultipleValue);
     const buildDivider = () => {
       console.log('from buildDivider', this.props);
       console.log('inside buildDivider');
       console.log(this.props.attributes.isMultiple);
       if(isMultiple){
         console.log('building divider');
         let div = `<div class="test"
         style="border:${dividerColorValue ? '1px solid ' + dividerColorValue : '1px solid rgb(152,152,152)'};
         margin:${dividerAlignmentValue};
         border-color:${dividerColorValue};
         height:${dividerHeightValue ? dividerHeightValue + dividerHeightUnitValue : ''};
         width:${dividerWidthUnitValue ? dividerWidthValue != 0 ? dividerWidthValue + dividerWidthUnitValue : '' : ''};
         border-width:${dividerThicknessValue ? dividerThicknessValue + dividerThicknessUnitValue : ''};
         display:${isHidden ? 'none' : ''};
         border-radius:${isRounded ? '2rem' : ''};
         ">`;
         setAttributes({additionalDivider: div });
         console.log('done building the divider');
         return div;
      }else{
        setAttributes({additionalDivider: '' });
      }
     }


    return (
      <div
      style={dividerWrapperStyles}
      >
      <InspectorControls>
      <Accordion
          className = {'gx-style-tab-setting gx-accordion'}
          allowMultipleExpanded = {true}
          allowZeroExpanded = {true}
      >
      <AccordionItem>
          <AccordionItemHeading className={'gx-accordion-tab gx-typography-tab'}>
            <AccordionItemButton className='components-base-control__label'>
              {__('Divider', 'gutenberg-extra' )}
            </AccordionItemButton>
          </AccordionItemHeading>
        <AccordionItemPanel>
        <PanelBody>
          <HideDivider {...this.props}/>
          <VerticalDivider {...this.props}/>
          <RoundedDivider {...this.props}/>
          <AlignDivider {...this.props}/>
          <DividerPosition {...this.props}/>
          <DividerWidth {...this.props} buildDivider={buildDivider}/>
          <DividerHeight {...this.props}/>
          <DividerColor {...this.props}/>
          <AdditionalDivider {...this.props} buildDivider={buildDivider}/>
          </PanelBody>
        </AccordionItemPanel>

      </AccordionItem>
      </Accordion>

      </InspectorControls>
      <div
      className={'gx-divider'}
      style={dividerStyles}
      />
      </div>
    )
  }
}
export default Divider;
