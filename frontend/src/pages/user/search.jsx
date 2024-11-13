import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Image } from "react-bootstrap";
import NavMainMenu from "../../components/MainMenu";
import "./search.css";

const MainBuscar = () => {
    const { nombre } = useParams();

    const [artistas, setArtistas] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [canciones, setCanciones] = useState([]);

    useEffect(() => {
        loadArtistas();
        loadAlbums();
        loadCanciones();
        document.title = "Resultados Búsqueda";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nombre]);

    const loadArtistas = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/artista/nombre/${nombre}`);
            setArtistas(response.data);
        } catch (error) {
            console.error("Error al cargar artistas:", error);
        }
    };

    const loadAlbums = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/album/nombre/${nombre}`);
            setAlbums(response.data);
        } catch (error) {
            console.error("Error al cargar álbumes:", error);
        }
    };

    const loadCanciones = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/cancion/nombre/${nombre}`);
            setCanciones(response.data);
        } catch (error) {
            console.error("Error al cargar canciones:", error);
        }
    };

    return (
        <>
            <NavMainMenu />
            <Container className="buscar-container">
                <Row className="buscar-section">
                    <h3>Artistas</h3>
                    {artistas.length > 0 ? (
                        artistas.map((artista) => (
                            <Col key={artista.id} xs={6} md={4} lg={3} className="text-center">
                                <Link to={`/spotify/artista/${artista.id}`} className="link">
                                    <Image
                                        src={`http://localhost:3000/artista/image/${artista.id}`}
                                        alt={artista.nombre}
                                        roundedCircle
                                        fluid
                                        className="artista-image"
                                    />
                                    <p>{artista.nombre}</p>
                                </Link>
                            </Col>
                        ))
                    ) : (
                        <p>No se encontraron artistas con ese nombre.</p>
                    )}
                </Row>
                <Row className="buscar-section">
                    <h3>Álbumes</h3>
                    {albums.length > 0 ? (
                        albums.map((album) => (
                            <Col key={album.id} xs={6} md={4} lg={3} className="text-center">
                                <Link to={`/spotify/artista/${album.artista.id}${album.id ? `/${album.id}` : ''}`} className="link">
                                    <Image
                                        src={`http://localhost:3000/album/image/${album.id}`}
                                        alt={album.nombre}
                                        fluid
                                        className="album-image"
                                    />
                                    <p>{album.nombre}</p>
                                </Link>
                            </Col>
                        ))
                    ) : (
                        <p>No se encontraron álbumes con ese nombre.</p>
                    )}
                </Row>

                <Row className="buscar-section">
                    <h3>Canciones</h3>
                    {canciones.length > 0 ? (
                        canciones.map((cancion) => (
                            <Col key={cancion.id} xs={12} md={6} lg={4} className="text-center">
                                <div className="cancion-card">
                                    <Link to={`/spotify/artista/${cancion.album.artistaId}/${cancion.albumId ? cancion.albumId : ''}/${cancion.id ? cancion.id : ''}`}>
                                        <Image
                                            src={`http://localhost:3000/album/image/${cancion.albumId}`}
                                            alt={cancion.nombre}
                                            fluid
                                            className="cancion-image"
                                        />
                                    </Link>
                                    <p>{cancion.nombre}</p>
                                </div>
                            </Col>
                        ))
                    ) : (
                        <p>No se encontraron canciones con ese nombre.</p>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default MainBuscar;
