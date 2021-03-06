import { Directive, ElementRef, Output, EventEmitter, Input, HostListener } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[detectClick]'
})

export class DetectClickDirective {
    clickIsInsideElement = false;
    active = false;
    @Output() detectClick = new EventEmitter<boolean>();

    @Input() listen(active: boolean) {
        this.active = active;
    }

    @HostListener('document:click', ['$event.target']) onClick(targetElement) {
        this.clickIsInsideElement = this.elRef.nativeElement.contains(targetElement);
        this.detectClick.emit(this.clickIsInsideElement);
    }

    constructor(private elRef: ElementRef) { }
}