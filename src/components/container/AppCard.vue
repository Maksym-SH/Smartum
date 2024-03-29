<template>
  <div class="card">
    <template v-if="!table">
      <header v-if="$slots.header" class="card__header">
        <slot name="header" />
      </header>
      <div v-if="$slots.content" class="card__content">
        <slot name="content" />
      </div>
      <footer v-if="$slots.footer" class="card__footer">
        <slot name="footer" />
      </footer>
    </template>
    <table v-else class="card__table">
      <thead class="card__table-header">
        <tr>
          <slot name="table-header" />
        </tr>
      </thead>
      <slot v-if="$slots['table-body']" name="table-body" />
      <tfoot
        v-if="$slots['table-body'] || $slots['table-footer']"
        class="card__table-footer"
      >
        <slot name="table-footer-titles" />
        <slot name="table-footer" />
      </tfoot>
    </table>
    <slot name="custom" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { PropType } from "vue";
import type { Variant } from "@/types";

export default defineComponent({
  props: {
    variant: {
      type: String as PropType<Variant>,
      default: "info",
    },
    table: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid $color-dark-grey5;
  background-color: var(--color-background-card);
  transition: background-color 0.3s;
  border-radius: 4px;

  &__header {
    border-bottom: 1px solid $color-dark-grey5;
  }
  &__footer {
    border-top: 1px solid $color-dark-grey5;
  }

  &__header,
  &__content,
  &__footer {
    padding: 15px 30px;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    &-header,
    &-footer {
      border-bottom: 1px solid $color-dark-grey5;

      :deep(th) {
        font-size: 18px;
        color: var(--color-text);
        text-align: start;
        padding: 15px 30px;
        font-family: $RobotoBD;
      }
    }

    &-footer {
      border-top: 1px solid $color-dark-grey5;

      :deep(td) {
        color: var(--color-text);
        text-align: start;
        padding: 15px 30px;
      }
    }

    :deep(td) {
      color: var(--color-text);
      text-align: center;
      padding: 15px 30px;
    }
  }
}
</style>
