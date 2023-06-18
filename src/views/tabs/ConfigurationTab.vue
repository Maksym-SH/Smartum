<template>
  <div class="configuration-tab">
    <div class="configuration-tab__content">
      <div class="configuration-tab__content-navigation-filter">
        <AppCard table>
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
                <InlineSvg class="icon" :src="`/images/icons/${navigate.icon}.svg`" />
                <span>
                  {{ navigate.title }}
                </span>
                <InlineSvg
                  v-if="navigate.alwaysDisplay"
                  class="disable-icon"
                  src="/images/icons/lock.svg"
                />
              </td>
              <td class="card-content-info__item--actions">
                <AppCheckbox
                  v-model="navigate.showed"
                  switch-box
                  :disabled="navigate.alwaysDisplay"
                  :name="navigate.title"
                  label="Показать"
                  secondary-label="Скрыть"
                />
              </td>
            </tr>
          </template>
          <template #custom>
            <AppButton
              class="card-info--save-changes"
              title="Сохранить"
              @click="saveNavigationList"
            />
          </template>
        </AppCard>
      </div>
      <div class="configuration-tab__avatar-settings">
        <AppCard>
          <template #header>
            <h2 class="card-info__title settings-avatar">
              Изменить цвет фона профиля
              <AppButton size="small" title="Сохранить" @click="saveBackgroundAvatar" />
            </h2>
          </template>
          <template #content>
            <div class="card-info__change-avatar">
              <div class="card-info__change-avatar--result">
                <h5 class="card-info__avatar-title">Результат:</h5>
                <Avatar
                  :size="80"
                  :avatar="avatarParams"
                  :first-name="userName.firstName"
                  :last-name="userName.lastName"
                />
              </div>
              <div class="card-info__change-avatar--params">
                <h5>Изменить цвет</h5>
                <ColorPicker v-model="avatarParams.bgAvatar" theme="light" />
              </div>
              <small class="change-avatar-hint">
                Примечание: другие пользователи увидят выбранный вами цвет.
              </small>
            </div>
          </template>
        </AppCard>
      </div>
      <div class="configuration-tab__additional-settings">
        <AppCard>
          <template #header>
            <h2 class="card-info__title">Дополнительные настройки</h2>
          </template>
          <template #content>
            <div class="card-info__additional-settings">
              <div class="card-info__additional-settings-item">
                <h4 class="card-info__additional-settings-name">
                  Изменить фон боковой панели
                </h4>
                <ColorPicker v-model="asideBackgroundColor" theme="dark" />
              </div>
              <div class="card-info__additional-settings-item">
                <h4 class="card-info__additional-settings-name">
                  Статус подтверждения адреса
                </h4>
                <AppCheckbox
                  v-model="additionalParams.showEmailConfirm"
                  switch-box
                  name="ToggleStatus"
                  label="Показать"
                  secondary-label="Скрыть"
                />
              </div>
              <div class="card-info__additional-settings-item">
                <h4 class="card-info__additional-settings-name">Дата и время</h4>
                <AppCheckbox
                  v-model="additionalParams.showCurrentDate"
                  switch-box
                  name="ToggleTime"
                  label="Показать"
                  secondary-label="Скрыть"
                />
              </div>
              <div class="card-info__additional-settings-item">
                <h4 class="card-info__additional-settings-name">
                  Кнопка "Удалить аккаунт"
                </h4>
                <AppCheckbox
                  v-model="additionalParams.showDeleteAccountButton"
                  switch-box
                  name="ToggleDeleteAccount"
                  label="Показать"
                  secondary-label="Скрыть"
                />
              </div>
            </div>
          </template>
          <template #custom>
            <AppButton
              class="card-info--save-changes"
              title="Сохранить"
              @click="saveAdditional"
            />
          </template>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import useConfiguration from "@/composables/useConfiguration";
import AppCard from "@/layout/AppCard.vue";
import Avatar from "@/components/user/AppAvatar.vue";
import ColorPicker from "@/components/dialogs/SelectColor.vue";
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  components: {
    AppCard,
    Avatar,
    ColorPicker,
    InlineSvg,
  },
  setup() {
    return useConfiguration();
  },
});
</script>

<style lang="scss" scoped>
.configuration-tab {
  padding: 20px 0 20px 0;

  &__content {
    display: grid;
    grid-template-columns: repeat(2, 480px);
    gap: 50px;
    color: var(--color-text);

    &-navigation-filter {
      grid-area: 1/1/3/1;
    }

    .c-button {
      text-transform: none;
      color: $color-white1;
    }

    .card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      &-info {
        &__title {
          font-weight: 500;

          &.center {
            text-align: center;
          }

          &.settings-avatar {
            display: flex;
            justify-content: space-between;
          }
        }

        &--save-changes {
          margin: auto 10px 10px auto;
          display: block;
          min-width: 40%;
        }

        &__change-avatar {
          display: flex;
          justify-content: space-between;
          position: relative;

          &--result {
            height: 100px;
          }
          .user-avatar {
            border: 1px solid var(--color-text);
          }

          .change-avatar-hint {
            position: absolute;
            bottom: 0;
            font-size: 10px;
            right: -20px;
            text-align: end;
          }
        }

        &__additional-settings {
          display: flex;
          flex-direction: column;
          gap: 10px;

          &-item {
            display: flex;
            width: 100%;
            font-size: 14px;
            justify-content: space-between;
            align-items: center;
          }
        }
      }

      &-content-info {
        &__item--text {
          width: 100%;
          position: relative;
          display: inline-flex;
          align-items: center;

          .icon {
            margin-right: 10px;
            width: 17px;
          }

          .disable-icon {
            position: absolute;
            right: 2px;
            width: 15px;
          }
        }

        &--actions {
          text-align: center;
        }

        &--text,
        &--actions {
          height: 50px;
        }
      }
    }

    &-avatar-settings {
      .c-button {
        min-width: 90px;
        margin-left: 30px;
      }
    }

    &-additional-settings {
      grid-area: 2/2/3/3;
      .card {
        width: 100%;

        &-info {
          &__additional-settings-name {
            font-weight: 500;
          }
        }
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
            &--text,
            &--actions {
              padding: 10px 20px;
            }

            &--text {
              width: 230px;
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
    padding-top: 0;

    &__content {
      .card {
        width: 100%;

        &-info {
          &__title.center {
            padding-right: 50px;
          }
        }

        &-content-info {
          &__item {
            &--text {
              width: 100%;
            }
          }
        }
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
            &--text,
            &--actions {
              padding: 10px 10px 10px 15px;
              font-size: 12px;
            }

            &--text {
              padding-right: 20px;
              gap: 5px;

              .icon {
                margin: 0;
                width: 10px;
              }
            }
          }
        }

        &-info {
          &__title,
          &__title--settings-avatar {
            align-items: center;
            font-size: 15px;
            padding: 15px;
          }

          &__change-avatar {
            padding-bottom: 20px;

            .change-avatar-hint {
              right: 0;
              bottom: 15px;
              font-size: 11px;
              width: 60%;
              text-align: end;
            }
          }

          &__additional-settings-item {
            font-size: 12px;
          }

          &__additional-settings-name {
            padding-right: 5px;
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
            &--text,
            &--actions {
              padding: 5px;
              font-size: 12px;
            }

            &--text {
              padding-right: 20px;
            }
          }
        }

        &-info {
          &__title,
          &__title--settings-avatar {
            font-size: 13px;
            padding: 5px;
          }

          &__change-avatar {
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
