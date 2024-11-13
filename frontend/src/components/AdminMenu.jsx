import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import './AdminMenu.css'
import logo from './logo.png'
const NavAdminMenu = () => {
    return (
        <Navbar expand="lg">
        <Container>
        <Navbar.Brand href="/admin/generos">
            <img src={logo} alt="Spotify Logo" className="spotify-logo" />
            Spotify
            </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <NavDropdown title="Generos" id="generos-nav-dropdown">
                    <Link className="dropdown-item" to={"/admin/generos"}>Lista de Generos</Link>
                    <Link className="dropdown-item" to={"/admin/generos/formulario"}>Crear Genero</Link>
                </NavDropdown>
                <NavDropdown title="Artistas" id="artistas-nav-dropdown">
                    <Link className="dropdown-item" to={"/admin/artistas"}>Lista de Artistas</Link>
                    <Link className="dropdown-item" to={"/admin/artistas/formulario"}>Crear Artista</Link>
                </NavDropdown>
                <NavDropdown title="Albumes" id="albumes-nav-dropdown">
                    <Link className="dropdown-item" to={"/admin/albumes"}>Lista de Albumes</Link>
                    <Link className="dropdown-item" to={"/admin/albumes/formulario"}>Crear Album</Link>
                </NavDropdown>
                <NavDropdown title="Canciones" id="canciones-nav-dropdown">
                    <Link className="dropdown-item" to={"/admin/canciones"}>Lista de Canciones</Link>
                    <Link className="dropdown-item" to={"/admin/canciones/formulario"}>Crear Cancion</Link>
                </NavDropdown>
                <Nav className="ml-auto">
                        <Link className="nav-link" to={"/spotify"}>Modo Usuario</Link>
                </Nav>
            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
     );
}
 
export default NavAdminMenu;