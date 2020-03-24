const { __ } = wp.i18n;
import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/compose';

const {
    InspectorControls,
} = wp.blockEditor;

export const iconAttributes = {

}



class Icon extends Component {
  constructor( props ) {
		super( ...arguments );
  }

  render() {
    const {
			instanceId,
      setAttributes,
      iconName,
		} = this.props;

     const iconStyles =  {
       width: '40px',
       height: '40px'
     };

    return (
      ''
    )
  }
}
export default Icon;
