![RUNOOB 图标](https://www.uonus.net/logo.png)

## 中文

### 介绍

NFT画师助手像素图双层画板Vue插件，喜欢的话给个Star

前后端均已开源,前端在app文件夹下，后端在server文件夹下。

### 工具网站地址

www.uonus.net 
（考虑到服务器消耗和对后面其他开源作者的激励，会收取一定的费用。如果仅仅是使用画板合成，可以考虑使用开源代码自己本机运行。）

### 本机运行
```javascript
//客户端
npm i 
npm run dev

//服务端
cd server
npm i
node server.js
```javascript

### 视频教程

https://www.bilibili.com/video/BV1gv411G7FG

### 在自己的项目中使用

```javascript
npm i vue-nft-painting
```javascript
<template>
  <div>
    <nft-painting v-bind:painting_settings="painting_settings"></nft-painting>
  </div>
</template>

<script>
import nftpainting from "vue-nft-painting";
export default {
  components: {
    "nft-painting": nftpainting,
  },
  data: function () {
    return {
      painting_settings: {
        showSelfDefine: true,
        hideOriginalButton: false,
        buttons: {
          btn1: {
            name: "按钮1",
            method: function () {
              console.log(1);
            }
          },
          btn2: {
            name: "按钮2",
            method: function () {
              console.log(2);
            }
          },
          btn3: {
            name: "按钮3",
            method: function () {
              console.log(3);
            }
          },
          btn4: {
            name: "按钮4",
            method: function () {
              console.log(4);
            }
          },
          btn5: {
            name: "按钮5",
            method: function () {
              console.log(5);
            }
          },
          btn6: {
            name: "按钮6",
            method: function () {
              console.log(6);
            }
          }
        }
      }
    }
  }
}
</script>
```
## English

### Introduction

The vue-nft-painting is a tool to help painters create NFT works

### Website address

www.uonus.net 
(A fee will be charged to account for server consumption and incentives for subsequent open source authors. If you are only using sketchpad composition, consider using open source code to run it natively.)

### Video tutorial

https://www.bilibili.com/video/BV1gv411G7FG

### Run locally
```javascript
//client
npm i 
npm run dev

//server
cd server
npm i
node server.js
```
```javascript

### Usage

```javascript
npm i vue-nft-painting
```

```javascript
<template>
  <div>
    <nft-painting v-bind:painting_settings="painting_settings"></nft-painting>
  </div>
</template>

<script>
import nftpainting from "vue-nft-painting";
export default {
  components: {
    "nft-painting": nftpainting,
  },
  data: function () {
    return {
      painting_settings: {
        showSelfDefine: true,
        hideOriginalButton: false,
        buttons: {
          btn1: {
            name: "btn1",
            method: function () {
              console.log(1);
            }
          },
          btn2: {
            name: "btn2",
            method: function () {
              console.log(2);
            }
          },
          btn3: {
            name: "btn3",
            method: function () {
              console.log(3);
            }
          },
          btn4: {
            name: "btn4",
            method: function () {
              console.log(4);
            }
          },
          btn5: {
            name: "btn5",
            method: function () {
              console.log(5);
            }
          },
          btn6: {
            name: "btn6",
            method: function () {
              console.log(6);
            }
          }
        }
      }
    }
  }
}
</script>

