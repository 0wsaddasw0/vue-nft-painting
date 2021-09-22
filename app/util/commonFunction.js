//公共方法

var commonFunction = {
    getInstance: () => {//获取vue实例
        return document.querySelector('#app').__vue__;
    },
    routerPush: (params) => {//路由跳转
        let str = '/' + params
        commonFunction.getInstance().$router.push(str)
    },
    copyToClipboard: (str) => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('复制成功')
    },
    base64ToString: (data) => {
        let toBinaryTable = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
        ];
        let base64Pad = '=';
        var result = '';
        var leftbits = 0; // number of bits decoded, but yet to be appended  
        var leftdata = 0; // bits decoded, but yet to be appended 
        // Convert one by one.                                                                             
        for (var i = 0; i < data.length; i++) {
            var c = toBinaryTable[data.charCodeAt(i) & 0x7f];
            var padding = (data.charCodeAt(i) == base64Pad.charCodeAt(0));
            // Skip illegal characters and whitespace  
            if (c == -1) continue;
            // Collect data into leftdata, update bitcount  
            leftdata = (leftdata << 6) | c;
            leftbits += 6;
            // If we have 8 or more bits, append 8 bits to the result 
            if (leftbits >= 8) {
                leftbits -= 8;
                // Append if not padding. 
                if (!padding)
                    result += String.fromCharCode((leftdata >> leftbits) & 0xff);
                leftdata &= (1 << leftbits) - 1;
            }
        }
        // If there are any bits left, the base64 string was corrupted                                      
        if (leftbits)
            throw Components.Exception('Corrupted base64 string');
        return result;
    }
}
export default commonFunction