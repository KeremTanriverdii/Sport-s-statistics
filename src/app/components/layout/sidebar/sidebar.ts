import { Component } from '@angular/core';
import { faBasketball, faFutbolBall, faStar, faTrophy, faUser, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-sidebar',
  imports: [FaIconComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true,
})
export class Sidebar {
  futbol = faFutbolBall;
  basket = faBasketball;
  trophy = faTrophy;
  teams = faUsersRectangle;
  player = faUser;
  favotites = faStar;
}
