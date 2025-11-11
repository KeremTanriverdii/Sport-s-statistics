import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./components/layout/sidebar/sidebar";
import { Header } from "./components/layout/header/header";
import { HomeComponent } from "./components/home/home";
import { Main } from "./components/layout/main/main";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header, HomeComponent, Main],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  protected readonly title = signal('sports-info');
}
