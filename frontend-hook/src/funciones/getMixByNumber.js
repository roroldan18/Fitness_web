import { hookMixes } from "../database/mixes";

export const getHeroesByName = ( number ) => {

    if (number  === '') {
        return []
    }
    
    return hookMixes.filter( mix => mix.id.includes( number ));
}
