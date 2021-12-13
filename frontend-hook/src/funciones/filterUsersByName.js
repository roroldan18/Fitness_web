
export const filterUsersByName = ( usuarios, name ) => {

    if (name  === '') {
        return []
    }

    const userFiltered = []
    

    usuarios.forEach( usuario => {
            if (usuario.instructors[0]?.nombre.toLocaleLowerCase().include(name.toLocaleLowerCase()) || usuario.instructors[0]?.apellido.toLocaleLowerCase().include(name.toLocaleLowerCase()) ) 
            {
                userFiltered.push(usuario)
            }
        }
    )


    return userFiltered;

    
}
