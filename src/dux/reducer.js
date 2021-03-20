const initialState = {
    user: {},
    markers: [],
    count: {}
}

const GET_USER = 'GET_USER'
const GET_MARKERS = 'GET_MARKERS'
const GET_COUNT = 'GET_COUNT'
const CLEAR_USER = 'CLEAR_USER'

export function getUser(userObj) {
    return {
        type: GET_USER,
        payload: userObj
    }
}

export function getMarkers(markerArr) {
    return {
        type: GET_MARKERS,
        payload: markerArr
    }
}

export function getCount(countObj) {
    return {
        type: GET_COUNT,
        payload: countObj
    }
}

export function clearUser() {
    return {
        type: CLEAR_USER,
        payload: {}
    }
}

export default function reducer(state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case GET_USER:
            return { ...state, user: payload }
        case GET_MARKERS:
            return { ...state, markers: payload }
        case GET_COUNT:
            return { ...state, count: payload }
        case CLEAR_USER:
            return { ...state, user: payload }
        default:
            return state
    }
}