<template>
  <div style="min-width: 1000px; width: 90%">
    <editor v-model="myValue" :init="init" :disabled="disabled"> </editor>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import { useQiniuUpload, qiNiuCdn } from "@/composable/Upload";
import "tinymce/themes/silver/theme"; // 引用主题文件
import "tinymce/icons/default"; // 引用图标文件
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink"; //锚点
import "tinymce/plugins/autoresize";
import "tinymce/plugins/autosave";
import "tinymce/plugins/charmap"; //特殊字符
import "tinymce/plugins/code"; //查看源码
import "tinymce/plugins/codesample"; //插入代码
import "tinymce/plugins/directionality"; //
import "tinymce/plugins/fullpage"; //页面属性编辑
import "tinymce/plugins/fullscreen"; //全屏
import "tinymce/plugins/help"; //帮助
import "tinymce/plugins/hr"; //横线
import "tinymce/plugins/image"; //图片
import "tinymce/plugins/imagetools"; //图片工具
import "tinymce/plugins/importcss"; //图片工具
import "tinymce/plugins/insertdatetime"; //时间插入
import "tinymce/plugins/media"; //媒体插入
import "tinymce/plugins/nonbreaking"; //
import "tinymce/plugins/noneditable"; //不间断空格
import "tinymce/plugins/pagebreak"; //分页
import "tinymce/plugins/paste"; //粘贴
import "tinymce/plugins/preview"; //预览
import "tinymce/plugins/print"; //打印
import "tinymce/plugins/quickbars"; //快捷菜单
import "tinymce/plugins/save"; //保存
import "tinymce/plugins/searchreplace"; //查询替换
import "tinymce/plugins/tabfocus"; //
import "tinymce/plugins/textpattern"; //
import "tinymce/plugins/visualblocks"; //
import "tinymce/plugins/visualchars"; //
import "tinymce/plugins/wordcount"; //数字统计
import "tinymce/plugins/emoticons"; //emoticons

interface TinyMCEEditorBlob {
  filename: () => string;
  blob: () => File;
}

export default defineComponent({
  components: {
    Editor,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    toolbar: {
      type: [String, Array],
      default:
        "fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                table image media emoticons charmap emoticons hr pagebreak insertdatetime print preview | code selectall | indent2em lineheight formatpainter axupimgs",
    },
    plugins: {
      type: [String, Array],
      default:
        "print preview searchreplace emoticons autolink directionality emoticons visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave ",
    },
  },
  emits: ["update:modelValue", "uploadImage"],
  setup(props) {
    const { modelValue } = toRefs(props);

    const myValue = ref("");
    myValue.value = modelValue.value as string;

    return {
      updateImg: null,
      Imgloading: false,
      imgPovp: false,
      //初始化配置
      init: {
        language_url:
          "/tinymce/langs/zh_CN.js" /*vue3.x 的路径/tinymce/langs/zh_CN.js ，vue2.x的路径/static/tinymce/langs/zh_CN.js*/,
        language: "zh_CN",
        skin_url: "/tinymce/skins/ui/oxide",
        autoresize_bottom_margin: 50,
        toolbar_mode: "none",
        max_height: 500,
        min_height: 550,
        plugins:
          "wordcount  visualchars visualblocks textpattern tabfocus searchreplace save quickbars print preview paste pagebreak noneditable nonbreaking media insertdatetime importcss  image hr help fullscreen directionality codesample code charmap link code table lists advlist anchor autolink autoresize autosave emoticons", // 插件需要import进来
        toolbar:
          "formats undo  redo paste print fontsizeselect fontselect wordcount ltr rtl visualchars visualblocks searchreplace|save preview pagebreak nonbreaking image|outdent indent aligncenter alignleft alignright alignjustify lineheight  underline quicklink h1 h2 h3 h4 h5 h6 blockquote numlist bullist table removeformat forecolor backcolor bold italic  strikethrough hr charmap emoticons link insertdatetime|subscript superscript cut codesample code |anchor preview fullscreen|help",
        styles:
          "img {width: 100%;} .language-markup {background-color: #000;} p {margin: 5px 0;font-size: 14px;}",
        content_css: "tinymce/tinycontent",
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        lineheight_formats: "1 1.1 1.2 1.3 1.4 1.5 2 3 4 5 6 10",
        color_map: [
          "000000",
          "Black",
          "993300",
          "Burnt orange",
          "333300",
          "Dark olive",
          "003300",
          "Dark green",
          "003366",
          "Dark azure",
          "000080",
          "Navy Blue",
          "333399",
          "Indigo",
          "333333",
          "Very dark gray",
          "800000",
          "Maroon",
        ],
        branding: true,
        menubar: false,
        statusbar: false, // 隐藏编辑器底部的状态栏
        paste_data_images: true /*是否允许粘贴图片*/,
        emoticons_database_url: '/tinymce/emoticons/js/emojis.js',
        //图片上传
        images_upload_handler: async function (
          blobInfo,
          success,
          failure,
          progress
        ) {
          const file = blobInfo.blob();
          const key = blobInfo.filename();
          useQiniuUpload(
            file,
            key,
            (res) => {
              success(`${qiNiuCdn}/${res.key}`);
            },
            "article/"
          );
        },
      },
      myValue,
      totalImg: 30,
      imgNum: 0,
      uploadImgList: [],
      isUpload: false,
    };
  },
  watch: {
    myValue(value) {
      this.$emit("update:modelValue", value);
    },
    modelValue(value) {
      this.myValue = value;
    },
  },
  mounted() {
    tinymce.init({
      inline: true,
      content_style:
        "img {cursor: pointer;} .language-markup {background-color: #000;} p {margin: 5px 0;font-size: 14px;}",
    });
  },
});
</script>
