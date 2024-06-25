import {Component, OnInit} from '@angular/core';
import {GeoSearchControl, OpenStreetMapProvider} from "leaflet-geosearch";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{

  async ngOnInit() {
    const provider = new OpenStreetMapProvider();

    // @ts-ignore
    let searchControl = new GeoSearchControl({
      provider: provider,
    });

// search
    const results = await provider.search({ query: '1234'});
  }
}
