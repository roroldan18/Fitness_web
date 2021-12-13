export const getTrackByName = ( name, mixesInstructor ) => {

    if (name  === '') {
        return []
    }

    const hookMixes = mixesInstructor?.filter(mix => mix.descripcion.toLocaleLowerCase().includes(name.toLocaleLowerCase()));

    return hookMixes;    
}
