import axios from 'axios'

const getWeather = (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
  return axios.get(url).then((response) => response.data)
}

export default { getWeather }
