
export const getTrackByStyle = ( style, mixesInstructor ) => {

    if (style  === '') {
        return []
    }

    const quisoDecirMT = style.toLocaleLowerCase().includes("muay", "thai");
    if(quisoDecirMT){
        style = "MT"
    }

    const quisoDecirLCH = style.toLocaleLowerCase().includes("lucha");
    if(quisoDecirLCH){
        style = "LCH"
    }

    const quisoDecirSBOX = style.toLocaleLowerCase().includes("super", "superbox");
    if(quisoDecirSBOX){
        style = "SBOX"
    }

    if(style.includes("entrada en calor de patadas")){
        style = "ECP"
    }

    const quisoDecirECP = style.toLocaleLowerCase().includes("patadas");
    if(quisoDecirECP){
        style = "ECP"
    }

    const quisoDecirEC = style.toLocaleLowerCase().includes("entrada", "entrada en calor");
    if(quisoDecirEC){
        style = "EC"
    }

    const styledTracks = mixesInstructor?.filter(mix => mix.estilo?.toLocaleLowerCase().includes(style.toLocaleLowerCase()));

    return styledTracks;
}
