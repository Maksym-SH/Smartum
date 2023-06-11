<template>
  <div class="profile-tab">
    <form class="profile-tab__form" @submit.prevent>
      <div class="profile-tab__form--upload">
        <span class="label">Обновить фото профиля</span>
        <ImageUpload
          file-type="image"
          :avatar-params="userInfo.avatarParams.url"
          @loaded="updatePhoto"
          @deleted="deletePhoto"
        />
      </div>
      <div class="profile-tab__form-item first-name">
        <cInput
          v-model.trim="userInfo.firstName"
          :min="userInfo.firstName ? Length.Text : Length.None"
          :max-length="Length.Maximum"
          label="Имя"
          name="userFirstName"
          @keydown.enter.prevent
        />
      </div>
      <div class="profile-tab__form-item last-name">
        <cInput
          v-model.trim="userInfo.lastName"
          :min="userInfo.lastName ? Length.Text : Length.None"
          :max-length="Length.Maximum"
          label="Фамилия"
          name="userLastName"
          @keydown.enter.prevent
        />
      </div>
      <div class="profile-tab__form-item textarea">
        <cTextarea
          v-model.trim="userInfo.about"
          :max="Length.Textarea"
          label="Дополнительная информация"
          name="userAbout"
        />
      </div>
      <div class="profile-tab__form-item phone">
        <cInput
          v-model.trim="userInfo.phone"
          class="phone"
          is-phone
          label="Телефон"
          name="userPhone"
          @keydown.enter.prevent
        />
      </div>
      <div class="profile-tab__form-item email">
        <cInput
          v-model="userInfo.email"
          disabled
          is-email
          label="Электронный адрес"
          name="userEmail"
        />
      </div>
      <div class="profile-tab__form-item new-password">
        <Hint
          v-if="emailNotVerified"
          content="Для изменения пароля подтвердите электронный адрес."
          variant="danger"
        />
        <cInput
          v-model.trim="userInfo.newPassword"
          type="password"
          :disabled="emailNotVerified"
          :min="userInfo.newPassword ? Length.Password : Length.None"
          label="Новый пароль"
          name="userPassword"
          @keydown.enter.prevent
        />
      </div>
      <div class="profile-tab__form-buttons-wrapper">
        <cButton
          class="btn-save"
          :class="{ 'full-width-mobile': saveChangesButtonToFullScreen }"
          title="Сохранить"
          @click="saveChanges"
        />
        <transition name="toggle-content">
          <cButton
            v-if="showDeleteAccountButton"
            class="btn-delete"
            :color="Colors.Danger"
            title="Удалить аккаунт"
            @click="deleteAccountConfirm"
          />
        </transition>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { Colors, Length, NotificationType } from "@/types/enums";
import type { IUserInfo } from "@/types/interfaces";
import { Confirmation, DeleteAccountPopup } from "@/helpers/methods";
import { PasswordUpdate } from "@/helpers/firebase/firebaseUserInfoUpdate";

import RegExp from "@/helpers/regExp";
import newNotificationContent from "@/composables/useNotificationContent";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import useStores from "@/composables/useStores";
import FileUpload from "@/components/fileUpload/FileUpload.vue";
import Hint from "@/components/UI/Hint.vue";

export default defineComponent({
  components: {
    ImageUpload: FileUpload,
    Hint,
  },
  setup() {
    const { userStore, configurationStore, notificationStore } = useStores();

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
        url: "",
      },
      newPassword: "",
    });

    // Actions
    const showConfirmation = ref(true);

    const validForm = computed((): boolean => {
      if (
        (userInfo.phone.match(RegExp.Phone) || !userInfo.phone) &&
        (!userInfo.firstName || userInfo.firstName.length >= Length.Text) &&
        (!userInfo.lastName || userInfo.lastName.length >= Length.Text) &&
        (!userInfo.newPassword || userInfo.newPassword.length >= Length.Password)
      )
        return true;

      return false;
    });

    const emailNotVerified = computed((): boolean => !currentUser.value.emailVerified);

    const passwordChanged = computed((): boolean => userInfo.newPassword !== "");

    const showDeleteAccountButton = computed((): boolean => {
      return configurationStore.additionalParams.showDeleteAccountButton;
    });

    const saveChangesButtonToFullScreen = computed(() => !showDeleteAccountButton.value);

    // Update methods.
    const updatePhoto = (file: File) => {
      userInfo.photoFile = file;
    };
    const deletePhoto = (): void => {
      userInfo.photoFile = null;
      userInfo.avatarParams.url = "";
    };

    const profileUpdate = async (): Promise<any> => {
      const infoToUpdate = {
        ...userInfo,
        uid: unicID.value,
      };
      userStore.updateUserInfo(infoToUpdate).then((): void =>
        notify({
          title: "Ваши данные были успешно обновлены!",
        })
      );
    };

    const updatePassword = (): void => {
      PasswordUpdate(currentUser.value, userInfo.newPassword).then((): void => {
        const notification = newNotificationContent(NotificationType.PasswordChange);

        notificationStore.setNewNotification(notification);
        userInfo.newPassword = ""; // After update password reset input value.
        profileUpdate();
      });
      // Hide confirmation popup.
      showConfirmation.value = false;
    };

    const saveChanges = (): void => {
      if (!validForm.value) return;

      if (passwordChanged.value && showConfirmation.value) {
        Confirmation(true, updatePassword); // Show confirmation.
      } else {
        profileUpdate().then(() => {
          if (passwordChanged.value) updatePassword();
        });
      }
    };

    const deleteAccountPopup = (): void => {
      showConfirmation.value = false;
      DeleteAccountPopup(unicID.value)();
    };

    const deleteAccountConfirm = (): void => {
      if (showConfirmation.value) Confirmation(true, deleteAccountPopup);
      else deleteAccountPopup();
    };

    onMounted((): void => {
      const profileInfo = userStore.userInfo as Required<IUserInfo>;

      userInfo.firstName = profileInfo.firstName;
      userInfo.lastName = profileInfo.lastName;
      userInfo.about = profileInfo.about;
      userInfo.avatarParams.url = profileInfo.avatarParams.url || "";
      userInfo.phone = profileInfo.phone;
    });

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

    &-item {
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
      grid-area: 1/1/3/1;

      .label {
        font-size: 13px;
        color: var(--color-text);
      }

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

    &-buttons-wrapper {
      display: flex;
      justify-content: space-between;
      grid-area: 4/1/4/4;

      .btn-save,
      .btn-delete {
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

      &-item {
        &.new-password {
          .c-hint {
            font-size: 9px;
          }
        }
      }

      .c-textarea {
        height: 110px !important;
      }

      &-buttons-wrapper {
        .btn-save,
        .btn-delete {
          width: 170px;
        }
      }
    }
  }

  @include mobile(max) {
    height: 100%;
    padding-bottom: 20px;

    &__form {
      padding: 0;
      display: flex;
      height: 100%;
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

      &-item {
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

      &-buttons-wrapper {
        width: 100%;
        max-width: 440px;
        justify-content: space-between;
        margin-top: auto;
        padding-top: 30px;

        .btn-save,
        .btn-delete {
          font-size: 13px;
          width: 47%;
          max-width: none;
        }

        .btn-save {
          order: 2;

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
