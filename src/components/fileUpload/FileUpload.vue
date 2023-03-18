<template>
  <div class="file-upload" @click="upload?.click()">
    <input type="file" ref="upload" class="file-upload--input" />
    <img
      v-if="imgPath && loaded"
      @load="imgLoad"
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
import { defineComponent, ref } from "vue";
import { RefElement } from "@/types/index";

export default defineComponent({
  props: {
    imgPath: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const upload = ref<RefElement>();

    const loaded = ref(false);

    const imgLoad = () => (loaded.value = true);

    return {
      loaded,
      upload,
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
