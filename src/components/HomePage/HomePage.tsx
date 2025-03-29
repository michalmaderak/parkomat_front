import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import MapComponent from "../Map/map";
import { MarkerData } from "../../types/map";
import { parksApi } from "../../api/parksApi";
import { Park } from "../../types/parks";


const HomePage: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>();
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await parksApi.getAll();
        console.log(response);
        const contacts: MarkerData[] = response.map((e:Park) => ({
          id: e.id,
          popupText: e.name,
          position: [
            e.latitude,
            e.longitude
          ],
        }));
        
        
        setMarkers(contacts);
      } catch (error) {
        alert("Błąd podczas łączenia z API" + error);
      }
    };
    fetchMessage();
  }, []);
  
  return (
    <div className={styles.home}>
      <h1>Park-o-mat</h1>
      <p>Znajdź swój parking</p>
      <div className="map">{markers && <MapComponent markers={markers as MarkerData[]} />}</div>
      <div className={styles.buttons}>
      </div>
    </div>
  );
};

export default HomePage;
