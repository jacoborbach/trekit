export let original =
    // [
    //     {
    //         "featureType": "administrative.country",
    //         "elementType": "geometry",
    //         "stylers": [
    //             {
    //                 "visibility": "simplified"
    //             },
    //             {
    //                 "hue": "#ff0000"
    //             }
    //         ]
    //     }
    // ]
    [
        {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [
                { visibility: "off" }
            ]
        }
    ]

// This is for removing equator and date line but keeping country borders.
//For also removing country borders just write geometry instead of geometry.fill
// {
//     "featureType": "administrative",
//         "elementType": "geometry.fill",
//             "stylers": [{ "visibility": "off" }]
// },