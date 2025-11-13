import { CommonModule, NgStyle } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { slugify } from '../../../../utils/slugify';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.css',
  standalone: true,
})
export class Card {
  @Input({ required: true }) imageUrl!: string;
  @Input({ required: false }) cardTitle!: string;
  @Input({ required: false }) linkUrl!: string;
  slugif = slugify;
  router = inject(Router);
  public get DynamicStyle(): any {
    return {
      'background-image': `url('${this.imageUrl}')`
    }
  }

  goToDetail(player: any) {
    const slug = slugify(this.cardTitle);
    this.router.navigate([`players/${slug}`], {
      state: {
        id: this.linkUrl
      }
    })
  }
}
