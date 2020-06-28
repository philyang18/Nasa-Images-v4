const API_KEY1 = "RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0";
const API_KEY2 = "BfzfbPpRYn7O5rafnhT7BMOC0hUoEV54ybVwWe1a";
const API_KEY3 = "PBViMuqFzfpvcXjqnmC6jYR4pqkNbyC0jNUy95Sh";
export async function fetchRover(date) {
  try {
    const response1 = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${API_KEY1}`);
    // const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&camera=MAHLI&api_key=RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0`);
    var json = await response1.json();
    if(json.error){
      const response2 = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${API_KEY2}`);
    // const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&camera=MAHLI&api_key=RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0`);
      json = await response2.json();
    }
    if(json.error){
      const response3 = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${API_KEY3}`);
    // const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&camera=MAHLI&api_key=RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0`);
      json = await response3.json();
    }
    return json.photos;
  } catch {
    return 0;
  }
}
export async function fetchAPOD(date){
  var response;
  if (!date) {
    response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY1}&hd=true`);
  } else {
    response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY1}&date=${date}&hd=true`);
  }
  var json = await response.json();
  if(json.error){
    if (!date) {
      response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY2}&hd=true`);
    } else {
      response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY2}&date=${date}&hd=true`);
    }
    json = await response.json();
  }
  if(json.error){
    if (!date) {
      response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY3}&hd=true`);
    } else {
      response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY3}&date=${date}&hd=true`);
    }
    json = await response.json();
  }
	return json;
}
export async function fetchFavorites(){
  const response = await fetch('https://itp404-final-project-yangphil.herokuapp.com/api/favorites/');
  if (response.status === 200 ) {
    const json = await response.json();
    return json;
  }
  else {
    return response.status;
  } 
}

export async function fetchMarsFavorites(id){
  const response = await fetch(`https://itp404-final-project-yangphil.herokuapp.com/api/favorites/mars/${id}`);
  if (response.status === 200 ) {
    const json = await response.json();
    return json;
  }
  else {
    return response.status;
  } 
}

export async function fetchApodFavorites(id){
  const response = await fetch(`https://itp404-final-project-yangphil.herokuapp.com/api/favorites/apod/${id}`);
  if (response.status === 200 ) {
    const json = await response.json();
    return json;
  }
  else {
    return response.status;
  } 
}