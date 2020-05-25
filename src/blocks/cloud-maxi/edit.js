/**
 * Edit component.
 */

 /**
 * Import dependencies.
 */
import MaxiModal from './modal';
import { library } from '../../icons';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Placeholder } = wp.components;
const { Component, Fragment } = wp.element;
const {
	BlockControls,
	BlockAlignmentToolbar,
} = wp.editor;

export default class Edit extends Component {

	constructor( props ) {
		super( ...arguments );
	}

	render() {

		const {
			attributes,
			setAttributes,
			clientId,
		} = this.props;

		/* Placeholder with layout modal */
		return [
			<Fragment key={ this.props.clientId }>
				<BlockControls key="controls">
					<BlockAlignmentToolbar
						value={ attributes.align }
						onChange={ align => setAttributes( { align } ) }
						controls={ [] }
					/>
				</BlockControls>
				<Placeholder
					key="placeholder"
					label={ __( 'Cloud Library Maxi', 'gutenberg-extra-blocks' ) }
					instructions={ __( 'Launch the library to browse pre-designed blocks and templates.', 'gutenberg-extra-blocks' ) }
					className={ 'maxi-block-library__placeholder' }
					icon= {library}
				>
					<MaxiModal clientId={ clientId } />
				</Placeholder>
			</Fragment>
		];
	}
}
