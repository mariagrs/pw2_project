<template>
  <v-card
    color="grey lighten-4"
    flat
    height="100%"
    width="100%"
    tile
  >
    <v-toolbar dense>
      <v-toolbar-title>Hephaïstos - Liste de vos modules</v-toolbar-title>
    </v-toolbar>
  <v-layout column justify-center align-center>
    <v-row xs12 sm8 md12 style="max-width:88rem">
      <v-col v-for="module in modules" :key="module.id">
        <h2>
          <router-link :to="`/module/${module.id}`">
            {{ module.name }}
          </router-link>
        </h2>
        <v-row justify="start">
          <v-card
          class="ma-2"
          height="8em"
          width="16em"
          v-for="session in getSessionsByModuleId(module.id)"
          :key="session.id">
            <v-card-title class="subtitle-1">
              {{ session.name }}
            </v-card-title>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
  </v-card>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState('modules', ['modules']),
    ...mapGetters('sessions', ['getSessionsByModuleId'])
  },
  methods: {
    ...mapActions('modules', ['fetchModules']),
    ...mapActions('sessions', ['fetchSessionsForModule'])

  },
  async mounted () {
    await this.fetchModules()
    /* for (const module of this.modules) {
      await this.fetchSessionsForModule({ moduleId: module.id })
    } */
    await Promise.all(
      this.modules.map(m => this.fetchSessionsForModule({ moduleId: m.id }))
    )
  }
}
</script>
