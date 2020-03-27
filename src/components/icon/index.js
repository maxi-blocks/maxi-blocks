const { __ } = wp.i18n;
import { withInstanceId } from '@wordpress/compose';
import { FaRegSmile } from 'react-icons/fa';
import { IconLibrary } from '../icon-library';

import './editor.scss';

const {
  Component,
  Fragment
} = wp.element;

const {
    InspectorControls,
} = wp.blockEditor;

const {
    PanelBody,
    Button,
    Modal
} = wp.components;

export const iconAttributes = {
}


let isOpen;

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

     const openModal = () =>{
       isOpen = !isOpen;
       console.log(isOpen);
     }

     const closeModal = () => {
       isOpen = false;
     }

    return (
      <PanelBody className="gx-panel gx-image-setting gx-content-tab-setting gx-icon-lib" initialOpen={true} title={__('Icons', 'gutenberg-extra')}>
      <div class='library-wrapper'>
        <span className={"gx-icon-smiley"}><FaRegSmile/></span>

        <Button isSecondary onClick={ openModal }>Open Modal</Button>
          { isOpen ?
              <Modal
                  title="This is my modal"
                  onRequestClose={ closeModal }>
                  <Button isSecondary onClick={ closeModal }>
                      My custom close button
                  </Button>
              </Modal>
          : '' }
      </div>
      </PanelBody>
    )
  }
}
export default Icon;
