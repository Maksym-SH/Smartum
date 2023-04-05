<template>
  <v-expansion-panels :variant="variant">
    <v-expansion-panel
      :title="name"
    >
    <v-expansion-panel-text>
      
    </v-expansion-panel-text>
  </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ExpansionPanelVariant, ExpansionPanelItems } from "@/types";

export default defineComponent({ 
  props: {
    variant: {
      type: String as PropType<ExpansionPanelVariant>,
      default: "default"
    },
    name: {
      type: String,
      required: true
    },
    content: {
      type: Array as PropType<ExpansionPanelItems>,
      default: () => []
    }
  }
})

</script>