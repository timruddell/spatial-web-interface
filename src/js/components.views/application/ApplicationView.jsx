'use strict'

var Provider = require("react-redux").Provider;

var Content = require("../../components.content/Content");
var Navbar = require("../../components.navigation/Navbar");
var DetailPane = require("../../components.content/detail/DetailPane");

/*
    Currently the application uses the standard AdminLTE template. This should be shifted to use a react version of the template
    to better manage the stateful UI.
*/

const ApplicationView = ({
    detailPaneIsOpen,
    toggleDetailPaneOpen,
    
    // Global appliation store.
    store
}) => {
    return (
        <Provider store={store}>
            <div>
                <header className="main-header">
                    { /* Logo */ }
                    <a href="/" className="logo">
                    { /* mini logo for sidebar mini 50x50 pixels */ }
                    <span className="logo-mini"><b><i className="fa fa-thumb-tack"></i></b></span>
                    { /* logo for regular state and mobile devices */ }
                    <span className="logo-lg"><b> Pin</b>net <b><i className="fa fa-thumb-tack"></i></b></span>
                    </a>
                    
                    { /* Header Navbar: style can be found in header.less */ }
                    <nav className="navbar navbar-static-top">
                    { /* Sidebar toggle button */ }
                    <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </a>

                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                        { /* Messages: style can be found in dropdown.less */ }
                        <li className="dropdown messages-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                            <i className="fa fa-envelope-o"></i>
                            <span className="label label-success"></span>
                            </a>
                        </li>
                        { /* Notifications: style can be found in dropdown.less */ }
                        <li className="dropdown notifications-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                            <i className="fa fa-bell-o"></i>
                            <span className="label label-warning"></span>
                            </a>
                        </li>
                        { /* Tasks: style can be found in dropdown.less */ }
                        <li className="dropdown tasks-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                            <i className="fa fa-flag-o"></i>
                            <span className="label label-danger"></span>
                            </a>
                        </li>
                        { /* Control Sidebar Toggle Button */ }
                        <li>
                            <a href="#" onClick={ toggleDetailPaneOpen }><i className="fa fa-info-circle"></i></a>
                        </li>
                        </ul>
                    </div>
                    </nav>
                </header>

                { /* Left side column. contains the sidebar */ }
                <aside className="main-sidebar">
                    <Navbar />
                </aside>

                { /* Content Wrapper. Contains page content */ }
                <div className="content-wrapper">
                    <Content />
                </div>

                <DetailPane />
                <div className="control-sidebar-bg"></div>
            </div>
        </Provider>
    );
}

module.exports = ApplicationView;