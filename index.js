const mapsJson = "./data/maps.json";
const builderJson = "./data/builder.json";
const categoriesJson = "./data/categories.json";
const imgDir = "./images/maps";

var allMaps;
var allBuilders = [];
var allCategories = [];

// ToDo: Filter by categories

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
            loadCategories();
        });
}

function loadCategories()
{
    fetch(categoriesJson)
        .then(response => response.json())
        .then(data => {
            allCategories = data;
            displayMaps(allMaps);
        })
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
    return `
        <div class="form-control" style="margin-bottom: 20px; height: 98%; position: relative">
            ${getMapImage(map)}
            <table class="table table-striped">
                <tr><th colspan="2">${map.name}</th></tr>
                ${getMapId(map)}
                ${getMapPrice(map)}
                <tr><td colspan="2">
                    <button type="button" class="btn btn-secondary" data-bs-toggle="collapse" 
                    data-bs-target="#details_${map.id}" style="width: 100%">
                        Weitere Deteils Anzeigen
                    </button>
                </td></tr>
            </table>
            <div id="details_${map.id}" class="collapse col-sm-2 bg-light text-black" style="position: absolute; width: 94%; border-radius: 7px">
                <table class="table table-striped" style="width: 100%" border="3px" frame="border">
                    ${getMapCorridor(map)}
                    ${getMapCategories(map)}
                    ${getMapSize(map)}
                    ${getMapBuilders(map)}
                    ${getMapCredits(map)}
                </table>
            </div>
        </div>`;
}

function getMapImage(map)
{
    let imgUrl = imgDir + "/" + map.id + ".png";
    return "" +
        "<div style='text-align: center; margin-bottom: 10px'>" +
        "   <a href='" + imgUrl + "' target=\"_blank\" rel=\"noopener noreferrer\">" +
        "       <img src='" + imgUrl + "' class='mapImg' height='300px' alt='Bild'>" +
        "   </a>" +
        "</div>";
}

function getMapId(map)
{
    return  "" +
        "<tr>" +
        "   <td>Nr.:</td>" +
        "   <td>" + map.id + "</td>" +
        "</tr>";
}

function getMapPrice(map)
{
    let result = "";
    let price;

    if(map.priceWithoutAc === 0)
    {
        price = map.priceWithAc.toLocaleString("en").replaceAll(",", ".") + "$";
        result += "" +
            "<tr>" +
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
            "<tr>" +
            "   <td>Preis ohne AC:</td>" +
            "   <td>" + price + "</td>" +
            "</tr>";
    }
    return result;
}

function getMapCorridor(map)
{
    return `
        <tr>
            <td>Gang</td>
            <td>${map.corridor}</td>
        </tr>`
}

function getMapCategories(map)
{
    let result = ``;
    let categoriesOfMap = map.categories;

    for(let i = 0;i < categoriesOfMap.length;i++)
    {
        if(i === 0)
        {
            if(categoriesOfMap.length === 1)
            {
                result += `
                <tr style="border-bottom: 3px solid #555">
                    <td>Kategorien:</td>
                    <td>${getCategoryById(categoriesOfMap[i])}</td>
                </tr>`;
            }
            else
            {
                result += `
                <tr>
                    <td>Kategorien:</td>
                    <td>${getCategoryById(categoriesOfMap[i])}</td>
                </tr>`;
            }
        }
        else
        {
            if(i === categoriesOfMap.length - 1)
            {
                result += `
                <tr style="border-bottom: 3px solid #555">
                    <td></td>
                    <td>${getCategoryById(categoriesOfMap[i])}</td>
                </tr>`;
            }
            else
            {
                result += `
                <tr>
                    <td></td>
                    <td>${getCategoryById(categoriesOfMap[i])}</td>
                </tr>`;
            }
        }
    }
    return result;
}

function getCategoryById(id)
{
    let category;
    for(let i = 0;i < allCategories.length;i++)
    {
        if(allCategories[i].id === id)
        {
            category = allCategories[i].name;
            break;
        }
    }
    return category;
}

function getMapSize(map)
{
    let amount = map.sizeX * map.sizeY;

    return "" +
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
        "   <td>Creator:</td>" +
        "   <td>" +
        "       <a href='" + "https://" + map.creatorLink + "' target='_blank' rel='noopener noreferrer'>" +
                    map.creatorName +
        "       </a>" +
        "   </td>" +
        "</tr>" +
        "<tr>" +
        "   <td colspan=\"2\">" +
        "       <a href='" + "https://" + map.source + "' target='_blank' rel='noopener noreferrer'>" +
        "           Quelle</a>" +
        "   </td>" +
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
