<template>
  <div>
    <introduce></introduce>
    <nft-painting v-bind:painting_settings="painting_settings"></nft-painting>
  </div>
</template>

<script>
import nftpainting from "./plugin.js";
import introduce from "@view/introduce.vue";
export default {
  components: {
    "nft-painting": nftpainting,
    "introduce":introduce
  },
  data: function () {
    return {
      painting_settings: {
        showSelfDefine: true,
        hideOriginalButton: false,
        buttons: {
          btn1: {
            name: "合成图片",
            method: function () {
              console.log(334413);
            },
          },
          btn2: {
            name: "本地暂存",
            method: function () {
              console.log(331113);
            },
          },
          btn3: {
            name: "本地读取",
            method: function () {
              console.log(344443);
            },
          },
          btn4: {
            name: "查看教程",
            method: function () {
              console.log(3555333);
            },
          },
          btn5: {
            name: "自定义",
            method: function () {
              console.log(333333);
            },
          },
          btn6: {
            name: "自定义",
            method: function () {
              console.log(333333);
            },
          }
        }
      }
    }
  }
};
</script>
