import axios from "axios";
import { useReducer } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, info: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function App() {
  const [{ loading, info, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [currentLocation, setCurrentLocation] = useState();
  const [search, setSearch] = useState();
  const [imperial, setImperial] = useState(false);
  const [menu, setMenu] = useState(true)
  if (!currentLocation) {
    setCurrentLocation("Asuncion");
  } else {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCurrentLocation(
        position.coords.latitude.toFixed(3) +
          "," +
          position.coords.longitude.toFixed(3)
      );
    });
  }

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
      params: { q: currentLocation, days: "6" },
      headers: {
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
        "X-RapidAPI-Key": "5f1e69948cmshbcddcfc5cba4103p1e565ejsnc5be6a57a899",
      },
    };
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          dispatch({ type: "FETCH_SUCCESS", payload: response.data });
        })
        .catch(function (error) {
          console.error(error);
          dispatch({ type: "FETCH_FAIL", payload: error.message });
        });
    };
    fetchData();
  }, [currentLocation]);

  const submitSearch = (e) => {
    e.preventDefault();
    setCurrentLocation(search);
  };

  return (
    <div className="weather-container">
      {loading ? (
        <div>Cargando</div>
      ) : error ? (
        <div>Ocurrió un error</div>
      ) : (
        <div>
          <Helmet>
            <title> {info.location.name} </title>
          </Helmet>
          <nav>
            <div className={menu ? "navbar close" : "navbar open"}>
              <form onSubmit={submitSearch} >
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  className="navbar-search"
                  placeholder="Search a place"
                />
                <button className="button-search" type="submit" onClick={(()=> setMenu(!menu))}>Search</button>
              </form>

              <div className="navbar-button">
                <button onClick={() => setImperial(false)}>ºC</button>
                <button onClick={() => setImperial(true)}>ºF</button>
              </div>
            </div>
            <div className="menu-mobile" onClick={(() => setMenu(!menu))}>
            <i className={menu ? "fa fa-bars" : "fa fa-close" }></i>
            </div>
          </nav>
          <div className="weather-current">
            <div className="weather-location">
              {info.location.name}, {info.location.region}{" "}
            </div>
            <div className="weather-temperature">
              <img src={info.current.condition.icon} alt="icon" />
              <div>
                {imperial
                  ? info.current.temp_f.toFixed(0) + "ºF"
                  : info.current.temp_c.toFixed(0) + "ºC"}
              </div>
            </div>

            <div className="weather-text"> {info.current.condition.text} </div>
          </div>
          <div className="weather-highlights">
            <h2> Today's Highlights</h2>
            <div className="weather-today">
              <div className="today-box">
                <span> Feels Like</span>
                {imperial
                  ? info.current.feelslike_f.toFixed(0) + "ºF"
                  : info.current.feelslike_c.toFixed(0) + "ºC"}
              </div>
              <div className="today-box">
                <span>Wind status</span>
                {imperial
                  ? info.current.wind_mph.toFixed(0) + " mph"
                  : info.current.wind_kph.toFixed(0) + " kmh"}
              </div>
              <div className="today-box">
                <span>Visibility</span>
                {imperial
                  ? info.current.vis_miles.toFixed(1) + " mi"
                  : info.current.feelslike_c.toFixed(1) + " km"}
              </div>
              <div className="today-box">
                <span>Humidity</span>
                {info.current.humidity.toFixed(0) + "%"}
              </div>
            </div>
          </div>

          <div className="weather-highlights-small">
            <h2>Forescast</h2>
            <div className="weather-today">
              <div className="small-box">
                <span>Today</span>
                <div className="icon">
                  <img
                    src={info.forecast.forecastday[0].day.condition.icon}
                    alt="icon"
                  />
                  {imperial
                    ? info.forecast.forecastday[0].day.avgtemp_f.toFixed(0) +
                      "ºF"
                    : info.forecast.forecastday[0].day.avgtemp_c.toFixed(0) +
                      "ºC"}
                </div>

                {info.forecast.forecastday[0].day.condition.text}
              </div>
              <div className="small-box">
                <span>Tomorrow</span>
                <div className="icon">
                  <img
                    src={info.forecast.forecastday[1].day.condition.icon}
                    alt="icon"
                  />
                  {imperial
                    ? info.forecast.forecastday[1].day.avgtemp_f.toFixed(0) +
                      "ºF"
                    : info.forecast.forecastday[1].day.avgtemp_c.toFixed(0) +
                      "ºC"}
                </div>

                {info.forecast.forecastday[1].day.condition.text}
              </div>
              <div className="small-box">
                <span>Day after tomorrow</span>
                <div className="icon">
                  <img
                    src={info.forecast.forecastday[2].day.condition.icon}
                    alt="icon"
                  />
                  {imperial
                    ? info.forecast.forecastday[2].day.avgtemp_f.toFixed(0) +
                      "ºF"
                    : info.forecast.forecastday[2].day.avgtemp_c.toFixed(0) +
                      "ºC"}
                </div>
                {info.forecast.forecastday[2].day.condition.text}
              </div>
            </div>
          </div>
        </div>
      )}
      <footer>Created by sergioesc</footer>
    </div>
  );
}

export default App;
