
import { modifPath } from "../../funciones/modifPathDbox";
import { scroller } from "react-scroll";



export const MixesList = ({ listadoTracks, setVideoTrack }) => {
    const tracksFiltrados = listadoTracks.filter(track => track.tipo_material !== "VIDEO" & track.estilo !== "MIX COMPLETO");
    const tracksVideos = listadoTracks.filter(track => track.tipo_material === "VIDEO");
    
    const videoTrack = (cancion) => {
        const trackVideo = tracksVideos.find(track => track.descripcion.toLocaleLowerCase().includes(cancion.descripcion.toLocaleLowerCase()) && track.id_material === cancion.id_material )
        return trackVideo;
    }
    const clickVerVideo = (e, track) =>{
        e.preventDefault();
        setVideoTrack(track);

        scroller.scrollTo("videoTrack", {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
          });
    }


    return (
        <>
                {
                    tracksFiltrados.map( (track) => 
                        <tbody key={track.id}>
                            <tr> 
                                <td className="colMixSearch">{(track.material?.descripcion) ? (track.material.descripcion) : track.mix}</td>
                                <td className="colNumSearch">Track {track.orden}</td>
                                <td className="colStyleSearch">{track.estilo}</td>
                                <td className="colNameSearch">{ track.descripcion }</td>
                                <td className="colAudioVideo">
                                    {
                                        (track.tipo_material === "AUDIO")
                                        &&
                                        <>
                                            <audio controls name={ track.orden }>
                                                <source src={ track.path } type='audio/mp3' />
                                            </audio>
                                            
                                        </>
                                    }

                                    <a href={modifPath(track.path)} ><i className="fas fa-download col-1"></i></a>

                                    {
                                        (track.path_video)
                                        ?
                                        <button className="buscarBoton videoButton mb-2" onClick={(e) => clickVerVideo(e, track)}>Ver Video</button>
                                        :
                                        (
                                            (videoTrack(track))
                                            &&
                                            <button className="buscarBoton videoButton mb-2" onClick={(e) => clickVerVideo(e, videoTrack(track))}>Ver Video</button>
                                        )
                                    }


                                </td>
                            </tr>
                        </tbody>
                    )
                }
        </>
    )
}
