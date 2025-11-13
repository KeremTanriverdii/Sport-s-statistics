import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Card } from "../../ui/card/card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Card, CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
  standalone: true,
})
export class Main {
  cards: any = signal([
    { title: 'Premier League', url: 'premierleague.png' },
    { title: 'La Liga', url: 'laliga.png' },
    { title: 'Serie A', url: 'seriea.png' },
    { title: 'NBA', url: 'nba.png' }
  ])

  cardsTeams: any = signal([
    { title: 'Fenerbahçe SK', url: 'fenerbahce.png' },
    { title: "Real Madrid", url: "madrid.png" },
    { title: 'Man United', url: "manunited.png" },
    { title: 'Boston Celtics', url: 'celtics.png' },
    // { title: 'GS Warriors', url: 'gswarriors.png' }
  ])

  cardsPlayer: any = signal([
    { title: "Cristiano Ronaldo", url: "cristiano.png" },
    { title: 'Lionel Messi', url: "messi.png" },
    { title: 'LeBron James', url: 'lebron.png' },
    { title: 'Alperen Şengün', url: 'alperen.png', linkUrl: '860' },
    { title: 'Kenan Yıldız', url: 'Kenan.png' }
  ])

}
