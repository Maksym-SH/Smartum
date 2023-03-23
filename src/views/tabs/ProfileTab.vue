<template>
  <div class="profile-tab">
    <div class="profile-tab__content">
      <Card>
        <template #descript>
          <Avatar :name="fullName" :image="userAvatar" :size="150" />
        </template>
        <template #content>
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
        </template>
        <template #footer>
          Ваши данные
        </template>
      </Card>
      <Card class="edit" variant="success">
        <template #descript>
          <div class="card__image">
            <span class="item-label">Обновить фото профиля</span>
            <ImageUpload fileType="image"  @loaded="setPhoto"/>
          </div>
        </template>
        <template #form>
          <form @submit.prevent="saveChanges">
            <label for="firtName">Имя:</label>
            <Input
              name="firstName" 
              transparent 
              :min="TextLength" 
              :placeholder="firstName"
              v-model="editedFirstName"
            />

            <label for="firtName">Фамилия:</label>
            <Input 
              name="lastName" 
              transparent 
              :min="TextLength" 
              :placeholder="lastName"
              v-model="editedLastName"
            />
            <Button :disabled="disableBtnSave"> 
              Сохранить <span class="mdi mdi-content-save-outline"></span>
            </Button> 
          </form>
        </template>
        <template #footer>
          Редактирование данных
        </template>
      </Card>
      <div class="card edit">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Avatar from "@/components/user/Avatar.vue";
import Card from "@/container/Card.vue";
import { useStore } from "vuex";
import FileUpload from "@/components/fileUpload/FileUpload.vue";
import GetDate from "@/helpers/date/useInfoTime";
import { ELanguage, ELength } from "@/enums/index";
import { updateProfile } from "@firebase/auth";
import refreshUserInfo from "@/helpers/firebase/firebaseRefresh";
import { FileResult } from "@/interfaces/index";

export default defineComponent({
  components: {
    Avatar,
    ImageUpload: FileUpload,
    Card
  },
  setup() {
    const store = useStore();

    // Edit
    const editedFirstName = ref("");
    const editedLastName = ref("");

    const [firstName, lastName] = store.getters.getCurrentUser?.displayName?.split(" ");
  
    const fullName = computed(() => `${firstName} ${lastName}`);

    const userInfo = store.getters.getCurrentUser;
  
    const createAccountDate = GetDate(userInfo.reloadUserInfo.createdAt, ELanguage.Russian, true);

    const imageURL = ref("");

    const disableBtnSave = computed(() => 
                  (!editedFirstName.value && !editedLastName.value) && !imageURL.value)

    const setPhoto = (fileRes: FileResult) => {
      imageURL.value = `${fileRes.type} ${ URL
                          .createObjectURL(new Blob([fileRes.result], { type : fileRes.type })) }`;
    }

    const saveChanges = () => {
      const userFirstName = editedFirstName.value || firstName;
      const userLastName = editedLastName.value || lastName;
      const photo = imageURL.value;

      store.dispatch("setLoadingStatus", true);

      updateProfile(userInfo, {
        photoURL: photo,
        displayName: `${userFirstName} ${userLastName}`,
      }).then(() => {
          refreshUserInfo()
        })
      .finally(() => store.dispatch("setLoadingStatus", false));
    }

    return {
      firstName,
      lastName,
      fullName,
      userInfo,
      editedFirstName,
      editedLastName,
      createAccountDate,
      imageURL,
      disableBtnSave,
      userAvatar: computed(() => store.getters.getUserPhoto),
      setPhoto,
      saveChanges,
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
    grid-template-columns: minmax(auto, 400px) minmax(auto, 600px);
    gap: 40px;
    
    .card {
      h2 {
        max-width: 100%;
        display: inline-flex;
        white-space: nowrap;
      }

      &.edit {
        padding-top: 15px;

        .file-upload {
          margin-top: 20px;
          width: 200px;
          height: 200px;
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
}
</style>
