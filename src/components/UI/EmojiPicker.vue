<template>
  <span class="emoji-picker">
    <transition name="emoji-window">
      <EmojiPicker
        v-show="openEmojiWindow"
        class="emoji-picker__window"
        native
        hide-search
        disable-skin-tones
        @select="selectEmoji"
      />
    </transition>
    <cButton
      @click="openEmojiWindow = !openEmojiWindow"
      class="emoji-picker__add-new"
      rounded
      title="😀"
      :color="Colors.LightGrey"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Colors } from "@/types/enums";
import type { IEmoji } from "@/types/interfaces";

import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

export default defineComponent({
  components: {
    EmojiPicker,
  },
  emits: ["addEmoji"],
  setup(_, { emit }) {
    const { unicID } = useCurrentUserInfo();

    const openEmojiWindow = ref(false);

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

    return {
      Colors,
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
