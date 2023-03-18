<template>
  <div class="profile-tab">
    <div class="profile-tab__content">
      <div class="card info">
        <h4 class="card__title">Ваши данные</h4>
        <Avatar :name="fullName" :avatar="userInfo.photo" :size="150" />
        <div class="card__content">
          <h2>Имя: 
            <span class="text-ellipsis">
              {{ fullName }}
            </span>
          </h2>
          <h2>Почта:
            <span class="text-ellipsis">
              {{ userInfo.email }}
            </span>
          </h2>
          <h2>Дата регистрации:
            <span class="text-ellipsis">
              {{ createAccountDate.date }}
            </span> 
          </h2>
        </div>
      </div>
      <div class="card edit">

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import Avatar from "@/components/user/Avatar.vue";
import { useStore } from "vuex";
import GetDate from "@/helpers/date/useInfoTime";

export default defineComponent({
  components: {
    Avatar,
  },
  setup() {
    const store = useStore();
    const [firstName, lastName] = store.getters.getCurrentUser.displayName.split(" ");
    const fullName = computed(() => `${firstName} ${lastName}`);

    const userInfo = store.getters.getCurrentUser;
    const createAccountDate = GetDate(userInfo.reloadUserInfo.createdAt, "ru", true);

    return {
      firstName,
      lastName,
      fullName,
      userInfo,
      createAccountDate
    };
  },
});
</script>

<style lang="scss" scoped>
.profile-tab {
  padding-top: 20px;
  &__content {
    display: grid;
    grid-template-columns: minmax(auto, 500px) 200px;
    gap: 40px;
  }
  .card {
    padding: 60px 30px 20px 30px;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba($color-black, 0.4);
    background-color: $color-white4;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    &__title {
      position: absolute;
      top: 10px;
      left: 10px;
    }
    &__content {
      margin-top: 20px;
      overflow: hidden;
      max-width: 100%;
      h2 {
        max-width: 100%;
        display: inline-flex;
        white-space: nowrap;
      }
    }
  }
}
</style>
