import { ref } from "vue";

export default function useImageLoad() {
  const imageLoaded = ref(false);

  const imageLoad = (): void => {
    imageLoaded.value = true;
  };

  return {
    imageLoaded,
    imageLoad,
  };
}
