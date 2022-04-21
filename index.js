const mapsJson = "/data/maps.json";
const builderJson = "/data/builder.json";
const imgDir = "/images/maps";

var allMaps;
var allBuilders;

function onLoad()
{
    loadBuilders();
    loadMaps();
}

function loadMaps()
{
    fetch(mapsJson)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            allMaps = data;
            displayMaps(data);
        });
}

function loadBuilders()
{
    fetch(builderJson)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            allBuilders = data;
        });
}

function displayMaps(maps)
{
    let content = document.getElementById("maps");
    let result;

    result = "<div class='row'>";
    for(let i = 0;i < maps.length;i++)
    {
        result += "<div class='col-sm-3'>" + mapToString(maps[i]) + "</div>"

        if((i + 1) % 4 === 0)
        {
            result += "</div><div class='row'>"
        }
    }
    result += "</div>";

    content.innerHTML = result;
}

function mapToString(map)
{
    let result = "" +
        "<div class='form-control'style='margin-bottom: 20px'>" +
        "   <table class='table table-striped'>" +
        "       <tr><th colspan=\"2\">" + map.name + "</th></tr>" +
                getMapId(map) +
                getMapPrice(map) +
                getMapSize(map) +
                getMapBuilders(map) +
                getMapCredits(map) +
        "   </table>" +
        "</div>";
    return result;
}

function getMapId(map)
{
    let result = "" +
        "<tr>" +
        "   <td>Nr.:</td>" +
        "   <td>" + map.id + "</td>" +
        "</tr>";
    return result;
}

function getMapPrice(map)
{
    let result = "";

    if(map.priceWithAc !== 0)
    {
        let price = map.priceWithAc.toLocaleString("en").replaceAll(",", ".") + "$";
        result += "" +
            "<tr>" +
            "   <td>Preis mit AC:</td>" +
            "   <td>" + price + "</td>" +
            "</tr>"
    }
    if(map.priceWithoutAc !== 0)
    {
        let price = map.priceWithoutAc.toLocaleString("en").replaceAll(",", ".") + "$";
        result += "" +
            "<tr>" +
            "   <td>Preis ohne AC:</td>" +
            "   <td>" + price + "</td>" +
            "</tr>"
    }
    return result;
}

function getMapSize(map)
{
    let amount = map.sizeX * map.sizeY;

    let result = "" +
        "<tr>" +
        "   <td>Anzahl der Karten:</td>" +
        "   <td>" + amount + "</td>" +
        "</tr>" +
        "<tr>" +
        "   <td>Höhe:</td>" +
        "   <td>" + map.sizeY + "</td>" +
        "</tr>" +
        "<tr>" +
        "   <td>Breite:</td>" +
        "   <td>" + map.sizeX + "</td>" +
        "</tr>";
    return result;
}

function getMapBuilders(map)
{
    let result = "";
    let builders = map.builderIds;

    for(let i = 0;i < builders.length;i++)
    {
        if(i === 0)
        {
            result += "" +
                "<tr>" +
                "   <td>Erbauer:</td>" +
                "   <td>" + getBuilderById(builders[i]) + "</td>" +
                "</tr>";
        }
        else
        {
            result += "" +
                "<tr>" +
                "   <td></td>" +
                "   <td>" + getBuilderById(builders[i]) + "</td>" +
                "</tr>";
        }
    }
    return result;
}

function getBuilderById(id)
{
    let builder;
    for(let i = 0;i < allBuilders.length;i++)
    {
        if(allBuilders[i].id === id)
        {
            builder = allBuilders[i].name;
            break;
        }
    }
    return builder;
}

function getMapCredits(map)
{
    return "" +
        "<tr>" +
        "   <td>Credits:</td>" +
        "   <td><a href='" + "https://" + map.creatorLink + "' target='_blank' rel='noopener noreferrer'>" +
                    map.creatorLink + "</a></td>" +
        "</tr>";
}
