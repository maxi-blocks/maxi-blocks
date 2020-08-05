import React, {Component} from "react";
import ReactDOM from "react-dom";
const { Fragment } = wp.element;

class Scripts extends Component {

  render() {
  	const {
  	        hover_animation,
  	        hover_animation_type,
  	    } = this.props;
  	// let folder = '';

  	// if({hover_animation_type} === 'basic') folder = 'hover';
  	// if({hover_animation_type} === 'text') folder = 'text';

  	let path_to_script = `http://localhost/mobiloud/wp-content/plugins/maxi-blocks/js/hover-animations/${hover_animation_type}/${hover_animation}/${hover_animation}.js`;
  	let path_to_css = `http://localhost/mobiloud/wp-content/plugins/maxi-blocks/js/hover-animations/${hover_animation_type}/${hover_animation}/${hover_animation}.css`;
  	let id_js = `maxi-hover-animation-${hover_animation}-js`;
  	let id_css = `maxi-hover-animation-${hover_animation}-css`;



  	return (
  		<Fragment>
  		  <link rel='stylesheet' id={id_css} href={path_to_css} media='all' />
	      <script id={id_js} src={path_to_script}/>
	    </Fragment>
    );
  }
}

export default Scripts;