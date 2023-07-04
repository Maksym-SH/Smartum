<template>
  <div class="file-upload" @click="upload?.click()">
    <input ref="upload" type="file" class="file-upload--input" @change="fileUpload" />
    <AppButton
      v-if="showImageTemplate"
      class="file-upload--delete"
      :color="Colors.DANGER"
      @click.stop="deleteImgPopup"
      icon="delete-outline"
    />
    <v-img
      v-if="showImageTemplate"
      class="file-upload--image"
      cover
      :src="currentImgPath"
      @load="imageLoad"
    />
    <img class="file-upload--icon" src="/images/icons/upload.svg" alt="Upload" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import type { FileType, ImageSource, RefElement } from "@/types/types";
import { OpenPopup } from "@/helpers/methods";

import i18n from "@/i18n";
import fileValidate from "@/helpers/file/validate";
import useImageLoad from "@/composables/useImageLoad";

import { Colors } from "@/types/enums";
import type { PropType } from "vue";

export default defineComponent({
  props: {
    fileType: {
      type: String as PropType<FileType>,
      required: true,
    },
    avatarParams: {
      type: String,
      default: "",
    },
  },
  emits: ["loaded", "deleted"],
  setup(props, { emit }) {
    const { t } = i18n.global;

    const upload = ref<RefElement>();
    // Image
    const { imageLoaded, imageLoad } = useImageLoad();

    const imgDeleted = ref(false);

    const imageSource = ref<ImageSource>(props.avatarParams);

    const currentImgPath = computed((): string =>
      String(imageSource.value || props.avatarParams)
    );
    const showImageTemplate = computed(
      (): string | boolean => (imageLoaded.value || props.avatarParams) && !imgDeleted.value
    );

    // File load.
    const fileUpload = (): void => {
      const reader = new FileReader();
      const file = upload.value?.files?.[0];

      if (file) {
        if (props.fileType === "image") reader.readAsDataURL(file);

        reader.onload = (): void => {
          if (fileValidate(file, props.fileType)) {
            // Validation was successful.

            if (props.fileType === "image") {
              imageSource.value = reader.result;
              imageLoaded.value = true;
              imgDeleted.value = false;

              emit("loaded", file);

              upload.value!.value = ""; // Clear input file after image load.
            }
          }
        };
      }
    };

    const deleteImgPopup = (): void => {
      OpenPopup({
        title: t("popup.deletePhoto.title"),
        buttons: {
          yes: {
            text: t("buttons.delete"),
            color: Colors.DANGER,
          },
        },
        callback: (): void => {
          emit("deleted");
          imgDeleted.value = true;
        },
      });
    };

    return {
      imageLoaded,
      upload,
      currentImgPath,
      imgDeleted,
      showImageTemplate,
      deleteImgPopup,
      fileUpload,
      imageLoad,
      Colors,
    };
  },
});
</script>

<style lang="scss" scoped>
.file-upload {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 3px dashed $color-blue;
  cursor: pointer;

  &--delete {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    color: $color-white1;
    height: 25px;
    border-radius: 4px;
    background-color: $color-red;

    &:hover {
      background-color: $color-red-hover;
    }
  }

  &--input {
    position: fixed;
    top: -10000px;
  }

  &--image {
    position: absolute;
    margin: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    border-radius: 8px;
    object-fit: cover;
  }

  &--icon {
    outline: none;
    animation: upload 0.5s infinite alternate-reverse;
    width: 32px;
    height: 32px;

    @include mobile(max) {
      width: 50px;
      height: 50px;
    }
  }
}

// Upload icon animate.
@keyframes upload {
  from {
    transform: translateY(-5px);
  }

  to {
    transform: translateY(0);
  }
}
</style>
