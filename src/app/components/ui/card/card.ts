import { CommonModule, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
  standalone: true,
})
export class Card {
  @Input({ required: true }) imageUrl!: string;
  @Input({ required: false }) cardTitle!: string;
  public get DynamicStyle(): any {
    return {
      'background-image': `url('${this.imageUrl}')`
    }
  }
}
