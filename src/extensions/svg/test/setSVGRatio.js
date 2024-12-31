import setSVGRatio from '@extensions/svg/setSVGRatio';

describe('setSVGRatio', () => {
	const icon =
		'<svg viewBox="0 0 36.1 36.1" class="bubble-118-shape-maxi-svg maxi-image-block__image" data-item="image-maxi-1__svg"><pattern id="image-maxi-1__1__img" class="maxi-svg-block__pattern" width="100%" height="100%" x="0" y="0" patternunits="userSpaceOnUse"><image class="maxi-svg-block__pattern__image" width="100%" height="100%" x="0" y="0" href="http://localhost:8888/wp-content/uploads/2022/08/781997cf-493c-323f-8cb1-0f6ee31e5150.jpg" preserveaspectratio="xMidYMid slice"></image></pattern><path fill="url(#image-maxi-1__1__img)" data-fill="" d="M32.511 1.569H3.698C1.969 1.569.471 2.721.471 4.22v23.742c0 1.498 1.383 2.651 3.227 2.651h19.247l7.03 3.919-.922-3.919h3.342c1.729 0 3.227-1.152 3.227-2.651V4.22c.115-1.498-1.268-2.651-3.112-2.651z" style="fill: url(#image-maxi-1__1__img)"></path></svg>';

	it('Set `meet` to the icon (fill)', () => {
		const newIcon = setSVGRatio(icon, 'meet');

		expect(newIcon).toMatchSnapshot();
	});

	it('Set `slice` to the icon (fit)', () => {
		const newIcon = setSVGRatio(icon, 'slice');

		expect(newIcon).toMatchSnapshot();
	});
});
