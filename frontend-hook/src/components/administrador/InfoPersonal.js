import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { perfil, uri } from '../../config.js'
import { useForm } from '../../hooks/useForm.js'

export const InfoPersonal = ({idUsuario}) => {

    const [showModificarEmail, setShowModificarEmail] = useState(false);
    const [formValues, handleInputChange, reset] = useForm();

    const [usuario, setUsuario] = useState({})
    const [instructor, setInstructor] = useState({})
    const obtenerInfoUsuario = async (isMounted) => {
        try{
            const res = await axios.get(`${uri}/users/admin/${idUsuario}`);
            if(res.data.data.usuario.id_perfil === 5){
                const response = await axios.get(`${uri}/instructores/admin/usuario/${idUsuario}`);
                if(isMounted){
                    setUsuario(res.data.data.usuario)
                    setInstructor(response.data.data)
                }
            }
            else{
                if(isMounted){
                    setUsuario(res.data.data.usuario)
                }
            }
        }
        catch(error){
            console.log('Hubo un error al obtener la informacion del usuario');
        }
    }

    useEffect(() => {
        let isMounted = true;
        obtenerInfoUsuario(isMounted);
        return () => {isMounted = false}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleModificar = (e) => {
        e.preventDefault();
        setShowModificarEmail(true);
    }

    const handleModificarCancelar = () => {
        setShowModificarEmail(false);
        reset();
    }
    const handleModificarConfirmar = () => {

        const regexEmail = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
        const coincidencia = formValues.correo?.match(regexEmail);

        if( !formValues.correo ){
            Swal.fire({
                title: 'Error!',
                text: 'Debe enviar algun dato para cambiar',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }

        if( coincidencia?.length < 1 || !coincidencia ){
            Swal.fire({
                title: 'Error!',
                text: 'Debe enviar un email valido',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }

        else{
            axios.put(`${uri}/users/admin/${usuario.id}`, formValues)
                .then(res => {                    
                    Swal.fire(
                        'Confirmado!',
                        'El correo se ha modificado.',
                        'success'
                        )
                        obtenerInfoUsuario(true);
                        setShowModificarEmail(false);
                        reset();
                })
                    .catch(err => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Ha ocurrido un error del servidor en el alta, valide que el email no esté asignado a otro usuario',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        })
                        setShowModificarEmail(false);
                        reset();
                    })
        }
    }

    const fecha = new Date(usuario?.createdAt);
    const mesCreacion = fecha.getUTCMonth()+1;
    const diaCreacion = fecha.getUTCDate();
    const anioCreacion = fecha.getUTCFullYear();
    const fechaCreacion = `${diaCreacion}/${mesCreacion}/${anioCreacion}`;

    return (
        <div>
            <table className="table">
                <tbody>
                    <tr>
                        <th className="m-2">Nombre y apellido:</th>
                        <td className="ms-4">{instructor.nombre} {instructor.apellido}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th className="m-2">Nombre de Usuario:</th>
                        <td className="ms-4">{usuario.username}</td> 
                        <td></td>
                    </tr>
                    <tr>
                        <th className="m-2">Email:</th>
                        <td className="ms-4">{usuario.correo}</td>
                        <td><button value={usuario.id} className="ms-4 btn btn-outline-light" onClick={handleModificar}>Modificar</button></td>
                    </tr>
                    <tr>
                        <th className="m-2">Perfil:</th>
                        <td className="ms-4">{perfil(usuario.id_perfil)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th className="m-2">Telefono:     </th>
                        <td className="ms-4">{instructor.telefono}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th className="m-2">Direccion:     </th>
                        <td className="ms-4">{instructor.direccion} - {instructor.ciudad} - {instructor.provincia} - {instructor.pais}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th className="m-2">Facebook:     </th>
                        <td className="ms-4">{instructor.perfil_fb}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th className="m-2">Instagram:     </th>
                        <td className="ms-4">{instructor.perfil_instagram}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th className="m-2">Fecha de creacion:</th>
                        <td className="ms-4">{fechaCreacion}</td> 
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <Modal show={showModificarEmail} onHide={() => setShowModificarEmail(false)}>
                <Modal.Header className="text-dark">
                    <h1>Nuevo Email</h1>
                </Modal.Header>
                    
                    <form action="">
                        <input type="text" className="form-control mb-3" name="correo" placeholder="email@example.com" onChange={ handleInputChange } />
                    </form>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModificarCancelar}>
                            Cerrar
                        </Button>
                        <Button variant="primary" onClick={handleModificarConfirmar}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}
