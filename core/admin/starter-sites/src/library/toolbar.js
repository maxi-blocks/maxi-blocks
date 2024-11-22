/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	library,
	help,
	fullScreen,
	closeIcon,
	largeMode,
	mediumMode,
	smallMode,
} from '../icons';
import MaxiModal from './modal';

/**
 * External dependencies
 */
import classnames from 'classnames';
import React from 'react';
import { SearchClient as TypesenseSearchClient } from 'typesense';
import * as ReactDOM from 'react-dom';
import { isNil, isUndefined } from 'lodash';

/**
 * Component
 */
const ToolbarButton = props => {
	const { label, onClick, icon, className, isSelected } = props;

	const classes = classnames('maxi-cloud-toolbar__button', className);

	return (
		<button
			type='button'
			className={classes}
			onClick={onClick}
			aria-pressed={isSelected}
		>
			{icon}
			<span>{label}</span>
		</button>
	);
};

const LibraryToolbar = props => {
	const {
		type,
		onChange,
		onRequestClose,
		title = '',
		cost = '',
		toneUrl,
	} = props;

	const apiKey = process.env.REACT_APP_TYPESENSE_API_KEY;
	const apiHost = process.env.REACT_APP_TYPESENSE_API_URL;

	let client = new TypesenseSearchClient({
		nodes: [
			{
				host: apiHost,
				port: '443',
				protocol: 'https',
			},
		],
		apiKey,
		connectionTimeoutSeconds: 2,
	});

	const buttons = [
		{ label: 'Style cards', value: 'styleCards' },
		{ label: 'Pages', value: 'pages' },
		{ label: 'Block patterns', value: 'patterns' },
		{ label: 'Global', value: 'global' },
		{ label: 'Blocks', value: 'blocks' },
		{ label: 'Preview', value: 'preview' },
	];

	function addClass(elements, className) {
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element.classList) {
				element.classList.add(className);
			} else {
				element.className += ' ' + className;
			}
		}
	}

	function removeClass(elements, className) {
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element.classList) {
				element.classList.remove(className);
			} else {
				element.className = element.className.replace(
					new RegExp(
						'(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
						'gi'
					),
					' '
				);
			}
		}
	}

	document.addEventListener('fullscreenchange', event => {
		if (!document.fullscreenElement) {
			removeClass(
				document.getElementsByClassName('maxi-cloud-toolbar'),
				'maxi-cloud-toolbar__fullwidth'
			);
			removeClass(
				document.getElementsByClassName(
					'maxi-cloud-toolbar__button-fullwidth'
				),
				'maxi-cloud-toolbar__button_active'
			);
		} else {
			addClass(
				document.getElementsByClassName('maxi-cloud-toolbar'),
				'maxi-cloud-toolbar__fullwidth'
			);
			addClass(
				document.getElementsByClassName(
					'maxi-cloud-toolbar__button-fullwidth'
				),
				'maxi-cloud-toolbar__button_active'
			);
		}
	});

	const goFullScreen = () => {
		const modal = document.getElementsByClassName(
			'maxi-library-modal maxi-preview'
		)[0];

		const elem = modal?.getElementsByClassName(
			'components-modal__content'
		)[0];

		if (!document.fullscreenElement) {
			elem.requestFullscreen().catch(err => {
				console.warn(
					`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
				);
			});
		} else {
			document.exitFullscreen();
		}
	};

	const openRelatedPattern = () => {
		let relatedSerial = toneUrl.toLowerCase();
		const modal = document.getElementsByClassName(
			'maxi-library-modal maxi-preview'
		)[0];
		const previewIframe = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-iframe_wrap'
		)[0];

		const previewIframeWrap = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-iframe_main-wrap'
		)[0];

		const previewIframeSpace = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-iframe_space'
		)[0];

		const labelTablet = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-tablet__label'
		)[0];

		const labelMobile = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-mobile__label'
		)[0];

		if (toneUrl.includes('/')) {
			const parts = toneUrl.replace(/:$/ / '').split('/');
			relatedSerial = parts.pop() || parts.pop();
		}

		let searchParameters = {
			q: relatedSerial,
			query_by: 'post_number',
			per_page: 1,
		};

		const masonryCardId = `maxi-cloud-masonry-card__pattern-${relatedSerial}`;
		let fuulWidth = false;
		if (document.fullscreenElement) {
			fuulWidth = true;
		}

		client
			.collections('post')
			.documents()
			.search(searchParameters)
			.then(function (result) {
				const relatedHint = result?.hits[0]?.document;
				const root = ReactDOM.createRoot(
					document.getElementById('maxi-modal')
				);

				const previewIframeStyles = previewIframe.style;
				const previewIframeWrapStyles = previewIframeWrap.style;
				const previewIframeSpaceStyles = previewIframeSpace.style;

				const labelTabletStyles = labelTablet.style;
				const labelMobileStyles = labelMobile.style;

				root.render(
					<MaxiModal
						type='switch-tone'
						url={relatedHint['demo_url']}
						title={relatedHint['post_title']}
						serial={relatedHint['post_number']}
						cost={relatedHint['cost'][0]}
						toneUrl={relatedHint['link_to_related']}
						cardId={masonryCardId}
						onClose={onRequestClose}
					/>
				);
				window.setTimeout(function () {
					if (fuulWidth) {
						const modal = document.getElementsByClassName(
							'maxi-library-modal maxi-preview'
						)[0];
						const elem = modal?.getElementsByClassName(
							'components-modal__content'
						)[0];
						elem.requestFullscreen().catch(err => {
							console.warn(
								`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
							);
						});
					}
				}, 100);
				window.setTimeout(function () {
					const modal = document.getElementsByClassName(
						'maxi-library-modal maxi-preview'
					)[0];
					const previewIframe = modal?.getElementsByClassName(
						'maxi-cloud-container__preview-iframe_wrap'
					)[0];

					const previewIframeWrap = modal?.getElementsByClassName(
						'maxi-cloud-container__preview-iframe_main-wrap'
					)[0];

					const previewIframeSpace = modal?.getElementsByClassName(
						'maxi-cloud-container__preview-iframe_space'
					)[0];

					const labelTablet = modal?.getElementsByClassName(
						'maxi-cloud-container__preview-tablet__label'
					)[0];

					const labelMobile = modal?.getElementsByClassName(
						'maxi-cloud-container__preview-mobile__label'
					)[0];

					previewIframe.style.outline = previewIframeStyles.outline;
					previewIframe.style['border-radius'] =
						previewIframeStyles['border-radius'];
					labelTablet.style.display = labelTabletStyles.display;
					labelMobile.style.display = labelMobileStyles.display;
					previewIframeWrap.style.top = previewIframeWrapStyles.top;
					previewIframeSpace.style.height =
						previewIframeSpaceStyles.height;
					previewIframe.style.width = previewIframeStyles.width;
					previewIframe.style.height = previewIframeStyles.height;
					previewIframeWrap.style.left = previewIframeWrapStyles.left;
					previewIframeWrap.style.right =
						previewIframeWrapStyles.right;
					previewIframe.style.margin = previewIframeStyles.margin;
					if (previewIframe.style.width === '768px') {
						removeClass(
							document.getElementsByClassName(
								'maxi-cloud-toolbar__button-desktop'
							),
							'maxi-cloud-toolbar__button_active'
						);
						addClass(
							document.getElementsByClassName(
								'maxi-cloud-toolbar__button-tablet'
							),
							'maxi-cloud-toolbar__button_active'
						);
						removeClass(
							document.getElementsByClassName(
								'maxi-cloud-toolbar__button-mobile'
							),
							'maxi-cloud-toolbar__button_active'
						);
					} else if (previewIframe.style.width === '390px') {
						removeClass(
							document.getElementsByClassName(
								'maxi-cloud-toolbar__button-desktop'
							),
							'maxi-cloud-toolbar__button_active'
						);
						removeClass(
							document.getElementsByClassName(
								'maxi-cloud-toolbar__button-tablet'
							),
							'maxi-cloud-toolbar__button_active'
						);
						addClass(
							document.getElementsByClassName(
								'maxi-cloud-toolbar__button-mobile'
							),
							'maxi-cloud-toolbar__button_active'
						);
					}
				}, 0);
			});
	};

	const goResponsive = mode => {
		const modal = document.getElementsByClassName(
			'maxi-library-modal maxi-preview'
		)[0];
		if (!modal) return;

		const previewIframe = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-iframe_wrap'
		)[0];

		const previewIframeWrap = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-iframe_main-wrap'
		)[0];

		const previewIframeSpace = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-iframe_space'
		)[0];

		const previewModalContent = modal?.getElementsByClassName(
			'components-modal__content'
		)[0];

		if (!previewIframe) return;

		let iframeWidth = '100%';
		let iframeHeight = '100%';

		const labelTablet = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-tablet__label'
		)[0];

		const labelMobile = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-mobile__label'
		)[0];

		function addClass(elements, className) {
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				if (element.classList) {
					element.classList.add(className);
				} else {
					element.className += ' ' + className;
				}
			}
		}

		function removeClass(elements, className) {
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				if (element.classList) {
					element.classList.remove(className);
				} else {
					element.className = element.className.replace(
						new RegExp(
							'(^|\\b)' +
								className.split(' ').join('|') +
								'(\\b|$)',
							'gi'
						),
						' '
					);
				}
			}
		}

		switch (mode) {
			case 't':
				iframeWidth = '768px';
				iframeHeight = '1024px';
				previewIframe.style.outline = '#96b0cb  30px solid';
				previewIframe.style['border-radius'] = '15px';
				labelTablet.style.display = 'block';
				labelMobile.style.display = 'none';
				previewIframeWrap.style.top = '100px';
				previewIframeSpace.style.height = '20px';
				previewModalContent.style.overflowY = 'scroll';
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-desktop'
					),
					'maxi-cloud-toolbar__button_active'
				);
				addClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-tablet'
					),
					'maxi-cloud-toolbar__button_active'
				);
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-mobile'
					),
					'maxi-cloud-toolbar__button_active'
				);
				break;
			case 'm':
				iframeWidth = '390px';
				iframeHeight = '844px';
				previewIframe.style.outline = '#96b0cb  30px solid';
				previewIframe.style['border-radius'] = '15px';
				labelTablet.style.display = 'none';
				labelMobile.style.display = 'block';
				previewIframeWrap.style.top = '100px';
				previewIframeSpace.style.height = '20px';
				previewModalContent.style.overflowY = 'scroll';
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-desktop'
					),
					'maxi-cloud-toolbar__button_active'
				);
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-tablet'
					),
					'maxi-cloud-toolbar__button_active'
				);
				addClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-mobile'
					),
					'maxi-cloud-toolbar__button_active'
				);
				break;
			default:
				previewIframe.style.outline = 'none';
				previewIframe.style['border-radius'] = 0;
				labelTablet.style.display = 'none';
				labelMobile.style.display = 'none';
				previewIframeWrap.style.top = 0;
				previewIframeSpace.style.height = '0px';
				previewModalContent.style.overflowY = 'hidden';
				addClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-desktop'
					),
					'maxi-cloud-toolbar__button_active'
				);
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-tablet'
					),
					'maxi-cloud-toolbar__button_active'
				);
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-mobile'
					),
					'maxi-cloud-toolbar__button_active'
				);
				break;
		}

		previewIframe.style.width = iframeWidth;
		previewIframe.style.height = iframeHeight;
		previewIframeWrap.style.left = 0;
		previewIframeWrap.style.right = 0;
		previewIframe.style.margin = '0 auto 35px auto';
	};

	return (
		<div className='maxi-cloud-toolbar'>
			{type !== 'preview' && (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a
					href='https://maxiblocks.com/demo/'
					target='_blank'
					rel='noreferrer'
					className='maxi-cloud-toolbar__logo'
				>
					{library}

					{type === 'patterns' && __('Starter sites', 'maxi-blocks')}
				</a>
			)}
			{type === 'preview' && (
				<>
					<div className='maxi-cloud-toolbar__buttuns-group'>
						<ToolbarButton
							label={__('Back', 'maxi-blocks')}
							onClick={onRequestClose}
						/>
						<h2>{title}</h2>
						<span className='maxi-cloud-toolbar__line'>|</span>
						<span>{cost}</span>
						{!isUndefined(toneUrl) &&
							!isNil(toneUrl) &&
							toneUrl !== '' && (
								<ToolbarButton
									onClick={openRelatedPattern}
									label={__('Switch tone', 'maxi-blocks')}
								/>
							)}
					</div>
					<div className='maxi-cloud-toolbar__responsive-buttons'>
						<ToolbarButton
							className='maxi-cloud-toolbar__button-fullwidth'
							onClick={goFullScreen}
							icon={fullScreen}
							label={__('Full screen', 'maxi-blocks')}
						/>
						<ToolbarButton
							className='maxi-cloud-toolbar__button-desktop maxi-cloud-toolbar__button_active'
							onClick={() => {
								goResponsive('d');
							}}
							icon={largeMode}
							label={__('Desktop', 'maxi-blocks')}
						/>
						<ToolbarButton
							className='maxi-cloud-toolbar__button-tablet'
							onClick={() => {
								goResponsive('t');
							}}
							icon={mediumMode}
							label={__('Tablet', 'maxi-blocks')}
						/>
						<ToolbarButton
							className='maxi-cloud-toolbar__button-mobile'
							onClick={() => {
								goResponsive('m');
							}}
							icon={smallMode}
							label={__('Mobile', 'maxi-blocks')}
						/>
					</div>
				</>
			)}
			{type !== 'preview' && (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a
					className='maxi-cloud-toolbar__help-button'
					href='https://maxiblocks.com/go/help-desk'
					rel='noreferrer'
					target='_blank'
				>
					{help}
					{__('Help', 'maxi-blocks')}
				</a>
			)}

			{(type === 'preview' || type === 'switch-tone') && (
				<div className='maxi-cloud-toolbar__buttuns-group_close'>
					<ToolbarButton onClick={onRequestClose} icon={closeIcon} />
				</div>
			)}
		</div>
	);
};

export default LibraryToolbar;
