import mapped_styles from './Yoz_Location_Mapped.module.css';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { bounds } from 'leaflet';

// Fix for default marker icon issue with bundlers like Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
          iconUrl: icon,
          shadowUrl: iconShadow,
          iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
          popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

// 1. Coordinates for Bathurst Street, Freetown, Sierra Leone
const position = [8.4875, -13.2325];

// 2. Style for the highlighted circle area
const highlightOptions = {
          color: '#686868ff',
          fillColor: '#545454ff',
          fillOpacity: 0.3,
};

export default function Yoz_Location_Mapped() {
          return (
                    <div className={mapped_styles.map_section} data-aos="zoom-in">
                              <h2 className={mapped_styles.map_title}>Find Us On The Map</h2>
                              <div className={mapped_styles.map_container}>
                                        <MapContainer center={position} zoom={17} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                                                  <Circle center={position} pathOptions={highlightOptions} radius={80} />
                                                  <Marker position={position}>
                                                            <Popup><b>Yoz Services Limited</b><br />#12 Bathurst Street, Freetown.</Popup>
                                                  </Marker>
                                        </MapContainer>
                              </div>
                    </div>
          );
}