// Custom input
export const useInputProps = {
  modelValue: {
    type: [String, Number],
    required: true,
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
  required: {
    type: Boolean,
    default: false,
  },
  isEmail: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  autoComplete: {
    type: Boolean,
    default: true,
  },
}

// Custom button
export const useButtonProps = {
  title: {
    type:String,
    default: ""
  },
  icon: {
    type: String,
    default: ""
  },
  variant: {
    type: String,
    default: "info",
    validator: (variant: string) => ["info", "danger", "success"].includes(variant),
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false
  },  
  size: {
    type: String,
    default: "md",
    validator: (variant: string) => ["sm", "md", "lg"].includes(variant)
  }
}

// Custom checkbox
export const useCheckboxProps = {
  modelValue: {
    type: Boolean,
    required: true
  },  
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: ""
  }
};
