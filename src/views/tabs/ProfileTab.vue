<template>
  <div class="profile-tab">
    <form class="profile-tab__form" @submit.prevent>
      <div class="profile-tab__form--upload">
        <span class="label">Обновить фото профиля</span>
        <ImageUpload 
          :fileType="'image'" 
          :photoURL="userInfo.photoURL" 
          @loaded="updatePhoto"
          @deleted="deletePhoto"
        />
      </div>
      <div class="form-item first-name">
        <Input 
          v-model.trim="userInfo.editedFirstName"
          :min="userInfo.editedFirstName ? TextLength : LengthNone"
          :placeholder="userInfo.firstName"
          label="Имя"
        />
      </div>
      <div class="form-item last-name">
        <Input 
          v-model.trim="userInfo.editedLastName" 
          :min="userInfo.editedLastName ? TextLength : LengthNone" 
          :placeholder="userInfo.lastName" 
          label="Фамилия"
        />
      </div>
      <div class="form-item textarea">
        <Textarea 
          v-model.trim="userInfo.about" 
          :max="TextareaLength"
          label="Дополнительная информация"
          placeholder="Расскажите о себе (не обязательно)"
        />
      </div>
      <div class="form-item phone">
        <Input 
          class="phone"
          v-model.trim="userInfo.phone" 
          :placeholder="userInfo.phone"
          isPhone
          label="Телефон"
        />
      </div>
      <div class="form-item email">
        <Input 
          disabled
          isEmail
          v-model="userInfo.email" 
          label="Электронный адрес"
        />
      </div>
      <div class="form-item new-password">
        <Input 
          v-model.trim="userInfo.newPassword" 
          placeholder="Изменить пароль" 
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
import { defineComponent, computed, ref, reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { getAuth, User } from "@firebase/auth";
import { ELength } from "@/enums";
import { FileResult, IUserInfo } from "@/interfaces";
import verifyEmail from "@/helpers/firebase/firebaseVerifyEmail";
import RegExp from "@/helpers/regExp";
import { Confirmation, OpenPopup } from "@/helpers/methods";
import { ProfileUpdateAdditional, GetUserInfo } from "@/database";
import FileUpload from "@/components/fileUpload/FileUpload.vue";
import Avatar from "@/components/user/Avatar.vue";
import Card from "@/container/Card.vue";
import { ProfileUpdate, PasswordUpdate } from "@/helpers/firebase/firebaseUpdate";
import { notify } from "@kyvg/vue3-notification";

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

    const [firstName, lastName] = store.getters.getCurrentUser?.displayName?.split(" ");

    const userInfo: IUserInfo = reactive({
      editedFirstName: "",
      editedLastName: "",
      firstName, lastName,
      fullName: `${firstName} ${lastName}`,
      phone: "",
      about: "",
      email: currentUser.email,
      photoURL: "",
      emailVerified: currentUser.emailVerified,
      newPassword: ""
    })

    const validForm = computed((): boolean => {
      if ((userInfo.phone.match(RegExp.Phone) || !userInfo.phone) &&
          (!userInfo.editedFirstName || userInfo.editedFirstName.length >= ELength.Text) && 
            (!userInfo.editedLastName || userInfo.editedLastName.length >= ELength.Text) &&
              (!userInfo.newPassword || userInfo.newPassword.length >= ELength.Password))
      {
        return true;
      }

      return false;
    })


    // Actions
    const btnSaveDisable = ref(true);
    const imgChanged = ref(false);

    const passwordChanged = computed(() => userInfo.newPassword != "");

    // Disable save changes button.
    watch(userInfo, () => {
      btnSaveDisable.value = false;
    })

    // Update methods.
    const updatePhoto = ({ result }: FileResult) => {
      userInfo.photoURL = JSON.stringify({ result });
      imgChanged.value = true;
    }
    const deletePhoto = (): void => {
      userInfo.photoURL = "";
      imgChanged.value = true;
    }
    const updatePassword = (): void => {
      PasswordUpdate(currentUser, userInfo.newPassword).then(() => {
        userInfo.newPassword = ""; // After update password reset input value.
        profileUpdate();
      })
      // Hide confirmation popup.
      showConfirmation.value = false;
    }

    const showConfirmation = ref(true);

    const profileUpdate = (): Promise<void> => {
      const userFirstName = userInfo.editedFirstName || firstName;
      const userLastName = userInfo.editedLastName || lastName;

      return Promise.all([
        ProfileUpdate(currentUser, `${ userFirstName } ${ userLastName }`),
        ProfileUpdateAdditional(userInfo, currentUser, imgChanged.value)
      ]).then(() => notify({
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

      OpenPopup({
        title: "Удалить аккаунт?",
        text: "Это действие необратимо!",
        buttons: {
          yes: {
            text: "Удалить аккаунт",
            variant: "danger"
          },
        },
        callback: () => {
          getAuth().currentUser?.delete()
          .then(() => store.dispatch("userLogout"));
        }
      });
    }

    const deleteConfirm = (): void => {
      if (showConfirmation.value) {
        Confirmation(true, deleteAccountPopup);
      }
      else deleteAccountPopup();
    }

    onMounted(():void => {
      GetUserInfo().then(():void => {
        const userAdditionalInfo = store.getters.getAdditionalUserInfo;
        userInfo.about = userAdditionalInfo.about;
        userInfo.phone = userAdditionalInfo.phone;
        userInfo.photoURL = store.getters.getUserPhoto;

      }).then(():boolean => btnSaveDisable.value = true)
    })

    return {
      userInfo,
      TextLength: ELength.Text,
      PasswordLength: ELength.Password,
      LengthNone: ELength.None,
      TextareaLength: ELength.Textarea,
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
    .input-wrapper {
      padding-bottom: 0;
    }
    .textarea {
      grid-area: 2/2/3/4;
      .textarea-wrapper {
        height: 130px;
      }
    }
    .btn-delete {
      grid-column-start: 3;
      max-width: 200px;
      justify-self: end;
    }
    @include respond($lg, max) {
      max-width: 100%;
      padding-right: 40px;
      grid-template-columns: 200px 0.5fr 0.5fr;
    }
    @include respond($md, max) {
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
      .textarea-wrapper {
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
          height: 200px;
          width: 200px;
        }
      }
      .form-item {
        margin: 0 auto;
        width: 100%;
        max-width: 330px;
      }
      .c-button {
        width: 45%;
        margin: 0 auto;
        max-width: none;
      }
    }
  }
  .verify-email-btn {
    position: absolute;
    top: -80px;
    right: 10px;
    @include mobile(max) {
      position: static;
      display: block;
      margin: 0 auto;
      margin: 20px auto;
    }
  } 
}
</style>
