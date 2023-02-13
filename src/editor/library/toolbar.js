/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, useDispatch } from '@wordpress/data';

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
} from '../../icons';
// eslint-disable-next-line import/no-cycle
import MaxiModal from './modal';
import { onRequestInsertPattern } from './util';

/**
 * External dependencies
 */
import classnames from 'classnames';
import React from 'react';
import { SearchClient as TypesenseSearchClient } from 'typesense';

/**
 * Component
 */
const ToolbarButton = props => {
	const { label, onClick, icon, className, isSelected } = props;

	const classes = classnames('maxi-cloud-toolbar__button', className);

	return (
		<button
			className={classes}
			onClick={onClick}
			aria-pressed={isSelected}
			type='button'
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
		toneUrl = '',
		isMaxiProActive = false,
		isPro,
		isBeta,
		gutenbergCode,
		onSelect,
		isSwapChecked,
	} = props;

	const client = new TypesenseSearchClient({
		nodes: [
			{
				host: '24q17endjv0kacilp-1.a1.typesense.net',
				port: '443',
				protocol: 'https',
			},
		],
		apiKey: '0DpJlIVm3kKOiQ9kAPTklrXrIbFLgWk6',
		connectionTimeoutSeconds: 2,
	});

	const buttons = [
		{ label: 'Style Cards', value: 'styleCards' },
		{ label: 'Pages', value: 'pages' },
		{ label: 'Block Patterns', value: 'patterns' },
		{ label: 'Global', value: 'global' },
		{ label: 'Blocks', value: 'blocks' },
		{ label: 'Preview', value: 'preview' },
	];

	function addClass(elements, className) {
		for (let i = 0; i < elements.length; i += 1) {
			const element = elements[i];
			if (element.classList) {
				element.classList.add(className);
			} else {
				element.className += ` ${className}`;
			}
		}
	}

	function removeClass(elements, className) {
		for (let i = 0; i < elements.length; i += 1) {
			const element = elements[i];
			if (element.classList) {
				element.classList.remove(className);
			} else {
				element.className = element.className.replace(
					new RegExp(
						`(^|\\b)${className.split(' ').join('|')}(\\b|$)`,
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
			'maxi-library-modal maxi-library-modal__preview'
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

	const { isValidTemplate, getSelectedBlockClientId } =
		select('core/block-editor');
	const clientId = getSelectedBlockClientId();
	const { replaceBlock } = useDispatch('core/block-editor');

	const openRelatedPattern = () => {
		let relatedSerial = toneUrl.toLowerCase();

		if (toneUrl.includes('/')) {
			const parts = toneUrl.replace(/:$/ / '').split('/');
			relatedSerial = parts.pop() || parts.pop();
		}

		const searchParameters = {
			q: relatedSerial,
			query_by: 'post_number',
			per_page: 1,
		};

		const masonryCardId = `maxi-cloud-masonry-card__pattern-${relatedSerial}`;
		let fullWidth = false;
		if (document.fullscreenElement) {
			fullWidth = true;
		}

		const modal = document.getElementsByClassName(
			'maxi-library-modal__preview'
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

		client
			.collections('post')
			.documents()
			.search(searchParameters)
			.then(result => {
				const relatedHit = result?.hits[0]?.document;
				const previewIframeStyles = previewIframe.style;
				const previewIframeWrapStyles = previewIframeWrap.style;
				const previewIframeSpaceStyles = previewIframeSpace.style;

				const labelTabletStyles = labelTablet.style;
				const labelMobileStyles = labelMobile.style;

				window.setTimeout(() => {
					if (fullWidth) {
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

				// window.setTimeout(() => {
				// 	const modal = document.getElementsByClassName(
				// 		'maxi-library-modal maxi-library-modal__preview'
				// 	)[0];
				// 	const previewIframe = modal?.getElementsByClassName(
				// 		'maxi-cloud-container__preview-iframe_wrap'
				// 	)[0];

				// 	const previewIframeWrap = modal?.getElementsByClassName(
				// 		'maxi-cloud-container__preview-iframe_main-wrap'
				// 	)[0];

				// 	const previewIframeSpace = modal?.getElementsByClassName(
				// 		'maxi-cloud-container__preview-iframe_space'
				// 	)[0];

				// 	const labelTablet = modal?.getElementsByClassName(
				// 		'maxi-cloud-container__preview-tablet__label'
				// 	)[0];

				// 	const labelMobile = modal?.getElementsByClassName(
				// 		'maxi-cloud-container__preview-mobile__label'
				// 	)[0];

				// 	previewIframe.style.outline = previewIframeStyles.outline;
				// 	previewIframe.style['border-radius'] =
				// 		previewIframeStyles['border-radius'];
				// 	labelTablet.style.display = labelTabletStyles.display;
				// 	labelMobile.style.display = labelMobileStyles.display;
				// 	previewIframeWrap.style.top = previewIframeWrapStyles.top;
				// 	previewIframeSpace.style.height =
				// 		previewIframeSpaceStyles.height;
				// 	previewIframe.style.width = previewIframeStyles.width;
				// 	previewIframe.style.height = previewIframeStyles.height;
				// 	previewIframeWrap.style.left = previewIframeWrapStyles.left;
				// 	previewIframeWrap.style.right =
				// 		previewIframeWrapStyles.right;
				// 	previewIframe.style.margin = previewIframeStyles.margin;
				// 	if (previewIframe.style.width === '768px') {
				// 		removeClass(
				// 			document.getElementsByClassName(
				// 				'maxi-cloud-toolbar__button-desktop'
				// 			),
				// 			'maxi-cloud-toolbar__button_active'
				// 		);
				// 		addClass(
				// 			document.getElementsByClassName(
				// 				'maxi-cloud-toolbar__button-tablet'
				// 			),
				// 			'maxi-cloud-toolbar__button_active'
				// 		);
				// 		removeClass(
				// 			document.getElementsByClassName(
				// 				'maxi-cloud-toolbar__button-mobile'
				// 			),
				// 			'maxi-cloud-toolbar__button_active'
				// 		);
				// 	} else if (previewIframe.style.width === '390px') {
				// 		removeClass(
				// 			document.getElementsByClassName(
				// 				'maxi-cloud-toolbar__button-desktop'
				// 			),
				// 			'maxi-cloud-toolbar__button_active'
				// 		);
				// 		removeClass(
				// 			document.getElementsByClassName(
				// 				'maxi-cloud-toolbar__button-tablet'
				// 			),
				// 			'maxi-cloud-toolbar__button_active'
				// 		);
				// 		addClass(
				// 			document.getElementsByClassName(
				// 				'maxi-cloud-toolbar__button-mobile'
				// 			),
				// 			'maxi-cloud-toolbar__button_active'
				// 		);
				// 	}
				// }, 0);

				const maxiModal = document.getElementById('maxi-modal');

				wp.element.render(
					<MaxiModal
						type='switch-tone'
						url={relatedHit.demo_url}
						title={relatedHit.post_title}
						serial={relatedHit.post_number}
						cost={relatedHit.cost[0]}
						toneUrl={relatedHit.link_to_related}
						onClose={onRequestClose}
						isPro={relatedHit.cost?.[0] === 'Pro'}
						isBeta={relatedHit.post_tag?.includes('Beta')}
						gutenbergCode={relatedHit.gutenberg_code}
						isSwapChecked={isSwapChecked}
						onSelect={onSelect}
						forceIsOpen
						isOpen
					/>,
					maxiModal
				);
			});
	};

	const goResponsive = mode => {
		const modal = document.getElementsByClassName(
			'maxi-library-modal__preview'
		)[0];

		if (!modal) return;

		const previewIframe = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-iframe_wrap'
		)[0];

		const previewIframeContainer = modal?.getElementsByClassName(
			'maxi-cloud-container'
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
			for (let i = 0; i < elements.length; i += 1) {
				const element = elements[i];
				if (element.classList) {
					element.classList.add(className);
				} else {
					element.className += ` ${className}`;
				}
			}
		}

		function removeClass(elements, className) {
			for (let i = 0; i < elements.length; i += 1) {
				const element = elements[i];
				if (element.classList) {
					element.classList.remove(className);
				} else {
					element.className = element.className.replace(
						new RegExp(
							`(^|\\b)${className.split(' ').join('|')}(\\b|$)`,
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
				// previewIframeWrap.style.top = '100px';
				previewIframeSpace.style.height = '20px';
				// previewModalContent.style.overflowY = 'scroll';
				previewIframeContainer.style.overflowY = 'scroll';
				previewIframe.style.margin = '50px auto 35px auto';
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
				// previewIframeWrap.style.top = '100px';
				previewIframeSpace.style.height = '20px';
				// previewModalContent.style.overflowY = 'scroll';
				previewIframe.style.margin = '50px auto 35px auto';
				previewIframeContainer.style.overflowY = 'scroll';
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
				// previewIframeWrap.style.top = 0;
				previewIframeSpace.style.height = '0px';
				previewModalContent.style.overflowY = 'hidden';
				previewIframe.style.margin = '0 auto 35px auto';
				previewIframeContainer.style.overflowY = 'hidden';
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
	};

	return (
		<div className='maxi-cloud-toolbar'>
			{type !== 'preview' && type !== 'switch-tone' && (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a className='maxi-cloud-toolbar__logo'>
					{library}
					{type === 'svg' && __('Icon library', 'maxi-blocks')}
					{type === 'patterns' &&
						__('Template library', 'maxi-blocks')}
					{type === 'sc' && __('Style cards', 'maxi-blocks')}
					{type.includes('shape') &&
						__('Shape library', 'maxi-blocks')}
					{type.includes('button') &&
						__('Button icon library', 'maxi-blocks')}
					{type.includes('video') &&
						__('Video icon library', 'maxi-blocks')}
				</a>
			)}
			{(type === 'preview' || type === 'switch-tone') && (
				<>
					<div className='maxi-cloud-toolbar__buttons-group'>
						<ToolbarButton
							label={__('Back', 'maxi-blocks')}
							onClick={onRequestClose}
						/>
						<h2>{title}</h2>
						<span className='maxi-cloud-toolbar__line'>|</span>
						<span>{cost}</span>
						<ToolbarButton
							onClick={() => {
								onRequestClose();
								openRelatedPattern();
							}}
							label={__('Switch tone', 'maxi-blocks')}
						/>
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
			{type === 'all' && (
				<div>
					{buttons.map(button => (
						<ToolbarButton
							key={`maxi-cloud-toolbar__button__${button.value}`}
							label={button.label}
							onClick={() => onChange(button.value)}
							isSelected={type === button.value}
						/>
					))}
				</div>
			)}
			{type !== 'preview' && type !== 'switch-tone' && (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a className='maxi-cloud-toolbar__help-button'>
					{help}
					{__('Help', 'maxi-blocks')}
				</a>
			)}

			{(type === 'preview' || type === 'switch-tone') && (
				<div className='maxi-cloud-toolbar__buttons-group_close'>
					{(!isPro || isBeta || isMaxiProActive) && (
						<ToolbarButton
							label={__('Insert', 'maxi-blocks')}
							onClick={() => {
								onRequestInsertPattern(
									gutenbergCode,
									isSwapChecked,
									isValidTemplate,
									onSelect,
									onRequestClose,
									replaceBlock,
									clientId
								);
								onRequestClose();
							}}
						/>
					)}
					{isPro && !isBeta && !isMaxiProActive && (
						<ToolbarButton
							label={__('Go Pro', 'maxi-blocks')}
							onClick={() =>
								window.open(
									'https://maxiblocks.com/go/pro-library',
									'_blank'
								)
							}
						/>
					)}
					<ToolbarButton onClick={onRequestClose} icon={closeIcon} />
				</div>
			)}
		</div>
	);
};

export default LibraryToolbar;
