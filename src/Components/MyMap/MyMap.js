import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { v4 as randomString } from "uuid";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import SearchMap from "../SearchMap/SearchMap";
import { original } from "./ColorThemes/original";
import { dark } from "./ColorThemes/dark";
import { silver } from "./ColorThemes/silver";
import { noLabels } from "./ColorThemes/noLabels";
import { sunset } from "./ColorThemes/sunset";
import "./MyMap.css";
import InfoWindowComp from "../InfoWindowComp/InfoWindowComp";
import { ThemeProvider } from "styled-components";
import { useOnClickOutside } from "../../hooks";
import { GlobalStyles } from "../../global";
import { theme } from "../../theme";
import { Burger, Menu } from "../../Components";
import FocusLock from "react-focus-lock";
import useWindowDimensions from "../../useWindowDimensions";
import * as d3Collection from "d3-collection";
import capitalize from "capitalize-the-first-letter";

import Filter from "./Filter/Filter";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PushPinIcon from "@mui/icons-material/PushPin";
import { red } from "@mui/material/colors";

// import svgTest from "../../icons/bigben.svg";

const aws = require("aws-sdk");
const s3 = new aws.S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const { REACT_APP_S3_BUCKET: S3_BUCKET } = process.env;

//laptop
const mapContainerStyle = {
  width: "65vw",
  height: "60vh",
  left: "0vw",
  top: "0vh",
};

const center = {
  lat: 34.373112,
  lng: 6.252371,
};

function MyMap(props) {
  const [open, setOpen] = useState(false);
  const node = useRef();
  const menuId = "main-menu";

  useOnClickOutside(node, () => setOpen(false));

  const [libraries] = useState(["places"]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  //checking if new user
  const [newUser, setNewUser] = useState(false);
  //trips
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [countryCount, setCountries] = useState(" ");
  const [showView, changeView] = useState(true);
  const [dateView, changeDateView] = useState(false);
  // Inputs
  const [startDate, setStart] = useState("");
  const [endDate, setEnd] = useState("");
  const [ratingInp, setRating] = useState(0);
  const [commentInp, setComment] = useState("");
  // Editing Trip Info
  const [toggleTripEdit, setToggleTripEdit] = useState(false);
  const [newStartDate, setNewStart] = useState("");
  const [newEndDate, setNewEnd] = useState("");
  const [newRating, setNewRating] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newFile, setNewFile] = useState({ name: "" });
  const [colors, setColors] = useState(null);
  const [toggleList, SetToggleList] = useState(false);

  //show info window
  const [showIW, setshowIW] = useState(true);

  //Aws
  const [file, setFile] = useState({ name: "" });
  const [fileView, setFileView] = useState(false);

  //Device type/orientation
  const { device, orientation } = useWindowDimensions();

  //filter
  const [value, setValue] = useState("");

  // toggle List Items Individually
  const [showListItem, setShowListItem] = useState([
    { id: "this is a placeholder id" },
  ]);

  const setUserColor = () => {
    if (props.user.theme === "Dark") {
      setColors(dark);
    } else if (props.user.theme === "Silver") {
      setColors(silver);
    } else if (props.user.theme === "No Labels") {
      setColors(noLabels);
    } else if (props.user.theme === "Original") {
      setColors(original);
    } else if (props.user.theme === "Sunset") {
      setColors(sunset);
    }
  };

  const getCount = () => {
    if (props.user.id) {
      axios.get(`/api/trip-count/${props.user.id}`).then((res) => {
        setCountries(res.data[0].countries);
      });
    }
  };

  // console.log(device, orientation)
  useEffect(() => {
    setUserColor();
    axios.get("/api/user").then((res) => {
      //returning users - load data off of session
      if (res.data[1][0]) {
        setNewUser(false);
        setCountries(res.data[2][0].countries);
        setMarkers(res.data[1]);
      }

      //new users
      else {
        setNewUser(true);
        setCountries(props.count[0].countries);
        setMarkers(props.markers);
      }
    });
  }, []);

  let options = {
    styles: colors,
    disableDefaultUI: true,
    zoomControl: true,
    // minZoom: 1.9,
    // maxZoom: 1.9,
    draggable: true,
    // restriction: {
    //   latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
    //   strictBounds: true,
    // },
  };

  // too (hopefully) cause less re-renders
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  let name = "";
  let city = "";
  let country = "";
  const splitUpName = (coords) => {
    const splitName = coords.address.split(", ");
    name = splitName[0];
    country = splitName.pop();
    city = splitName.pop();
  };

  // Add Markers
  const addmarker = (coordinates) => {
    console.log("coordinate types:", coordinates.types);
    if (props.user.id) {
      splitUpName(coordinates);
      axios
        .post("/api/newtrip", {
          id: props.user.id,
          name,
          city,
          country,
          type: coordinates.types[0],
          lat: coordinates.lat,
          lng: coordinates.lng,
        })
        .then((res) => {
          getCount();
          mapRef.current.panTo({ lat: coordinates.lat, lng: coordinates.lng });
          mapRef.current.setZoom(6);
          setMarkers((current) => [
            ...current,
            {
              name,
              city,
              country,
              type: coordinates.types[0],
              lat: coordinates.lat,
              lng: coordinates.lng,
              trip_id: res.data.trip_id,
            },
          ]);
        })
        .catch((err) => console.log(err));
    }
  };

  const toggle = () => {
    changeView(!showView);
    setSelected(null);
    setNewUser(false);
  };

  const toggleDateView = () => {
    changeDateView(!dateView);
  };

  const toggleFileView = () => {
    setFileView(!fileView);
  };

  // Confirm Closing of Info Window
  const confirmClose = () => {
    let result = window.confirm(
      "Are you sure you want to stop editing this trip? All your data will be lost"
    );
    if (result === true) {
      setStart("");
      setEnd("");
      setRating("");
      setComment("");
      setFile({});
      setSelected(null);
    } else if (result === false) {
      let copySelected = selected;
      let copyStart = startDate;
      let copyEnd = endDate;
      let copyRating = ratingInp;
      let copyComment = commentInp;
      setSelected(null);
      setSelected(copySelected);
      setStart(copyStart);
      setEnd(copyEnd);
      setRating(+copyRating);
      setComment(copyComment);
      setFile({});
    }
  };

  const handleClose = () => {
    startDate || endDate || ratingInp || commentInp || file.name
      ? confirmClose()
      : setSelected(null);
  };

  const handleEdit = () => {
    setToggleTripEdit(!toggleTripEdit);
    setNewStart(selected.start_date.substring(0, 10));
    setNewEnd(selected.end_date.substring(0, 10));
    setNewRating(selected.rating);
    setNewComment(selected.comment);
  };

  // Edit Trip Info
  const handleTripEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put("/api/trip", {
        trip_id: selected.trip_id,
        start_date: newStartDate,
        end_date: newEndDate,
        rating: newRating,
        comment: newComment,
        file: newFile,
      })
      .then((res) => {
        let copyMarkers = [...markers];
        for (let i = 0; i < copyMarkers.length; i++) {
          if (copyMarkers[i].trip_id === res.data.trip_id) {
            copyMarkers[i].start_date = res.data.start_date;
            copyMarkers[i].end_date = res.data.end_date;
            copyMarkers[i].rating = res.data.rating;
            copyMarkers[i].comment = res.data.comment;
            {
              newFile.name
                ? getSignedRequest(newFile)
                : console.log("no itinerary submitted");
            }
          }
        }
        setMarkers(copyMarkers);
        setToggleTripEdit(!toggleTripEdit);

        setStart("");
        setEnd("");
        setRating("");
        setComment("");
        setNewComment({});
      })
      .catch((err) => console.log(err));
  };

  // Submit Trip Info
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/tripinfo", {
        trip_id: selected.trip_id,
        startDate,
        endDate,
        ratingInp,
        commentInp,
      })
      .then((res) => {
        let copyMarkers = [...markers];
        for (let i = 0; i < copyMarkers.length; i++) {
          if (copyMarkers[i].trip_id === res.data.trip_id) {
            copyMarkers[i].start_date = res.data.start_date;
            copyMarkers[i].end_date = res.data.end_date;
            copyMarkers[i].rating = res.data.rating;
            copyMarkers[i].comment = res.data.comment;
            {
              file.name
                ? getSignedRequest(file)
                : console.log("no itinerary submitted");
            }
          }
        }
        setMarkers(copyMarkers);
        setStart("");
        setEnd("");
        setRating("");
        setComment("");
        setFile({});
      })
      .catch((err) => console.log(err));
  };

  //AWS
  const getSignedRequest = (file) => {
    const fileName = `${randomString()}-${file.name.replace(/\s/g, "-")}`;

    axios
      .get("/sign-s3", {
        params: {
          "file-name": fileName,
          "file-type": file.type,
        },
      })
      .then((response) => {
        const { signedRequest, url } = response.data;
        uploadFile(file, signedRequest, url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFile = (file, signedRequest, url) => {
    const options = {
      headers: {
        "Content-Type": file.type,
      },
    };

    axios
      .put(signedRequest, file, options)
      .then((response) => {
        axios
          .post("/api/file", { url, trip_id: selected.trip_id })
          .then((res) => {
            // console.log(res.data)
            let copyArray = [...markers];
            for (let i = 0; i < copyArray.length; i++) {
              if (selected.trip_id === copyArray[i].trip_id) {
                copyArray[i].file = res.data.file;
              }
            }
            setMarkers(copyArray);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        if (err.response.status === 403) {
          alert(
            `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${err.stack}`
          );
        } else {
          alert(`ERROR: ${err.status}\n ${err.stack}`);
        }
      });
  };

  const doNothing = () => {
    return undefined;
  };

  // Delete Markers
  const handleDelete = () => {
    if (props.user.id) {
      axios
        .delete(`/api/trip/${selected.trip_id}`)
        .then((res) => {
          //remove the trip from state and re-set state here
          let copyMarkers = [...markers];
          for (let i = 0; i < copyMarkers.length; i++) {
            if (copyMarkers[i].trip_id === selected.trip_id) {
              copyMarkers.splice(i, 1);
            }
          }
          setMarkers(copyMarkers);

          //add another axios call for count
          axios.get(`/api/trip-count/${props.user.id}`).then((response) => {
            setCountries(response.data[0].countries);
          });

          {
            selected.file ? DeleteAwsFile() : doNothing();
          }
        })
        .catch((err) => console.log(err));
      setSelected(null);
    }
  };

  let DeleteAwsFile = () => {
    const params = {
      Bucket: S3_BUCKET,
      Key: selected.file.substring(47), //pushes the file that AWS recognizes (removes https:....)
    };
    //delete the file from db
    // axios.put('/api/file', { trip_id: selected.trip_id })
    //     .then(res => console.log(res.data))
    //     .catch(err => console.log(err))

    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      // an error occurred
      else console.log(data); // successful response
      /*
            data = {
            }
            */
    });
  };

  const groupedMarkers = markers.reduce((r, a) => {
    r[a.country] = [...(r[a.country] || []), a];
    return r;
  }, {});

  // const groupedCities = Object.values(groupedMarkers).reduce((r, a) => {
  //   r[a.city] = [...(r[a.city] || []), a];
  //   return r;
  // }, {});

  const toggleListItem = (id) => {
    const index = showListItem.map((e) => e.id).indexOf(id); //check if id in array
    if (index === -1) {
      //if not in array, add to array
      setShowListItem((showListItem) => [...showListItem, { id }]);
    } else {
      let copyshowListItem = [...showListItem];
      for (let i = 0; i < copyshowListItem.length; i++) {
        if (copyshowListItem[i].id === id) {
          copyshowListItem.splice(i, 1);
        }
      }
      setShowListItem(copyshowListItem);
    }
  };

  let entries = d3Collection
    .nest()
    .key(function (d) {
      return d.country;
    })
    .key(function (d) {
      return d.city;
    })
    .key(function (d) {
      return d.type;
    })
    .entries(markers);

  console.log("entries:", entries);
  return (
    <div id="map-background">
      <div id="profile">
        <GoogleMap
          className="myMapLaptop"
          mapContainerStyle={mapContainerStyle}
          zoom={1.9}
          center={center}
          options={options}
          onLoad={onMapLoad}
          onClick={() => setshowIW(false)}
        >
          {/* if new user we are going to build a simple UI tutorial on how to use trekit */}

          {showView ? (
            <div className="AddBtn">
              {newUser ? (
                <>
                  <h2>Click to add a marker </h2>
                  <div class="arrow-1"></div>
                </>
              ) : null}

              <h2 id="AddBtn" onClick={toggle} title="Click to add trips">
                Add +
              </h2>
            </div>
          ) : (
            <div className="search-container">
              <h2 id="MinusBtnTutorial">Search for a place</h2>
              <SearchMap addmarker={addmarker} />
              <h2 title="Click to close search" id="MinusBtn" onClick={toggle}>
                -
              </h2>
            </div>
          )}

          {/* this should wait till we map through markers and convert string to array for type */}
          {markers.map((marker, i) => (
            <Marker
              key={marker.trip_id}
              title="Click to add trip info"
              position={{
                lat: +marker.lat || marker.lat,
                lng: +marker.lng || marker.lng,
              }}
              icon={{
                url: marker.icon || undefined,
                origin: new window.google.maps.Point(0, 0),
                // anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(60, 60),
              }}
              onClick={() => {
                setshowIW(true);
                setSelected(marker);
                changeView(true);
              }}
            />
          ))}

          <div className="count">
            <h2 id="countDisplay">
              Countries <br />
              <span className="countDisplay">{countryCount}</span>
            </h2>
          </div>

          {showIW && (
            <InfoWindowComp
              selected={selected}
              handleClose={handleClose}
              handleDelete={handleDelete}
              toggleTripEdit={toggleTripEdit}
              handleEdit={handleEdit}
              newStartDate={newStartDate}
              setNewStart={setNewStart}
              newEndDate={newEndDate}
              setNewEnd={setNewEnd}
              newRating={newRating}
              setNewRating={setNewRating}
              newComment={newComment}
              setNewComment={setNewComment}
              toggleFileView={toggleFileView}
              setNewFile={setNewFile}
              handleTripEditSubmit={handleTripEditSubmit}
              handleSubmit={handleSubmit}
              dateView={dateView}
              toggleDateView={toggleDateView}
              startDate={startDate}
              setStart={setStart}
              endDate={endDate}
              setEnd={setEnd}
              setRating={setRating}
              ratingInp={ratingInp}
              setComment={setComment}
              commentInp={commentInp}
              setFile={setFile}
              fileView={fileView}
              newFile={newFile}
            />
          )}
        </GoogleMap>
        <div id="list-container">
          <h4>Markers</h4>
          <input
            placeholder="Filter Cities"
            value={value}
            onChange={(e) => setValue(e.target.value.toLowerCase())}
          />

          {/* After grouping markers by country, city and type, we map here --List-- */}
          {entries
            .filter(
              (thing) =>
                thing.key.toLowerCase().includes(value) ||
                thing.values.some((values) =>
                  values.key.toLowerCase().includes(value)
                )
            )
            .map((e, i) => {
              return (
                <ul key={i} className="list">
                  {/* Looks for if id of the country key is in showListItem */}
                  <li className="countriesList">
                    {showListItem.find((item) => item.id === `${i}${e.key}`) ? (
                      <ExpandLessIcon
                        onClick={() => toggleListItem(`${i}${e.key}`)}
                      />
                    ) : (
                      <ExpandMoreIcon
                        onClick={() => toggleListItem(`${i}${e.key}`)}
                      />
                    )}
                    <span
                      className="country"
                      onClick={() => toggleListItem(`${i}${e.key}`)}
                    >
                      {e.key}
                    </span>
                  </li>

                  {/* If the country key was added (toggled) to the showListItem list, then the cities will render below.  */}
                  {showListItem.find((item) => item.id === `${i}${e.key}`)
                    ? e.values.map((ee, ii) => {
                        return (
                          <ul>
                            <li key={ii} className="citiesList">
                              {showListItem.find(
                                (item) => item.id === `${ii}${ee.key}`
                              ) ? (
                                <ExpandLessIcon
                                  onClick={() =>
                                    toggleListItem(`${ii}${ee.key}`)
                                  }
                                />
                              ) : (
                                <ExpandMoreIcon
                                  onClick={() =>
                                    toggleListItem(`${ii}${ee.key}`)
                                  }
                                />
                              )}
                              <span
                                onClick={() => toggleListItem(`${ii}${ee.key}`)}
                              >
                                {ee.key}
                              </span>
                            </li>
                            {/* If the city key was added (toggled) to the showListItem list, then the types will render below.  */}
                            {showListItem.find(
                              (item) => item.id === `${ii}${ee.key}`
                            )
                              ? e.values[ii].values.map((eee, iii) => {
                                  return (
                                    <ul>
                                      <li key={iii} className="typesList">
                                        {showListItem.find(
                                          (item) =>
                                            item.id === `${iii}${eee.key}`
                                        ) ? (
                                          <ExpandLessIcon
                                            onClick={() =>
                                              toggleListItem(`${iii}${eee.key}`)
                                            }
                                          />
                                        ) : (
                                          <ExpandMoreIcon
                                            onClick={() =>
                                              toggleListItem(`${iii}${eee.key}`)
                                            }
                                          />
                                        )}
                                        <span
                                          onClick={() =>
                                            toggleListItem(`${iii}${eee.key}`)
                                          }
                                        >
                                          {capitalize(eee.key)}
                                        </span>
                                        {/* If the types key was added (toggled) to the showListItem list, then the actual places will render below.  */}
                                      </li>
                                      {showListItem.find(
                                        (item) => item.id === `${iii}${eee.key}`
                                      )
                                        ? e.values[ii].values[iii].values.map(
                                            (eeee, iiii) => {
                                              return (
                                                <ul>
                                                  <li
                                                    key={iiii}
                                                    className="place"
                                                    onClick={() =>
                                                      setSelected(eeee)
                                                    }
                                                  >
                                                    <PushPinIcon
                                                      style={{ color: "red" }}
                                                    />
                                                    {eeee.name}
                                                    <MoreHorizIcon className="moreHoriz" />
                                                  </li>
                                                </ul>
                                              );
                                            }
                                          )
                                        : null}
                                    </ul>
                                  );
                                })
                              : null}
                          </ul>
                        );
                      })
                    : null}

                  {/* If the city key was added (toggled) to the showListItem list, then the types (places) will render below.  */}
                </ul>
              );
            })}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (reduxState) => ({
  user: reduxState.userReducer.user,
  markers: reduxState.userReducer.markers,
  count: reduxState.userReducer.count,
});

export default connect(mapStateToProps)(MyMap);
