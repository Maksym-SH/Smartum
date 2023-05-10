<template>
  <div class="card">
    <template v-if="!table">
      <header class="card__header" v-if="$slots.header">
        <slot name="header" />
      </header>
      <div class="card__content" v-if="$slots.content">
        <slot name="content" />
      </div>
      <footer class="card__footer" v-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </template>
    <table v-else class="card__table">
      <thead class="card__table-header">
        <tr>
          <slot name="table-header" />
        </tr>
      </thead>

      <slot name="table-body" v-if="$slots['table-body']"></slot>

      <tfoot
        class="card__table-footer"
        v-if="$slots['table-body'] || $slots['table-footer']"
      >
        <slot name="table-footer-titles"></slot>
        <slot name="table-footer"></slot>
      </tfoot>
    </table>
    <slot name="custom"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Variant } from "@/types/types";

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
  border: 1px solid var(--color-border-card);
  background-color: var(--color-background-card);
  border-radius: 4px;

  &__header {
    border-bottom: 1px solid var(--color-border-card);
  }
  &__footer {
    border-top: 1px solid var(--color-border-card);
  }
  &__header,
  &__content,
  &__footer {
    padding: 13px 30px;
  }
  &__table {
    width: 100%;
    border-collapse: collapse;
    &-header,
    &-footer {
      border-bottom: 1px solid var(--color-border-card);
      :deep(th) {
        font-size: 18px;
        color: var(--color-text);
        text-align: start;
        padding: 15px 30px;
      }
    }
    &-footer {
      border-top: 1px solid var(--color-border-card);
      ::deep(td) {
        color: var(--color-text);
        text-align: start;
        padding: 15px 30px;
      }
    }
    :deep(td) {
      color: var(--color-text);
      text-align: start;
      padding: 15px 30px;
    }
  }
}
</style>
