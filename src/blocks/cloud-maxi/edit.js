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
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { BlockControls, BlockAlignmentToolbar } from '@wordpress/block-editor';
import { Placeholder } from '../../components';

export default class Edit extends Component {
	render() {
		const { attributes, setAttributes, clientId } = this.props;

		/* Placeholder with layout modal */
		return [
			<Fragment key={this.props.clientId}>
				<BlockControls key='controls'>
					<BlockAlignmentToolbar
						value={attributes.align}
						onChange={align => setAttributes({ align })}
						controls={[]}
					/>
				</BlockControls>
				<Placeholder
					key='placeholder'
					label={__('Cloud Library Maxi', 'gutenberg-extra-blocks')}
					instructions={__(
						'Launch the library to browse pre-designed blocks and templates.',
						'gutenberg-extra-blocks'
					)}
					className='maxi-block-library__placeholder'
					icon={library}
				>
					<MaxiModal clientId={clientId} />
				</Placeholder>
			</Fragment>,
		];
	}
}
