import "./current-weather.css";

const CurrentWeather = ({ data }) => {
    return (
        <div className="weather">

            <div className="top">
                <div>
                    <p className="city"> {data.city} </p>
                    <p className="weather-description"> {data.weather[0].description}</p>
                </div>
                <img alt="weather icon" className="weather-icon" src={`icons/${data.weather[0].icon}.png`} />
            </div>

            <div className="bottom">
                <p className="temperature"> {Math.round(data.main.temp)}°C</p>

                <div className="details">

                    <div className="parameter-row">
                        <span className="parameter-label-details"> Details </span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label">Wind</span>
                        <span className="parameter-value">{data.wind.speed} m/s</span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label">Humidity</span>
                        <span className="parameter-value">{data.main.humidity}%</span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label">Pressure</span>
                        <span className="parameter-value">{data.main.pressure} hPa</span>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default CurrentWeather;

// eslint-disable-next-line no-lone-blocks
{/* <div className="temperature">
<p className="temperature-value"> 20</p>
<p className="temperature-unit">°C</p>
</div>
<div className="feels-like">
<p>Feels like</p>
<p> 18°C</p>
</div> */}