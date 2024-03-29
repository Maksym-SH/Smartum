<template>
  <span class="emoji-picker">
    <transition name="emoji-window">
      <EmojiPicker
        v-if="openEmojiWindow"
        class="emoji-picker__window"
        native
        hide-search
        :theme="emojiWindowTheme"
        disable-skin-tones
        @select="selectEmoji"
      />
    </transition>
    <AppButton
      class="emoji-picker__add-new"
      rounded
      title="😀"
      :color="Colors.LIGHT_GREY"
      @click="openEmojiWindow = !openEmojiWindow"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import "vue3-emoji-picker/css";

import AppButton from "./AppButton.vue";
import EmojiPicker from "vue3-emoji-picker";

import { Colors } from "@/types/enums";
import type { IEmoji } from "@/types/interfaces/board";
import type { Theme } from "@/types";

export default defineComponent({
  components: {
    AppButton,
    EmojiPicker,
  },
  emits: ["addEmoji"],
  setup(_, { emit }) {
    const { unicID } = useCurrentUserInfo();

    const openEmojiWindow = ref(false);

    const emojiWindowTheme = ref<Theme>("dark");

    const selectEmoji = ({ i }: { i: string }) => {
      const emoji = i;

      const newEmoji: IEmoji = {
        smile: emoji,
      };

      emit("addEmoji", {
        emoji: newEmoji,
        newAuthor: unicID.value,
      });

      openEmojiWindow.value = false;
    };

    onMounted((): void => {
      const savedTheme = localStorage.getItem("smartumTheme") as Theme;

      emojiWindowTheme.value = savedTheme;
    });

    return {
      Colors,
      emojiWindowTheme,
      openEmojiWindow,
      selectEmoji,
    };
  },
});
</script>

<style lang="scss" scoped>
.emoji-picker {
  position: relative;

  &__add-new {
    height: 30px;
    padding: 5px;
  }

  &__window {
    position: absolute;
    bottom: 100%;
  }
}

.emoji-window-enter-active,
.emoji-window-leave-active {
  transition: all 0.2s ease;
}
.emoji-window-enter-from,
.emoji-window-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
