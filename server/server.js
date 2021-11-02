var express = require("express");
var expressWs = require("express-ws");
const Canvas = require('canvas');
const path = require('path');
const fs = require('fs');
const JSZIP = require('jszip');
const zip = new JSZIP();
var app = express();
app.use(express.static('public'))
const canvas = new Canvas.Canvas(480, 480);
var ctx = canvas.getContext('2d');
expressWs(app);  //将 express 实例上绑定 websock 的一些方法
app.ws("/ws", function (ws, req) {
    ws.on("message", function (data) {
        getImages(JSON.parse(data), 20, ws);
    });
});

app.listen(3000);
console.log("Listening on port 3000...");

function descartes(nums) {
    return nums.reduce((a, b) => {
        let m = a.map(item => b.map(i => [i].concat(item)))
        return m.reduce((c, d) => c.concat(d), [])
    })
}

function getCombinationMode(imageData) {
    let imageSubs = []
    let combinationMode = [];
    for (let i = 9; i >= 0; i--) {
        let arr = [];
        let imageNames = imageData["imageName"][i]["imageName"];
        for (let j = 0; j < imageNames.length; j++) {
            arr.push(j);
        }
        if (arr.length > 0) {
            imageSubs.push(arr);
        } else {
            imageSubs.push([0]);
        }
    }
    combinationMode = descartes(imageSubs);
    return combinationMode
}



function getRepeatIndexArray(imageNames, item) {
    let indexArray = [];
    for (let i = 0; i < imageNames.length; i++) {
        if (imageNames[i] == item) {
            indexArray.push(i);
        }
    }
}
function getImages(imageData, size, ws) {
    clearCanvas(size);
    let fileId = genID(12);
    let combinationMode = getCombinationMode(imageData)
    fs.mkdirSync(`./out/${fileId}`);
    let resJson = {
        "current": "",
        "count": "",
        "data": ""
    }
    console.log(combinationMode);
    for (let j = 0; j < combinationMode.length; j++) {
        resJson["count"] = combinationMode.length;
        resJson["current"] = j;
        ws.send(JSON.stringify(resJson));
        for (let i = 9; i >= 0; i--) {
            let levelName = imageData["imageName"][i]["levelName"];
            if (imageData["image"][levelName]) {
                drawOneImage(imageData["image"][levelName][combinationMode[j][i]], size);
            }
            base64Data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ""),
                dataBuffer = new Buffer(base64Data, 'base64');
        }
        fs.writeFileSync(`./out/${fileId}/${j}out.png`, dataBuffer, function (err) {
        });
    }
    pushZip(zip, path.resolve(__dirname, `./out/${fileId}`));
    zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9
        }
    }).then(function (content) {
        fs.writeFile(path.resolve(__dirname, `./public/${fileId}.zip`), content, err => {
            if (err) throw err;
            resJson["data"] = `http://localhost:3000/${fileId}.zip`;
            ws.send(JSON.stringify(resJson));
            console.log('文件已被保存');
        });
    });
}

function changeColor(color, type) {
    let r = color.slice(1, 3);
    let g = color.slice(3, 5);
    let b = color.slice(5, 7);
    newColor1 = "#" + b + g + r;
    newColor2 = "#" + g + r + b;
    newColor3 = "#" + g + b + r;
    newColor4 = "#" + b + r + g;
    let newColorArr = [newColor1, newColor2, newColor3, newColor4];
    return newColorArr[type];
}
function genID(length) {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}
function drawOneImage(imageData, size) {
    let type = Math.round(Math.random() * 3);
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 24; j++) {
            let k = j * 24 + i;
            if (imageData['image'][k] == 1) {
                draw(imageData['color'][k], imageData['alpha'][k], i, j, size);
            }
        }
    }
}

function draw(color, alpha, positionX, positionY, size) {
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(size * positionX, size * positionY, size, size);
}

function clearCanvas(size) {
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 24; j++) {
            ctx.clearRect(size * i, size * j, size, size);
        }
    }
}






function pushZip(floder, pPath) {
    const files = fs.readdirSync(pPath, { withFileTypes: true });
    files.forEach((dirent, index) => {
        let filePath = `${pPath}/${dirent.name}`;
        if (dirent.isDirectory()) {
            let zipFloder = zip.folder(filePath.replace(`${__dirname}\\prod/`, ''));
            pushZip(zipFloder, filePath);
        } else {
            floder.file(dirent.name, fs.readFileSync(filePath));
        }
    });
}