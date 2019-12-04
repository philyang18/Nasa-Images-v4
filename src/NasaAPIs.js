// const API_KEY = "RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0";
// const API_KEY = "BfzfbPpRYn7O5rafnhT7BMOC0hUoEV54ybVwWe1a";
const API_KEY = "PBViMuqFzfpvcXjqnmC6jYR4pqkNbyC0jNUy95Sh";
export async function fetchRover(date) {
  try {
    const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${API_KEY}`);
    // const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&camera=MAHLI&api_key=RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0`);
    const json = await response.json();
    return json.photos;
  } catch {
    return 0;
  }
}
export async function fetchAPOD(date){
  var response;
  if (!date) {
    response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&hd=true`);
  } else {
    response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}&hd=true`);
  }
  const json = await response.json();
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