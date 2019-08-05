import { Directive, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[focusFirstInvalidField]'
})
export class FocusFirstInvalidFieldDirective {

    constructor(private el: ElementRef) { }
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

    @HostListener('submit')
    onFormSubmit() {

        const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
        console.log(invalidElements);
        if (invalidElements.length > 0) {
            let invalidE = invalidElements[0].querySelector('mat-select');
            let invalidI = invalidElements[0].querySelector('input');
            if (invalidE) {
                invalidE.focus();
            } else if (invalidElements[2] && (invalidE = invalidElements[2].querySelector('mat-expansion-panel'))) {
                if (invalidE) {
                    let index = invalidE.getAttribute('id');
                    this.ngModelChange.emit(index);
                    let invalidA = invalidE.querySelector('input');
                    if (invalidA) {
                        setTimeout(() => {
                            invalidA.focus();
                        }, 200);
                    }
                }
            } else if (invalidI) {
                invalidI.focus();
            }

        }
    }
}