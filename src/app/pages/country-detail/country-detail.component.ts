import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
  imports: [NgxChartsModule],
  standalone: true
})
export class CountryDetailComponent implements OnInit {
  countryName: string = '';
  numberEntries: number = 0;
  numberMedals: number = 0;
  numberAthletes: number = 0;
  private olympicsSubscription!: Subscription;

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Medals Count';
  timeline: boolean = true;

  view: [number, number] = [window.innerWidth * 0.85, 400];
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  multi: any[] = [];

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.countryName = this.route.snapshot.paramMap.get('countryName') || '';

    this.olympicsSubscription =  this.olympicService.getOlympics().subscribe((olympics: Olympic[]) => {
      if (olympics) {
        const countryData = olympics.find(country => country.country.toLowerCase() === this.countryName.toLowerCase());

        if (countryData) {
          this.numberEntries = countryData.participations.length;
          this.numberMedals = countryData.participations.reduce((total, participation) => total + participation.medalsCount, 0);
          this.numberAthletes = countryData.participations.reduce((total, participation) => total + participation.athleteCount, 0);

          this.multi = [
            {
              name: 'Medals',
              series: countryData.participations.map(participation => ({
                name: participation.year.toString(),
                value: participation.medalsCount,
              }))
            }
          ];
        } else {
          console.warn(`Le pays suivant n'a pas été trouvé : ${this.countryName}`);
        }
      }
    });
  }


  ngOnDestroy(): void {
    if (this.olympicsSubscription) {
      this.olympicsSubscription.unsubscribe();
    }
  }

}
