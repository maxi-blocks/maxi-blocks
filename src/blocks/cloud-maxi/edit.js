/**
 * Edit component.
 */

/**
 * Import dependencies.
 */
import MaxiModal from '../../editor/library/modal';
import { library } from '../../icons';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Component, RawHTML } from '@wordpress/element';
import { Placeholder } from '../../components';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

export default class Edit extends Component {
	render() {
		const { attributes, clientId, handleSetAttributes } = this.props;

		const { content, openFirstTime } = attributes;

		/* Placeholder with layout modal */
		return [
			<div key={this.props.clientId}>
				{isEmpty(content) && (
					<Placeholder
						key='placeholder'
						label={__(
							'Cloud Library Maxi',
							'gutenberg-extra-blocks'
						)}
						instructions={__(
							'Launch the library to browse pre-designed blocks and templates.',
							'gutenberg-extra-blocks'
						)}
						className='maxi-block-library__placeholder'
						icon={library}
					>
						<MaxiModal
							clientId={clientId}
							type='patterns'
							openFirstTime={openFirstTime}
							onOpen={obj => handleSetAttributes(obj)}
							onSelect={obj => handleSetAttributes(obj)}
							onRemove={obj => handleSetAttributes(obj)}
							{...this.props}
						/>
					</Placeholder>
				)}
				{!isEmpty(content) && <RawHTML>{content}</RawHTML>}
			</div>,
		];
	}
}
