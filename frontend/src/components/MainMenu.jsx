import { Container, Navbar, Form, Button, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from './logo.png';

const NavMainMenu = () => {
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setNombre(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (nombre.trim()) {
            navigate(`/spotify/busqueda/${nombre}`);
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/spotify">
                    <img src={logo} alt="Logo" style={{ width: "50px", marginRight: "10px" }} />
                    Spotify
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="mr-auto">
                        <Form className="d-flex" onSubmit={handleSearchSubmit}>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre"
                                value={nombre}
                                onChange={handleSearchChange}
                                className="me-2"
                            />
                            <Button variant="outline-success" type="submit">Buscar</Button>
                        </Form>
                    </Nav>
                    <Nav>
                        <Link to="/admin/generos" className="btn btn-secondary">Modo Admin</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavMainMenu;
