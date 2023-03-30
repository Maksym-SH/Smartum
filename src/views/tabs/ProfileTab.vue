<template>
  <div class="profile-tab">
    <form class="profile-tab__form" @submit.prevent>
      <div class="profile-tab__form--upload">
        <span class="label">Обновить фото профиля</span>
        <ImageUpload :fileType="'image'" />
      </div>
      <div class="form-item first-name">
        <Input 
          v-model.trim="userInfo.editedFirstName"
          @invalid="invalid = true"
          :min="userInfo.editedFirstName ? 3 : 0"
          :placeholder="userInfo.firstName"
          label="Имя"
        />
      </div>
      <div class="form-item last-name">
        <Input 
          v-model.trim="userInfo.editedLastName" 
          :min="userInfo.editedFirstName ? 3 : 0" 
          @invalid="invalid = true"
          :placeholder="userInfo.lastName" 
          label="Фамилия"
        />
      </div>
      <div class="form-item textarea">
        <Textarea 
          v-model.trim="userInfo.about" 
          :max="255"
          label="Дополнительная информация"
          placeholder="Расскажите о себе (не обязательно)"
        />
      </div>
      <div class="form-item phone">
        <Input 
          @invalid="invalid = true"
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
          :value="userInfo.email" 
          :placeholder="userInfo.email" 
          label="Почта"
        />
      </div>
      <div class="form-item dd">
        <Input 
          v-model="userInfo.email" 
          :placeholder="userInfo.email" 
          label="Фамилия"
        />
      </div>
      <Button 
        :disabled="disableBtnSave"
        variant="info"
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
      variant="success"
      @click="verify"
    >
      <span class="mdi mdi-email-open-multiple-outline"></span>
      Подтвердить почту
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, watch } from "vue";
import { useStore } from "vuex";
  
import { ELength } from "@/enums";
import { FileResult, IUserInfo } from "@/interfaces";

import { updateProfile, getAuth } from "@firebase/auth";

import refreshUserInfo from "@/helpers/firebase/firebaseRefresh";
import verifyEmail from "@/helpers/firebase/firebaseVerifyEmail";

import FileUpload from "@/components/fileUpload/FileUpload.vue";
import Avatar from "@/components/user/Avatar.vue";
import Card from "@/container/Card.vue";

import { OpenPopup } from "@/helpers/methods";

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
      imageURL: "",
      emailVerified: currentUser.emailVerified
    })

    const disableBtnSave = ref(true);

    const invalid = ref(false);

    watch([userInfo, invalid], (newInfo, newStatus) => {
      if (newInfo) {
        invalid.value = false;
      }  
      if (newStatus) {
        disableBtnSave.value = false;
      }
    });

    const setPhoto = (fileRes: FileResult) => {
      // ToDo: save image in firebase.
      const blob = URL.createObjectURL(new Blob([fileRes.result], { type : fileRes.type }));
      userInfo.imageURL = `${ fileRes.type } ${ blob }`; 
    }

    // Actions
    const saveChanges = (): void => {
      if(invalid.value) return;

      const userFirstName = userInfo.editedFirstName || firstName;
      const userLastName = userInfo.editedLastName || lastName;
     /*  const photo = imageURL.value; */

      store.dispatch("setLoadingStatus", true);

      updateProfile(currentUser, {
        displayName: `${userFirstName} ${userLastName}`,
      }).then(() => {
          refreshUserInfo()
        })
      .finally(() => store.dispatch("setLoadingStatus", false));
    }

    const verify = (): void => verifyEmail(currentUser);

    const deleteConfirm = (): void => {
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
      })
    };

    return {
      userInfo,
      disableBtnSave,
      invalid,
      userAvatar: computed(() => store.getters.getUserPhoto),
      TextLength: ELength.Text,
      setPhoto,
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
    row-gap: 10px;

    &--upload {
      grid-area: 1/1/3/1;

      .file-upload {
        width: 100%;
        height: 100%;
        max-height: 200px;
        max-width: 200px;
      }
    }

    .textarea {
      grid-area: 2/2/3/4;
      
      .textarea-wrapper {
        height: 123px;
      }
    }

    .btn-delete {
      grid-column-start: 3;
      max-width: 200px;
      justify-self: end;
    }

    @media (max-width: $lg) {
      max-width: 100%;
      padding-right: 40px;
      grid-template-columns: 200px 0.5fr 0.5fr;
    }

    @media (max-width: $md) {
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
        height: auto !important; 
      }
    }

    @media (max-width: $sm) {
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

    @media (max-width: $sm) {
      position: static;
      display: block;
      margin: 0 auto;
      margin: 20px auto;
    }
  } 
}
</style>
