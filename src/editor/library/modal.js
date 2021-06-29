/**
 * Layout modal window with tab panel.
 */

import CloudLibrary from '.';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Component, RawHTML } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { Icon } from '../../components';

/**
 * Icons
 */
import { SCaddMore, toolbarReplaceImage } from '../../icons';

class MaxiModal extends Component {
	state = {
		isOpen: this.props.openFirstTime,
	};

	render() {
		const { isOpen } = this.state;

		const { type, clientId, empty, style, layerId } = this.props;

		const { getBlockAttributes, getSelectedBlockClientId } =
			select('core/block-editor');

		const attributes = getBlockAttributes(getSelectedBlockClientId());

		const onClick = () => {
			this.setState({
				isOpen: !isOpen,
			});

			dispatch('core/block-editor').updateBlockAttributes(clientId, {
				openFirstTime: !isOpen,
			});
		};

		return (
			<div className='maxi-library-modal__action-section'>
				<div className='maxi-library-modal__action-section__buttons'>
					{type === 'patterns' && (
						<Button
							key={`maxi-block-library__modal-button--${clientId}`}
							isPrimary
							className='maxi-block-library__modal-button'
							onClick={onClick}
						>
							{__('Launch the Library', 'maxi-blocks')}
						</Button>
					)}
					{type === 'sc' && (
						<Button
							className='maxi-style-cards__sc__more-sc--add-more'
							onClick={onClick}
						>
							<Icon icon={SCaddMore} />
						</Button>
					)}
					{type === 'svg' && empty && (
						<>
							<div className='maxi-svg-icon-block__placeholder'>
								<Button
									isPrimary
									key={`maxi-block-library__modal-button--${clientId}`}
									className='maxi-block-library__modal-button'
									onClick={onClick}
								>
									{__('Select SVG Icon', 'maxi-blocks')}
								</Button>
							</div>
						</>
					)}
					{type === 'svg' && !empty && (
						<Button
							className='maxi-svg-icon-block__replace-icon'
							onClick={onClick}
							icon={toolbarReplaceImage}
						/>
					)}
					{type.includes('shape') && (
						<Button
							className='maxi-svg-defaults__load-library'
							onClick={onClick}
						>
							{attributes['background-svg-SVGElement'] &&
							attributes['background-svg-SVGCurrentElement'] ===
								''
								? __('Replace Shape From Cloud', 'maxi-blocks')
								: __('Load Shape Library', 'maxi-blocks')}
						</Button>
					)}
					{type === 'button-icon' && (
						<Button
							className='maxi-svg-defaults__load-library'
							onClick={onClick}
						>
							{__('Replace Icon', 'maxi-blocks')}
						</Button>
					)}
					{isOpen && (
						<CloudLibrary
							layerId={layerId}
							cloudType={type}
							onClose={onClick}
							blockStyle={style}
						/>
					)}
				</div>
				{attributes &&
					type === 'bg-shape' &&
					attributes['background-svg-SVGElement'] &&
					attributes['background-svg-SVGCurrentElement'] === '' && (
						<div className='maxi-library-modal__action-section__preview'>
							<RawHTML>
								{attributes['background-svg-SVGElement']}
							</RawHTML>
						</div>
					)}
				{attributes &&
					type === 'image-shape' &&
					attributes.SVGElement &&
					attributes.SVGCurrentElement === '' && (
						<div className='maxi-library-modal__action-section__preview'>
							<RawHTML>{attributes.SVGElement}</RawHTML>
						</div>
					)}
			</div>
		);
	}
}
export default MaxiModal;
