import React from "react";
import Iframe from "../iframe";
import renderer from "react-test-renderer";
test("Render default iframe", function () {
    var component = renderer.create(React.createElement(Iframe, { position: "relative", url: "http://www.foo.com", src: "http://www.foobar.com" }));
    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
test("Render iframe with title", function () {
    var component = renderer.create(React.createElement(Iframe, { position: "relative", title: "A foobared iframe", url: "http://www.foobar.com", src: "http://www.foo.com", ariaHidden: true, ariaLabel: "someLabel", ariaLabelledby: "someId", allow: "encrypted-media", sandbox: "allow-scripts", allowFullScreen: false, className: "myIframeClass", frameBorder: 0, overflow: "auto", loading: "eager", onLoad: function () { console.log("hello"); }, onMouseOut: function () { console.log("goodbye"); }, onMouseOver: function () { console.log("hi"); }, display: "inline-block", id: "myIframeId", name: "My Iframe name", scrolling: "yes", styles: { background: "red" }, target: "_self" }));
    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
test("Render with allowFullscreen bool", function () {
    var component = renderer.create(React.createElement(Iframe, { allowFullScreen: false, allow: "fullscreen", frameBorder: 1, url: "http://www.foobar.com" }));
    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
test("Render with allow attribute", function () {
    var component = renderer.create(React.createElement(Iframe, { allowFullScreen: true, allow: "fullscreen autoplay", frameBorder: 1, url: "http://www.foobar.com" }));
    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
