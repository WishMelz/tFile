<template>
  <div class="upload" v-loading.fullscreen.lock="fullscreenLoading">
    <a href="https://github.com/WishMelz/tFile">
      <img
        style="
          position: fixed;
          top: 0px;
          right: 0px;
          border: 0px;
          width: 150px;
        "
        src="https://cdn.jsdelivr.net/gh/WishMelz/file@master/messy/614b81962449bb3430193bdd6eaa3c7f.png"
        alt="Fork me on GitHub"
      />
    </a>
    <el-row style="text-align: center">
      <el-col>
        <el-upload
          style="width: 100%"
          class="upload-demo"
          drag
          multiple
          action="/"
          :before-upload="befUpload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__text"><b>支持 ctrl + v 上传</b></div>
        </el-upload>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <div style="text-align: center; padding-bottom: 20px; font-size: 14px">
      仅支持视频和图片,以及5M的大小限制
    </div>
    <el-row style="padding: 0 30px; display: grid; place-items: center">
      <el-col :span="10" class="resimg">
        <el-input v-model="resUrl.url">
          <template slot="prepend">tFileUrl</template>
          <template slot="append">
            <el-button class="copy" @click="copy(resUrl.url)">复制</el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="10" class="resimg">
        <el-input v-model="resUrl.md">
          <template slot="prepend">Markdown</template>
          <template slot="append">
            <el-button class="copy" @click="copy(resUrl.md)">复制</el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="10" style="text-align: center; padding: 20px">
        <img
          v-if="resUrl.type == 'image'"
          class="pic"
          :src="resUrl.url"
          alt=""
        />
        <video
          controls
          style="max-width: 100%"
          v-if="resUrl.type == 'video'"
          :src="resUrl.url"
        ></video>
      </el-col>
    </el-row>
    <footer>
      <span>
        <a href="https://github.com/WishMelz/imgurl">Github图片管理系统</a>
      </span>
      |
      <span>
        <a href="https://github.com/WishMelz/tFile">TG视频/图片床</a>
      </span>
    </footer>
  </div>
</template>

<script>
import { upload } from "@/api/upload";
export default {
  data() {
    return {
      resUrl: {
        url: "",
        type: "",
        md: "",
      },
      fullscreenLoading: false,
    };
  },
  mounted() {
    let _this = this;
    document.addEventListener("paste", function (event) {
      var isChrome = false;
      if (event.clipboardData || event.originalEvent) {
        //某些chrome版本使用的是event.originalEvent
        var clipboardData =
          event.clipboardData || event.originalEvent.clipboardData;
        if (clipboardData.items) {
          // for chrome
          var items = clipboardData.items,
            len = items.length,
            blob = null;
          isChrome = true;
          for (var i = 0; i < len; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              //getAsFile() 此方法只是living standard firefox ie11 并不支持
              blob = items[i].getAsFile();
            }
          }
          if (blob !== null) {
            if (_this.fullscreenLoading) {
              return;
            }
            _this.befUpload(blob);

            //base64码显示
            // reader.onload = function (event) {
            //   // event.target.result 即为图片的Base64编码字符串
            //   var base64_str = event.target.result;
            // };
          }
        }
      }
    });
  },
  methods: {
    befUpload(file) {
      let fileType = file.type.split("/")[0];
      // 格式限制
      if (fileType == "image" || fileType == "video") {
      } else {
        this.$message.error("仅支持上传图片和视频!");
        return;
      }

      this.resUrl.type = fileType;
      this.uploadFile(file);
    },
    uploadFile(file) {
      let formData = new FormData();
      formData.append("file", file);
      this.fullscreenLoading = true;
      upload(formData)
        .then((res) => {
          this.fullscreenLoading = false;
          if (res.error) {
            this.$message.error(res.error);
            return;
          }
          this.resUrl.url = `https://telegra.ph${res[0].src}`;
          this.resUrl.md = `![wishtfile](https://telegra.ph${res[0].src})`;
          this.$message.success("上传成功");
        })
        .catch((err) => {
          console.log(err);
          this.fullscreenLoading = false;
        });
    },
    // 复制内容
    copy(val) {
      if (val == "" || !val) {
        return;
      }
      let oInput = document.createElement("input");
      oInput.value = val;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      this.$message({
        message: "复制成功",
        type: "success",
      });
      oInput.remove();
    },
  },
};
</script>

<style scoped>
.upload {
  /* margin-top: 60px; */
  padding-top: 60px;
  min-height: 100vh;
  box-sizing: border-box;
}
.pic {
  max-width: 100%;
}
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: #c0c4cc;
}
footer a {
  list-style: none;
  text-decoration: none;
  color: #909399;
}
</style>