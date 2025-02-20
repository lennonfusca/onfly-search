<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="bg-white text-dark">
        <q-img
          src="../assets/onflyLogo.png"
          width="120px"
          height="40px"
          style="margin-left: 30px"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>
