import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import "./InfoWindowComp.css";
import svgTest from "../../icons/bigben.svg";

export default function InfoWindowComp(props) {
  const {
    selected,
    handleClose,
    handleDelete,
    toggleTripEdit,
    handleEdit,
    newStartDate,
    setNewStart,
    newEndDate,
    setNewEnd,
    newRating,
    setNewRating,
    newComment,
    setNewComment,
    toggleFileView,
    setNewFile,
    handleTripEditSubmit,
    handleSubmit,
    dateView,
    toggleDateView,
    startDate,
    setStart,
    endDate,
    setEnd,
    setRating,
    ratingInp,
    commentInp,
    setComment,
    setFile,
    fileView,
  } = props;

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  const images = importAll(
    require.context(`../../icons/USA/SVG`, false, /\.svg$/)
  );

  return (
    <div>
      {selected ? (
        <InfoWindow
          // anchor={{ lat: 30, lng: 30 }}
          options={{
            disableAutoPan: true,
            pixelOffset: new window.google.maps.Size(100, 30),
          }}
          position={{ lat: +selected.lat, lng: +selected.lng }}
          onCloseClick={() => {
            handleClose();
          }}
        >
          {selected.start_date ||
          selected.end_date ||
          selected.rating ||
          selected.comment ? (
            <>
              <h2 className="formName">
                {selected.name || selected.city + ", " + selected.country}
              </h2>
              <button onClick={handleDelete} className="deleteBtn">
                Delete
              </button>

              {/* Displaying Trip Info */}
              {!toggleTripEdit ? (
                <div>
                  <div className="alignTripInfoLeft">
                    <p>
                      Start Date:{" "}
                      <span>{selected.start_date.substring(0, 10)}</span>
                    </p>

                    <p>
                      End Date:{" "}
                      <span>{selected.end_date.substring(0, 10)}</span>
                    </p>

                    <div className="ratingContainer">
                      <p>Rating</p>
                      <div className="rating">
                        <input
                          id="star5"
                          name={5}
                          type="radio"
                          className="radio-btn hide"
                          checked={+selected.rating === 5}
                          disabled="disabled"
                        />
                        <label htmlFor="star5">☆</label>
                        <input
                          id="star4"
                          name={4}
                          type="radio"
                          className="radio-btn hide"
                          checked={+selected.rating === 4}
                          disabled="disabled"
                        />
                        <label htmlFor="star4">☆</label>
                        <input
                          id="star3"
                          name={3}
                          type="radio"
                          className="radio-btn hide"
                          checked={+selected.rating === 3}
                          disabled="disabled"
                        />
                        <label htmlFor="star3">☆</label>
                        <input
                          id="star2"
                          name={2}
                          type="radio"
                          className="radio-btn hide"
                          checked={+selected.rating === 2}
                          disabled="disabled"
                        />
                        <label htmlFor="star2">☆</label>
                        <input
                          id="star1"
                          name={1}
                          type="radio"
                          className="radio-btn hide"
                          checked={+selected.rating === 1}
                          disabled="disabled"
                        />
                        <label htmlFor="star1">☆</label>
                        <div className="clear"></div>
                      </div>
                    </div>

                    <p className="question">Notes: </p>
                    <span>{selected.comment}</span>
                  </div>

                  <br />

                  {selected.file ? (
                    <>
                      <div className="alignTripInfoLeft">
                        <div>Files:</div>
                        <a
                          href={selected.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Itinerary
                        </a>
                      </div>
                      <br />
                      {/* <button onClick={DeleteAwsFile}>Delete AWS File</button> */}

                      <button onClick={handleEdit}>Edit</button>
                      <br />
                      <br />
                    </>
                  ) : (
                    <>
                      <button onClick={handleEdit}>Edit</button>
                      <br />
                      <br />
                    </>
                  )}
                </div>
              ) : (
                <>
                  <label>Start Date:</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStart(e.target.value)}
                  />

                  <br />
                  <br />

                  <label>End Date:</label>
                  <input
                    id="endDateInp"
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEnd(e.target.value)}
                  />
                  <br />
                  <br />

                  <label>Rating:</label>
                  <input
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                  />

                  {/* Text Area */}
                  <h3 id="review">Review</h3>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    maxLength="1250"
                    rows="4"
                    cols="20"
                  />
                  <br />
                  <br />

                  <div>
                    {!fileView ? (
                      <p id="cutPadding" onClick={toggleFileView}>
                        Add an Itinerary+
                      </p>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/png, .doc, .docx, image/jpeg"
                          onChange={(e) => {
                            setNewFile(e.target.files[0]);
                          }}
                        />
                        <span onClick={toggleFileView}>Dont Add</span>
                      </>
                    )}
                  </div>
                  <br />

                  <button onClick={handleEdit}>Back</button>
                  <button id="EditTripSubmit" onClick={handleTripEditSubmit}>
                    Submit
                  </button>

                  <br />
                  <br />
                </>
              )}
            </>
          ) : (
            // Add Trip Info
            <>
              <form onSubmit={handleSubmit}>
                <button onClick={handleDelete} className="deleteBtn">
                  Delete
                </button>
                <h2 className="formName">
                  {selected.name || selected.city + ", " + selected.country}
                </h2>
                <div className="tripInfoForm">
                  {!dateView ? (
                    <h3 onClick={toggleDateView} id="review">
                      Add dates{" "}
                      <span id="plus" title="Click to add Dates">
                        +
                      </span>
                    </h3>
                  ) : (
                    <div className="dumbclass">
                      {/* Trip Dates */}
                      {/* <DateInput
                name="date"
                placeholder="Date"

                iconPosition="left"

            /> */}
                      <label>Start Date:</label>
                      <input
                        type="date"
                        placeholder="dd/mm/yyyy"
                        pattern="(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)"
                        required
                        value={startDate}
                        onChange={(e) => setStart(e.target.value)}
                      />
                      <br />

                      <label>End Date:</label>
                      <input
                        id="endDateInp"
                        type="date"
                        placeholder="dd/mm/yyyy"
                        pattern="(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)"
                        required
                        value={endDate}
                        onChange={(e) => setEnd(e.target.value)}
                      />

                      <br />
                      <p
                        onClick={toggleDateView}
                        id="back"
                        title="Click to go back to 'Add Dates' view"
                      >
                        Back
                      </p>
                    </div>
                  )}

                  {/* Star Rating */}
                  <div className="ratingContainer">
                    <h3 className="question">Rating</h3>
                    <div className="rating">
                      <input
                        onChange={(e) => setRating(e.target.name)}
                        id="star5"
                        name={5}
                        type="radio"
                        value={ratingInp}
                        className="radio-btn hide"
                        checked={+ratingInp === 5}
                      />
                      <label htmlFor="star5">☆</label>
                      <input
                        onChange={(e) => setRating(e.target.name)}
                        id="star4"
                        name={4}
                        type="radio"
                        value={ratingInp}
                        className="radio-btn hide"
                        checked={+ratingInp === 4}
                      />
                      <label htmlFor="star4">☆</label>
                      <input
                        onChange={(e) => setRating(e.target.name)}
                        id="star3"
                        name={3}
                        type="radio"
                        value={ratingInp}
                        className="radio-btn hide"
                        checked={+ratingInp === 3}
                      />
                      <label htmlFor="star3">☆</label>
                      <input
                        onChange={(e) => setRating(e.target.name)}
                        id="star2"
                        name={2}
                        type="radio"
                        value={ratingInp}
                        className="radio-btn hide"
                        checked={+ratingInp === 2}
                      />
                      <label htmlFor="star2">☆</label>
                      <input
                        onChange={(e) => setRating(e.target.name)}
                        id="star1"
                        name={1}
                        type="radio"
                        value={ratingInp}
                        className="radio-btn hide"
                        checked={+ratingInp === 1}
                      />
                      <label htmlFor="star1">☆</label>
                      <div className="clear"></div>
                    </div>
                  </div>

                  {/* Text Area */}
                  <h3 id="review">Review</h3>
                  <textarea
                    value={commentInp}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength="1250"
                    rows="4"
                    cols="20"
                  />
                  <br />

                  {/* Custom Pin */}
                  <h3>Customize Marker:</h3>

                  <div id="customizeIcon">
                    {Object.keys(images).map(function (key, index) {
                      return (
                        <img
                          className="customizeIcon"
                          src={images[key].default}
                          height={50}
                          width={50}
                          // key={index}
                        />
                      );
                    })}
                  </div>

                  {/* <img src={images["test.svg"].default} /> */}

                  <br />

                  {/* AWS */}
                  <span>Submit Itinerary: </span>
                  <input
                    type="file"
                    accept="image/png, .doc, .docx, image/jpeg"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                  <br />
                </div>
                <input type="submit" />
              </form>
            </>
          )}
        </InfoWindow>
      ) : null}
    </div>
  );
}
