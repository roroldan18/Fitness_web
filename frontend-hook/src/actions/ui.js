import { types } from "../types/types.js"


export const startLoading = () => ({
    type: types.uiStartLoading,
})

export const finishLoading = () => ({
    type: types.uiFinishLoading,
})