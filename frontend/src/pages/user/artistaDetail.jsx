import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Image, Table, Button } from "react-bootstrap";
import "./artistaDetail.css";
import NavMainMenu from "../../components/MainMenu";

const ArtistaDetail = () => {
    const { id, albumId, songId } = useParams();
    const [artista, setArtista] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [showSongs, setShowSongs] = useState({});
    const [autoPlaySongId, setAutoPlaySongId] = useState(null);

    useEffect(() => {
        loadArtista();
        loadAlbums();
        document.title = "Detalles del Artista";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (albumId) {
            setShowSongs((prevState) => ({
                ...prevState,
                [albumId]: true,
            }));
            if (songId) {
                setAutoPlaySongId(songId);
            }
        }
    }, [albumId, songId]);

    const loadArtista = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/artista/${id}`);
            setArtista(response.data);
        } catch (error) {
            console.error("Error al obtener los datos del artista:", error);
        }
    };

    const loadAlbums = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/album/artista/${id}`);
            setAlbums(response.data);
        } catch (error) {
            console.error("Error al obtener los álbumes:", error);
        }
    };

    const toggleSongsVisibility = (albumId) => {
        setShowSongs((prevState) => ({
            ...prevState,
            [albumId]: !prevState[albumId],
        }));
    };

    return (
        <>
            <NavMainMenu />
            <Container className="artista-detail-container">
                {artista && (
                    <>
                        <Row className="artista-header my-4">
                            <Col md={3}>
                                <Image
                                    src={`http://localhost:3000/artista/image/${artista.id}`}
                                    alt={artista.nombre}
                                    className="artista-image"
                                    fluid
                                />
                            </Col>
                            <Col md={9}>
                                <h2 className="artista-name">{artista.nombre}</h2>
                                <p className="artista-listeners">Oyentes: {artista.oyentes}</p>
                            </Col>
                        </Row>
                        <Row className="artista-albums">
                            <h3>Álbumes</h3>
                            {albums.length > 0 ? (
                                albums.map((album) => (
                                    <div key={album.id} className="album-card mb-3">
                                        <Row>
                                            <Col>
                                                <Image
                                                    src={`http://localhost:3000/album/image/${album.id}`}
                                                    alt={album.nombre}
                                                    className="album-image"
                                                    fluid
                                                />
                                            </Col>
                                            <Col md={9}>
                                                <h5>{album.nombre} ({album.ano})</h5>
                                                <Button onClick={() => toggleSongsVisibility(album.id)}>
                                                    {showSongs[album.id] ? "Ocultar canciones" : "Ver canciones"}
                                                </Button>
                                            </Col>
                                        </Row>
                                        {showSongs[album.id] && (
                                            <Row>
                                                <Col>
                                                    <h5>Canciones</h5>
                                                    <Table striped bordered hover className="album-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Nombre</th>
                                                                <th>Reproducir</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {album.canciones && album.canciones.length > 0 ? (
                                                                album.canciones.map((cancion) => (
                                                                    <tr key={cancion.id}>
                                                                        <td>{cancion.nombre}</td>
                                                                        <td>
                                                                            <audio controls autoPlay={cancion.id.toString() === autoPlaySongId}>
                                                                                <source
                                                                                    src={`http://localhost:3000/cancion/audio/${cancion.id}`}
                                                                                    type="audio/mp3"
                                                                                />
                                                                                Tu navegador no soporta el elemento de audio.
                                                                            </audio>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr><td colSpan="2">No hay canciones disponibles</td></tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No hay álbumes disponibles para este artista.</p>
                            )}
                        </Row>
                    </>
                )}
            </Container>
        </>
    );
};


export default ArtistaDetail;
