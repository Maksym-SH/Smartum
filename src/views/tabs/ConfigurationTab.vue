<template>
  <div class="configuration-tab">
    <div class="configuration-tab__content">
      <div class="configuration-tab__content-navigation-filter">
        <Card table>
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
                  :name="navigate.title" 
                  label="Показать"
                  secondaryLabel="Скрыть" 
                  v-model="navigate.showed" 
                />
              </td>
            </tr>
          </template>
          <template #custom>
            <Button 
              @click="saveNavigationList"
              class="card-info--save-changes"
              title="Сохранить"
            />
          </template>
        </Card>
      </div>
      <div class="configuration-tab__content-wrapper">
        <div class="configuration-tab__content-avatar-settings">
          <Card>
            <template #header>
              <h2 class="card-info__title--settings-avatar">
                Изменить цвет фона профиля
                <Button
                  size="sm"
                  @click="saveBackgroundAvatar"
                  title="Сохранить"
                />
              </h2> 
            </template>
            <template #content>
              <div class="card-info__change-background-avatar">
                <div class="card-info__change-background-avatar--result">
                  <h5 class="card-info__avatar-title">Результат:</h5>
                  <Avatar 
                    :size="80"
                    :avatar="avatarParams"
                    :firstName="userName.firstName"
                    :lastName="userName.lastName"
                  />
                </div>
                <div class="card-info__change-background-avatar--params">
                  <h5>Изменить цвет</h5>
                  <ColorPalette v-model="avatarParams.bgAvatar" />
                </div>
                <small class="change-avatar-hint">
                  Примечание: выбирайте более светлые тона, чтобы ваши инициалы были различимы.
                </small>
              </div>
            </template>
          </Card>
        </div>
        <div class="configuration-tab__content-additional-settings">
          <Card>
            <template #header>
              <h2 class="card-info__title">
                Дополнительные настройки
              </h2> 
            </template>
            <template #content>
              <div class="card-info__additional-settings">
                <div class="card-info__additional-settings-item">
                  <h4 class="card-info__additional-settings-title">
                    Изменить фон боковой панели
                  </h4>
                  <ColorPalette v-model="asideBackgroundColor" />
                </div>
                <div class="card-info__additional-settings-item">
                  <h4 class="card-info__additional-settings-title">
                    Статус подтверждения адреса
                  </h4>
                  <Checkbox  
                    switchBox
                    name="ToggleStatus" 
                    label="Показать"
                    secondaryLabel="Скрыть" 
                    v-model="additionalParams.showEmailConfirm"
                  />
                </div>
                <div class="card-info__additional-settings-item">
                  <h4 class="card-info__additional-settings-title">
                    Дата и время
                  </h4>
                  <Checkbox  
                    switchBox
                    name="ToggleTime" 
                    label="Показать"
                    secondaryLabel="Скрыть" 
                    v-model="additionalParams.showCurrentDate"
                  />
                </div>
                <div class="card-info__additional-settings-item">
                  <h4 class="card-info__additional-settings-title">
                    Кнопка "Удалить аккаунт"
                  </h4>
                  <Checkbox  
                    switchBox
                    name="ToggleDeleteAccount" 
                    label="Показать"
                    secondaryLabel="Скрыть" 
                    v-model="additionalParams.showDeleteAccountButton"
                  />
                </div>
              </div>
            </template>
            <template #custom>
              <Button 
                @click="saveAdditional"
                class="card-info--save-changes"
                title="Сохранить"
              />
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Card from "@/container/Card.vue";
import Avatar from "@/components/user/Avatar.vue";
import ColorPalette from '@/components/ui/ColorPalette.vue';
import useConfiguration from "@/composables/useConfiguration";

export default defineComponent({
  components: { 
    Card,
    Avatar,
    ColorPalette
  },
  setup() {

    return useConfiguration();
  }
})

</script>

<style lang="scss" scoped>
.configuration-tab {
  padding: 20px 0 20px 0;
  &__content {
    display: flex;
    gap: 50px;
    color: var(--color-text);
    &-wrapper {
      display: flex;
      flex-direction: column;
      gap: 50px;
    }
    
    .card {
      width: fit-content;
      &-info {
        &__title {
          &.center {
            text-align: center;
          }
          &--settings-avatar {
            display: flex;
            justify-content: space-between;
          }
        }
        &--save-changes {
          margin: 0 10px 10px auto;
          display: block;
          min-width: 40%;
        }
        &__change-background-avatar {
          display: flex;
          justify-content: space-between;
          position: relative;
          .user-avatar {
            border: 1px solid var(--color-text);
          }
          &--params {
            .color-picker {
              width: 100%;
              height: 40px;
            }
          }
          .change-avatar-hint {
            position: absolute;
            bottom: 0;
            font-size: 10px;
            right: -20px;
            max-width: 220px;
          }
        }
        &__additional-settings {
          display: flex;
          flex-direction: column;
          gap:10px;
          &-item {
            display: flex;
            width: 100%;
            font-size: 14px;
            justify-content: space-between;
            align-items: center;
            .color-picker {
              width: 90px;
              height: 40px;
            }
          }
        }
      }
      &-content-info {
        &__item {
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
          &--actions {
            text-align: center;
          }
        }
      }
    }
    &-avatar-settings {
      .c-button {
        margin-left: 30px;
      }
    }
    &-additional-settings {
      grid-area: 2/2/3/3;
      .card {
        width: 100%;
      }
    }
  }
  @include responsive($xxl, max) {
    &__content {
      display: flex;
      flex-direction: column;
      max-width: none;
      gap: 12px;
      &-wrapper {
        gap: 12px;
      }
      
      .card {
        width: 100%;
        
        &-info {
          &--save-changes {
            margin-top: 10px;
            min-width: 20%;
            max-width: 100px;
          }
          &__title.center {
            text-align: end;
            padding-right: 60px;
          }
        }
        
        &-content-info {
          &__item {
            &--text, &--actions {
              padding: 10px 20px;
            }

            &--text {
              width: 35%;
              white-space: nowrap;
            }
            &--actions {
              text-align: end;
            }
          }
        }
      }

      &-avatar-settings {
        .c-button {
          margin-left: 0;
        }
      }
    }
  }
  @include mobile(max) {
    &__content {
      .card {
        width: 100%;
      }
    }
  }
  @include responsive($us, max) {
    &__content {
      .card {
        :deep(.card__header) {
          padding: 0;
        }
        :deep(.card__content) {
          padding: 15px;
        }
        .c-checkbox {
          min-width: 140px;
        }
        &-content-info {
          &__item {
            &--text, &--actions {
              padding: 10px 10px 10px 15px;
              font-size: 12px;
              .icon {
                display: none;
              }
            }
            &--text {
              padding-right: 20px;
            }
          }
        }
        &-info {
          &__title, &__title--settings-avatar {
            align-items: center;
            font-size: 15px;
            padding: 15px;
          }
          &__change-background-avatar {
            padding-bottom: 20px;
            .change-avatar-hint {
              right: 0;
              font-size: 11px;
              width: 60%;
              text-align: end;
            }
          }
          &__additional-settings-item {
            font-size: 12px;
            padding-right: 2px;
          }
        }
      }
    }
  }
  @include responsive($tiny, max) {
    &__content {
      .card {
        :deep(.card__content) {
          padding: 5px;
        }
        .c-checkbox {
          min-width: 140px;
        }
        &-content-info {
          &__item {
            &--text, &--actions {
              padding: 5px;
              font-size: 12px;
            }
            &--text {
              padding-right: 20px;
            }
          }
        }
        &-info {
          &__title, &__title--settings-avatar {
            font-size: 12.5px;
            padding: 5px;
          }
          &__change-background-avatar {
            .change-avatar-hint {
              font-size: 10px;
              width: 70%;
            }
          }
        }
      }
    }
  }
}
</style>