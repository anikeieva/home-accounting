import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[accDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  @HostListener('click') onClick() {
    this.isOpen = !this.isOpen;
  }
}
