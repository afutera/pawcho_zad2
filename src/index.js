const {createRequire} = require("node:module")
const searequire=createRequire(__filename)
const config=searequire("./config.js")
const worldMap=searequire("./cities.js")
const http=require("http")
const url=require("url")
//Miało być małe, to bez dodatkowych zależności typu Express, samym http.

const head="<html><head><meta charset='utf8'><title>Pogoda</title></head><body>"

function showWeather(res,city){
    //Sprawdzenie,czy w tablicy jest takie miasto
    let found=worldMap.find(country=>country.cities.find((c=>c.selectId==city))!=undefined)
    if(found==undefined){
        res.writeHead(404,{'Content-Type': 'text/html'})
        res.end(head+"<h2>Błąd</h2><p>To miasto nie jest dostępne.</p></body></html>")
        return
    }
    else{
        let foundCity=found.cities.find(c=>c.selectId==city)
        http.request(`http://api.openweathermap.org/data/2.5/weather?APPID=${config.apiKey}&units=metric&lang=pl`+foundCity.apiQuery,(wres)=>{
            if(wres.statusCode==200){
                let data = ''
                wres.on('data', (chunk) => {data += chunk;});
                wres.on('end', () => {
                    weather=JSON.parse(data)
                    let text=head+`<h2>Pogoda dla miasta ${foundCity.displayName}</h2><p><ul>`;
                    for(var i in weather.weather) text+="<li>"+weather.weather[i].description+"</li>"
                    text+=`</ul><table><tr><td>Temperatura:</td><td>${weather.main.temp} &#176;C</td></tr><tr><td>Odczuwalna:</td><td>${weather.main.feels_like} &#176;C</td></tr><tr><td>Ciśnienie:</td><td>${weather.main.pressure} hPa</td></tr><tr><td>Prędkość wiatru:</td><td>${weather.wind.speed} m/s</td></tr><tr><td>Zachmurzenie:</td><td>${weather.clouds.all}%</td></tr><tr><td>Wilgotność powietrza:</td><td>${weather.main.humidity}%</td></tr></table></p>`
                    res.writeHead(200,{'Content-Type': 'text/html'})
                    res.end(text+"</body></html>");
                });
            }
            else{
                res.writeHead(500,{'Content-Type': 'text/html'})
                res.end(head+"<h2>Błąd serwera</h2><p>Błąd przy pobieraniu danych pogodowych (nieprzewidziany kod "+wres.statusCode+").</p></body></html>")
            }
        }).on("error",(err)=>{
            console.log(err);
            res.writeHead(500,{'Content-Type': 'text/html'})
            res.end(head+"<h2>Błąd serwera</h2><p>Błąd przy pobieraniu danych pogodowych.</p></body></html>")
        }).end();
    }
}
//Jeśli nie ma parametru w query stringu: wyświetlić formularz wyboru miasta
function showForm(res){
    res.writeHead(200,{'Content-Type': 'text/html'})
    var text=head+"<h2>Wybierz miasto</h2><form method='get'>Kraj:<select id='country'>"
    for(var i in worldMap){
        text+=`<option value='${worldMap[i].country}'>${worldMap[i].displayName}</option>`
    }
    text+="</select><br/>Miasto:<select id='city' name='city'>"
    for(var i in worldMap){
        for(var j in worldMap[i].cities) text+=`<option style='' class='city-${worldMap[i].country}' value='${worldMap[i].cities[j].selectId}'>${worldMap[i].cities[j].displayName}</option>`
    }
    text+="</select><br/><input type='submit' value='Wyślij'></form><script>const func=()=>{let value=document.getElementById('country').value;let cityselect=document.getElementById('city');cityselect.value='';let allcities=cityselect.getElementsByTagName('option');for(var i=0;i<allcities.length;i++)allcities[i].style.display='none';let incountry=document.getElementsByClassName('city-'+value);for(var j=0;j<incountry.length;j++)incountry[j].style.display='';};document.addEventListener('DOMContentLoaded',func);document.getElementById('country').addEventListener('change',func);</script></body></html>"
    //Skrypt powoduje, ze w drugim selecie sa widoczne tylko miasta z wybranego panstwa
    res.end(text);
}

const server=http.createServer((req,res)=>{
    let query=url.parse(req.url,true).query;
    console.log(new Date(Date.now())," - otrzymano żądanie na adres:",req.url)
    if(query==null||query.city==undefined) showForm(res)
    else showWeather(res,query.city)
});

server.listen(config.port,()=>{console.log(new Date(Date.now())," - rozwiązanie zadania 1 Aleksandry Futera nasłuchuje na porcie",config.port+".")})