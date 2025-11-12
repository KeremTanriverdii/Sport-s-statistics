import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faBell, faMagnifyingGlass, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../services/auth';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, RouterLink, NgClass],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header {
  magnifyingGlass = faMagnifyingGlass
  bell = faBell
  logOutSvg = faRightFromBracket
  authService = inject(AuthService)
  isDropdownOpen: boolean = false;
  private elementRef = inject(ElementRef)

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const inside = this.elementRef.nativeElement.contains(event.target);

    if (!inside && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }



  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
          photo: user.photoURL!
        });
      } else {
        this.authService.currentUserSig.set(null)
      }
      console.log(this.authService.currentUserSig())
    })
  }
}
