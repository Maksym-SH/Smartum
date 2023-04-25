<template>
  <div 
    class="notification-item" 
    :class="{ 'not-read': params.status === 'not read' }"
    @click="openNotify"
  >
    <Avatar 
      v-if="image" 
      :avatar="image" 
      :size="45"
      circle
      noBackground
    />
    <div class="notification-item__content">
      <div class="notification-item__content-info">
         <h3 class="notification-item__title">
          {{ params.title }}
        </h3>
        <time class="notification-item__date">
          {{ dateSent }}
        </time>
      </div> 
      <p class="notification-item__description">
        {{ params.description }}
      </p>
    </div>
    <span
      @click.stop="$emit('delete', params.id)" 
      class="notification-item__close mdi mdi-close-circle"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, computed } from 'vue';
import Avatar from '@/components/user/Avatar.vue';
import { IPictureParams, INotificationItem, INotificationDate } from '@/interfaces';
import { GetBetweenDateString } from '@/helpers/date/useInfoTime';
import { Language, NotifyType, Numbers } from '@/enums';
import useTimestamp from '@/helpers/date/timestamp';
import router from '@/router';

export default defineComponent({
  emits:["delete", "read"],
  components: {
    Avatar
  },
  props: {
    params: {
      type: Object as PropType<INotificationItem<INotificationDate>>,
      required: true
    }
  },
  setup(props, { emit }) {
    const image = reactive<IPictureParams>({
      url: props.params.image || "",
    })

    const dateSent = computed((): string => {
      const propsDate = props.params.date.seconds || props.params.date;
      const recievedDate = props.params.date.seconds 
                              ? new Date(Number(propsDate) * Numbers.Second) 
                              : new Date()

      const dateBetween = GetBetweenDateString(recievedDate);
      const time = useTimestamp(recievedDate, Language.Russian, props.params.date.seconds).time;
      return `${ dateBetween } в ${ time }`
    })

    const openNotify = (): void => {
      emit('read', props.params.id);
      
      // Action by notification type.
      switch(props.params.type) {
        // ToDo: Dashboard page.
        //case NotifyType.Dashboard: 
        //  router.push({ name: "Dashboard" });
        //  break;
        case NotifyType.Profile: 
          router.push({ name: "Profile" })
          break;
        case NotifyType.Reset: 
          router.push({ name: "Forgot" })
          break;
        case NotifyType.Default: 
          return;
        // ToDo: Users page.
        // case NotifyType.User: 
        //  router.push({ name: "Dashboard/User" })
        //  break;
      }
      
    };

    return {
      openNotify,
      image,
      dateSent
    }
  }
})
</script>


<style lang="scss" scoped>
.notification-item {
  background-color: var(--color-background-notification);
  border: 1px solid var(--color-border-notification);
  padding: 10px;
  display: flex;
  width: 100%;
  border-radius: 4px;
  position: relative;
  margin-bottom: 10px;
  transition: all 0.2s;
  cursor: pointer;
  padding-right: 27px;
  color: var(--color-text);
  &.not-read {
    background-color: var(--color-background-notification-new);
  }
  &__content {
    width: 100%;
    margin-left: 10px;
    &-info {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      overflow-x: hidden;
    }
  }
  &__title {
    display: inline;
    word-break: break-word;
    font-size: 15px;
  }
  &__date {
    font-size: 14px;
    white-space: nowrap;
    margin-left: 10px;
    color: $color-dark-grey4;
  }
  &__description { 
    margin-top: 7px;
    font-size: 13px;
    line-height: 16px;
    color: var(--color-text);
    opacity: 0.8;
  }
  &__close {
    position: absolute;
    top: -2px;
    right: 2px;
    color: var(--color-text);
    font-size: 24px;
    cursor: pointer;
    transition: all 0.1s;
    &:hover {
      color: $color-red-hover;
    }
  }
  @include mobile(max) {
    padding: 20px 10px 30px 5px;
    &__title {
      font-size: 14px;
    }
    &__date {
      position: absolute;
      bottom: 5px;
      left: 0;
      font-size: 10px;
    }
    &__close {
      font-size: 20px;
    }
  }
}
</style>