'use strict'

const MapSourceSelector = require("../../components.navigation/MapSourceSelector");

const NavbarView = () => {
     return (
            <section className="sidebar">
                <form action="#" method="get" className="sidebar-form">
                    <div className="input-group">
                        <input type="text" name="q" className="form-control" placeholder="Search..." />
                        <span className="input-group-btn">
                            <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i>
                            </button>
                        </span>
                    </div>
                </form>
                
                <ul className="sidebar-menu">
                    <li className="header">CONTENT</li>
                    <li className="treeview">
                    <a href="#">
                        <i className="fa fa-map"></i> <span>Maps</span> <i className="fa fa-angle-left pull-right"></i>
                    </a>
                        <ul className="treeview-menu">
                            <MapSourceSelector />
                        </ul>
                    </li>
                    <li className="treeview">
                    <a href="#">
                        <i className="fa fa-map-marker"></i>
                        <span>Assets</span>
                        <span className="label label-primary pull-right"></span>
                    </a>
                    <ul className="treeview-menu">
                        <li><a href="/"><i className="fa fa-circle-o"></i> Top Navigation</a></li>
                        <li><a href="/"><i className="fa fa-circle-o"></i> Boxed</a></li>
                    </ul>
                    </li>
                    <li className="header">ANALYSIS</li>
                    <li>
                    <a href="/">
                        <i className="fa fa-area-chart"></i> <span>Charts</span>
                        <small className="label pull-right bg-green"></small>
                    </a>
                    </li>
                </ul>
            </section>
        );
}

module.exports = NavbarView;