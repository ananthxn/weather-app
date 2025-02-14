import { AsyncPaginate } from 'react-select-async-paginate';
import { useState } from 'react';
import { geoAPIoptions, geoAPIurl } from '../../api';


const Search = ({ onSearchChange }) => {

    const [search, setSearch] = useState(null);
    
    const loadOptions = (inputValue) => {
        return fetch(`${geoAPIurl}/cities?minpopulation=1000000&namePrefix=${inputValue}`, geoAPIoptions)
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                return {
                    options: response.data.map((city) => {
                        return {
                            value: `${city.latitude} ${city.longitude}`,
                            label: `${city.name}, ${city.countryCode}`
                        }
                    }),
                }
            })
            .catch((error) => {
                console.error(error);
                return { options: [] };
            });

    };

    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);

    }
    return (
        <AsyncPaginate
            placeholder="Search for a city"
            debounceTimeout={600}
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
        />
    );
}

export default Search;