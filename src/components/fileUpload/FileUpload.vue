<template>
  <div class="file-upload" @click="upload?.click()">
    <input
      type="file"
      ref="upload"
      class="file-upload--input"
      @change="fileUpload"
    />
    <Button
      v-if="showImageTemplate"
      class="file-upload--delete"
      :color="Colors.Danger"
      @click.stop="deleteImgPopup"
    >
      <span class="mdi mdi-delete-outline"></span>
    </Button>
    <v-img
      v-if="showImageTemplate"
      @load="imgLoad"
      ref="image"
      class="file-upload--image"
      cover
      :src="currentImgPath"
    ></v-img>
    <img
      class="file-upload--icon"
      src="/images/icons/upload.svg"
      alt="Upload"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from "vue";
import { RefElement, FileType, ImageSource } from "@/types/types";
import { OpenPopup } from "@/helpers/methods";
import { Colors } from "@/types/enums";

import fileValidate from "@/helpers/file/validate";

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
    const upload = ref<RefElement>();
    // Image
    const imgLoaded = ref(false);

    const imgDeleted = ref(false);

    const currentImgPath = computed((): string =>
      String(imageSource.value || props.avatarParams)
    );
    const showImageTemplate = computed(
      (): string | boolean =>
        (imgLoaded.value || props.avatarParams) && !imgDeleted.value
    );

    const imgLoad = (): boolean => (imgLoaded.value = true);

    const imageSource = ref<ImageSource>(props.avatarParams);

    // File load.
    const fileUpload = (): void => {
      const reader = new FileReader();
      const file = upload.value?.files?.[0];

      if (file) {
        if (props.fileType == "image") reader.readAsDataURL(file);

        reader.onload = (): void => {
          if (fileValidate(file, props.fileType)) {
            // Validation was successful.

            if (props.fileType == "image") {
              imageSource.value = reader.result;
              imgLoaded.value = true;
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
        title: "Удалить фото?",
        buttons: {
          yes: {
            text: "Удалить",
            color: Colors.Danger,
          },
        },
        callback: (): void => {
          emit("deleted");
          imgDeleted.value = true;
        },
      });
    };

    return {
      imgLoaded,
      upload,
      currentImgPath,
      imgDeleted,
      showImageTemplate,
      deleteImgPopup,
      fileUpload,
      imgLoad,
      Colors,
    };
  },
});
</script>

<style lang="scss" scoped>
.file-upload {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 3px dashed $color-blue;
  cursor: pointer;
  @include flex-center;

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
    border: 1px solid $color-black;
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
    font-size: 1rem;
    @include mobile(max) {
      font-size: 2.1rem;
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
