const initialState = {
    colors: ''
}

const COLOR_CHOOSER = 'COLOR_CHOOSER'

export function changeColor(colorChoice) {
    return {
        type: COLOR_CHOOSER,
        payload: colorChoice
    }
}

export default function reducer(state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case COLOR_CHOOSER:
            return { ...state, colors: payload }
        default:
            return state
    }
}