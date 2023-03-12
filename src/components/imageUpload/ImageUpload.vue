<template>
  <div class="image-upload" @click="upload.click()">
    <input 
      type="file"
      ref="upload"
      class="image-upload--input"
    >
    <img 
      v-if="imgPath && loaded" 
      @load="imgLoad" 
      class="image-upload--pucture"
    />
    <img 
      v-else
      svg-inline
      class="image-upload--icon" 
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
      default: ""
    },
  },  
  setup(props) { 
    const upload = ref<RefElement>(null)

    const loaded =  ref(false);
    
    const imgLoad = () => loaded.value = true;
    
    return {
      loaded,
      imgLoad,
      upload
    }
  },
})
</script>

<style lang="scss" scoped>
.image-upload {
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

  &--pucture {
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
    font-size: 18px;
  }
}

// Upload icon animate
@keyframes upload {
  from {
    transform: translateY(-5px);
  }
  to {
    transform: translateY(0);
  }
}
</style>