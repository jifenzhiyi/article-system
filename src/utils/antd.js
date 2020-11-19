import Vue from 'vue';
import {
  Button,
  ConfigProvider,
  Dropdown,
  Form,
  Icon,
  Input,
  List,
  message,
  Modal,
  Pagination,
  Tooltip,
  Avatar,
  Card,
  Menu,
  Upload,
  Checkbox,
  Tag,
} from 'ant-design-vue';

Vue.use(Avatar);
Vue.use(Button);
Vue.use(Card);
Vue.use(Checkbox);
Vue.use(ConfigProvider);
Vue.use(Dropdown);
Vue.use(Form);
Vue.use(Icon);
Vue.use(Input);
Vue.use(List);
Vue.use(Menu);
Vue.use(Pagination);
Vue.use(Tag);
Vue.use(Tooltip);
Vue.use(Upload);

Vue.prototype.$message = message;
Vue.prototype.$modal = Modal;
