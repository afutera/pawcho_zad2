//apiQuery jest zorganizowany w taki sposob, zeby w razie przejscia na api 3.0 mozna bylo latwo przejsc na wspolrzedne geograficzne
const map=[{
    country:"PL",
    displayName:"Polska",
    cities:[{
        selectId:"Warszawa",
        apiQuery:"&q=Warszawa,pl",
        displayName: "Warszawa"
    },{
        selectId:"Lublin",
        apiQuery:"&q=Lublin,pl",
        displayName: "Lublin"
    }]
},{
    country:"UK",
    displayName:"Wielka Brytania",
    cities:[{
        selectId:"London",
        apiQuery:"&q=London,uk",
        displayName: "Londyn"
    },{
        selectId:"Cardiff",
        apiQuery:"&q=Cardiff,uk",
        displayName: "Cardiff"
    }]
}]

module.exports=map;