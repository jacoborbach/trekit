import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api"
import usePlacesAutocomplete, {
    // getDetails,
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import axios from 'axios'

import { noLabels } from './noLabels'
import { mapStyles } from "./mapStyles"
import { alternativeMap } from "./alternativeMap"
import "./MyMap.css"


const mapContainerStyle = {
    // width: "69vw",
    width: "96vw",
    height: "74vh",
    left: "2vw",
    // top: "4vh"
    top: "8vh"
}
const center = {
    lat: 43.419014,
    lng: 14.445674
}

export default function MyMap(props) {
    const [libraries] = useState(['places']);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });


    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null)
    const [cityCount, setCities] = useState(" ");
    const [countryCount, setCountries] = useState(" ");
    const [showView, changeView] = useState(true)

    const [dateView, changeDateView] = useState(false);

    // Inputs
    const [startDate, setStart] = useState('');
    const [endDate, setEnd] = useState('');
    const [ratingInp, setRating] = useState(0);
    const [commentInp, setComment] = useState('');
    const defaultId = 1;

    // Editing Trip Info
    const [toggleTripEdit, setToggleTripEdit] = useState(false)
    const [newStartDate, setNewStart] = useState('')
    const [newEndDate, setNewEnd] = useState('')
    const [newRating, setNewRating] = useState('')
    const [newComment, setNewComment] = useState('')


    const [colors, setColorTheme] = useState(null)

    let options = {
        styles: colors,
        disableDefaultUI: true,
        zoomControl: true,
        minZoom: 2
    }

    const fetchUser = async () => {
        const userData = await axios.get(`/api/user/${defaultId}`);
        // console.log(userData)
        setCountries(userData.data.count[0].countries)
        setCities(userData.data.count[0].cities)
        setMarkers(userData.data.userData)
        setUserColorOnLogin();
    }

    const setUserColorOnLogin = () => {
        if (props.user.theme === "mapStyles") {
            setColorTheme(mapStyles)
        } else if (props.user.theme === "alternativeMap") {
            setColorTheme(alternativeMap)
        } else if (props.user.theme === "noLabels") {
            setColorTheme(noLabels)
        }
    }

    useEffect(() => {
        fetchUser()
    }, []);

    const getCount = async () => {
        const newCount = await axios.get(`/api/trip-count/${defaultId}`)
        setCountries(newCount.data[0].countries)
        setCities(newCount.data[0].cities)
    }

    // too (hopefully) cause less re-renders
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps"

    const toggle = () => {
        changeView(!showView)
        setSelected(null)
    }

    const addmarker = (coordinates) => {
        axios.post('/api/newtrip', { id: props.user.id || defaultId, name: coordinates.address, lat: coordinates.lat, lng: coordinates.lng })
            .then(res => {
                getCount();
                setMarkers(current => [...current, {
                    name: coordinates.address,
                    lat: coordinates.lat,
                    lng: coordinates.lng,
                    id: res.data.id //this is the trip id
                }])
            })

            .catch(err => console.log(err))
    }

    const handleDelete = () => {
        axios.delete(`/api/trip/${selected.id}`)
            .then(res => {
                console.log(res.data)
                setMarkers(res.data.newMarkers)
                setCities(res.data.count[0].cities)
                setCountries(res.data.count[0].countries)
            })
            .catch(err => console.log(err))
        setSelected(null)
    }

    const toggleDateView = () => {
        changeDateView(!dateView)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`/api/tripinfo/${defaultId}`, { id: selected.id, startDate, endDate, ratingInp, commentInp })
            .then(res => {
                let copyMarkers = [...markers];
                for (let i = 0; i < copyMarkers.length; i++) {
                    if (copyMarkers[i].id === res.data.trip_id) {
                        copyMarkers[i].start_date = res.data.start_date
                        copyMarkers[i].end_date = res.data.end_date
                        copyMarkers[i].rating = res.data.rating
                        copyMarkers[i].comment = res.data.comment
                        setMarkers(copyMarkers)
                    }
                }
                setStart('')
                setEnd('')
                setRating('')
                setComment('')
            })
            .catch(err => console.log(err))
    }

    const confirmClose = () => {
        let result = window.confirm('Are you sure you want to stop editing this trip? All your data will be lost')
        if (result === true) {
            setStart('')
            setEnd('')
            setRating('')
            setComment('')
            setSelected(null)
        } else if (result === false) {
            // console.log('you hit cancel')
            let copySelected = selected
            let copyStart = startDate;
            let copyEnd = endDate;
            let copyRating = ratingInp;
            console.log(copyRating)
            let copyComment = commentInp;
            setSelected(null)
            setSelected(copySelected)
            setStart(copyStart)
            setEnd(copyEnd)
            setRating(+copyRating)
            setComment(copyComment)
        }
    }

    const handleClose = () => {
        startDate || endDate || ratingInp || commentInp ? confirmClose() : setSelected(null)
    }

    const handleEdit = () => {
        setToggleTripEdit(!toggleTripEdit)
        setNewStart(selected.start_date.substring(0, 10))
        setNewEnd(selected.end_date.substring(0, 10))
        setNewRating(selected.rating)
        setNewComment(selected.comment)
    }

    const handleTripEditSubmit = (e) => {
        e.preventDefault();
        axios.put(`/api/trip/${defaultId}`, {
            trip_id: selected.id, start_date: newStartDate, end_date: newEndDate, rating: newRating, comment: newComment
        })

            .then(res => {
                let copyMarkers = [...markers];
                for (let i = 0; i < copyMarkers.length; i++) {
                    if (copyMarkers[i].id === res.data.trip_id) {
                        copyMarkers[i].start_date = res.data.start_date
                        copyMarkers[i].end_date = res.data.end_date
                        copyMarkers[i].rating = res.data.rating
                        copyMarkers[i].comment = res.data.comment
                        setMarkers(copyMarkers)
                        setToggleTripEdit(!toggleTripEdit)
                    }
                }
                setStart('')
                setEnd('')
                setRating('')
                setComment('')

            })
            .catch(err => console.log(err))
    }


    let handleColorChange = (e) => {
        setColorTheme(e)

        let dbColor = '';
        if (colors === mapStyles) {
            dbColor = "mapStyles"
        } else if (colors === noLabels) {
            dbColor = "noLabels"
        } else if (colors === alternativeMap) {
            dbColor = "alternativeMap"
        }
        axios.put(`/api/color/${defaultId}`, { color: dbColor })
            .catch(err => console.log(err))
    }


    return (
        <div id='map-background'>

            {/* first button sets background to noLabels */}
            <h3>Color Options</h3>
            <button onClick={() => handleColorChange(noLabels)} >Default</button>
            {/* second button sets background to dark */}
            <button onClick={() => handleColorChange(mapStyles)} >Dark</button>
            {/* third button sets background to the alternative */}
            <button onClick={() => handleColorChange(alternativeMap)} >Alternative</button>


            <GoogleMap className='myMap'
                mapContainerStyle={mapContainerStyle}
                zoom={2.15}
                center={center}
                options={options}
                onLoad={onMapLoad} >

                {showView
                    ? (
                        <h2 className='AddBtn' onClick={toggle} title='Click to add trips'>Add +</h2>
                    )
                    : (
                        < div className='search-container'>
                            <Search addmarker={addmarker} />
                            <h2 title="Click to close search" className='MinusBtn' onClick={toggle}>-</h2>
                        </div>

                    )}

                {markers.map((marker, i) => (
                    < Marker
                        key={i}
                        title='Click to add trip info'
                        position={{ lat: +marker.lat || marker.lat, lng: +marker.lng || marker.lng }}
                        // icon = {{ url: "", scaledSize: new window.google.maps.Size(30, 30) }}
                        onClick={() => {
                            setSelected(marker);
                            changeView(true)
                        }}
                    />
                ))}

                <div className="count">
                    <h2>Cities <br /><span className='countDisplay'>{cityCount}</span></h2>
                    <h2>Countries <br /><span className='countDisplay'>{countryCount}</span></h2>
                </div>

                {selected ? (
                    <InfoWindow
                        // pixelOffset:
                        position={{ lat: +selected.lat, lng: +selected.lng }}
                        onCloseClick={() => {
                            handleClose();
                        }}
                    >
                        {selected.start_date || selected.end_date || selected.rating || selected.comment ? (
                            <>
                                <h2 className='formName'>{selected.name || selected.city + ', ' + selected.country}</h2>
                                <button onClick={handleDelete} className='deleteBtn'>Delete</button>

                                {/* on click of edit toggle view for that specific input back to the input view  */}
                                {!toggleTripEdit ? (
                                    <>
                                        <span>Start Date: </span>
                                        <span>{selected.start_date.substring(0, 10)}</span>
                                        <br /><br />

                                        <span>End Date: </span>
                                        <span>{selected.end_date.substring(0, 10)}</span>

                                        <br /><br />
                                        <span>Rating: {selected.rating}</span>


                                        <br /><br />
                                        <span>{selected.comment}</span>
                                        <br /><br />
                                        <button onClick={handleEdit}>Edit</button>

                                        <br /><br />


                                    </>

                                ) : (
                                        <>
                                            <label>Start Date:</label>
                                            <input type='date'
                                                value={newStartDate}
                                                onChange={e => setNewStart(e.target.value)}
                                            />

                                            <br /><br />

                                            <label>End Date:</label>
                                            <input id='endDateInp' type='date'
                                                value={newEndDate}
                                                onChange={e => setNewEnd(e.target.value)} />
                                            <br /><br />

                                            <label>Rating:</label>
                                            <input value={newRating}
                                                onChange={e => setNewRating(e.target.value)} />


                                            {/* Text Area */}
                                            <h3 id='review'>Review</h3>
                                            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} maxLength="1250" rows='4' cols='20' /><br /><br />

                                            <button onClick={handleEdit}>Back</button>
                                            <button id='EditTripSubmit' onClick={handleTripEditSubmit}>Submit</button>
                                            <br /><br />

                                        </>
                                    )}


                            </>
                        ) : (
                                <>
                                    <form onSubmit={handleSubmit}>
                                        <button onClick={handleDelete} className='deleteBtn'>Delete</button>
                                        <h2 className='formName'>{selected.name || selected.city + ', ' + selected.country}</h2>
                                        <div className='tripInfoForm'>
                                            {!dateView ?
                                                (
                                                    <h3 onClick={toggleDateView} id='review' >Add dates <span id='plus' title='Click to add Dates'>+</span></h3>
                                                ) : (
                                                    <div className='dumbclass'>
                                                        {/* Trip Dates */}
                                                        <label>Start Date:</label>
                                                        <input type='date' value={startDate} onChange={e => setStart(e.target.value)} /><br />

                                                        <label>End Date:</label>
                                                        <input id='endDateInp' type='date' value={endDate} onChange={e => setEnd(e.target.value)} />

                                                        <br />
                                                        <p onClick={toggleDateView} id='back' title="Click to go back to 'Add Dates' view">Back</p>
                                                    </div>
                                                )}


                                            {/* Star Rating */}
                                            <div className='ratingContainer'>
                                                <h3 className='question'>Rating</h3>
                                                <div className="rating">
                                                    <input onChange={e => setRating(e.target.name)} id="star5" name={5} type="radio" value={ratingInp} className="radio-btn hide"
                                                        checked={+ratingInp === 5} />
                                                    <label htmlFor="star5">☆</label>
                                                    <input onChange={e => setRating(e.target.name)} id="star4" name={4} type="radio" value={ratingInp} className="radio-btn hide"
                                                        checked={+ratingInp === 4} />
                                                    <label htmlFor="star4">☆</label>
                                                    <input onChange={e => setRating(e.target.name)} id="star3" name={3} type="radio" value={ratingInp} className="radio-btn hide"
                                                        checked={+ratingInp === 3} />
                                                    <label htmlFor="star3">☆</label>
                                                    <input onChange={e => setRating(e.target.name)} id="star2" name={2} type="radio" value={ratingInp} className="radio-btn hide"
                                                        checked={+ratingInp === 2} />
                                                    <label htmlFor="star2">☆</label>
                                                    <input onChange={e => setRating(e.target.name)} id="star1" name={1} type="radio" value={ratingInp} className="radio-btn hide"
                                                        checked={+ratingInp === 1} />
                                                    <label htmlFor="star1">☆</label>
                                                    <div className="clear"></div>
                                                </div>
                                            </div>


                                            {/* Text Area */}
                                            <h3 id='review'>Review</h3>
                                            <textarea value={commentInp} onChange={e => setComment(e.target.value)} maxLength="1250" rows='4' cols='20' /><br />

                                        </div>
                                        <input type="submit" />
                                    </form>
                                </>
                            )}

                    </InfoWindow>) : null}
            </GoogleMap>

        </div >
    )
}

export function Search(props) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            types: ['(cities)']
        }
    });

    return (
        <div className='search'>
            <Combobox
                onSelect={async (address) => {
                    setValue('', false);
                    clearSuggestions();

                    try {
                        const results = await getGeocode({ address });
                        // console.log(results[0])
                        // console.log('city', results[0].address_components[0].short_name)
                        // console.log('country:', results[0].address_components[-1].short_name)
                        const { lat, lng } = await getLatLng(results[0]);
                        // const details = await getDetails(results[0].place_id)
                        // console.log(details)
                        props.addmarker({ address, lat, lng })
                    } catch (error) {
                        console.log("error", error);
                    }
                }}>
                <ComboboxInput
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={!ready}
                    placeholder="Enter a City..."
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" &&
                            data.map(({ description }, i) =>
                                <ComboboxOption key={i} value={description} />
                            )}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    )
}