import { GlobalModel } from './model/global.model';
import { ApiService } from './Api/api.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  global: boolean;
  country: string;
  data: GlobalModel;
  dailyData: any[];
  countries: any[];
  lineChartData: any[] = [
    {
      data: [65, 52, 12, 54], label: 'tempLabel'
    }
  ];
  lineChartType = 'line';
  lineChartLabel: any[] = [
    'Label01', 'Label02', 'Label03'
  ];
  barChartType = 'bar';
  barChartLabel: any[] = [
    'Infected', 'Recovered', 'Deaths'
  ];
  barChartData: any[] = [
    {
      data: [51, 123, 32, 54],
      label: 'Label'
    }
  ]

  constructor(public api: ApiService) {
    this.data = new GlobalModel();
  }

  ngOnInit(): void {
    this.global = true;
    this.fetchData();
    this.fetchCountries();
    this.fetchDailyData();
  }

  fetchData() {
    this.api.fetchData().subscribe((res: any[]) => {
      this.data.confiremd = res['confirmed']['value'];
      this.data.recovered = res['recovered']['value'];
      this.data.deaths = res['deaths']['value'];
      this.data.lastupdate = res['lastUpdate'];
    });
  }

  fetchCountries() {
    this.api.fetchCountries().subscribe((res: any[]) => {
      var countries = res['countries'];
      this.countries = countries.map((name) => name['name']);
    })
  }

  fetchDataCountry(country: string) {
    this.api.fetchDataByCountry(country).subscribe((res: any[]) => {
      this.data.confiremd = res['confirmed']['value'];
      this.data.recovered = res['recovered']['value'];
      this.data.deaths = res['deaths']['value'];
      this.data.lastupdate = res['lastUpdate'];

      this.barChartData = [
        {
          data: [this.data.confiremd, this.data.recovered, this.data.deaths],
          label: "orang"
        }
      ]
    })
  }

  fetchDailyData() {
    this.api.fetchDailyData().subscribe((res: any[]) => {
      this.lineChartLabel = res.map((date) => date['reportDate']);

      var infectedData = res.map((confiremd) => confiremd['totalConfirmed']);
      var deaths = res.map((deaths) => deaths['deaths']['total']);
      var recovered = res.map((rev) => rev);

      this.lineChartData = [
        {
          data: infectedData,
          label: "Terinfeksi"
        },
        {
          data: deaths,
          label: "Meninggal"
        },
      ]
    })
  }

  countryChanged(value: string) {
    this.country = value;
    if (value == 'global') {
      this.fetchData();
      this.global = true;
    } else {
      this.fetchDataCountry(value);
      this.global = false;
    }
  }



}
