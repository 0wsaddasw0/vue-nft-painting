<template>
    <div>
        <div class="body">
            <div class="header">
                <div class="titleImage"></div>
                <i title="交流经验" @click="QRCodeDialogVisible = true" class="el-icon-coffee-cup" style="cursor: pointer; margin: 20px; font-size: 30px; color: 194d33">
            </i>
            </div>
            <div class="content">
                <div style="width: 550px; display: flex; justify-content: center">
                    <canvas style="border: 1px solid #dcdfe6" width="480" height="480" id="canvasPrew"></canvas>
                </div>
                <div  class = "tools" >
                    <canvas style="border: 1px solid #dcdfe6" width="480" height="480" id="myCanvas"></canvas>
                </div>
                <div>
                    <div style="margin: 20px; margin-left: 0px">
                        <el-radio-group v-model="tool">
                            <el-radio :label="1">画笔</el-radio>
                            <el-radio :label="0">橡皮</el-radio>
                            <el-radio :label="2">吸管</el-radio>
                        </el-radio-group>
                    </div>
                    <div style="margin: 20px; margin-left: 0px">
                        <sketch-picker v-model="colors" />
                    </div>
                </div>
                <div 
                class = "levelBox">
                    <el-collapse style="width: 100%" @change="chooseLevel" accordion>
                        <el-collapse-item v-for="index of 10" v-bind:key="index" :title="imageNames[index - 1]['levelName']" :name="index">
                            <div v-for="(item, key) in submitData[index - 1]" v-bind:key="key"
                            class = "imageBox" >
                                <div @click="chooseImage([index - 1, key])">
                                    <el-radio v-model="imageChoosedRadio[index - 1]" :label="key">{{ imageNames[index - 1]["imageName"][key] }}</el-radio>
                                </div>
                                <i v-if="index != 1" class="el-icon-top" title="上移一层" style="cursor: pointer" @click="moveUp([index - 1, key])">
                    </i>
                                <i v-if="index != 10" class="el-icon-bottom" title="下移一层" style="cursor: pointer" @click="moveDown([index - 1, key])">
                    </i>
                                <i class="el-icon-edit" title="修改名称" style="cursor: pointer" @click="changeName([index - 1, key])">
                    </i>
                                <i class="el-icon-delete" title="删除" style="cursor: pointer" @click="deleteImage([index - 1, key])">
                    </i>
                            </div>
                            <div style=" cursor: pointer;padding-top:10px; display: flex;justify-content:space-between ">
                                <i class="el-icon-circle-plus-outline" @click="addImage(index)">添加新图</i>
    
                                <i class="el-icon-edit" title="修改层名" @click="changeLevelName(index)">修改层名</i>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
            <div class="buttons" style="margin-top: 30px">
                <el-button @click="toCompose" plain>合成图片</el-button>
                <el-button @click="saveAsTxt" saveAsTxt plain>本地暂存</el-button>
                <el-button saveAsTxt @click="readTxt" plain><input type="file" @change="loadTextFromFile" id="txt" class="fileInputHide" />本地读取</el-button>
            </div>
        </div>
        <div class="footer"></div>
        <el-dialog title="请确认合成具有稀缺性的像素图" :visible.sync="dialogVisible" width="30%">
            <div style="height:130px">
                <div>
                    {{ tipsContent }}
                </div>
                <div v-if="isShowSlider" style="margin:10px;margin-top:30px">
                    <el-progress :percentage="completePercent"></el-progress>
                </div>
                <div v-if="isComplete" style="margin:10px;margin-top:30px"> 下载URL:<a :href="downLoadURL">{{downLoadURL}}</a> </div>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitToPost"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="QRCodeDialogVisible" width="30%">
            <div style="display: flex; justify-content: center; align-items: center">
                <div style="width: 200px">
                    <p>
                        为帮助NFT画师创作，我们准备做一些工具。目前24*24像素画板已经升级为分层画板，可以帮助大家在短时间内分层组合成超多的像素图画，且先记下本站网址，后续会有更多功能^_^.
                    </p>
                    <p>还可扫左侧二维码，加入画师交流群，一起交流绘画经验.</p>
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
import { Swatches, Chrome, Sketch } from "vue-color";
export default {
    components: {
        "chrome-picker": Chrome,
        "sketch-picker": Sketch,
        "swatches-picker": Swatches,
    },
    data: function() {
        return {
            isShowSlider: false,//是否显示生成图片的进度条 Whether to display the progress bar of the generated picture
            downLoadURL: "",//下载图片压缩包的URL Download the URL of the image compression package
            isComplete: false,//是否完成图片生成 Whether to complete the image generation
            completePercent: 0,//生成图片完成百分比 Percentage of complete picture generation
            imageComposeValue: 0,//需要生成的图片数目 The number of pictures that need to be generated
            imageComposeMaxValue: 0,//需要生成的最多的图片数目 The maximum number of pictures that need to be generated
            dialogVisible: false,//合成图像对话框  Composite image dialog
            QRCodeDialogVisible: false,//二维码对话框  QR code dialog
            canvas: "",//画板实例 Instance of artboards
            preCanvas: "",//画板的预览 Image preview
            ctx: null,//画板Context   Artboards context  
            preCtx: "",//画板预览Context      Image preview context 
            imageChoosed: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],//已选中图片的数据  Data of the selected picture
            imageChoosedRadio: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],//已选中图片的radio  The radio of the selected picture
            imageNames: {//各个图片的名称  The name of each picture
                0: {
                    levelName: "图层 1",
                    imageName: [],
                },
                1: {
                    levelName: "图层 2",
                    imageName: [],
                },
                2: {
                    levelName: "图层 3",
                    imageName: [],
                },
                3: {
                    levelName: "图层 4",
                    imageName: [],
                },
                4: {
                    levelName: "图层 5",
                    imageName: [],
                },
                5: {
                    levelName: "图层 6",
                    imageName: [],
                },
                6: {
                    levelName: "图层 7",
                    imageName: [],
                },
                7: {
                    levelName: "图层 8",
                    imageName: [],
                },
                8: {
                    levelName: "图层 9",
                    imageName: [],
                },
                9: {
                    levelName: "背景",
                    imageName: [],
                },
            },
            editingImage: [0, 0],//正在绘画的图片的索引  Index of the picture being drawn
            imageDataArray: [],//画板图片数据 Artboard image data
            colorDataArray: [],//画板图片颜色数据 Color data of the drawing board picture
            alphaDataArray: [],//画板图片透明度数据 Artboard image transparency data
            colors: {//取色板颜色 Pick the color of the palette
                color: "",
                hex: "#194d33",
                hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
                hsv: { h: 150, s: 0.66, v: 0.3, a: 1 },
                rgba: { r: 25, g: 77, b: 51, a: 1 },
                a: 1,
            },
            penPosition: {//画笔位置 Pen position
                x: 0,
                y: 0,
            },
            drawing: false,//绘画状态 Painting state
            isEditing: false,//图片编辑状态 Picture editing status
            tool: 1,//画图工具 Drawing tools
            zeroData: [//零矩阵数据 Zero matrix data
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
            //空图数据字符串 Data string of empty graph
            zeroString: "image:,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,color:,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,alpha:,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,",     
            submitData: {//提交或保存的数据 Submitted or saved data
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: [],
                8: [],
                9: [],
            },
            websocket: null //websocket实例     websocket instance
        };
    },
    computed: {
        tipsContent: function() {//算出一共可合成多少张图像   Calculate how many images can be combined in total
            let datasLength = [];
            for (let key in this.submitData) {
                if (key == 'imageNames') {
                    continue
                }
                if (this.submitData[key].length != 0) {
                    datasLength.push(this.submitData[key].length);
                }
            }
            function zeroToOne(num) {
                return num == 0 ? 1 : num;
            }
            function calculate(array) {
                let isZero = true;
                let sum = 1;
                for (let i = 0; i < array.length; i++) {
                    sum = zeroToOne(array[i]) * sum;
                    if (array[i] != 0) {
                        isZero = false;
                    }
                }
                return isZero ? 0 : sum;
            }

            let tipsString =
                "一共" +
                datasLength.length +
                "层图片，可以合成" +
                calculate(datasLength) +
                "张图片";
            return tipsString;
        },
    },
    created: function() {
        this.imageDataArray = JSON.parse(JSON.stringify(this.zeroData));//将空图数据赋值给画板  Assign empty image data to the drawing board
        this.colorDataArray = JSON.parse(JSON.stringify(this.zeroData));//将空图数据赋值给画板  Assign empty image data to the drawing board
        this.alphaDataArray = JSON.parse(JSON.stringify(this.zeroData));//将空图数据赋值给画板  Assign empty image data to the drawing board
        let that = this;

        function keyUp(e) {//绘图工具快捷键  Drawing tool shortcuts
            var currKey = 0,
                e = e || event;
            currKey = e.keyCode || e.which || e.charCode;
            var keyName = String.fromCharCode(currKey);
            if (currKey == 65) {
                that.tool = 1;
            }
            if (currKey == 83) {
                that.tool = 0;
            }
            if (currKey == 68) {
                that.tool = 2;
            }
        }
        document.onkeyup = keyUp;
    },

    watch: {
        penPosition: function(value) {//当画笔在画版上移动时  When the brush moves on the plate
        console.log(value)
            if (!this.isEditing) {
                return;
            }
            document.querySelector("#boxSon").style.backgroundColor = this.colors.hex;
            if (this.drawing && this.tool == 1) {
                let k = value.y * 24 + value.x;
                this.imageDataArray[k] = 1;
                this.colorDataArray[k] = this.colors.hex;
                this.alphaDataArray[k] = this.colors.a;
                this.ctx.fillStyle = this.colors.hex;
                this.ctx.globalAlpha = this.colors.a;
                this.ctx.clearRect(value.x * 20, value.y * 20, 20, 20);
                this.ctx.fillRect(value.x * 20, value.y * 20, 20, 20);
            } else if (this.drawing && this.tool == 0) {
                let k = value.y * 24 + value.x;
                this.imageDataArray[k] = 0;
                this.colorDataArray[k] = 0;
                this.alphaDataArray[k] = 0;
                this.ctx.clearRect(value.x * 20, value.y * 20, 20, 20);
            } else if (this.drawing && this.tool == 2) {
                let k = value.y * 24 + value.x;
                if (this.colorDataArray[k] && this.colorDataArray[k] != 0) {
                    let inputDom = document.querySelector(
                        ".vc-editable-input>.vc-input__input"
                    );
                    inputDom.value = this.colorDataArray[k];
                    var event = new InputEvent("input");
                    inputDom.dispatchEvent(event);
                }
            } else if (!this.drawing) {}
            this.saveDrawing();
        },
    },
    mounted: function() {
        this.initCanvas();
    },
    methods: {
        submitToPost: function() {
            this.CompletePercent = 0;
            this.isShowSlider = true;
            this.initWebSocket()
        },
        toCompose() {
            let datasLength = [];
            for (let key in this.submitData) {
                if (this.submitData[key].length != 0) {
                    datasLength.push(this.submitData[key].length);
                }
            }

            function zeroToOne(num) {
                return num == 0 ? 1 : num;
            }

            function calculate(array) {
                let isZero = true;
                let sum = 1;
                for (let i = 0; i < array.length; i++) {
                    sum = zeroToOne(array[i]) * sum;
                    if (array[i] != 0) {
                        isZero = false;
                    }
                }
                // 
                return isZero ? 0 : sum;
            }

            this.imageComposeMaxValue = calculate(datasLength)
            this.imageComposeValue = this.imageComposeMaxValue

            this.dialogVisible = true;
            this.isComplete = false;
        },
        noFunc() {
            this.$message({
                message: "该功能暂未开放。",
                type: "warning",
            });
        },
        changeName(array) {
            this.$prompt("请输入图片名称", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(({ value }) => {
                this.$set(this.imageNames[array[0]]["imageName"], array[1], value);
                // this.submitData[array[0] - 1].push(this.submitData[array[0]][array[1]]);
                this.$message({
                    type: "success",
                    message: "修改成功 ",
                });
            });
        },
        changeLevelName(index) {
            if (index == 10) {
                this.$message({
                    message: "背景名称不可修改",
                    type: "warning",
                });
                return
            }
            this.$prompt("请输入层级名称", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(({ value }) => {
                this.$set(this.imageNames[index - 1], "levelName", value);
                this.$message({
                    type: "success",
                    message: "修改成功 ",
                });
            });
        },
        mouseToFlow: function(e) {
            let div = document.getElementById("box");
            let scrollLeft =
                document.body.scrollLeft || document.documentElement.scrollLeft;
            let scrollTop =
                document.body.scrollTop || document.documentElement.scrollTop;
            //IE8及以下不支持event
            let event = e || window.event;
            //IE浏览器不支持pageX,pageY
            let pageX = event.pageX || event.clientX + scrollLeft;
            let pageY = event.pageY || event.clientY + scrollTop;
            //让鼠标保持在div的正中间
            let targetX = pageX - div.offsetWidth / 2;
            let targetY = pageY - div.offsetHeight / 2;
            div.style.left =
                targetX -
                (this.canvas.getBoundingClientRect().left -
                    this.preCanvas.getBoundingClientRect().left) +
                "px";
            div.style.top = targetY + "px";
        },
        readTxt() {
            let inputDom = document.querySelector("#txt");
            var event = new InputEvent("input");
            inputDom.dispatchEvent(event);
        },
        chooseImage(array) {
            this.isEditing = false;
            this.imageDataArray = JSON.parse(JSON.stringify(this.zeroData));
            this.colorDataArray = JSON.parse(JSON.stringify(this.zeroData));
            this.alphaDataArray = JSON.parse(JSON.stringify(this.zeroData));
            this.imageChoosed[array[0]] = JSON.parse(
                JSON.stringify(this.submitData[array[0]][array[1]])
            );
            this.prewCanvas();
            this.reDrawing();
            setTimeout(() => {
                this.editImage(array);
            }, 0);
        },
        moveDown(array) {
            this.$message({
                message: "已下移该图。",
                type: "warning",
            });
            this.submitData[array[0] + 1].push(this.submitData[array[0]][array[1]]);
            this.imageNames[array[0] + 1]["imageName"].push(
                this.imageNames[array[0]]["imageName"][array[1]]
            );
            this.deleteImage(array, true);
        },
        moveUp(array) {
            this.$message({
                message: "已上移该图。",
                type: "warning",
            });
            this.submitData[array[0] - 1].push(this.submitData[array[0]][array[1]]);
            this.imageNames[array[0] - 1]["imageName"].push(
                this.imageNames[array[0]]["imageName"][array[1]]
            );
            this.deleteImage(array, true);
        },
        deleteImage(array, isMove) {
            this.isEditing = false;
            this.imageChoosed[array[0]] = -1;
            this.imageChoosedRadio[array[0]] = -1;
            this.editingImage = [0, 0];
            this.imageDataArray = JSON.parse(JSON.stringify(this.zeroData));
            this.colorDataArray = JSON.parse(JSON.stringify(this.zeroData));
            this.alphaDataArray = JSON.parse(JSON.stringify(this.zeroData));
            this.submitData[array[0]].splice(array[1], 1);
            this.imageNames[array[0]]["imageName"].splice(array[1], 1);
            this.prewCanvas();
            this.reDrawing();
            if (!isMove) {
                this.$message({
                    message: "已删除该图。",
                    type: "warning",
                });
            }
        },
        chooseLevel(index) {
            if (!index) {
                return;
            }
            if (this.imageChoosedRadio[index - 1] != -1) {
                this.editImage([index - 1, this.imageChoosedRadio[index - 1]]);
            } else {
                this.isEditing = false;
                this.imageDataArray = JSON.parse(JSON.stringify(this.zeroData));
                this.colorDataArray = JSON.parse(JSON.stringify(this.zeroData));
                this.alphaDataArray = JSON.parse(JSON.stringify(this.zeroData));
                this.prewCanvas();
                this.reDrawing();
            }
        },
        saveDrawing() {
            let txtStr = "";
            txtStr += `image:${this.imageDataArray.join(
        ","
      )}color:${this.colorDataArray.join(",")}alpha:${this.alphaDataArray.join(
        ","
      )}`;
            this.submitData[this.editingImage[0]][this.editingImage[1]] = txtStr;
            this.imageChoosed[this.editingImage[0]] = JSON.parse(
                JSON.stringify(
                    this.submitData[this.editingImage[0]][this.editingImage[1]]
                )
            );
        },
        addImage(index) {
            this.submitData[index - 1].push(this.zeroString);
            this.imageNames[index - 1]["imageName"].push(
                "图" +
                index +
                "-" +
                (this.imageNames[index - 1]["imageName"].length + 1)
            );
        },
        editImage(array) {
            this.isEditing = true;
            this.editingImage = array;
            let imageDataString = JSON.parse(
                JSON.stringify(this.submitData[array[0]][array[1]])
            );
            let choosedArr = imageDataString.split(/image:|color:|alpha:/);
            this.imageDataArray = choosedArr[1].split(",");
            this.colorDataArray = choosedArr[2].split(",");
            this.alphaDataArray = choosedArr[3].split(",");
            this.prewCanvas();
            this.reDrawing();
        },
        initCanvas() {
            this.canvas = document.getElementById("myCanvas");
            this.preCanvas = document.getElementById("canvasPrew");
            this.ctx = this.canvas.getContext("2d");
            this.preCtx = this.preCanvas.getContext("2d");
            let isWhite = false;
            for (let i = 0; i < 24; i++) {
                isWhite = !isWhite;
                for (let j = 0; j < 24; j++) {
                    isWhite = !isWhite;
                    this.ctx.fillStyle = isWhite ? "#0113015E" : "#FFFFFF";
                    this.ctx.fillRect(20 * i, 20 * j, 20, 20);
                }
            }
            this.canvas.addEventListener("mousemove", (e) => {
                if (!this.isEditing) {
                    return;
                }
                var cRect = this.canvas.getBoundingClientRect();

                var canvasX = Math.round(e.clientX - cRect.left);
                var canvasY = Math.round(e.clientY - cRect.top);
                if (canvasX > 0 && canvasX < 480 && canvasY > 0 && canvasY < 480) {
                    this.calculationLocation(canvasX, canvasY);
                    this.mouseToFlow(e);
                }
            });
            this.canvas.addEventListener("mousedown", (e) => {
                if (!this.isEditing) {
                    this.$message({
                        message: "需要创建并选择一张图才能进行绘画——1.点击右侧图层。2.添加新图。3.选择图片进行绘画。",
                        type: "warning",
                    });
                    return;
                }
                this.drawing = true;
                var cRect = this.canvas.getBoundingClientRect();
                var canvasX = Math.round(e.clientX - cRect.left);
                var canvasY = Math.round(e.clientY - cRect.top);
                if (canvasX > 0 && canvasX < 480 && canvasY > 0 && canvasY < 480) {
                    this.calculationLocation(canvasX, canvasY);
                }
            });

            this.canvas.addEventListener("mouseup", (e) => {
                if (!this.isEditing) {
                    return;
                }
                this.prewCanvas();
                this.reDrawing();
                this.saveDrawing();
                this.drawing = false;
            });
            this.preCanvas.addEventListener("mousedown", (e) => {
                this.$message({
                    message: "此处显示图像，右侧才是画板",
                    type: "warning",
                });
            });
        },
        prewCanvas() {
            for (let i = 0; i < 24; i++) {
                for (let j = 0; j < 24; j++) {
                    this.preCtx.clearRect(20 * i, 20 * j, 20, 20);
                }
            }
            for (let p = 9; p >= 0; p--) {
                if (this.imageChoosed[p] == -1) {
                    continue;
                }
                let choosedArr = this.imageChoosed[p].split(/image:|color:|alpha:/);
                let imageDataArrayTemp = choosedArr[1].split(",");
                let colorDataArrayTemp = choosedArr[2].split(",");
                let alphaDataTemp = choosedArr[3].split(",");
                for (let i = 0; i < 24; i++) {
                    for (let j = 0; j < 24; j++) {
                        let k = j * 24 + i;
                        if (imageDataArrayTemp[k] == 1) {
                            this.preCtx.fillStyle = colorDataArrayTemp[k];
                            this.preCtx.globalAlpha = alphaDataTemp[k];
                            this.preCtx.fillRect(20 * i, 20 * j, 20, 20);
                        }
                    }
                }
            }
        },
        updateValue(value) {
            console.log(this.color);
        },
        reDrawing() {
            let isWhite = false;
            let k = 0;
            for (let i = 0; i < 24; i++) {
                isWhite = !isWhite;
                for (let j = 0; j < 24; j++) {
                    isWhite = !isWhite;
                    let k = j * 24 + i;
                    if (this.imageDataArray[k] == 1) {
                        this.ctx.fillStyle = this.colorDataArray[k];
                        this.ctx.globalAlpha = this.alphaDataArray[k];
                        this.ctx.clearRect(20 * i, 20 * j, 20, 20);
                        this.ctx.fillRect(20 * i, 20 * j, 20, 20);
                    } else {
                        this.ctx.fillStyle = isWhite ? "#0113015E" : "#FFFFFF";
                        this.ctx.globalAlpha = 1;
                        this.ctx.clearRect(20 * i, 20 * j, 20, 20);
                        this.ctx.fillRect(20 * i, 20 * j, 20, 20);
                    }
                }
            }
        },
        calculationLocation(x, y) {
            this.penPosition = { x: parseInt(x / 20), y: parseInt(y / 20) };
        },
        genNonDuplicateID: function(randomLength) {
            return Number(
                Math.random().toString().substr(3, randomLength) + Date.now()
            ).toString(36);
        },
        saveAsTxt: function() {
            let txtStr = "";
            this.submitData["imageNames"] = this.imageNames;
            txtStr += JSON.stringify(this.submitData);
            console.log(txtStr);
            var date = new Date();
            this.download("新格式图片数据" + date.getTime() + ".txt", txtStr);
        },
        saveAsPNG() {
            var canvasElement = this.preCanvas;
            var MIME_TYPE = "image/png";
            var imgURL = canvasElement.toDataURL(MIME_TYPE);
            var dlLink = document.createElement("a");
            dlLink.download = "图片";
            dlLink.href = imgURL;
            dlLink.dataset.downloadurl = [
                MIME_TYPE,
                dlLink.download,
                dlLink.href,
            ].join(":");
            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
            this.$message({
                message: "正在下载图片，但是注意,这个仅仅是图片，而不是可读取的图片数据",
                type: "warning",
            });
        },
        loadTextFromFile(e) {
            const file = e.target.files[0];
            let name = file.name.split(".").splice(-1).toString();
            if (name !== "txt") {
                this.$message({
                    message: "文件类型错误,请重新选择文件",
                    type: "warning",
                });
                return;
            }
            let reader = new FileReader();
            if (typeof FileReader === "undefined") {
                this.$message({
                    message: "您的浏览器不支持",
                    type: "warning",
                });
            }
            reader.onload = (e) => {
                try {
                    this.submitData = JSON.parse(reader.result);
                } catch (error) {
                    this.$message({
                        message: "文件数据格式错误,请重新选择文件",
                        type: "warning",
                    });
                    return;
                }
                if (this.submitData["imageNames"]) {
                    this.imageNames = this.submitData["imageNames"];
                } else {
                    for (let i in this.submitData) {
                        let k = parseInt(i) + 1;
                        this.imageNames[i]["levelName"] = "图层 " + k;
                        for (let j = 0; j < this.submitData[i].length; j++) {
                            this.imageNames[i]["imageName"][j] = "图" + k + "-" + (j + 1);
                        }
                    }
                }
                this.imageDataArray = JSON.parse(JSON.stringify(this.zeroData));
                this.colorDataArray = JSON.parse(JSON.stringify(this.zeroData));
                this.alphaDataArray = JSON.parse(JSON.stringify(this.zeroData));
                this.isEditing = false;
                this.imageChoosed = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
                this.imageChoosedRadio = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
                this.prewCanvas();
                this.reDrawing();
            };
            reader.readAsText(file, "utf-8");
        },
        loadTextFromFileNew(e) {
            const file = e.target.files[0];
            let name = file.name.split(".").splice(-1).toString();
            if (name !== "txt") {
                this.$message({
                    message: "文件类型错误,请重新选择文件",
                    type: "warning",
                });
                return;
            }
            let reader = new FileReader();
            if (typeof FileReader === "undefined") {
                this.$message({
                    message: "您的浏览器不支持",
                    type: "warning",
                });
            }
            reader.onload = (e) => {
                try {
                    this.submitData = this.dataJsonToString(
                        JSON.parse(reader.result)["image"]
                    );
                    this.imageNames = this.dataJsonToString(
                        JSON.parse(reader.result)["imageName"]
                    );
                } catch (error) {
                    this.$message({
                        message: "文件数据格式错误,请重新选择文件",
                        type: "warning",
                    });
                    return;
                }
                this.imageDataArray = JSON.parse(JSON.stringify(this.zeroData));
                this.colorDataArray = JSON.parse(JSON.stringify(this.zeroData));
                this.alphaDataArray = JSON.parse(JSON.stringify(this.zeroData));
                this.isEditing = false;
                this.imageChoosed = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
                this.imageChoosedRadio = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
                this.prewCanvas();
                this.reDrawing();
            };
            reader.readAsText(file, "utf-8");
        },
        download(filename, text) {
            var pom = document.createElement("a");
            pom.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," + encodeURIComponent(text)
            );
            pom.setAttribute("download", filename);
            if (document.createEvent) {
                var event = document.createEvent("MouseEvents");
                event.initEvent("click", true, true);
                pom.dispatchEvent(event);
            } else {
                pom.click();
            }
        },
        dataStringToJson(dataString) {
            let imageData = dataString;
            let resultData = {};
            for (let i in imageData) {
                if (i == 'imageNames') {
                    continue;
                }
                for (let j in imageData[i]) {
                    let tempData = {
                        image: "",
                        color: "",
                        alpha: "",
                    };
                    if (imageData[i][j] == "" || !imageData[i][j]) {
                        continue;
                    }
                    let choosedArr = imageData[i][j].split(/image:|color:|alpha:/);
                    tempData["image"] = choosedArr[1].split(",");
                    tempData["color"] = choosedArr[2].split(",");
                    tempData["alpha"] = choosedArr[3].split(",");
                    if (tempData["image"].length > 0) {
                        tempData["image"].pop();
                        tempData["image"].pop();
                    }
                    if (tempData["color"].length > 0) {
                        tempData["color"].pop();
                        tempData["color"].pop();
                    }
                    if (tempData["alpha"].length > 0) {
                        tempData["alpha"].pop();
                        tempData["alpha"].pop();
                    }
                    if (!tempData) {}
                    let nameIndex =
                        "" + this.imageNames[parseInt(i)]["levelName"].replace(/\s*/g, "");
                    if (!resultData[nameIndex]) {
                        resultData[nameIndex] = [];
                    }
                    resultData[nameIndex].push(tempData);
                }
            }
            return resultData;
        },
        dataJsonToString(dataJson) {
            let imageData = dataJson;
            for (let i in imageData) {
                for (let j in imageData[i]) {
                    let tempDataString = "";
                    tempDataString +=
                        "image:," + imageData[i][j]["image"].toString() + ",";
                    tempDataString +=
                        "color:," + imageData[i][j]["color"].toString() + ",";
                    tempDataString +=
                        "alpha:," + imageData[i][j]["alpha"].toString() + ",";
                    imageData[i][j] = tempDataString;
                }
            }
            return imageData;
        },
        initWebSocket() {
            const ws = "wss://uonus_images_download.coltstail.net/ws"
            // const ws = "ws://192.168.31.164:8086/ws"

            this.websocket = new WebSocket(ws)
            this.websocket.onopen = this.onOpenWebsocket
            this.websocket.onerror = this.onErrorWebsocket
            this.websocket.onclose = this.onCloseWebsocket
            this.websocket.onmessage = this.onMessageWebsocket
        },
        onOpenWebsocket() {
            let txtJson = JSON.stringify({
                image: this.dataStringToJson(this.submitData),
                imageName: this.removeSpace(this.imageNames),
            });
            console.log(txtJson)
            // txtJson['image']
            this.websocket.send(txtJson)
        },
        removeSpace() {
            let newNames = JSON.parse(JSON.stringify(this.imageNames));
            for (let key in newNames) {
                newNames[key]['levelName'] = newNames[key]['levelName'].replace(/\s*/g, "")
            }
            return newNames
        },
        onErrorWebsocket() {
            console.log("连接失败!")
        },
        onCloseWebsocket() {
            console.log("连接关闭!")
        },
        onMessageWebsocket(message) {
            // this.completePercent = message;
            if (message.data) {
                console.log(message)
                if (JSON.parse(message.data)['data']) {
                    this.isComplete = true;
                    this.isShowSlider = false;
                    this.downLoadURL = JSON.parse(message.data)['data']
                } else {
                    this.completePercent = JSON.parse(message.data)['current'] / JSON.parse(message.data)['count'] * 100
                }
            }
        }
    }
};
</script>

<style scoped>
.header {
    height: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sidebar {
    width: 20%;
    display: flex;
    align-items: center;
}

.content {
    height: 550px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.footer {
    height: 10%;
}

.buttons {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.imageList {
    display: flex;
    justify-content: center;
}

.upload-demo /deep/ .el-upload-dragger {
    padding: 30px;
    height: 250px;
    width: 300px;
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #f5f5f5;
}

.titleImage {
    width: 780px;
    height: 200px;
    margin-top: 60px;
    background: url(@img/title2.jpg);
    background-repeat: no-repeat;
}

.QRCodeImage {
    width: 200px;
    height: 220px;
    background: url(@img/QR.jpg);
    background-repeat: no-repeat;
}

.fileInputHide {
    opacity: 0;
    font-size: 0;
    position: absolute;
    width: 96px;
    height: 40px;
    transform: translate(-20%, -30%);
    cursor: pointer;
}

.tools{
  height: 550pxpx;
  width: 550px;
  display: flex;
  justify-content: center;
  margin: 20px;
}

.levelBox{
  min-width: 100px;
  width: 200px;
  height: 600px;
  margin-top: 120px;
  margin-left: 20px;
  overflow: auto;
}

.imageBox{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-right: 10px;
}
</style>

 