export function elt(tagName, properties, ...children) {
    // Tạo element
    const ele = document.createElement(tagName);

    // Gắn thuộc tính lên trên element
    if (properties) {
        for (const prop of Object.entries(properties)) {
            const [key, value] = prop;

            // Kiểm tra thuộc tính có tồn tại trong element hay không
            if (key in ele) {
                ele[key] = value;

            } else {
                ele.setAttribute(key, value)
            }

        }

    }

    // append chỉ chấp nhận là một element

    if (Array.isArray(children)) {
        children.forEach((child) => {
            ele.append(child);
        });
    } else {
        if (children) {
            ele.append(children);
        }
    }

    return ele;
}

//Kiểm tra chuỗi có dính liền với số hay không?
export const checkDigitAndLetter = (str) => {
    if (!/\d/.test(str)) {
        // Nếu không có số trong chuỗi, trả về true
        return false;
    }

    const words = str.split('');
    for (let i = 0; i < words.length - 1; i++) {
        const currentChar = words[i].slice(-1);
        const nextChar = words[i + 1][0];
        console.log(currentChar,nextChar)
        if (/\s/.test(currentChar) || /\s/.test(nextChar)){
            continue;
        }
        if((isLetter(currentChar) && isDigit(nextChar)) || (isDigit(currentChar) && isLetter(nextChar))){
            return true
        }
    }
    return false;
}

const isLetter = (char) => {
    return /[a-zA-Z]/.test(char);
}

const isDigit = (char) => {
    return /\d/.test(char);
}
