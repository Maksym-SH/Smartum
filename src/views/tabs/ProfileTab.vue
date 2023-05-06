<template>
  <div class="profile-tab">
    <form class="profile-tab__form" @submit.prevent>
      <div class="profile-tab__form--upload">
        <span class="label">Обновить фото профиля</span>
        <ImageUpload 
          :fileType="'image'" 
          :avatarParams="userInfo.avatarParams.url"
          @loaded="updatePhoto"
          @deleted="deletePhoto"
        />
      </div>
      <div class="profile-tab__form_item first-name">
        <Input 
          v-model.trim="userInfo.firstName"
          @keydown.enter.prevent
          :min="userInfo.firstName ? Length.Text : Length.None"
          :maxLength="Length.Maximum"
          label="Имя"
          name="userFirstName"
        />
      </div>
      <div class="profile-tab__form_item last-name">
        <Input 
          v-model.trim="userInfo.lastName" 
          @keydown.enter.prevent
          :min="userInfo.lastName ? Length.Text : Length.None" 
          :maxLength="Length.Maximum"
          label="Фамилия"
          name="userLastName"
        />
      </div>
      <div class="profile-tab__form_item textarea">
        <Textarea 
          v-model.trim="userInfo.about" 
          :max="Length.Textarea"
          label="Дополнительная информация"
          name="userAbout"
        />
      </div>
      <div class="profile-tab__form_item phone">
        <Input 
          class="phone"
          @keydown.enter.prevent
          v-model.trim="userInfo.phone"
          isPhone
          label="Телефон"
          name="userPhone"
        />
      </div>
      <div class="profile-tab__form_item email">
        <Input 
          disabled
          isEmail
          v-model="userInfo.email" 
          label="Электронный адрес"
          name="userEmail"
        />
      </div>
      <div class="profile-tab__form_item new-password">
        <Hint 
          v-if="emailNotVerified"
          content="Для изменения пароля подтвердите электронный адрес." 
          variant="danger"
        />
        <Input 
          v-model.trim="userInfo.newPassword" 
          @keydown.enter.prevent
          type="password"
          :disabled="emailNotVerified"
          :min="userInfo.newPassword ? Length.Password : Length.None"
          label="Новый пароль"
          name="userPassword"
        />
      </div>
      <div class="profile-tab__form_buttons-wrapper">
        <Button 
          class="btn-save"
          :class="{'full-width-mobile': saveChangesButtonToFullScreen }"
          @click="saveChanges"
          title="Сохранить"
        />
        <transition name="toggle-content">
          <Button 
            v-if="showDeleteAccountButton"
            @click="deleteAccountConfirm"
            class="btn-delete"
            :color="Colors.Danger"
            title="Удалить аккаунт"
          />
        </transition>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { Length, NotificationType } from "@/enums";
import { IUserInfo } from "@/interfaces";
import { Confirmation, DeleteAccountPopup } from "@/helpers/methods";
import { PasswordUpdate } from "@/helpers/firebase/firebaseUpdate";
import { notify } from "@kyvg/vue3-notification";
import { Colors } from "@/enums";

import RegExp from "@/helpers/regExp";
import FileUpload from "@/components/fileUpload/FileUpload.vue";
import Avatar from "@/components/user/Avatar.vue";
import Card from "@/container/Card.vue";
import newNotificationContent from "@/composables/useNotificationContent";
import Hint from "@/components/UI/Hint.vue";
import useCurrentUserInfo from '@/composables/useCurrentUserInfo';

export default defineComponent({
  components: {
    Avatar,
    ImageUpload: FileUpload,
    Card,
    Hint
  },
  setup() {
    const store = useStore();
    // User info.
    const { currentUser, unicID } = useCurrentUserInfo();

    const userInfo = reactive<IUserInfo>({
      firstName: "",
      lastName: "",
      phone: "",
      about: "",
      email: currentUser.value.email as string,
      photoFile: null,
      avatarParams: {
        url: ""
      },
      newPassword: "",
    })

    // Actions
    const validForm = computed((): boolean => {
      if ((userInfo.phone.match(RegExp.Phone) || !userInfo.phone) &&
          (!userInfo.firstName || userInfo.firstName.length >= Length.Text) && 
            (!userInfo.lastName || userInfo.lastName.length >= Length.Text) &&
              (!userInfo.newPassword || userInfo.newPassword.length >= Length.Password))
      {
        return true;
      }

      return false;
    })

    const emailNotVerified = computed((): boolean => !currentUser.value.emailVerified);

    const passwordChanged = computed((): boolean => userInfo.newPassword != "");

    const showDeleteAccountButton = computed((): boolean => {
      return store.state.Configuration.additionalParams.showDeleteAccountButton;
    })

    const saveChangesButtonToFullScreen = computed(() => !showDeleteAccountButton.value);

    // Update methods.
    const updatePhoto = (file: File) => {
      userInfo.photoFile = file;
    }
    const deletePhoto = (): void => {
      userInfo.photoFile = null;
      userInfo.avatarParams.url = "";
    }
    const updatePassword = (): void => {
      PasswordUpdate(currentUser.value, userInfo.newPassword).then((): void => {

        store.commit("setNewNotification", newNotificationContent(NotificationType.PasswordChange))
        userInfo.newPassword = ""; // After update password reset input value.
        profileUpdate();
      })
      // Hide confirmation popup.
      showConfirmation.value = false;
    }

    const showConfirmation = ref(true);

    const profileUpdate = async(): Promise<any> => {
      const infoToUpdate = {
        ...userInfo,
        uid: unicID.value
      }
      store.dispatch("updateUserInfo", infoToUpdate)
      .then((): void => notify({
        title: "Ваши данные были успешно обновлены!"
      }))
    }

    const saveChanges = (): void => {
      if(!validForm.value) return;

      if(passwordChanged.value && showConfirmation.value) { // Show confirmation.
        Confirmation(true, updatePassword)
      }
      else {
        profileUpdate()
        .then(() => {
          if (passwordChanged.value) {
            updatePassword();
          }
        })
      }
    }

    const deleteAccountPopup = (): void => {
      showConfirmation.value = false;
      DeleteAccountPopup(unicID.value)();
    }

    const deleteAccountConfirm = (): void => {
      if (showConfirmation.value) {
        Confirmation(true, deleteAccountPopup);
      }
      else deleteAccountPopup();
    }

    onMounted((): void => {
      const profileInfo = store.state.User.userInfo;  

      userInfo.firstName = profileInfo.firstName;
      userInfo.lastName = profileInfo.lastName;
      userInfo.about = profileInfo.about;
      userInfo.avatarParams.url = profileInfo.avatarParams.url || "";
      userInfo.phone = profileInfo.phone;

    })

    return {
      userInfo,
      Length,
      validForm,
      emailNotVerified,
      showDeleteAccountButton,
      saveChangesButtonToFullScreen,
      Colors,
      updatePhoto,
      deletePhoto,
      saveChanges,
      deleteAccountConfirm,
    };
  },
});
</script>

<style lang="scss" scoped>
.profile-tab {
  position: relative;
  padding-top: 20px;
  &__form {
    display: grid;
    grid-template-columns: minmax(auto, 200px) repeat(2, 0.5fr);
    gap: 22px 25px;
    padding-bottom: 20px;
    max-width: 1200px;
    &_item {
      position: relative;
      &.new-password {
        .c-hint {
          top: -15%;
          right: 0;
          width: 100%;
          min-width: fit-content;
          @include responsive(600px, max) {
            right: -10%;
          }
        }
      }
    }
    &--upload {
      .label {
        font-size: 13px;
        color: var(--color-text);
      }
      grid-area: 1/1/3/1;
      .file-upload {
        width: 100%;
        height: 100%;
        max-height: 200px;
        max-width: 200px;
      }
    }
    .c-input {
      padding-bottom: 0;
      margin-top: 2px;
    }
    .textarea {
      grid-area: 2/2/3/4;
      .c-textarea {
        height: 130px;
      }
    }
    .btn-delete {
      grid-column-start: 3;
      max-width: 200px;
      justify-self: end;
    }
    &_buttons-wrapper {
      display: flex;
      justify-content: space-between;
      grid-area: 4/1/4/4;
      .btn-save, .btn-delete {
        color: $color-white1;
        text-transform: none;
        width: 30%;
        max-width: 200px;
      }
    }
    @include responsive($lg, max) {
      max-width: 100%;
      grid-template-columns: 200px 0.5fr 0.5fr;
    }
    @include responsive($md, max) {
      grid-template-columns: 170px 1fr 1fr;
      gap: 13px 15px;
      &--upload {
        .label {
          font-size: 14px;
        }
        .file-upload {
          max-width: 170px;
          max-height: 170px; 
        }
      }
      &_item {
        &.new-password {
          .c-hint {
            font-size: 9px;
          }
        }
      }
      .c-textarea {
        height: 110px !important; 
      }
      &_buttons-wrapper {
        .btn-save, .btn-delete {
          width: 170px;
        }
      }
    }
    @include mobile(max) {
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      &--upload {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .label {
          font-size: 16px;
        }
        .file-upload {
          max-width: none;
          max-height: none;
          height: 320px;
          max-width: 320px;
          :deep(.file-upload--delete) {
            width: 40px;
            height: 40px;
            font-size: 25px;
          }
        }
      }
      &_item {
        margin: 0 auto;
        width: 100%;
        max-width: 440px;
        &.new-password {
          .c-hint {
            font-size: 11px;
            top: -9px;
            right: 0;
          }
        }
      }
      &_buttons-wrapper {
        width: 100%;
        max-width: 440px;
        justify-content: space-between;
        .btn-save, .btn-delete {
          font-size: 13px;
          width: 47%;
          max-width: none;
        }
        .btn-save {
          &.full-width-mobile {
            width: 100%;
            max-width: 400px;
          }
        }
      }
    }
  }
}

</style>
