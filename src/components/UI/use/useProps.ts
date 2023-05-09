import { PropType } from "vue";
import { 
  ButtonSize, 
  ExpansionPanelVariant, 
  AsideExpPanelNavigation, 
  ButtonVariant  
} from "@/types/types";
import { Colors, Length } from "@/types/enums";

// Input.vue
export const useInputProps = {
  modelValue: {
    type: [String, Number],
    default: ""
  },
  type: {
    type: String,
    default: "text",
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  isEmail: {
    type: Boolean,
    default: false,
  },
  isPhone: {
    type: Boolean,
    default: false
  },
  lightTheme: {
    type: Boolean,
    default:false
  },
  min: {
    type: Number,
    default: Length.None,
  },
  label: {
    type: String,
    default: ""
  },
  autoComplete: {
    type: [Boolean, String],
    default: true,
  },
};

// Textarea.vue
export const useTextareaProps = {
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean, 
    default: false
  },
  name: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  max: {
    type: Number,
    default: Length.None
  },
  label: {
    type: String,
    default: "",
  },
  min: {
    type: Number,
    default: Length.None,
  },
  resize: {
    type: Boolean,
    default: false,
  }
}

// Button.vue
export const useButtonProps = {
  title: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  variant: {
    type: String as PropType<ButtonVariant>,
    default: "elevated",
  },
  color: {
    type: String as PropType<Colors>,
    default: Colors.Info
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: [Boolean, Number],
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<ButtonSize>,
    default: "default",
  },
};

// Checkbox.vue
export const useCheckboxProps = {
  modelValue: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  switchBox: {
    type: Boolean,
    default: false
  },
  secondaryLabel: {
    type: String,
    default: ""
  },
  disabled: {
    type: Boolean,
    default: false
  }
};

// ExpansionPanel.vue
export const useExpansionPanelProps = {
  variant: {
    type: String as PropType<ExpansionPanelVariant>,
    default: "default"
  },
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: null
  },
  content: {
    type: Array as PropType<AsideExpPanelNavigation[]>,
    default: () => []
  }
}