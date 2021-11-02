import nftpainting from './views/plugin.vue';
nftpainting.install = function(Vue) {
  Vue.component(nftpainting.name, nftpainting);
};
export default nftpainting;