<template>
  <div class="auth">
    <div class="auth__window">
      <div class="auth__window--image">
        <img src="@/assets/img/icons/logo.svg" alt="Logo">
      </div>
      <c-auth-form/>
    </div>
  </div>
</template>

<script setup>
import cAuthForm from "@/components/Forms/auth";
</script> 

<style lang="scss" src="./index.scss"></style>