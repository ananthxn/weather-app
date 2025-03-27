import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "./forecast-weather.css";

const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = ["Morning", "Afternoon", "Evening", "Night"];
const PERIOD_HOURS = {
  Morning: [6, 12], 
  Afternoon: [12, 18], 
  Evening: [18, 24], 
  Night: [0, 6], 
};  

const getClosestPeriodForecast = (hourlyForecasts, period) => {
  return hourlyForecasts.reduce((closest, hourly) => {
    const hour = parseInt(hourly.dt_txt.split(" ")[1].split(":"[0]), 10);
    if (hour >= PERIOD_HOURS[period][0] && hour < PERIOD_HOURS[period][1]) {
      const periodMidpoint = (PERIOD_HOURS[period][0] + PERIOD_HOURS[period][1]) / 2;
      const currentClosestHour = closest
        ? parseInt(closest.dt_txt.split(" ")[1].split(":"[0]), 10)
        : null;

      if (!closest || Math.abs(hour - periodMidpoint) < Math.abs(currentClosestHour - periodMidpoint)) {
        return hourly;
      }
    }
    return closest;
  }, null);
};

const Forecast = ({ data }) => {
  const today = new Date().getDay();
  const forecastDays = WEEK_DAYS.slice(today).concat(WEEK_DAYS.slice(0, today));

  // Group forecast data by date and select the entry closest to 12:00 PM
  const dailyForecast = {};
  data.list.forEach((item) => {
    const [date, time] = item.dt_txt.split(" ");
    const hour = parseInt(time.split(":")[0], 10);

    if (
      !dailyForecast[date] ||
      Math.abs(hour - 12) < Math.abs(parseInt(dailyForecast[date].dt_txt.split(" ")[1].split(":")[0], 10) - 12)
    ) {
      dailyForecast[date] = item;
    }
  });

  const forecastArray = Object.values(dailyForecast).slice(0, 5);

  return (
    <>
      <label className="title">5-Day Forecast</label>
      <Accordion allowZeroExpanded>
        {forecastArray.map((item, idx) => {
          const date = item.dt_txt.split(" ")[0];
          const hourlyForecasts = data.list.filter((hourly) => hourly.dt_txt.startsWith(date));

          return (
            <AccordionItem key={idx}>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div className="daily-item">
                    <img src={`icons/${item.weather[0].icon}.png`} className="icon-small" alt="weather" />
                    <label className="day">{forecastDays[idx]}</label>
                    <label className="description">{item.weather[0].description}</label>
                    <label className="min-max">
                      {Math.round(item.main.temp_max)}°C / {Math.round(item.main.temp_min)}°C
                    </label>
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="daily-details-grid">
                  <div className="daily-details-grid-item"><label>Pressure:</label><label>{item.main.pressure} hPa</label></div>
                  <div className="daily-details-grid-item"><label>Humidity:</label><label>{item.main.humidity}%</label></div>
                  <div className="daily-details-grid-item"><label>Clouds:</label><label>{item.clouds.all}%</label></div>
                  <div className="daily-details-grid-item"><label>Wind Speed:</label><label>{item.wind.speed} m/s</label></div>
                  {item.main.sea_level && <div className="daily-details-grid-item"><label>Sea Level:</label><label>{item.main.sea_level}m</label></div>}
                  <div className="daily-details-grid-item"><label>Feels Like:</label><label>{Math.round(item.main.feels_like)}°C</label></div>
                </div>

                <div className="hourly-forecast">
                  <label className="hourly-title">Hourly Forecast</label>
                  <div className="hourly-grid">
                    {PERIODS.map((period, index) => {
                      const periodForecast = getClosestPeriodForecast(hourlyForecasts, period);
                      return periodForecast ? (
                        <div key={index} className="hourly-item">
                          <label>{period}</label>
                          <label>{Math.round(periodForecast.main.temp)}°C</label>
                          <label>Feels like: {Math.round(periodForecast.main.feels_like)}°C</label>
                        </div>
                      ) : (
                        <div key={index} className="hourly-item">
                          <label>{period}</label>
                          <label>—</label>
                          <label>—</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AccordionItemPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
};

export default Forecast;




// import React from "react";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionItemHeading,
//   AccordionItemButton,
//   AccordionItemPanel,
// } from "react-accessible-accordion";
// import "./forecast-weather.css";

// const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// const Forecast = ({ data }) => {
//   const today = new Date().getDay();
//   const forecastDays = WEEK_DAYS.slice(today).concat(WEEK_DAYS.slice(0, today));

//   // Group forecast data by date and select the entry closest to 12:00 PM
//   const dailyForecast = {};
//   data.list.forEach((item) => {
//     const [date, time] = item.dt_txt.split(" ");
//     const hour = parseInt(time.split(":")[0], 10);

//     if (!dailyForecast[date] || Math.abs(hour - 12) < Math.abs(parseInt(dailyForecast[date].dt_txt.split(" ")[1].split(":"[0]), 10) - 12)) {
//       dailyForecast[date] = item;
//     }
//   });

//   // Get 5-day forecast, ensuring only unique dates
//   const forecastArray = Object.values(dailyForecast).slice(0, 5);

//   return (
//     <>
//       <label className="title">5-Day Forecast</label>
//       <Accordion allowZeroExpanded>
//         {forecastArray.map((item, idx) => {
//           const date = item.dt_txt.split(" ")[0];
//           const hourlyForecasts = data.list.filter((hourly) => hourly.dt_txt.startsWith(date));

//           return (
//             <AccordionItem key={idx}>
//               <AccordionItemHeading>
//                 <AccordionItemButton>
//                   <div className="daily-item">
//                     <img src={`icons/${item.weather[0].icon}.png`} className="icon-small" alt="weather" />
//                     <label className="day">{forecastDays[idx]}</label>
//                     <label className="description">{item.weather[0].description}</label>
//                     <label className="min-max">
//                       {Math.round(item.main.temp_max)}°C / {Math.round(item.main.temp_min)}°C
//                     </label>
//                   </div>
//                 </AccordionItemButton>
//               </AccordionItemHeading>
//               <AccordionItemPanel>
//                 <div className="daily-details-grid">
//                   <div className="daily-details-grid-item"><label>Pressure:</label><label>{item.main.pressure} hPa</label></div>
//                   <div className="daily-details-grid-item"><label>Humidity:</label><label>{item.main.humidity}%</label></div>
//                   <div className="daily-details-grid-item"><label>Clouds:</label><label>{item.clouds.all}%</label></div>
//                   <div className="daily-details-grid-item"><label>Wind Speed:</label><label>{item.wind.speed} m/s</label></div>
//                   {item.main.sea_level && <div className="daily-details-grid-item"><label>Sea Level:</label><label>{item.main.sea_level}m</label></div>}
//                   <div className="daily-details-grid-item"><label>Feels Like:</label><label>{Math.round(item.main.feels_like)}°C</label></div>
//                 </div>

//                 <div className="hourly-forecast">
//                   <label className="hourly-title">Hourly Forecast</label>
//                   <div className="hourly-grid">
//                     {["Morning", "Afternoon", "Evening", "Night"].map((period, index) => {
//                       const periodHours = {
//                         Morning: [6, 12], // 6 AM - 11 AM
//                         Afternoon: [12, 18], // 12 PM - 5 PM
//                         Evening: [18, 24], // 6 PM - 11 PM
//                         Night: [0, 6], // 12 AM - 5 AM
//                       };

//                       // Get the closest forecast to the middle of each period
//                       const periodForecast = hourlyForecasts.find((hourly) => {
//                         const hour = parseInt(hourly.dt_txt.split(" ")[1].split(":")[0], 10);
//                         return hour >= periodHours[period][0] && hour < periodHours[period][1];
//                       });

//                       return periodForecast ? (
//                         <div key={index} className="hourly-item">
//                           <label>{period}</label>
//                           <label>{Math.round(periodForecast.main.temp)}°C</label>
//                           <label>Feels like: {Math.round(periodForecast.main.feels_like)}°C</label>
//                         </div>
//                       ) : null;
//                     })}
//                   </div>
//                 </div>

//               </AccordionItemPanel>
//             </AccordionItem>
//           );
//         })}
//       </Accordion>
//     </>
//   );
// };

// export default Forecast;
