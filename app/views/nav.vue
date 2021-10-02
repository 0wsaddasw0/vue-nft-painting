<template>
  <div >
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      style="display: flex; align-items: center; height: 100px"
      router="true"
      id="nav_cmp"
    >
      <el-menu-item style="font-size: 38px; color: black" index="/"
        ><div class="logo"></div>
        NFT画师助手</el-menu-item
      >
      <el-menu-item style="font-size: 32px" index="/">画板</el-menu-item>
      <el-menu-item style="font-size: 32px" index="/opensource"
        >开源</el-menu-item
      >
      <el-menu-item style="font-size: 32px" index="/about">关于</el-menu-item>
      <el-menu-item style="color: black"
        ><i
          title="交流经验"
          @click="QRCodeDialogVisible = true"
          class="el-icon-coffee-cup"
          style="cursor: pointer; margin: 20px; font-size: 30px; color: 194d33"
        >
        </i>
      </el-menu-item>
    </el-menu>
    <el-dialog title="提示" :visible.sync="QRCodeDialogVisible" width="30%">
      <div style="display: flex; justify-content: center; align-items: center">
        <div style="width: 200px">
          <p>
            为帮助NFT画师创作，我们准备做一些工具。目前24*24像素画板已经升级为分层画板，可以帮助大家在短时间内分层组合成超多的像素图画，且先记下本站网址，后续会有更多功能^_^.
          </p>
          <p>还可扫左侧二维码，加入交流群，一起交流绘画与程序方面的经验.</p>
        </div>
        <div class="QRCodeImage"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="QRCodeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="QRCodeDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      QRCodeDialogVisible: false,
    };
  },
  mounted: function () {
    document.getElementById("nav_cmp").addEventListener("mousemove", (e) => {
      document.getElementById("box").style.opacity = 0;
    });
  },
};
</script>


<style scoped>
.logo {
  width: 58px;
  height: 58px;
  float: left;
  background: url(@img/logo.png);
  background-repeat: no-repeat;
}
.el-menu--horizontal > .el-menu-item {
  border-bottom: none;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
}

.QRCodeImage {
  width: 200px;
  height: 220px;
  background: url(@img/QR.jpg);
  background-repeat: no-repeat;
}
</style>