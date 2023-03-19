<template>
  <div class="file-upload" @click="upload?.click()">
    <input type="file" ref="upload" class="file-upload--input" @change="fileUpload" />
    <img
      v-if="loaded"
      @load="imgLoad"
      ref="image"
      :src="imageSource"
      class="file-upload--image"
    />
    <img
      v-else
      svg-inline
      class="file-upload--icon"
      src="@/assets/img/icons/upload.svg"
      alt="Upload"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import { RefElement, FileType } from "@/types/index";
import fileValidate from "@/helpers/file/validate";

export default defineComponent({
  props: {
    fileType: {
      type: String as PropType<FileType>,
      required: true,
    }
  },
  emits:["loaded"],
  setup(props, {emit}) {
    const upload = ref<RefElement>();

    const loaded = ref(false);

    const imgLoad = () => (loaded.value = true);

    const imageSource = ref();

    const fileUpload = () => {
      const reader = new FileReader();
      const file = upload.value?.files?.[0];
      if(file) {
        if(props.fileType == 'image') reader.readAsDataURL(file);

        reader.onload = () => {
          if(fileValidate(file, props.fileType)) {

            if(props.fileType == "image") {
              imageSource.value = reader.result;
              loaded.value = true;
              emit('loaded', {
                result: reader.result, 
                type: file.type
              });
            }
          }
        }
      }
    }

    return {
      loaded,
      upload,
      imageSource,
      fileUpload,
      imgLoad,
    };
  },
});
</script>

<style lang="scss" scoped>
.file-upload {
  border-radius: 8px;
  border: 3px dashed $color-info;
  width: 100px;
  height: 100px;
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

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
