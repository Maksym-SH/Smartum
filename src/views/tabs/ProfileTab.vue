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
        <h4 class="card__title">Редактирование данных</h4>
        <div class="card__content">
          <div class="card__image">
            <span class="item-label">Обновить фото профиля</span>
            <ImageUpload />
          </div>
          <form class="card__form">
            <label for="firtName">Имя:</label>
            <Input name="firstName" required transparent :min="TextLength" :placeholder="firstName"/>

            <label for="firtName">Фамилия:</label>
            <Input name="lastName" required transparent :min="TextLength" :placeholder="lastName"/>
            <Button> 
              Сохранить <span class="mdi mdi-content-save-outline"></span>
            </Button> 
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import Avatar from "@/components/user/Avatar.vue";
import { useStore } from "vuex";
import FileUpload from "@/components/fileUpload/FileUpload.vue";
import GetDate from "@/helpers/date/useInfoTime";
import { ELanguage, ELength } from "@/enums/index";

export default defineComponent({
  components: {
    Avatar,
    ImageUpload: FileUpload
  },
  setup() {
    const store = useStore();
  
    const [firstName, lastName] = store.getters.getCurrentUser.displayName.split(" ");
  
    const fullName = computed(() => `${firstName} ${lastName}`);

    const userInfo = store.getters.getCurrentUser;
  
    const createAccountDate = GetDate(userInfo.reloadUserInfo.createdAt, ELanguage.Russian, true);

    return {
      firstName,
      lastName,
      fullName,
      userInfo,
      createAccountDate,
      TextLength: ELength.Text
    };
  },
});
</script>

<style lang="scss" scoped>
.profile-tab {
  padding-top: 20px;

  &__content {
    display: grid;
    grid-template-columns: minmax(auto, 500px) minmax(auto, 600px);
    gap: 40px;
  }

  .card {
    padding: 60px 30px 20px 30px;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba($color-black, 0.3);
    background-color: $color-white4;
    border: 2px solid transparent;
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
      .item-label {
        font-size: 14px;
      }
    }

    &__form {
      display: flex;
      flex-direction: column;

      :deep(.c-input) {
        border-radius: 4px;
        border: 1px solid rgba($color-black, 0.2);
        color: $color-black;
        margin: 5px 0;
      }

      padding-right: 20px;
      width: 50%;
    }

    &.info {
      border-color: $color-dark-blue;
    }

    &.edit {
      border-color: $color-green;
      align-items: start;
      padding: 15px;

      .file-upload {
        width: 170px;
        height: 170px;
      }

      .card__content {
        padding: 0;
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
    }
  }
}
</style>
