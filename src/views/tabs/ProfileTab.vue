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
      <div class="profile-tab__form_form-item first-name">
        <Input 
          v-model.trim="userInfo.firstName"
          @keydown.enter.prevent
          :min="userInfo.firstName ? TextLength : LengthNone"
          label="Имя"
        />
      </div>
      <div class="profile-tab__form_form-item last-name">
        <Input 
          v-model.trim="userInfo.lastName" 
          @keydown.enter.prevent
          :min="userInfo.lastName ? TextLength : LengthNone" 
          label="Фамилия"
        />
      </div>
      <div class="profile-tab__form_form-item textarea">
        <Textarea 
          v-model.trim="userInfo.about" 
          :max="TextareaLength"
          label="Дополнительная информация"
          placeholder="Расскажите о себе (не обязательно)"
        />
      </div>
      <div class="profile-tab__form_form-item phone">
        <Input 
          class="phone"
          @keydown.enter.prevent
          v-model.trim="userInfo.phone" 
          :placeholder="userInfo.phone"
          isPhone
          label="Телефон"
        />
      </div>
      <div class="profile-tab__form_form-item email">
        <Input 
          disabled
          isEmail
          v-model="userInfo.email" 
          label="Электронный адрес"
        />
      </div>
      <div class="profile-tab__form_form-item new-password">
        <Input 
          v-model.trim="userInfo.newPassword" 
          placeholder="Изменить пароль" 
          @keydown.enter.prevent
          type="password"
          :min="userInfo.newPassword ? PasswordLength : LengthNone"
          label="Новый пароль"
        />
      </div>
      <Button 
        variant="info"
        :disabled="btnSaveDisable"
        @click="saveChanges"
        title="Сохранить"
      />
      <Button 
        @click="deleteConfirm"
        class="btn-delete"
        variant="danger"
        title="Удалить аккаунт"
      />
    </form>
    <Button
      v-if="!userInfo.emailVerified"
      class="verify-email-btn"
      variant="info"
      @click="verify"
    >
      <span class="mdi mdi-email-open-multiple-outline"></span>
      Подтвердить почту
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { getAuth } from "@firebase/auth";
import { Length } from "@/enums";
import { FileResult, IUserInfo } from "@/interfaces";
import { Confirmation, DeleteAccountPopup } from "@/helpers/methods";
import { PasswordUpdate } from "@/helpers/firebase/firebaseUpdate";
import { notify } from "@kyvg/vue3-notification";
import verifyEmail from "@/helpers/firebase/firebaseVerifyEmail";
import RegExp from "@/helpers/regExp";
import FileUpload from "@/components/fileUpload/FileUpload.vue";
import Avatar from "@/components/user/Avatar.vue";
import Card from "@/container/Card.vue";

export default defineComponent({
  components: {
    Avatar,
    ImageUpload: FileUpload,
    Card
  },
  setup() {
    const store = useStore();
    // User info.
    const currentUser = store.getters.getCurrentUser;

    const userInfo: IUserInfo = reactive({
      firstName: "",
      lastName: "",
      phone: "",
      about: "",
      email: currentUser.email,
      photoFile: null,
      avatarParams: {
        url: ""
      },
      emailVerified: currentUser.emailVerified,
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

    const btnSaveDisable = ref(true);
    const passwordChanged = computed((): boolean => userInfo.newPassword != "");

    // Disable save changes button.
    watch(userInfo, () => {
      btnSaveDisable.value = false;
    })

    // Update methods.
    const updatePhoto = (file: File) => {
      userInfo.photoFile = file;
    }
    const deletePhoto = (): void => {
      userInfo.photoFile = null;
      userInfo.avatarParams.url = "";
    }
    const updatePassword = (): void => {
      PasswordUpdate(currentUser, userInfo.newPassword).then((): void => {
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
        uid: currentUser.uid
      }
      store.dispatch("updateUserInfo", infoToUpdate).then((): void => notify({
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

    const verify = (): void => verifyEmail(currentUser); // Confirmation email.

    const deleteAccountPopup = (): void => {
      showConfirmation.value = false;
      DeleteAccountPopup(currentUser.uid)();
    }

    const deleteConfirm = (): void => {
      if (showConfirmation.value) {
        Confirmation(true, deleteAccountPopup);
      }
      else deleteAccountPopup();
    }

    onMounted(():void => {
      store.dispatch("getUserInfo").then((): void => {
        const field = store.getters.getUserInfo;  

        userInfo.firstName = field.firstName;
        userInfo.lastName = field.lastName;
        userInfo.about = field.about;
        userInfo.avatarParams.url = field.avatarParams.url || "";
        userInfo.phone = field.phone;

      }).then(():boolean => btnSaveDisable.value = true)
    })

    return {
      userInfo,
      TextLength: Length.Text,
      PasswordLength: Length.Password,
      LengthNone: Length.None,
      TextareaLength: Length.Textarea,
      validForm,
      btnSaveDisable,
      updatePhoto,
      deletePhoto,
      saveChanges,
      deleteConfirm,
      verify,
    };
  },
});
</script>

<style lang="scss" scoped>
.profile-tab {
  padding-top: 20px;
  position: relative;
  &__form {
    display: grid;
    grid-template-columns: minmax(auto, 200px) repeat(2, 0.4fr);
    gap: 25px;
    padding-bottom: 20px;
    max-width: 1200px;
    row-gap: 22px;
    &--upload {
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
    @include responsive($lg, max) {
      max-width: 100%;
      padding-right: 40px;
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
      .c-textarea {
        height: 110px !important; 
      }
    }
    @include mobile(max) {
      padding: 0;
      display: flex;
      flex-wrap: wrap;
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
          width: 320px;
        }
      }
      &_form-item {
        margin: 0 auto;
        width: 100%;
        max-width: 400px;
      }
      .c-button {
        width: 45%;
        max-width: 170px !important;
        font-size: 14px;
        max-width: none;
        margin: 10px auto;
      }
    }
  }
  .verify-email-btn {
    position: absolute;
    top: -115px;
    right: 5px;
    @include mobile(max) {
      position: static;
      display: block;
      margin: 0 auto;
      font-size: 14px;
      margin: 20px auto;
    }
  } 
}
</style>
