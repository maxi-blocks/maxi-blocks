const slideAttributes = {
	'_p.b-g': '65',
	'_p.b.u-g': 'px',
	'_p.l.u-g': 'px',
	'_p.r.u-g': 'px',
	'_p.sy-g': 'axis',
	'_p.t-g': '65',
	'_p.t.u-g': 'px',
};

const TEMPLATE = [
	[
		'maxi-blocks/slide-maxi',
		{ ...slideAttributes },
		[
			[
				'maxi-blocks/text-maxi',
				{
					_c: 'My awesome slider title 1',
					_tl: 'h4',
					'_pc-g': 5,
					'_ta-g': 'center',
				},
			],
			[
				'maxi-blocks/svg-icon-maxi',
				{
					_c: '<svg class="support-6-maxi-svg__25" width="64px" height="64px" viewBox="0 0 64 64"><style>.support-6-maxi-svg__25 .C{stroke:#081219}.support-6-maxi-svg__25 .D{stroke-width:2}.support-6-maxi-svg__25 .E{stroke-linejoin:round}.support-6-maxi-svg__25 .F{stroke-miterlimit:10}.support-6-maxi-svg__25 .G{stroke-linecap:round}.support-6-maxi-svg__25:hover .C{stroke:#081219}.support-6-maxi-svg__25:hover .D{stroke-width:2}.support-6-maxi-svg__25:hover .E{stroke-linejoin:round}.support-6-maxi-svg__25:hover .F{stroke-miterlimit:10}.support-6-maxi-svg__25:hover .G{stroke-linecap:round}</style><g fill="none" da_ta-stroke class="C D E F"><path d="M48.9 36.2h-.3c-.2.5-.9.9-1.5.7-1.1-.3-1.1-1.4-1-2.3" class="G"/><path d="M46 29.3v3.4-3.4h0z"/><path d="M15.4 23.7c.2-.5.6-.7 1.1-.8.1-3.4 1-6.4 2.4-8.3 3.1-4.6 8.5-7 13.9-6.7 2.7.2 5.8 1 8.7 3.2 4.4 3.2 5.9 8.1 6.3 11.8.4.1.7.4.8.7.2 0 .4 0 .6.1" class="G"/><path d="M32 53.7l6.7-4.6h0v-2c-2.1 1.2-4.4 1.9-6.9 1.9-2.4 0-4.6-.7-6.6-1.7v1.8h0l6.8 4.6z"/></g><path d="M41.5 11.1c-3-2.2-6.1-3-8.7-3.2-5.4-.3-10.8 2.1-13.9 6.6-1.4 2-2.2 4.9-2.4 8.3.7-.1 1.4.6 1.4 1.3v5.4c.4.1.8-.3 1.1-1.1.3-.9 1.2-1.5 2.1-1.5 3.2 0 10-.8 16.9-6 1.4-1 3.3-.3 3.6 1.4.2 1.3.9 2.7 2.3 3.9 1.1.7.5 3.1 2.1 3v-5.1c0-.9.9-1.5 1.7-1.2-.3-3.7-1.8-8.5-6.2-11.8z" da_ta-fill fill="#ff4a17" da_ta-stroke class="C D E F"/><g fill="none" da_ta-stroke class="C D E F"><path d="M58.8 61c0-3.4-1.5-6.8-4.2-9-2-1.7-4.7-2.8-7.6-2.8h-3.8-1.6l-.2.3-4.2 8.2c-.1.1-.1.2-.2.3-.3.3-.9.3-1.2-.1l-2-2.1-2-2.1-2 2.1-2 2.1c-.3.3-.8.3-1.2.1l-.3-.3-4.4-8.5h0 0-1.6-3.8c-6.5 0-11.7 5.3-11.7 11.7" class="G"/><path d="M25.3 49.1h0l-3 .1h0l4.4 8.5.3.3c.3.3.8.2 1.2-.1l2-2.1 2-2.1-6.9-4.6z"/><path d="M38.7 49.1h0L32 53.7l2 2.1 2 2.1c.3.3.9.3 1.2.1.1-.1.2-.2.2-.3l4.2-8.2.1-.3h0l-3-.1z"/><path d="M49.2 23.7c.8.1 1.5.3 2.1.7v-2C51.4 11.7 42.7 3 32 3s-19.4 8.7-19.4 19.4v2c-2.6 1.3-4 4.7-3 7.5.7 2.6 3.2 4.4 5.9 4.4-.2 0-.2-12.3-.1-12.4 0-.1 0-.1.1-.2" class="G"/><path d="M17.9 29.6l-.1-6c-.5-1.1-2.2-1-2.5.2 0 .1-.1.2-.1.3l.1 11.5c0 .8.9 1.5 1.7 1.2.5-.2 1-.7 1-1.3 0 .2-.1-5.9-.1-5.9z"/><g class="G"><path d="M41.5 45c2.6-2.7 4.6-7.3 4.5-10.4v-5.3c-.7 0-1.2-.6-1.3-1.5 0-.6-.4-1.1-.8-1.4-1.4-1.1-2-2.5-2.3-3.9-.3-1.7-2.3-2.4-3.6-1.4-6.9 5.2-13.7 6-16.9 6-.9 0-1.8.6-2.1 1.5-.3.8-.6 1.2-1.1 1.1V35c0 3.9 1.6 7.4 4.1 9.9.9.9 2 1.7 3.2 2.4 2 1.1 4.2 1.7 6.6 1.7 2.5 0 4.9-.7 6.9-1.9 1.1-.5 2-1.3 2.8-2.1h-7.9"/><path d="M33.7 45h1.8 3.3 2.8 4.9a4.48 4.48 0 0 0 4.5-4.5v-4.8s-.1 0-.1.1c-.7.2-1.3.4-2 .4"/></g><path d="M54.7 29.7c0-1.8-.8-3.5-2.2-4.6 0 0 0 .1.1.1-1.1-.9-2.5-1.4-3.9-1.5 0 .1.1.1.1.2s.1.2.1.3l-.1 11.5c0 .2 0 .4-.1.5 3.3.1 6.3-3 6-6.5zm-8.7 3v2-2z"/><path d="M48.7 23.9c-.3-1.5-2.6-1.2-2.6.3v5.1 5.2c-.1.9-.1 2.2 1 2.5.8.3 1.6-.5 1.6-1.3l.1-11.5c-.1-.1-.1-.2-.1-.3z"/><path d="M15.4 23.7l-2.8.7" class="G"/></g></svg>',
					'_pc-g': 4,
					'_m.b.u-g': 'px',
					'_m.l.u-g': 'px',
					'_m.r.u-g': 'px',
					'_m.sy-g': 'none',
					'_m.t-g': '50',
					'_m.t.u-g': 'px',
				},
			],
			[
				'maxi-blocks/text-maxi',
				{
					_c: 'Name Surname',
					_tl: 'p',
					'_pc-g': 4,
					'_ta-g': 'center',
					'_m.b-g': '-10',
					'_m.b.u-g': 'px',
					'_m.l.u-g': 'px',
					'_m.r.u-g': 'px',
					'_m.sy-g': 'none',
					'_m.t-g': '10',
					'_m.t.u-g': 'px',
				},
			],
			[
				'maxi-blocks/text-maxi',
				{
					_c: 'Position',
					_tl: 'p',
					'_pc-g': 3,
					'_ta-g': 'center',
				},
			],
		],
	],
	[
		'maxi-blocks/slide-maxi',
		{ ...slideAttributes },
		[
			[
				'maxi-blocks/text-maxi',
				{
					_c: 'My awesome slider title 2',
					_tl: 'h4',
					'_pc-g': 5,
					'_ta-g': 'center',
				},
			],
			[
				'maxi-blocks/text-maxi',
				{
					_c: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros.',
					_tl: 'p',
					'_pc-g': 3,
					'_ta-g': 'center',
					'_m.b-g': '15',
					'_m.b.u-g': 'px',
					'_m.l.u-g': 'px',
					'_m.r.u-g': 'px',
					'_m.sy-g': 'none',
					'_m.t-g': '10',
					'_m.t.u-g': 'px',
					'_p.b.u-g': 'px',
					'_p.l-g': '130',
					'_p.l.u-g': 'px',
					'_p.r-g': '130',
					'_p.r.u-g': 'px',
					'_p.sy-g': 'axis',
					'_p.t.u-g': 'px',
				},
			],
			['maxi-blocks/button-maxi', { _bc: 'My Button' }],
		],
	],
];

export default TEMPLATE;
