<template>
  <div class="configuration-tab">
    <div class="configuration-tab__content">
      <div class="configuration-tab-navigation-filter">
        <Card table v-if="showedNavigations.length">
          <template #table-header>
            <th class="card-info__title">Страницы</th>
            <th class="card-info__title center">Действие</th>
          </template>
          <template #table-body>
            <tr
              v-for="navigate in showedNavigations"
              :key="navigate.id"
              class="card-content-info__item"
            >
              <td class="card-content-info__item--text">
                <span class="icon mdi" :class="`mdi-${ navigate.icon }`"></span>
                <span>
                  {{ navigate.title }} 
                </span>
                <span v-if="navigate.alwaysDisplay" class="disable-icon mdi mdi-lock"></span>
              </td>
              <td class="card-content-info__item--actions">
                <Checkbox  
                  switchBox
                  :disabled="navigate.alwaysDisplay"
                  name="language" 
                  label="Показать"
                  secondaryLabel="Скрыть" 
                  v-model="navigate.showed" 
                />
              </td>
            </tr>
          </template>
        </Card>
      </div>
      <div class="configuration-tab__additional-settings">
        <Card>
          <template #header>
           <h2 class="card-info__title">
            Изменить цвет фона аватара 
            <Button
              size="sm" 
              title="Сохранить"
            />
           </h2> 
          </template>
          <template #content>
            <div class="card-info__change-background-avatar">
              <div class="card-info__change-background-avatar--result">
                <h5>Результат:</h5>
                <Avatar 
                  :size="70"
                  :avatar="avatarParams"
                  :firstName="userName.firstName"
                  :lastName="userName.lastName"
                />
              </div>
              <div class="card-info__change-background-avatar--params">
                <h5>Изменить цвет</h5>
                <ColorPalette v-model="avatarParams.bgAvatar" />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch,ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { IAsideNavigationItem, IPictureParams, IUserInfo } from '@/interfaces';
import { UserName } from "@/types";
import { NewObjectLink } from '@/helpers/methods';
import Card from "@/container/Card.vue";
import Avatar from "@/components/user/Avatar.vue";
import ColorPalette from '@/components/ui/ColorPalette.vue';

export default defineComponent({
  components: { 
    Card,
    Avatar,
    ColorPalette
  },
  setup() {
    const store = useStore();

    const showedNavigations = reactive<IAsideNavigationItem[]>([]);

    const avatarParams: Required<IPictureParams> = reactive({
      bgAvatar:"",
      url: "" 
    })

    const userName = reactive<UserName>({
      firstName: "",
      lastName: ""
    });

    watch(() => store.state.Configuration.asideNavigate, (navigations: IAsideNavigationItem[]) =>  {
      showedNavigations.push(...navigations);
    })

    const saveChanges = () => {
      console.log(123);
    }

    const saveBackgroundAvatar = () => {
      store.dispatch()
    }

    onMounted(() => {
      store.dispatch("getUserInfo").then((): void => {
        const navigations = NewObjectLink(store.state.Configuration.asideNavigate); 
        showedNavigations.push(...navigations);
        
        avatarParams.bgAvatar = store.state.User.userInfo.avatarParams.bgAvatar; // Set background avatar.
        
        const userInfo: IUserInfo = store.state.User.userInfo;

        userName.firstName = userInfo.firstName;
        userName.lastName = userInfo.lastName;
      })
    })

    return {
      showedNavigations,
      avatarParams,
      userName
    }
  }
})

</script>

<style lang="scss" scoped>
.configuration-tab {
  padding-top: 20px;
  &__content {
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
    color: var(--color-text);
    .card {
      width: fit-content;
      &-info {
       &__title {
          &.center {
            text-align: center;
          }
        }
        &__change-background-avatar {
          display: flex;
          justify-content: space-between;
          &--params {
            .color-picker {
              width: 100%;
              height: 40px;
            }
          }
        }
      }
      &-content-info__item {
        &--text {
          position: relative;
          .icon {
            margin-right: 10px;
          }
          .disable-icon {
            position: absolute;
            right: 0;
          }
        }
      }
    }
  }
  &__additional-settings {
    .c-button {
      margin-left: 30px;
    }
  }
}
</style>