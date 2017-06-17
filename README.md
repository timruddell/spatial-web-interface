# Spatial web interface

A spatial management web interface example with horticultural land management based demo. Uses [OpenLayers](https://github.com/openlayers/openlayers), the React and Redux libraries and the [AdminLTE](https://github.com/almasaeed2010/AdminLTE) interface.

![Example with demo data](http://i.imgur.com/fTSlwxt.png)

### Features
 - OpenLayers interactive map
 - Demo data served through mock webservices with state persistence
 - Visual map feature selection/creation/editing
 - Export current map view to PDF

### Running the solution

Install the solution dependencies:

```npm install```

Run the development webserver and demo services:

```npm run serve:all```

This command is an alias for the following commands:
 - ```serve:static```: serves the static client content
 - ```serve:app```: runs webpack to bundle and serve the application files
 - ```serve:mock-services```: runs the mock services backend with node

The solution is hosted at ```localhost:8080``` by default.

### Enabling base maps

To enable the base map tiles, the OpenLayers data source must be set up correctly in the ```MapConsts.js``` file.

The default source is Bing maps, for which you can obtain a developer key [with these instructions](https://msdn.microsoft.com/en-us/library/ff428642.aspx). Replace the placeholder text in ```MapConsts.js``` with your key.

To use a different map tile source, refer to the [OpenLayers docs](https://openlayers.org/en/latest/apidoc/ol.source.html).
