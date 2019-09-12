import { AbstractControl, Validator } from "@angular/forms";
import * as _ from "lodash";

export function CustomValidator (control: AbstractControl) {
    let value = Number(control.value);
    let valueString = String(control.value);

    if(valueString.indexOf('.') >= 0){
        return { validQuantity: true };
    }
	else if (_.isInteger(value) ) {
        return null
	}else{
        return { validQuantity: true };
    }
}
