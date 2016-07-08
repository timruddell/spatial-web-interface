/** @jsx React.DOM */

'use strict'

var NavbarView = require("../components.views/navigation/NavbarView");

class Navbar extends React.Component {
    
    render () {
        return <NavbarView onPdfExport= { this.onPdfExport } />
    }

    onPdfExport () {

        // Hacks that don't mean a whole lot. Seems like the only way to do this kind of thing well
        // is through serverside rendering, and having user snapshot their view through a smaller
        // selection extent with fixed paper ratios.

        var mapCanvas = $("canvas.ol-unselectable")[0];

        html2canvas(mapCanvas, {
            // width: $(mapCanvas).width(),
            // height: $(mapCanvas).height(),
            onrendered: (canvas) => {
                var img = canvas.toDataURL('image/jpeg', 1.0);

                var doc = new jsPDF({
                    orientation: "l",
                    format: [297 * 96 / 25.4, 210 * 96 / 25.4]
                });

                doc.addImage(img, 'PNG', -1 * ((canvas.width / 1.116 - 1280) / 2), 0, canvas.width / 1.116, canvas.height / 1.116);
                doc.save("export.pdf");
            }
        });
    }
}

module.exports = Navbar;