// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
// import { connect } from 'react-redux'
// import { getType, getOrientation } from '../../dux/dimensionReducer'
// import './WindowDimensions.css'

// function getWindowDimensions(props) {
//     const { innerWidth: width, innerHeight: height } = window;

//     console.log(width, height)
//     return {
//         width,
//         height
//     };
// }


// export default function useWindowDimensions() {
//     const [windowDimensions, setWindowDimensions] = useState(
//         getWindowDimensions()
//     );

//     useEffect(() => {
//         function handleResize() {
//             setWindowDimensions(getWindowDimensions());
//         }

//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     return windowDimensions;
// }




// // const mapStateToProps = reduxState => ({
// //     orientation: reduxState.dimensionReducer.orientation,
// //     deviceType: reduxState.dimensionReducer.deviceType
// // })

// // export default connect(mapStateToProps)(DetectDevice)