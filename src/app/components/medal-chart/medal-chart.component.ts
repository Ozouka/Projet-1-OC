import { Component, OnInit } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medal-chart',
  templateUrl: './medal-chart.component.html',
  styleUrls: ['./medal-chart.component.scss'],
})
export class MedalChartComponent implements OnInit {
  data: any[] = [];
  numberOfJOs: number = 0;
  numberOfCountries: number = 0;
  private olympicsSubscription!: Subscription;


  view: [number, number] = [window.innerWidth * 0.85, 300];
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendPosition: LegendPosition = LegendPosition.Below;

  constructor(private olympicService: OlympicService, private router: Router) {}
  ngOnInit(): void {
    this.olympicsSubscription = this.olympicService.getOlympics().subscribe((olympics) => {
      if (olympics) {
        this.numberOfCountries = olympics.length;
        this.numberOfJOs = olympics.reduce((acc: number, country: any) => acc + country.participations.length, 0);

        this.data = olympics.map((country: any) => ({
          name: country.country,
          value: country.participations.reduce((acc: number, participation: any) => acc + participation.medalsCount, 0),
        }));
      }
    });
  }

  onCountrySelect(e: any): void {
    const countryName = e.name;
    this.router.navigate(['/country-detail', countryName]);
  }

  ngOnDestroy(): void {
    this.olympicsSubscription.unsubscribe();
  }
}
