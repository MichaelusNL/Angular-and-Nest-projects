import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Link } from '../../../../app/interfaces/link';
import { StatsService } from '../../../../app/services/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  links: Link[] = [];

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.stats().subscribe((stats) => {
      this.links = stats;
    });
  }

  checkoutLink(code: string): string {
    return `${environment.checkoutUrl}/${code}`;
  }
}
