<template>
  <div class="file-upload" @click="upload?.click()">
    <input type="file" ref="upload" class="file-upload--input" @change="fileUpload" />
    <Button 
      v-if="imageShowed"
      class="file-upload--delete"
      variant="danger"
      @click.stop="deleteImage"
    >
      <span class="mdi mdi-delete-outline"></span>
    </Button>
    <img
      v-if="imageShowed"
      @load="imgLoad"
      ref="image"
      :src="imagePath"
      class="file-upload--image"
    />
    <img
      svg-inline
      class="file-upload--icon"
      src="@/assets/img/icons/upload.svg"
      alt="Upload"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from "vue";
import fileValidate from "@/helpers/file/validate";
import { RefElement, FileType, ImageSource } from "@/types";
import { OpenPopup } from "@/helpers/methods";

export default defineComponent({
  props: {
    fileType: {
      type: String as PropType<FileType>,
      required: true,
    },
    photoURL: {
      type: String,
      default: "",
    }
  },
  emits:["loaded", "deleted"],
  setup(props, { emit }) {
    const upload = ref<RefElement>();

    const imgLoaded = ref(false);
    const imgDeleted = ref(false);

    const imgLoad = (): boolean => imgLoaded.value = true;

    const imageSource = ref<ImageSource>(props.photoURL);

    const fileUpload = (): void => {
      const reader = new FileReader();
      const file = upload.value?.files?.[0];

      if(file) {
        if(props.fileType == 'image') reader.readAsDataURL(file);

        reader.onload = (): void => {
          
          if(fileValidate(file, props.fileType)) {

            if(props.fileType == "image") {
              imageSource.value = reader.result;
              imgLoaded.value = true;
              imgDeleted.value = false;

              emit('loaded', {
                result: reader.result, 
                type: file.type
              })

              upload.value!.value = ""; // Clear input file after image load.
            }
          }
        }
      }
    }

    const deleteImage = ():void => {
      OpenPopup({
        title: "Удалить фото?",
        buttons: {
          yes: {
            text: "Удалить",
            variant: "danger"
          },
        },
        callback: (): void => {
          emit("deleted");
          imgDeleted.value = true;
        }
      });
    };

    const imagePath = computed((): string => String(imageSource.value || props.photoURL));
    const imageShowed = computed((): string | boolean => 
                                    (imgLoaded.value || props.photoURL) && !imgDeleted.value);

    return {
      imgLoaded,
      upload,
      imageSource,
      imagePath,
      imgDeleted,
      imageShowed,
      deleteImage,
      fileUpload,
      imgLoad,
    };
  },
});
</script>

<style lang="scss" scoped>
.file-upload {
  border-radius: 8px;
  border: 3px dashed $color-blue;
  width: 100px;
  height: 100px;
  position: relative;
  cursor: pointer;
  @include flex-center;
  
  &--delete { 
    position: absolute;
    z-index: 2;
    top: 2px;
    right: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
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
