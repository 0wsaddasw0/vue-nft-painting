![RUNOOB 图标](https://www.uonus.net/logo.png)

## 中文

### 介绍

像素图双层画板Vue插件（前端），喜欢的话给个Star


### 使用

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

### Use

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

