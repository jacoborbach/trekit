import React from 'react';
import usePlacesAutocomplete, {
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

export default function Search(props) {
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