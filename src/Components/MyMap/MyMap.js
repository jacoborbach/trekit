import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { v4 as randomString } from 'uuid'
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow
}
    from "@react-google-maps/api";
import SearchMap from '../SearchMap/SearchMap'
import { dark } from "./ColorThemes/dark"
import { silver } from "./ColorThemes/silver"
import "./MyMap.css"
import { noLabels } from './ColorThemes/noLabels';

const aws = require('aws-sdk')
const s3 = new aws.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
})

const { REACT_APP_S3_BUCKET: S3_BUCKET } = process.env;

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

function MyMap(props) {
    const [libraries] = useState(['places']);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    //trips
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
    // Editing Trip Info
    const [toggleTripEdit, setToggleTripEdit] = useState(false)
    const [newStartDate, setNewStart] = useState('')
    const [newEndDate, setNewEnd] = useState('')
    const [newRating, setNewRating] = useState('')
    const [newComment, setNewComment] = useState('')
    const [colors, setColors] = useState(null)
    // const defaultId = 52

    //Aws
    const [file, setFile] = useState({})

    const setUserColor = () => {
        if (props.user.theme === 'Dark') {
            setColors(dark)
        } else if (props.user.theme === "Silver") {
            setColors(silver)
        } else if (props.user.theme === "No Labels") {
            setColors(noLabels)
        }
    }

    const getCount = () => {
        if (props.user.id) {
            axios.get(`/api/trip-count/${props.user.id}`)
                .then(res => {
                    setCountries(res.data[0].countries)
                    setCities(res.data[0].cities)
                })
        }
    }

    useEffect(() => {
        if (props.user.id) {
            setUserColor();
            axios.get(`/api/user/${props.user.id}`)
                .then(res => {
                    setCountries(res.data.count[0].countries)
                    setCities(res.data.count[0].cities)
                    setMarkers(res.data.userData)
                })
        }
    }, [props]);

    let options = {
        styles: colors,
        disableDefaultUI: true,
        zoomControl: true,
        minZoom: 1.5
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

    // Add Markers
    const addmarker = (coordinates) => {
        if (props.user.id) {
            axios.post('/api/newtrip', { id: props.user.id, name: coordinates.address, lat: coordinates.lat, lng: coordinates.lng })
                .then(res => {
                    console.log('hit')
                    getCount();
                    setMarkers(current => [...current, {
                        name: coordinates.address,
                        lat: coordinates.lat,
                        lng: coordinates.lng,
                        trip_id: res.data.trip_id
                    }])
                })
                .catch(err => console.log(err))
        }
    }

    const toggleDateView = () => {
        changeDateView(!dateView)
    }

    // Confirm Closing of Info Window
    const confirmClose = () => {
        let result = window.confirm('Are you sure you want to stop editing this trip? All your data will be lost')
        if (result === true) {
            setStart('')
            setEnd('')
            setRating('')
            setComment('')
            setFile({})
            setSelected(null)
        } else if (result === false) {
            let copySelected = selected
            let copyStart = startDate;
            let copyEnd = endDate;
            let copyRating = ratingInp;
            let copyComment = commentInp;
            setSelected(null)
            setSelected(copySelected)
            setStart(copyStart)
            setEnd(copyEnd)
            setRating(+copyRating)
            setComment(copyComment)
            setFile({})
        }
    }

    const handleClose = () => {
        startDate || endDate || ratingInp || commentInp || file.name ? confirmClose() : setSelected(null)
    }

    const handleEdit = () => {
        setToggleTripEdit(!toggleTripEdit)
        setNewStart(selected.start_date.substring(0, 10))
        setNewEnd(selected.end_date.substring(0, 10))
        setNewRating(selected.rating)
        setNewComment(selected.comment)
    }


    // Edit Trip Info
    const handleTripEditSubmit = (e) => {
        e.preventDefault();
        axios.put('/api/trip', {
            trip_id: selected.trip_id, start_date: newStartDate, end_date: newEndDate, rating: newRating, comment: newComment
        })

            .then(res => {
                let copyMarkers = [...markers];
                for (let i = 0; i < copyMarkers.length; i++) {
                    if (copyMarkers[i].trip_id === res.data.trip_id) {
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
    // Submit Trip Info
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/tripinfo', { trip_id: selected.trip_id, startDate, endDate, ratingInp, commentInp })
            .then(res => {
                let copyMarkers = [...markers];
                for (let i = 0; i < copyMarkers.length; i++) {
                    if (copyMarkers[i].trip_id === res.data.trip_id) {
                        copyMarkers[i].start_date = res.data.start_date
                        copyMarkers[i].end_date = res.data.end_date
                        copyMarkers[i].rating = res.data.rating
                        copyMarkers[i].comment = res.data.comment
                        // console.log(file)
                        { file.name ? getSignedRequest(file) : console.log('didnt work') }
                    }
                }
                setMarkers(copyMarkers)
                setStart('')
                setEnd('')
                setRating('')
                setComment('')
                setFile({})
            })
            .catch(err => console.log(err))
    }

    const getSignedRequest = (file) => {
        const fileName = `${randomString()}-${file.name.replace(/\s/g, '-')}`

        axios.get('/sign-s3', {
            params: {
                'file-name': fileName,
                'file-type': file.type
            }
        }).then((response) => {
            const { signedRequest, url } = response.data
            uploadFile(file, signedRequest, url)
        }).catch(err => {
            console.log(err)
        })
    }

    const uploadFile = (file, signedRequest, url) => {
        const options = {
            headers: {
                'Content-Type': file.type,
            },
        };

        axios
            .put(signedRequest, file, options)
            .then(response => {
                axios.post('/api/file', { url, trip_id: selected.trip_id })
                    .then(res => {
                        // console.log(res.data)
                        let copyArray = [...markers]
                        for (let i = 0; i < copyArray.length; i++) {
                            if (selected.trip_id === copyArray[i].trip_id) {
                                copyArray[i].file = res.data.file
                            }
                        }
                        setMarkers(copyArray)

                    })

                    .catch(err => console.log(err))
            })
            .catch(err => {
                if (err.response.status === 403) {
                    alert(
                        `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${err.stack
                        }`
                    );
                } else {
                    alert(`ERROR: ${err.status}\n ${err.stack}`);
                }
            });
    };
    // console.log(selected)

    const doNothing = () => {
        return undefined
    }

    // Delete Markers
    const handleDelete = () => {
        if (props.user.id) {
            axios.delete(`/api/trip/${selected.trip_id}`)
                .then(res => {
                    //remove the trip from state and re-set state here
                    let copyMarkers = [...markers]
                    for (let i = 0; i < copyMarkers.length; i++) {
                        if (copyMarkers[i].trip_id === selected.trip_id) {
                            copyMarkers.splice(i, 1)
                        }
                    }
                    setMarkers(copyMarkers)

                    //add another axios call for count
                    axios.get(`/api/trip-count/${props.user.id}`)
                        .then(response => {
                            setCities(response.data[0].cities)
                            setCountries(response.data[0].countries)
                        })

                    { selected.file ? DeleteAwsFile() : doNothing() }
                })
                .catch(err => console.log(err))
            setSelected(null)
        }
    }

    let DeleteAwsFile = () => {
        const params = {
            Bucket: S3_BUCKET,
            Key: selected.file.substring(47) //pushes the file that AWS recognizes (removes https:....)
        };
        //delete the file from db
        // axios.put('/api/file', { trip_id: selected.trip_id })
        //     .then(res => console.log(res.data))
        //     .catch(err => console.log(err))

        s3.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response
            /*
            data = {
            }
            */
        });
    }



    console.log(props)
    return (
        <div id='map-background'>

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
                            <SearchMap addmarker={addmarker} />
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

                                {/* Displaying Trip Info */}
                                {!toggleTripEdit ? (
                                    <div >
                                        <div className='alignTripInfoLeft'>
                                            <p>Start Date:  <span>{selected.start_date.substring(0, 10)}</span></p>

                                            <p>End Date: <span>{selected.end_date.substring(0, 10)}</span></p>



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
                                            </div>

                                            <p className='question'>Notes: </p>
                                            <span>{selected.comment}</span>
                                        </div>



                                        <br />

                                        {selected.file ? (
                                            <>
                                                <div className='alignTripInfoLeft'>
                                                    <div>Files:</div>
                                                    <a href={selected.file} target="_blank" rel="noopener noreferrer">Itinerary</a>
                                                </div>
                                                <br />
                                                {/* <button onClick={DeleteAwsFile}>Delete AWS File</button> */}

                                                <button onClick={handleEdit}>Edit</button><br /><br />
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={handleEdit}>Edit</button><br /><br />
                                            </>
                                        )}



                                    </div>

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
                            // Add Trip Info
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


                                        <div className="App">
                                            <h3 id='cutPadding'>Upload an Itinerary</h3>
                                            {/* File Input */}
                                            <input type='file' accept="image/png, .doc, .docx, image/jpeg" onChange={e => {
                                                setFile(e.target.files[0])
                                            }} />


                                        </div>
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

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps)(MyMap)