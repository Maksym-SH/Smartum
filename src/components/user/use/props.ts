// Avatar.vue
export const useAvatarProps = {
  avatar: {
    type: String,
    default: "",
  },
  online: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 42,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: true,
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
    type: String,
    default: "",
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