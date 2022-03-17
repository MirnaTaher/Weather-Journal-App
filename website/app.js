/* Global Variables */
//elements to edit when we get api response
const entryHolder = document.getElementById("entryHolder");
const date = document.getElementById("date");
const temp = document.getElementById("temp");
const content = document.getElementById("content");
const formHolder= document.getElementById("formHolder");
//elements to have event listeners on them
const generate = document.getElementById("generate");
const zip = document.getElementById("zip");
let zipVal;
const feelings = document.getElementById("feelings");
let feelingsVal;
// Personal API Key for OpenWeatherMap API
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
const country = "us"; //making it a static country but it can be changed to dynamic later on
const apiKey = "a010608ea77d6e404ebb9376683e77fb&units=imperial";
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() +1+ "." + d.getDate() + "." + d.getFullYear();


// Event listener to add function to existing HTML DOM element
generate.addEventListener("click", generateResponse);
zip.addEventListener("change",(e)=>{
    zipVal= e.target.value
})
feelings.addEventListener("change",(e)=>{
    feelingsVal= e.target.value
})
/* Function called by event listener */
function generateResponse(event) {
  event.preventDefault();
    if(!zipVal || !feelingsVal){
        alert("Please enter all data");
        return;
    }
    else{
        getDataFromApi(baseURL, zipVal, apiKey).then((data)=>{
            postData("/add",{date: newDate, 
              temp: data.main.temp,
              content: feelingsVal})
        }).then(()=>{
          updateUI();
        })
    }
    formHolder.reset();
};

/* Function to GET Web API Data*/
const getDataFromApi = async (baseURL, zipCode, apiKey) => {
  const response = await fetch(
    `${baseURL}${zipCode}&appid=${apiKey}`
  );
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error", error);
  }
};
/* Function to POST data */
const postData = async (url = "", data = {}) => {
  const request = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      date: data.date,
      temp: data.temp,
      content: data.content,
    }),
  });
  try {
    const newData = await request.text();
    return newData;
  } catch (error) {
    console.error("error", error);
  }
};

/* Function to GET Project Data */
const updateUI = async ()=>{
    const request = await fetch("/all");
    try{
        const data = await request.json();
        date.innerText = `Date: ${data.date}`;
        content.innerText = `Feelings: ${data.content}`;
        temp.innerText = `Temperature: ${data.temp} °F`;
    }
    catch(error){
        console.error("error",error);
    }
}