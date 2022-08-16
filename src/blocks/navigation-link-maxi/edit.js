/**
 * Wordpress dependencies
 */
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import getStyles from './styles';
import Inspector from './inspector';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import copyPasteMapping from './copy-paste-mapping';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const response = {
			navigation_menu: {
				[uniqueID]: {},
			},
		};

		return response;
	}

	render() {
		const { attributes, maxiSetAttributes } = this.props;
		const { uniqueID, label, url } = attributes;

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-navigation-link--${uniqueID}`}
				ref={this.blockRef}
				{...getMaxiBlockAttributes(this.props)}
			>
				<RichText
					className='maxi-navigation-link-block__content menu-item__content'
					href={url}
					value={label}
					identifier='content'
					onChange={label => {
						if (this.typingTimeout) {
							clearTimeout(this.typingTimeout);
						}

						this.typingTimeout = setTimeout(() => {
							maxiSetAttributes({ label });
						}, 100);
					}}
					placeholder={__('Add link', 'maxi-blocks')}
					withoutInteractiveFormatting
					tagName='a'
				/>
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
