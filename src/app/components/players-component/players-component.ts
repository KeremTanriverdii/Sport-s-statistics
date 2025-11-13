import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-players-component',
  imports: [],
  templateUrl: './players-component.html',
  styleUrl: './players-component.css',
})
export class PlayersComponent {
  private route = inject(ActivatedRoute);
  playerSlug = this.route.snapshot.paramMap.get('id');
  routeData = this.route.snapshot.data;
  ngOnInit() {

    // this.http.get(`https://v1.basketball.api-sports.io/players/${this.x}`, {
    //   headers: {
    //     'x-rapidapi-key': `${environment.apiSportsKey}`
    //   }
    // }).subscribe((res: any) => {
    //   this.playersSig.set(res.response)
    // })

    console.log(this.playerSlug, this.routeData);
  }
}
