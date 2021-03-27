const initialState = {
    deviceType: '',
    orientation: ''
}

const GET_TYPE = 'GET_TYPE'
const GET_ORIENTATION = 'GET_ORIENTATION'

export function getType(device) {
    console.log('hit device:', device)
    return {
        type: GET_TYPE,
        payload: device
    }
}

export function getOrientation(deviceOrientation) {
    console.log('hit orientation: ', deviceOrientation)
    return {
        type: GET_ORIENTATION,
        payload: deviceOrientation
    }
}

export default function reducer(state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case GET_TYPE:
            return { ...state, deviceType: payload }
        case GET_ORIENTATION:
            return { ...state, orientation: payload }
        default:
            return state
    }
}