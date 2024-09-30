var map = L.map('map').setView([17.970927, 83.533639], 14); // Centered on India with lower zoom

        // OpenStreetMap base layer
        var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        // Stadia Satellite layer
        var Stadia_AlidadeSatellite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'jpg'
        });

        // Terrain layer
        var St = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        });

        // GeoServer WMS ortho photo
        var orthoPhoto = L.tileLayer.wms("http://localhost:8080/geoserver/chinnapally/wms", {
            layers: 'chinnapally:Chinnipalem',
            format: 'image/png',
            transparent: true,
            attribution: "GeoServer"
        });

        var baseMaps = {
            'OSM': osmLayer,
            'Satellite': Stadia_AlidadeSatellite,
            'Terrain': St,
            'Ortho Photo': orthoPhoto
        };

        L.control.layers(baseMaps).addTo(map);

        osmLayer.addTo(map); // Load OSM by def

// Event listener to display latitude and longitude of the mouse pointer
map.on('mousemove', function(e) {
    var lat = e.latlng.lat.toFixed(5);  // Get latitude and round it
    var lng = e.latlng.lng.toFixed(5);  // Get longitude and round it

    // Update the display div with the current lat and lng
    document.getElementById('latlngDisplay').innerHTML = `Lat: ${lat}, Lng: ${lng}`;
});

// Initialize the measure tool and add it to the map on the top right
L.control.measure({
    position: 'topright',
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'meters',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'hectares',
    activeColor: '#FF0000',
    completedColor: '#FF0000'
}).addTo(map);

// Store GeoJSON layers
var geojsonLayers = {
    cadastrial: {},
    electricity: {},
    lulc: {},
    transportation: {},
    water:{},
    buildup:{},
    
};

// Store label layers
var labelLayers = {
    cadastrial: {},
    electricity: {},
    lulc: {},
    transportation: {},
    water:{},
    buildup:{},
    
};

// Simulate the folders and files
var folders = {
    cadastrial: ['Survey_Boundary.geojson', 'Village_Boundary.geojson', 'Hissa_Map.geojson'],
    electricity: ['Electric_Mast.geojson', 'Electric_Pole.geojson', 'High_Tension_Line.geojson', 'High_Tenstion_Tower.geojson'],
    lulc: ['Barren_Land.geojson', 'Buildup_Area.geojson', 'Cultivation_Land.geojson', 'Open_Area.geojson', 'Railway_Land.geojson', 'Under_Pass.geojson', 'Water_Body.geojson'],
    transportation: ['Asphalt_Road.geojson', 'Concrete_Road.geojson', 'Mud_Road.geojson', 'Railway_Track.geojson'],
    water:['Hand_Pump.geojson','Overhead_Tank.geojson','Streams.geojson','Well.geojson'],
    buildup: ['Buildings.geojson',  'Hut.geojson', 'Misc.geojson', 'Shed.geojson', 'Temple.geojson', ] // New buildup folder

};

// Define zoom levels for labels
const labelZoomLevels = {
    'Survey_Boundary': { minZoom: 14, maxZoom: 18 },
    'Village_Boundary': { minZoom: 12, maxZoom: 18 },
    // Add more layers and their corresponding zoom levels as needed
};

// Define styles for each individual layer
function getLayerStyle(layerName) {
    const styles = {
        'Asphalt_Road': { color: '#FF5733', weight: 2, opacity: 1 },
        'Concrete_Road': { color: '#3498DB', weight: 2, opacity: 1 },
        'Mud_Road': { color: '#8E44AD', weight: 2, opacity: 1 },
        'Railway_Track': { color: '#2ECC71', weight: 2, opacity: 1 },
        'Survey_Boundary': { color: '#E74C3C', weight: 2, opacity: 1 },
        'Village_Boundary': { color: '#D35400', weight: 2, opacity: 1 },
        'Hissa_Map': { color: '#C0392B', weight: 2, opacity: 1 },
        'Electric_Mast': { color: '#1ABC9C', weight: 2, opacity: 1 },
        'Electric_Pole': { color: '#F1C40F', weight: 2, opacity: 1 },
        'High_Tension_Line': { color: '#34495E', weight: 2, opacity: 1 },
        'High_Tenstion_Tower': { color: '#9B59B6', weight: 2, opacity: 1 },
        'Barren_Land': { color: '#AAB7B8', weight: 2, opacity: 1 },
        'Buildup_Area': { color: '#7D3C98', weight: 2, opacity: 1 },
        'Cultivation_Land': { color: '#27AE60', weight: 2, opacity: 1 },
        'Open_Area': { color: '#F39C12', weight: 2, opacity: 1 },
        'Water_Body': { color: '#2980B9', weight: 2, opacity: 1 },
        'Under_Pass': { color: '#D35400', weight: 2, opacity: 1 },
        'Hand_Pump': { color: '#D35400', weight: 2, opacity: 1 },
        'Overhead_Tank': { color: '#D35400', weight: 2, opacity: 1 },
        'Streams': { color: '#0000ff', weight: 2, opacity: 1 },
        'Well': { color: '#0000ff', weight: 2, opacity: 1 },
        'Buildings': { color: '#654321', weight: 2, opacity: 1 },
        //'Culvert': { color: '#0000ff', weight: 2, opacity: 1 },
        'Hut': { color: '#9400D3', weight: 2, opacity: 1 },
        'Misc': { color: '#D5006D', weight: 2, opacity: 1 },
        'Shed': { color: '#B8860B', weight: 2, opacity: 1 },
        'Temple': { color: '#0000ff', weight: 2, opacity: 1 },
        //'UC_Building': { color: '#0000ff', weight: 2, opacity: 1 },
    };

    return styles[layerName] || { color: '#000000', weight: 2, opacity: 1 };
}

// Function to add labels to GeoJSON layers
function addLabelsToLayer(geoJsonLayer, labelProperty, layerName) {
    const labels = [];
    geoJsonLayer.eachLayer(function (layer) {
        const properties = layer.feature.properties;
        const centroid = layer.getBounds().getCenter(); // Get the centroid of the polygon

        // Create a divIcon with the label property as text
        const labelIcon = L.divIcon({
            className: 'label-icon',
            html: `<div>${properties[labelProperty]}</div>`,
            iconSize: [5, 10],
            iconAnchor: [10, 5] // Adjust size based on your needs
        });

        // Create a marker for the label
        const labelMarker = L.marker(centroid, { icon: labelIcon });
        labels.push({ marker: labelMarker, layerName: layerName });
    });
    return labels;
}

// Function to dynamically load and create checkboxes in dropdowns
function loadGeoJSONFiles(folder) {
    const container = document.getElementById(`${folder}-layers`);
    container.innerHTML = ''; // Clear existing checkboxes
    let groupBounds = L.latLngBounds(); // To store the combined bounds of all layers

    const promises = folders[folder].map(file => {
        const layerName = file.split('.')[0];
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = layerName;
        checkbox.checked = (layerName === 'Village_Boundary');
        checkbox.addEventListener('change', () => updateLayerVisibility(folder, layerName));

        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(layerName));
        container.appendChild(label);

        // Load the GeoJSON layer asynchronously
        return fetch(`${folder}/${file}`)
            .then(response => response.json())
            .then(data => {
                // Apply the style based on the layer name
                const layerStyle = getLayerStyle(layerName);

                // Define onEachFeature to bind popups to each feature
                // Define onEachFeature to bind popups to each feature
                function onEachFeature(feature, layer) {
                    let popupContent = "";
                
                    // Hissa Map GeoJSON: Display Survey No, District, Mandal, Village Name, Owner, and Area
                    if (feature.properties.Layer === "Hissa Boundary") {
                        popupContent += "<b>Hissa Map Details:</b><br>";
                        if (feature.properties.Hissa_No) {
                            popupContent += `<b>Hissa No:</b> ${feature.properties.Hissa_No}<br>`;
                        }
                        if (feature.properties.District) {
                            popupContent += `<b>District:</b> ${feature.properties.District}<br>`;
                        }
                        if (feature.properties.Mandal) {
                            popupContent += `<b>Mandal:</b> ${feature.properties.Mandal}<br>`;
                        }
                        if (feature.properties.Village_Na) {
                            popupContent += `<b>Village:</b> ${feature.properties.Village_Na}<br>`;
                        }
                        if (feature.properties.Owner) {
                            popupContent += `<b>Owner:</b> ${feature.properties.Owner}<br>`;
                        }
                        if (feature.properties.O_Area) {
                            popupContent += `<b>Area (Acres):</b> ${feature.properties.O_Area}<br>`;
                        }
                
                    // Survey GeoJSON: Display Village Name, Survey Number, and Area in Sqm
                    } else if (feature.properties.hasOwnProperty("Survey_No")) {
                        popupContent += "<b>Survey Details:</b><br>";
                        if (feature.properties.Village_Na) {
                            popupContent += `<b>Village:</b> ${feature.properties.Village_Na}<br>`;
                        }
                        if (feature.properties.Survey_No) {
                            popupContent += `<b>Survey Number:</b> ${feature.properties.Survey_No}<br>`;
                        }
                        if (feature.properties.Area_Sqm) {
                            popupContent += `<b>Area (sqm):</b> ${feature.properties.Area_Sqm}<br>`;
                        }
                
                    // Village Boundary GeoJSON: Display Village Name only
                    } else if (feature.properties.hasOwnProperty("Area_Sqkm")) {
                        popupContent += "<b>Village Boundary Details:</b><br>";
                        if (feature.properties.Village_Na) {
                            popupContent += `<b>Village:</b> ${feature.properties.Village_Na}<br>`;
                        }
                
                    // For other layers: Display only the layer name
                    } else {
                        popupContent += `<b>Layer:</b> ${feature.properties.LAYER || feature.properties.Layer}`;
                    }
                
                    // Bind the popup content to the layer
                    layer.bindPopup(popupContent);
                }
                

                // Create the GeoJSON layer
                geojsonLayers[folder][layerName] = L.geoJSON(data, {
                    style: layerStyle,
                    onEachFeature: onEachFeature, // Bind popups to each feature
                    pointToLayer: function (feature, latlng) {
                        let iconUrl;
                        switch (layerName) {
                            case 'Electric_Mast':
                                iconUrl = 'https://cdn4.iconfinder.com/data/icons/energy-and-power-1-5/512/29-1024.png'; // Replace with actual open-source icon URL
                                break;
                            case 'Electric_Pole':
                                iconUrl = 'https://cdn-icons-png.flaticon.com/512/7248/7248318.png'; // Replace with actual open-source icon URL
                                break;
                            case 'High_Tension_Line':
                                iconUrl = 'https://example.com/icons/high-tension-line.png'; // Replace with actual open-source icon URL
                                break;
                            case 'High_Tenstion_Tower':
                                iconUrl = 'https://cdn1.iconfinder.com/data/icons/energy-and-construction/128/energy_construction_power_line_generation_electrical_grid_electricity_tower-512.png'; // Replace with actual open-source icon URL
                                break;
                            case 'Hand_Pump':
                                iconUrl = 'https://cdn3.iconfinder.com/data/icons/oil-industry-40/504/Hand-pump-water-supply-well-512.png'; // Replace with actual open-source icon URL
                                break;
                            case 'Overhead_Tank':
                                iconUrl = 'https://cdn-icons-png.flaticon.com/512/1574/1574996.png'; // Replace with actual open-source icon URL
                                break;
                            default:
                                iconUrl = 'https://example.com/icons/default.png'; // Replace with a default icon if needed
                            
                        }
                        const icon = L.icon({
                            iconUrl: iconUrl,
                            iconSize: [24, 24], // Adjust size as needed
                            iconAnchor: [12, 24], // Adjust anchor point
                        });
                        return L.marker(latlng, { icon: icon });
                    }
                });

                // Update the bounds to include this layer's bounds
                const layerBounds = geojsonLayers[folder][layerName].getBounds();
                groupBounds.extend(layerBounds);

                // Add labels conditionally based on layer type
                if (layerName === 'Survey_Boundary') {
                    labelLayers[folder][layerName] = addLabelsToLayer(geojsonLayers[folder][layerName], 'Survey_No', layerName);
                } else if (layerName === 'Village_Boundary') {
                    labelLayers[folder][layerName] = addLabelsToLayer(geojsonLayers[folder][layerName], 'Village_Na', layerName);
                }

                // Set initial visibility based on checkbox state
                updateLayerVisibility(folder, layerName);
            })
            .catch(error => console.error('Error loading GeoJSON: ', error));
    });

    // After all layers are loaded, fit map bounds
    Promise.all(promises).then(() => {
        if (groupBounds.isValid() && folder !== 'buildup') {
            map.fitBounds(groupBounds); // Only fit bounds for other folders
        }
    });
    
}


// Function to update layer and label visibility
function updateLayerVisibility(folder, layerName) {
    const checkbox = document.getElementById(layerName);
    const isChecked = checkbox.checked;

    if (isChecked) {
        geojsonLayers[folder][layerName].addTo(map); // Add layer to map
        if (labelLayers[folder][layerName]) {
            labelLayers[folder][layerName].addTo(map); // Add labels if present
        }
    } else {
        map.removeLayer(geojsonLayers[folder][layerName]); // Remove layer from map
        if (labelLayers[folder][layerName]) {
            map.removeLayer(labelLayers[folder][layerName]); // Remove labels if present
        }
    }
}

// Function to update label visibility based on zoom level and layer visibility
function updateLabelVisibility() {
    const zoom = map.getZoom();
    for (const folder in labelLayers) {
        for (const layerName in labelLayers[folder]) {
            const labels = labelLayers[folder][layerName];
            const zoomLevel = labelZoomLevels[layerName];

            // Check if the layer is visible
            const isLayerVisible = map.hasLayer(geojsonLayers[folder][layerName]);
            
            if (zoomLevel && zoom >= zoomLevel.minZoom && zoom <= zoomLevel.maxZoom) {
                // Only add labels if the corresponding layer is visible
                if (isLayerVisible) {
                    labels.forEach(({ marker }) => map.addLayer(marker));
                }
            } else {
                // Always remove labels when zoom level is not within range
                labels.forEach(({ marker }) => map.removeLayer(marker));
            }
        }
    }
}

// Add zoom event listener to handle label visibility
map.on('zoomend', updateLabelVisibility);

// Initial call to update label visibility based on the current zoom level
updateLabelVisibility();

// Other functions like loadGeoJSONFiles remain unchanged


// Toggle dropdown visibility on button click
document.querySelectorAll('.dropbtn').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
});

// Load all layers
loadGeoJSONFiles('cadastrial');
loadGeoJSONFiles('electricity');
loadGeoJSONFiles('lulc');
loadGeoJSONFiles('transportation');
loadGeoJSONFiles('water');
loadGeoJSONFiles('buildup');



// Global variable to store the loaded GeoJSON data
let hissaGeoJsonData;
 
// Function to extract unique owners from the GeoJSON
function getUniqueOwners(geojsonData) {
    const owners = new Set();
    geojsonData.features.forEach(feature => {
        if (feature.properties.Owner) {
            owners.add(feature.properties.Owner);
        }
    });
    return Array.from(owners);
}
 
// Global variable to store the filtered layer
let filteredLayer = null; // Global variable for the filtered layer
 
// Function to populate the dropdown with owner names and add search functionality
// Function to populate the dropdown with owner names and add search functionality
function populateOwnerDropdown(owners) {
    const ownerDropdownContainer = document.getElementById('ownerDropdownContainer'); // Assuming you have a container div for dropdown and search
    ownerDropdownContainer.innerHTML = ''; // Clear existing content

    // Add search box
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search Owner...';
    searchBox.id = 'ownerSearchBox';
    ownerDropdownContainer.appendChild(searchBox);

    // Add a <ul> for displaying suggestions
    const suggestionList = document.createElement('ul');
    suggestionList.id = 'suggestionList';
    ownerDropdownContainer.appendChild(suggestionList);

    // Function to update suggestions based on search input
    function updateSuggestions(searchTerm) {
        suggestionList.innerHTML = ''; // Clear current suggestions

        // Filter owners based on search term
        const filteredOwners = owners.filter(owner => 
            owner.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Show filtered owners as suggestions
        filteredOwners.forEach(owner => {
            const listItem = document.createElement('li');
            listItem.textContent = owner;
            listItem.classList.add('suggestion-item');
            
            // When an item is clicked, populate the search box and hide suggestions
            listItem.addEventListener('click', function() {
                searchBox.value = owner; // Set clicked owner in the search box
                suggestionList.innerHTML = ''; // Clear suggestions
                filterByOwner(owner); // Filter map by the selected owner
            });
            suggestionList.appendChild(listItem);
        });

        // If no results, show "No matches found"
        if (filteredOwners.length === 0) {
            const noResultItem = document.createElement('li');
            noResultItem.textContent = 'No matches found';
            suggestionList.appendChild(noResultItem);
        }
    }

    // Event listener for live search
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value;
        updateSuggestions(searchTerm); // Update suggestions as the user types
    });

    // Initial population of suggestions (with all owners)
    updateSuggestions('');
}

// Initialize the dropdown and populate suggestions
initializeHissaMapDropdown();

 
// Function to display the summary table of properties and the total area for the selected owner
function displayOwnerSummaryTable(filteredFeatures) {
    const ownerSummaryContainer = document.getElementById('ownerSummaryContainer').querySelector('tbody');
    ownerSummaryContainer.innerHTML = ''; // Clear the summary container
 
    // Calculate total area for the selected owner
    const ownerTotalArea = filteredFeatures.reduce((total, feature) => {
        return total + (parseFloat(feature.properties.RoR_AreaAC) || 0);
    }, 0);
 
    // Calculate the total area of all features (all owners)
    const totalAreaAllOwners = hissaGeoJsonData.features.reduce((total, feature) => {
        return total + (parseFloat(feature.properties.RoR_AreaAC) || 0);
    }, 0);
 
    // Calculate area of all other owners combined
    const othersTotalArea = totalAreaAllOwners - ownerTotalArea;
 
    // Create and append rows for the summary
    const ownerRow = createSummaryRow('Owner', filteredFeatures[0]?.properties.Owner || 'N/A');
    const totalAreaRow = createSummaryRow('Total Area', `${ownerTotalArea.toFixed(2)} Acres`);
    ownerSummaryContainer.appendChild(ownerRow);
    ownerSummaryContainer.appendChild(totalAreaRow);
 
    // Call the function to render the comparison chart
    renderOwnerComparisonChart(ownerTotalArea, othersTotalArea);
}
 
// Function to create a summary row
function createSummaryRow(label, value) {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    labelCell.textContent = label;
    const valueCell = document.createElement('td');
    valueCell.textContent = value;
    row.appendChild(labelCell);
    row.appendChild(valueCell);
    return row;
}
 
// Function to render the comparison chart using Chart.js
function renderOwnerComparisonChart(ownerArea, othersArea) {
    const ctx = document.getElementById('ownerChart').getContext('2d');
   
    // Destroy previous chart if exists
    if (window.ownerChartInstance) {
        window.ownerChartInstance.destroy();
    }
 
    // Create a new pie chart
    window.ownerChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Selected Owner', 'Other Owners'],
            datasets: [{
                label: 'Property Area Comparison',
                data: [ownerArea, othersArea],
                backgroundColor: ['#FFD700', '#87CEEB'], // Gold for selected owner, blue for others
                hoverOffset: 4
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} Acres`;
                        }
                    }
                }
            }
        }
    });
}
 
// Function to display the owner names and areas near the selected owner
// Global array to keep track of nearby owner layers
let nearbyOwnerLayers = [];

// Global array to keep track of permanently highlighted layers
let highlightedNearbyOwnerLayers = [];

// Function to display the owner names and areas near the selected owner
function displayNearbyOwnersTable(nearbyFeatures) {
    const nearbyOwnersContainer = document.getElementById('nearbyOwnersContainer').querySelector('tbody');
    nearbyOwnersContainer.innerHTML = ''; // Clear previous data

    // Clear existing nearby owner layers
    nearbyOwnerLayers.forEach(layer => map.removeLayer(layer));
    nearbyOwnerLayers = []; // Reset the layers array

    // Clear highlighted nearby layers if any
    highlightedNearbyOwnerLayers.forEach(layer => map.removeLayer(layer));
    highlightedNearbyOwnerLayers = []; // Reset highlighted layers array

    // Aggregate the nearby owner areas
    const nearbyOwnerAreaMap = nearbyFeatures.reduce((acc, feature) => {
        const ownerName = feature.properties.Owner || 'Unknown';
        const area = parseFloat(feature.properties.RoR_AreaAC) || 0;
        acc[ownerName] = (acc[ownerName] || 0) + area; // Aggregate area by owner
        return acc;
    }, {});

    // If no nearby owners found, display a message
    if (Object.keys(nearbyOwnerAreaMap).length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 2; // Span across both columns
        cell.textContent = 'No nearby owners found';
        row.appendChild(cell);
        nearbyOwnersContainer.appendChild(row);
        return;
    }

    // Iterate through the aggregated areas to create table rows
    for (const [owner, totalArea] of Object.entries(nearbyOwnerAreaMap)) {
        const row = document.createElement('tr');

        // Owner name column
        const ownerCell = document.createElement('td');
        ownerCell.textContent = owner;
        row.appendChild(ownerCell);

        // Area column
        const areaCell = document.createElement('td');
        areaCell.textContent = `${totalArea.toFixed(2)} Acres`;
        row.appendChild(areaCell);

        // Append the row to the table body
        nearbyOwnersContainer.appendChild(row);

        // Create a nearby owner layer for highlighting
        const nearbyOwnerLayer = L.geoJSON(nearbyFeatures.filter(feature => feature.properties.Owner === owner), {
            style: { color: '#FF4500', weight: 2, opacity: 0.7 }, // Style for highlighting
        });

        // Add mouse events to highlight on hover
        row.addEventListener('mouseenter', () => {
            nearbyOwnerLayer.addTo(map); // Highlight the area
            nearbyOwnerLayers.push(nearbyOwnerLayer); // Store the layer for later removal
        });

        row.addEventListener('mouseleave', () => {
            map.removeLayer(nearbyOwnerLayer); // Remove the highlight
            nearbyOwnerLayers = nearbyOwnerLayers.filter(layer => layer !== nearbyOwnerLayer); // Remove from the stored layers
        });

        // Add click event to keep the layer highlighted
        row.addEventListener('click', () => {
            // Clear previously highlighted layers
            highlightedNearbyOwnerLayers.forEach(layer => map.removeLayer(layer));
            highlightedNearbyOwnerLayers = []; // Reset array

            // Add the clicked layer to the map and keep it highlighted
            nearbyOwnerLayer.addTo(map);
            highlightedNearbyOwnerLayers.push(nearbyOwnerLayer); // Store the layer
        });
    }
}

// Function to find nearby land parcels based on distance
function getNearbyParcels(selectedOwnerFeatures) {
    const nearbyDistance = 500; // Define threshold distance in meters
    const nearbyFeatures = [];

    hissaGeoJsonData.features.forEach(feature => {
        selectedOwnerFeatures.forEach(selectedFeature => {
            const distance = turf.distance(turf.centroid(selectedFeature), turf.centroid(feature), { units: 'meters' });

            // If within the threshold distance and not owned by the selected owner
            if (distance <= nearbyDistance && feature.properties.Owner !== selectedFeature.properties.Owner) {
                nearbyFeatures.push(feature);
            }
        });
    });

    return nearbyFeatures;
}

// Update filterByOwner to also find nearby owners
// Update filterByOwner to include a click event on the highlighted property
function filterByOwner(ownerName) {
    // Clear existing filtered layer if any
    if (filteredLayer) {
        map.removeLayer(filteredLayer);
    }

    // If "Show All" is selected, clear the filter and tables
    if (ownerName === 'reset') {
        if (geojsonLayers['cadastrial']['Hissa_Map']) {
            map.removeLayer(geojsonLayers['cadastrial']['Hissa_Map']); // Remove the Hissa map if visible
        }
        displayNearbyOwnersTable([]); // Clear the nearby owners table
        return;
    }

    // Get features for the selected owner
    const selectedOwnerFeatures = hissaGeoJsonData.features.filter(feature => feature.properties.Owner === ownerName);
    
    // Create a geoJSON layer with a popup showing only survey number and owner name
    filteredLayer = L.geoJSON(selectedOwnerFeatures, {
        style: { color: '#00FF00', weight: 2, opacity: 0.7 }, // Style for selected owner's area
        onEachFeature: function (feature, layer) {
            // Create the popup content
            const surveyNumber = feature.properties.Hissa_No || 'N/A'; // Adjust the property name as needed
            const owner = feature.properties.Owner || 'Unknown';

            // Bind the popup to the layer
            layer.bindPopup(`Survey Number: ${surveyNumber}<br>Owner: ${owner}`);

            // Add a click event to highlight nearby parcels
            layer.on('click', function () {
                // Highlight nearby parcels when clicking on the property
                const nearbyFeatures = getNearbyParcels([feature]);
                highlightNearbyParcels(nearbyFeatures);
            });
        }
    }).addTo(map);

    // Update summary table
    displayOwnerSummaryTable(selectedOwnerFeatures);

    // Get nearby parcels and display
    const nearbyFeatures = getNearbyParcels(selectedOwnerFeatures);
    displayNearbyOwnersTable(nearbyFeatures);
}

// Function to highlight nearby parcels
// Function to highlight nearby parcels and add popups
function highlightNearbyParcels(nearbyFeatures) {
    // Clear existing nearby owner layers
    nearbyOwnerLayers.forEach(layer => map.removeLayer(layer));
    nearbyOwnerLayers = []; // Reset the layers array

    // Iterate through nearby features and highlight them
    nearbyFeatures.forEach(feature => {
        const nearbyLayer = L.geoJSON(feature, {
            style: { color: '#FF4500', weight: 2, opacity: 0.7 }, // Style for highlighting
            onEachFeature: function (feature, layer) {
                // Create the popup content for nearby parcels
                const surveyNumber = feature.properties.SurveyNumber || 'N/A'; // Adjust the property name as needed
                const owner = feature.properties.Owner || 'Unknown';

                // Bind the popup to the layer
                layer.bindPopup(`Survey Number: ${surveyNumber}<br>Owner: ${owner}`);
            }
        }).addTo(map);

        // Store the layer for later removal
        nearbyOwnerLayers.push(nearbyLayer);
    });
}


// Initialize Hissa map dropdown without loading the map by default
function initializeHissaMapDropdown() {
    fetch('Cadastrial/Hissa_Map.geojson')
        .then(response => response.json())
        .then(data => {
            hissaGeoJsonData = data; // Store the data globally
            const owners = getUniqueOwners(data); // Extract unique owners
            populateOwnerDropdown(owners); // Populate dropdown
 
            // Set up the event listener for the owner dropdown
            const ownerDropdown = document.getElementById('ownerDropdown');
            ownerDropdown.addEventListener('change', function() {
                const selectedOwner = this.value;
                filterByOwner(selectedOwner); // Highlight land parcels for the selected owner
            });
        })
        .catch(error => console.error('Error loading Hissa GeoJSON: ', error));
}
 
// Call the function to initialize the dropdown (but not the map)
initializeHissaMapDropdown();
