import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { dark } from '../MyMap/ColorThemes/dark'
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow
}
    from "@react-google-maps/api";

//laptop
const mapContainerStyle = {
    width: "88vw",
    height: "74vh",
    left: "6vw",
    top: "3vh"
}

const center = {
    lat: 34.373112,
    lng: 6.252371
}

export default function FriendsProfile(props) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    const [id, setId] = useState(0)
    const [user, setUser] = useState({})
    const [markers, setMarkers] = useState([])
    const [selected, setSelected] = useState(null)
    const [cityCount, setCities] = useState(" ")
    const [countryCount, setCountries] = useState(" ")
    const [showView, changeView] = useState(true)


    useEffect(() => {
        setId(props.match.params.id)
    }, [])

    useEffect(() => {
        if (id) {
            axios.get(`/api/friend/profile/${id}`)
                .then(res => {
                    if (res.data[1][0].cities) {
                        setUser(res.data[0])
                        setCountries(res.data[1][0].countries)
                        setCities(res.data[1][0].cities)
                        setMarkers(res.data[2])
                    }
                })
                .catch(err => console.log(err))
        }
    }, [id])

    let options = {
        styles: dark,
        disableDefaultUI: true,
        zoomControl: true,
        minZoom: 1.5
    }

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps"

    console.log(markers)
    return (
        <div id='map-background'>
            <GoogleMap className='myMapLaptop'
                mapContainerStyle={mapContainerStyle}
                zoom={2.15}
                center={center}
                options={options}
                onLoad={onMapLoad} >

                {markers.map((marker, i) => (
                    < Marker
                        key={i}
                        title='Click to view trip info'
                        position={{ lat: +marker.lat || marker.lat, lng: +marker.lng || marker.lng }}
                        onClick={() => {
                            setSelected(marker);
                            // changeView(true)
                        }}
                    />
                ))}

                <div className="count">
                    <h2 id='countDisplay'>Cities <br /><span className='countDisplay'>{cityCount}</span></h2>
                    <h2 id='countDisplay'>Countries <br /><span className='countDisplay'>{countryCount}</span></h2>
                </div>


                {selected ?
                    <InfoWindow
                        position={{ lat: +selected.lat, lng: +selected.lng }}
                        onCloseClick={() => {
                            setSelected(null)
                        }}
                    >
                        <div>
                            <h2 className='formName'>{selected.city + ', ' + selected.country}</h2>
                            <div className='alignTripInfoLeft'>
                                {selected.start_date ? <p>Start Date:  <span>{selected.start_date.substring(0, 10)}</span></p> : null}
                                {selected.end_date ? <p>End Date: <span>{selected.end_date.substring(0, 10)}</span></p> : null}

                                {selected.rating ?
                                    <div className='ratingContainer'>
                                        <p>Rating</p>
                                        <div className="rating">
                                            <input id="star5" name={5} type="radio" className="radio-btn hide"
                                                checked={+selected.rating === 5} disabled='disabled' />
                                            <label htmlFor="star5">☆</label>
                                            <input id="star4" name={4} type="radio" className="radio-btn hide"
                                                checked={+selected.rating === 4} disabled='disabled' />
                                            <label htmlFor="star4">☆</label>
                                            <input id="star3" name={3} type="radio" className="radio-btn hide"
                                                checked={+selected.rating === 3} disabled='disabled' />
                                            <label htmlFor="star3">☆</label>
                                            <input id="star2" name={2} type="radio" className="radio-btn hide"
                                                checked={+selected.rating === 2} disabled='disabled' />
                                            <label htmlFor="star2">☆</label>
                                            <input id="star1" name={1} type="radio" className="radio-btn hide"
                                                checked={+selected.rating === 1} disabled='disabled' />
                                            <label htmlFor="star1">☆</label>
                                            <div className="clear"></div>
                                        </div>
                                    </div> : null}

                                {selected.comment ?
                                    <>
                                        <p className='question'>Notes: </p>
                                        <span>{selected.comment}</span>
                                    </>
                                    : null}


                            </div>
                        </div>
                    </InfoWindow> : null}

            </GoogleMap>
        </div >
    )
}
