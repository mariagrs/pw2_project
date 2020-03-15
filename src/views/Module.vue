<template>
  <v-card
    color="grey lighten-4"
    flat
    height="100%"
    width="100%"
    tile
  >
    <v-toolbar dense>
      <v-toolbar-title>Hephaïstos</v-toolbar-title>
    </v-toolbar>
  <v-layout column justify-center align-center>
    <br>
    <h1> {{module.name}} </h1>
    <v-row xs12 sm8 md12 style="max-width:88rem">
      <v-col v-for="session in sessions" :key="session.id"
      cols="12">
        <h2>
          <router-link :to="`/sessions/${session.id}/do`">
            {{ session.name }}
          </router-link>
        </h2>
        <v-row justify="start">
          <v-card
          class="ma-2"
          height="8em"
          width="25em"
          v-for="exercise in getExercisesBySessionId(session.id)"
          :key="exercise.id">
            <v-card-title class="subtitle-1">
              {{ exercise.title }}
            </v-card-title>
            <v-card-text>
            </v-card-text>
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
  name: 'Module',
  computed: {
    ...mapState('modules', ['modules']),
    ...mapGetters('modules', ['getModuleById']),
    ...mapGetters('sessions', ['getSessionsByModuleId']),
    ...mapGetters('exercises', ['getExercisesBySessionId']),
    module () {
      return this.getModuleById(this.moduleId) ||
      { name: 'Loading..' }
    },
    moduleId () {
      return parseInt(this.$route.params.id)
    },
    sessions () {
      return this.getSessionsByModuleId(this.moduleId)
    }
  },
  methods: {
    ...mapActions('modules', ['fetchModule']),
    ...mapActions('sessions', ['fetchSessionsForModule']),
    ...mapActions('exercises', ['fetchExercisesForSession'])
  },
  async mounted () {
    await this.fetchModule({ id: this.moduleId })
    /* for (const module of this.modules) {
      await this.fetchSessionsForModule({ moduleId: module.id })
    } */
    await Promise.all(
      this.modules.map(m => this.fetchSessionsForModule({ moduleId: m.id }))
    )
    await Promise.all(
      this.sessions.map(s => this.fetchExercisesForSession({ sessionId: s.id }))
    )
  }
} // session par exo et fetch exo pour chaque session
</script>
