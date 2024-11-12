import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import ListGeneros from './pages/admin/generos/listGeneros.jsx';
import FormGeneros from './pages/admin/generos/formGeneros.jsx';
import ListArtistas from './pages/admin/artistas/listArtistas.jsx';
import FormArtistas from './pages/admin/artistas/formArtistas.jsx';
import ListAlbumes from './pages/admin/albumes/listAlbumes.jsx';
import FormAlbumes from './pages/admin/albumes/formAlbumes.jsx';
import ListCanciones from './pages/admin/canciones/listCanciones.jsx';
import FormCanciones from './pages/admin/canciones/formCanciones.jsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/admin/generos',
    element: < ListGeneros />,
  },
  {
    path: 'admin/generos/formulario',
    element: <FormGeneros />
  },
  {
    path: 'admin/generos/formulario/:id',
    element: <FormGeneros />
  },
  {
    path: 'admin/artistas',
    element: <ListArtistas />
  },
  {
    path: 'admin/artistas/formulario',
    element: <FormArtistas />
  },
  {
    path: 'admin/artistas/formulario/:id',
    element: <FormArtistas />
  },
  {
    path: 'admin/albumes',
    element: <ListAlbumes />
  },
  {
    path: 'admin/albumes/formulario',
    element: <FormAlbumes />
  },
  {
    path: 'admin/albumes/formulario/:id',
    element: <FormAlbumes />
  },
  {
    path: 'admin/canciones',
    element: <ListCanciones />
  },
  {
    path: 'admin/canciones/formulario',
    element: <FormCanciones />
  },
  {
    path: 'admin/canciones/formulario/:id',
    element: <FormCanciones />
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
