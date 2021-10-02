<template>
  <div>
      <nav-cmp></nav-cmp>
      <keep-alive><router-view /></keep-alive>
      <!-- <footer-cmp></footer-cmp> -->
  </div>
</template>

<script>
import nav from '@view/nav.vue'
import footer from '@view/footer.vue'

export default {
    components: {
        "nav-cmp": nav,
        "footer-cmp":footer
    }
}
</script>
