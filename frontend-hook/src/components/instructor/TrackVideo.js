
import React, { useEffect, useState } from 'react';
import { modifPath } from '../../funciones/modifPathDbox';

export const TrackVideo = ( {video} ) => {

const [videoDisplay, setVideoDisplay] = useState();

useEffect(() => {
    setVideoDisplay(
        (video?.path)
        &&
        (
            <>
                {
                    (video.path_video)
                    ?
                    <>
                        <h3>Track {video.orden} - {video.estilo} - {video.descripcion}  <a download href={ modifPath(video.path_video) }><i className="fas fa-download text-white ml4"></i></a></h3>
                        <video key={video.path_video} controls download>
                            <source  src={video.path_video} type="video/mp4" />
                        </video>      
                    </>
                    :
                    <>
                        <h3>Track {video.orden} - {video.estilo} - {video.descripcion}  <a download href={ modifPath(video.path) }><i className="fas fa-download text-white ml4"></i></a></h3>
                        <video key={video.path} controls download>
                            <source  src={video.path} type="video/mp4" />
                        </video>      
                    </>
                }
            </> 
        )
    )
}, [video])

    return (
        <div className="videoTrack">
            {videoDisplay}
        </div>
        )
}
