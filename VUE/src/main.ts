import { createApp } from 'vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import router from './router';
import cScrollbar from 'c-scrollbar';
import {
  ElBacktop,
  ElButton,
  ElTableColumn,
  ElTable,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElPopconfirm,
  ElRow,
  ElSelect,
  ElOption,
  ElImage,
  ElUpload,
  ElBadge,
  ElIcon,
  ElTimeline,
  ElTimelineItem,
  ElDropdown,
  ElLoading
} from 'element-plus';
import 'element-plus/dist/index.css';
import './common/less/base.less';
import store from '../src/store';
import mitt from 'mitt';
import moment, { LocaleSpecification } from 'moment';
import { momentsetting } from './plugins/utils';
import EleTable from './components/EleTable.vue';
import CommonBottom from './components/CommonBottom.vue';
import {
  Input,
  Button,
  Modal,
  Menu,
  Layout,
  Dropdown,
  Row,
  Col,
  Collapse,
  Form,
  Upload,
  Divider,
  Tag,
  Badge,
  Select,
  Table,
  Image,
  Tooltip,
  Popconfirm,
  Timeline,
  Carousel,
  Comment,
  Avatar,
  Skeleton,
  Switch
} from 'ant-design-vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
moment.locale('zh-cn', momentsetting as unknown as LocaleSpecification);
const IconFont = createFromIconfontCN({
  scriptUrl: '/css/iconfont.js',
});
const app = createApp(App);
app.config.globalProperties.$bus = mitt();
app
  .use(router)
  .use(store)
  .use(cScrollbar)
  .use(ElBacktop)
  .use(ElButton)
  .use(ElTableColumn)
  .use(ElTable)
  .use(ElDialog)
  .use(ElForm)
  .use(ElFormItem)
  .use(ElInput)
  .use(ElPopconfirm)
  .use(ElRow)
  .use(ElSelect)
  .use(ElOption)
  .use(ElImage)
  .use(ElUpload)
  .use(ElBadge)
  .use(ElIcon)
  .use(ElTimeline)
  .use(ElTimelineItem)
  .use(ElDropdown)
  .use(ElLoading)
  .use(Form)
  .use(Tag)
  .use(Divider)
  .use(Badge)
  .use(Input)
  .use(Upload)
  .use(Button)
  .use(Dropdown)
  .use(Row)
  .use(Col)
  .use(Collapse)
  .use(Modal)
  .use(Table)
  .use(Select)
  .use(Menu)
  .use(Layout)
  .use(cScrollbar)
  .use(Image)
  .use(Tooltip)
  .use(Popconfirm)
  .use(Timeline)
  .use(Comment)
  .use(Avatar)
  .use(Skeleton)
  .use(Switch)
  .use(Carousel);

app.component('icon-font', IconFont);
app.component('EleTable', EleTable);
app.component('CommonBottom', CommonBottom);
app.mount('#app');