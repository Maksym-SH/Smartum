import { ButtonSize, Variant } from "@/types/index";
import { PropType } from "vue";

// Input
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
  min: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: ""
  },
  autoComplete: {
    type: Boolean,
    default: true,
  },
};

// Textarea
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
  max: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: "",
  },
  min: {
    type: Number,
    default: 0,
  },
  resize: {
    type: Boolean,
    default: false,
  }
}

// Button
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
    type: String as PropType<Variant>,
    default: "info",
  },
  round: {
    type: Boolean,
    default: false,
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  outline: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<ButtonSize>,
    default: "md",
  },
};

// Checkbox
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
};
