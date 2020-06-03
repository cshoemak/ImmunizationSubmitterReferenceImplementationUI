import React from "react";import { useLocation } from "react-router";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";

export const TopNav = (): JSX.Element => {

    const rootPath = useLocation().pathname.match(/^\/[A-Z-]*/gi)?.shift() || "/";

    return (

        <div className="top-nav">
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">ISRI</NavbarBrand>
                <Nav pills>
                    <NavItem>
                        <NavLink  tag={Link} to="/connections" active={ rootPath === "/connections" } >
                            Connections
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink  tag={Link} to="/patients" active={ rootPath === "/patients" }>
                            Patients
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink  tag={Link} to="/test-results" active={ rootPath === "/test-results" }>
                            Test Results
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink  tag={Link} to="/send-message" active={ rootPath === "/send-message" }>
                            Send Message
                        </NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    );
}