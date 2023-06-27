import type { PropType } from "vue";
import type {
  AsideExpPanelNavigation,
  ButtonSize,
  ButtonVariant,
  EmptyListType,
  ExpansionPanelVariant,
  ModalContentType,
  Position,
  SelectElements,
  Variant,
} from "@/types/types";
import { Colors, Length } from "@/types/enums";

// AppInput.vue
export const useInputProps = {
  modelValue: {
    type: [String, Number],
    default: "",
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
  label: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: (props: any) => {
      if (props.label) {
        throw new Error("Props label not found.");
      }
    },
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
    default: false,
  },
  lightTheme: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: Length.None,
  },
  autoComplete: {
    type: [Boolean, String],
    default: true,
  },
};

// AppTextarea.vue
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
    default: false,
  },
  name: {
    type: String,
    default: (props: any) => {
      if (props.label) {
        throw new Error("Props label not found.");
      }
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  max: {
    type: Number,
    default: Length.None,
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
  },
};

// AppButton.vue
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
    default: Colors.Info,
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

// AppCheckbox.vue
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
  lineThrough: {
    type: Boolean,
    default: false,
  },
  switchBox: {
    type: Boolean,
    default: false,
  },
  secondaryLabel: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
};

// AppExpansionPanel.vue
export const useExpansionPanelProps = {
  variant: {
    type: String as PropType<ExpansionPanelVariant>,
    default: "default",
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: null,
  },
  content: {
    type: Array as PropType<AsideExpPanelNavigation[]>,
    default: () => [],
  },
};

// BackgroundItem.vue
export const useBackgroundItemProps = {
  image: {
    type: String,
    default: "",
  },
  width: {
    type: Number,
    default: 64,
  },
  height: {
    type: Number,
    default: 32,
  },
  background: {
    type: String as PropType<Colors | string>,
    default: "",
  },
  circle: {
    type: Boolean,
    default: false,
  },
};

// EmptyList.vue
export const useEmptyListProps = {
  type: {
    type: String as PropType<EmptyListType>,
    required: true,
  },
};

// AppHint.vue
export const useHintProps = {
  content: {
    type: String,
    required: true,
  },
  variant: {
    type: String as PropType<Variant>,
    required: true,
  },
};

// AppLoader.vue
export const useLoaderProps = {
  inline: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 60,
  },
};

// LongContentModal.vue
export const useLongContentModalProps = {
  contentType: {
    type: String as PropType<ModalContentType>,
    required: true,
  },
};

// AppSelect.vue
export const useSelectProps = {
  items: {
    type: Array as PropType<SelectElements>,
    default: () => [],
  },
  location: {
    // ToDo
    type: String as PropType<Position>,
    default: "end",
  },
  size: {
    type: Number,
    default: 30,
  },
};

// SwitchTheme.vue
export const useSwitchThemeProps = {
  small: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
};
