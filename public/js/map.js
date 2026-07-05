const map = L.map('map').setView(
    [listing.geometry.coordinates[1], listing.geometry.coordinates[0]],
    13
);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

L.marker([
    listing.geometry.coordinates[1],
    listing.geometry.coordinates[0]
]).addTo(map)
.bindPopup(`<b>${listing.title}</b>`)
.openPopup();