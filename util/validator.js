import { checkDigitAndLetter } from "./utils.js";
export class Validator {
    constructor(value) {
        this.value = value;
        this.message = "";
    }

    require(message = 'Không được bỏ trống') {
        if (this.message) return this;

        if (this.value.trim().length === 0) {
            this.message = message
        }

        return this;
    }

    checkDesc(message = 'Yêu cầu nhập không quá 30 từ') {
        if (this.message) return this;
        let regex = /^(\S+\s*){1,30}$/;

        if (!regex.test(this.value)) {
            this.message = message;
        }
        return this;
    }

    checkName1(message = "Yêu cầu không được chứa ký tự đặc biệt") {
        if (this.message) return this;

        let regex =/^[0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/

        if (!regex.test(this.value)) {
            this.message = message;
        }
        return this;
    };

    checkName2(message = "Yêu cầu không được bắt đầu là số") {
        if (this.message) return this;

        let regex =/^[^0-9].*$/

        if (!regex.test(this.value)) {
            this.message = message;
        }
        return this;
    };

    checkName3(message = "Số không được dính liền vào chữ"){
        if (this.message) return this;

        if(checkDigitAndLetter(this.value)){
            this.message = message
        }
        return this;
    }

    checkImageURL(message = "Hãy nhập vào 1 đường dẫn hợp lệ"){
        if (this.message) return this;

        let regex =/(http(s?):)*([/|.|\w|\s|-])*\.(?:jpg|svg|png)/

        if (!regex.test(this.value)) {
            this.message = message;
        }
        return this; 

    }

    
    checkPrice(message = "Nhập vào 1 số nguyên dương") {
        if (this.message) return this;

        let regexSalary = /^[1-9]\d*$/

        if (!regexSalary.test(this.value)) {
            this.message = message;
        }
        return this;
    }

    max(valueMax, message) {
        if (this.message) return this;
        if (Number(this.value) > valueMax) {
            this.message = "Không được lớn hơn số " + valueMax;
        }
        return this;
    }

    getMessage() {
        return this.message;
    };
}


