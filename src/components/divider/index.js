const { __ } = wp.i18n;
import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/compose';

export const dividerAttributes = {
  dividerWidth:{
    type: 'number',
    default: 0
  },
  dividerWidthUnit:{
    type: 'string',
    default: 'px'
  },
  dividerColor:{
    type: 'string'
  },
  dividerStyles:{
    type: 'string'
  },
  dividerHeightUnit:{
    type: 'string',
    default: 'px'
  },
  dividerPosition:{
    type: 'string',
    default: ''
  }
}

class Divider extends Component {
  constructor( props ) {
		super( ...arguments );
  }

  render() {
    const {
			help,
			instanceId,
			label = __( 'Margin', 'gx' ),
			type = 'margin',
		} = this.props;
    const {
      dividerColor,
      dividerWidth,
      dividerHeight,
      dividerWidthUnit,
      dividerHeightUnit,
     } = this.props.attributes;

     const dividerStyles =  {
         border: '1px solid rgb(152, 152, 152)',
         margin: 'auto',
         borderColor: dividerColor,
         height: dividerHeight ? dividerHeight + dividerHeightUnit : undefined,
         width: dividerWidth ? dividerWidth + dividerWidthUnit : undefined,
     }

    return (
        <div
        style={dividerStyles}
        />
    )
  }
}
export default Divider;
