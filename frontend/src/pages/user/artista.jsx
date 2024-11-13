import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Image } from "react-bootstrap";
import NavMainMenu from "../../components/MainMenu";
import "./artista.css";

const MainArtistas = () => {
    const { id } = useParams();
    const [artistas, setArtistas] = useState([]);

    useEffect(() => {
        loadArtistas();
        document.title = "Spotify - Artistas por Género";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadArtistas = async () => {
        axios.get(`http://localhost:3000/artista/genero/${id}`)
            .then((response) => {
                setArtistas(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <NavMainMenu />
            <Container className="container-custom mt-3">
                <Row>
                    {artistas.map((artista) => (
                        <Col key={artista.id} md={4} sm={6} xs={12} className="mb-3">
                            <Link to={`/spotify/artista/${artista.id}`} className="text-decoration-none">
                                <div className="artist-card">
                                    <div className="artist-image-container">
                                        <Image
                                            src={`http://localhost:3000/artista/image/${artista.id}`}
                                            alt={artista.nombre}
                                            fluid
                                            className="artist-image"
                                        />
                                    </div>
                                    <h5 className="artist-name">{artista.nombre}</h5>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default MainArtistas;
