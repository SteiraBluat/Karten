const mapsJson = "./data/maps.json";
const builderJson = "./data/builder.json";
const imgDir = "./images/maps";

var allMaps;
var allBuilders = [];

function onLoad()
{
    loadMapsAndBuilders();
}

function loadMapsAndBuilders()
{
    fetch(builderJson)
        .then(response => response.json())
        .then(data => {
            allBuilders = data;
            loadMaps();
        });
}

function loadMaps()
{
    fetch(mapsJson)
        .then(response => response.json())
        .then(data => {
            allMaps = data;
            displayMaps(data);
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
        "<div class='form-control' style='margin-bottom: 20px; height: 98%'>" +
            getMapImage(map) +
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

function getMapImage(map)
{
    return "<div style='text-align: center; margin-bottom: 10px'><img src='" + imgDir + "/" + map.id +
        ".jpg' class='mapImg' height='300px' alt='Bild'></div>";
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
    let price;

    if(map.priceWithoutAc === 0)
    {
        price = map.priceWithAc.toLocaleString("en").replaceAll(",", ".") + "$";
        result += "" +
            "<tr style='border-bottom: 3px solid #555'>" +
            "   <td>Preis mit AC:</td>" +
            "   <td>" + price + "</td>" +
            "</tr>";
    }
    else
    {
        price = map.priceWithAc.toLocaleString("en").replaceAll(",", ".") + "$";
        result += "" +
            "<tr>" +
            "   <td>Preis mit AC:</td>" +
            "   <td>" + price + "</td>" +
            "</tr>";

        price = map.priceWithoutAc.toLocaleString("en").replaceAll(",", ".") + "$";
        result += "" +
            "<tr style='border-bottom: 3px solid #555'>" +
            "   <td>Preis ohne AC:</td>" +
            "   <td>" + price + "</td>" +
            "</tr>";
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
        "<tr style='border-bottom: 3px solid #555'>" +
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
        "   <td>Quelle:</td>" +
        "   <td><a href='" + "https://" + map.creatorLink + "' target='_blank' rel='noopener noreferrer'>" +
                    map.creatorLink + "</a></td>" +
        "</tr>";
}

function showAllMaps()
{
    displayMaps(allMaps);
    toggleSearchError(false);
    changeMapsHeading("Alle Karten")
    clearSearchField();
}

function searchMap()
{
    let id = parseInt(document.getElementById("searchId").value);

    if(typeof id === "number" && !isNaN(id))
    {
        let map;

        for(let i = 0;i < allMaps.length;i++)
        {
            if(allMaps[i].id === id)
            {
                map = allMaps[i];
                break;
            }
        }

        if(map !== undefined)
        {
            let maps = [map];
            displayMaps(maps);
            toggleSearchError(false);
            changeMapsHeading("Karte mit der Nr. " + id);
        }
        else
        {
            toggleSearchError(true, "Keine Karte mit der Nr. " + id + " gefunden!");
        }
        clearSearchField();
    }
}

function changeMapsHeading(text)
{
    let heading = document.getElementById("mapsHeading");
    heading.innerHTML = text;
}

function toggleSearchError(show, text)
{
    let error = document.getElementById("searchError");
    error.innerHTML = text;
    if(show)
    {
        error.style.display = "contents";
    }
    else
    {
        error.style.display = "none";
    }
}

function clearSearchField()
{
    let field = document.getElementById("searchId");
    field.value = "";
}

function newestFirst()
{
    do
    {
        allMaps.reverse();
    }
    while(allMaps[0].id === 1);
    showAllMaps();
}

function oldestFirst()
{
    do
    {
        allMaps.reverse();
    }
    while(allMaps[0].id !== 1);
    showAllMaps();
}
