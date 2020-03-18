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
       border: dividerColor ? dividerThickness ? dividerThickness + dividerThicknessUnit + ' solid ' + dividerColor : '1px solid ' + dividerColor : '1px solid rgb(152, 152, 152)',
       margin: dividerAlignment,
       borderColor: dividerColor,
       height: dividerHeight ? dividerHeight + dividerHeightUnit : undefined,
       width: dividerWidth ? dividerWidth + dividerWidthUnit : undefined,
       borderWidth: dividerThickness ? dividerThickness + dividerThicknessUnit : '1px',
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

     const buildDivider = (
     /*1*/a = isMultiple,
     /*2*/align = dividerAlignment,
     /*3*/rounded = isRounded,
     /*4*/widthUnit = dividerWidthUnit,
     /*5*/width = dividerWidth,
     /*6*/thickness = dividerThickness,
     /*7*/thicknessUnit = dividerThicknessUnit,
     /*8*/height = dividerHeight,
     /*9*/heightUnit = dividerHeightUnit,
     /*10*/colour = dividerColor
      ) => {
       if(a){
         let div = `<div class="test"
         style="border:${colour ? '1px solid ' + colour : '1px solid rgb(152,152,152)'};
         margin:${align};
         border-color:${colour};
         height:${height ? height + dividerHeightUnitValue : ''};
         width:${widthUnit ? width != 0 ? width + widthUnit : '' : ''};
         border-width:${thickness ? thickness + dividerThicknessUnitValue : ''};
         border-radius:${rounded ? '2rem' : '' };
         display:${isHidden ? 'none' : ''};
         ">`;
         setAttributes({additionalDivider: div });
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
          <VerticalDivider {...this.props} buildDivider={buildDivider}/>
          <RoundedDivider {...this.props} buildDivider={buildDivider}/>
          <AdditionalDivider {...this.props} buildDivider={buildDivider}/>
          <AlignDivider {...this.props} buildDivider={buildDivider}/>
          <DividerPosition {...this.props}/>
          <DividerWidth {...this.props} buildDivider={buildDivider}/>
          <DividerHeight {...this.props} buildDivider={buildDivider}/>
          <DividerColor {...this.props} buildDivider={buildDivider}/>
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
