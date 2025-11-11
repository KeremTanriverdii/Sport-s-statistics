import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "../layout/sidebar/sidebar";
import { Header } from "../layout/header/header";

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class HomeComponent {

}
