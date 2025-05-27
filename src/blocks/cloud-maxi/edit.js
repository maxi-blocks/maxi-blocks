/**
 * WordPress dependencies.
 */
import { Component, RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies.
 */
import MaxiModal from '@editor/library/modal';
import { withMaxiProps } from '@extensions/maxi-block';

class edit extends Component {
	render() {
		const { attributes, clientId, maxiSetAttributes } = this.props;
		const { content, openFirstTime, preview } = attributes;

		if (preview)
			return (
				<img
					// eslint-disable-next-line no-undef
					src={previews.library_preview}
					alt={__('Cloud library block preview', 'maxi-blocks')}
				/>
			);

		/* Placeholder with layout modal */
		return [
			<div key={this.props.clientId}>
				{isEmpty(content) && (
					<div className='maxi-block-library__placeholder'>
						<MaxiModal
							clientId={clientId}
							type='patterns'
							openFirstTime={openFirstTime}
							onOpen={obj => maxiSetAttributes(obj)}
							onSelect={obj => maxiSetAttributes(obj)}
							onRemove={obj => maxiSetAttributes(obj)}
							{...this.props}
						/>
					</div>
				)}
				{!isEmpty(content) && <RawHTML>{content}</RawHTML>}
			</div>,
		];
	}
}

export default withMaxiProps(edit);
