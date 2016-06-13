/** @jsx React.DOM */

'use strict'

var React = require("react");
var ReactDOM = require("react-dom");
var Redux = require("redux");

var Application = require("./Application");

ReactDOM.render(<Application />, document.getElementById("application-root"));