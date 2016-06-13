/** @jsx React.DOM */

'use strict'

var Map = require("./Map");

class Content extends React.Component {
    
   render () {
       return (
            <div id="outer-content-container">
                <Map nodeId="ol-map" />
            </div>
       );
   } 
}

module.exports = Content;