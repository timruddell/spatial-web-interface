'use strict'

// TODO: dependency injection for javascript? Feels strange having views manage their container deps. 
const MapSourceSelector = require("../../components.navigation/MapSourceSelector");
const ProjectsSelector = require("../../components.navigation/ProjectsSelector");

const NavbarView = () => {
     return (
            <section className="sidebar">
                <form action="#" method="get" className="sidebar-form">
                    <div className="input-group">
                        <input type="text" name="q" className="form-control" placeholder="Search..." />
                        <span className="input-group-btn">
                            <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i></button>
                        </span>
                    </div>
                </form>
                
                <ul className="sidebar-menu">
                    <li className="header">MANAGEMENT</li>
                    <ProjectsSelector />
                    
                    <li className="treeview">
                        <a href="#">
                            <i className="fa fa-calendar"></i> <span>Programme</span>
                        </a>
                    </li>
                    <li className="header">CONTENT</li>
                    <li>
                        <a href="#">
                            <i className="fa fa-area-chart"></i> <span>Data</span>
                            <small className="label pull-right bg-green"></small>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fa fa-file-text-o"></i> <span>Documents</span>
                            <small className="label pull-right bg-green"></small>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fa fa-sticky-note"></i> <span>Notes</span>
                            <small className="label pull-right bg-green"></small>
                        </a>
                    </li>
                    <li className="header">OPTIONS</li>
                    <li className="treeview">
                        <a href="#">
                            <i className="fa fa-map"></i> <span>Maps</span> <i className="fa fa-angle-left pull-right"></i>
                        </a>
                        <ul className="treeview-menu">
                            <MapSourceSelector />
                        </ul>
                    </li>
                </ul>
            </section>
        );
}

module.exports = NavbarView;