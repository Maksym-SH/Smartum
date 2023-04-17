import { PropType } from "vue"
import { IPictureParams } from "@/interfaces";
// Avatar.vue
export const useAvatarProps = {
  avatar: {
    type: Object as PropType<IPictureParams>,
    default: {
      url: "",
      bgAvatar: ""
    },
  },
  online: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 42,
  },
  circle: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  }
}

// Container.vue
export const useContainerProps = {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: ""
  },
  avatar: {
    type: Object as PropType<IPictureParams>,
    default: {
      url: "",
      bgAvatar: ""
    },
  },
}
// Info.vue
export const useInfoProps = {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: ""
  }
}