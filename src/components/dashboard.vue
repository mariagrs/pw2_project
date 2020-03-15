<template>
    <v-card
    height="100%"
    width="100%"
    >
      <div class = "dashboard">
        <v-toolbar dense>
          <v-toolbar-title>Hephaïstos</v-toolbar-title>
        </v-toolbar>

      </div>
    </v-card>
</template>

<script>
import axios from 'axios'
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'
export default {
  name: 'dashboard',
  data: () => ({
    title: ''
  }),
  mounted () {
    this.tests_editor = ace.edit('tests_editor')
    this.tests_editor.setTheme('ace/theme/monokai')
    this.tests_editor.session.setMode('ace/mode/python')
    this.solution_editor = ace.edit('solution_editor')
    this.solution_editor.setTheme('ace/theme/monokai')
    this.solution_editor.session.setMode('ace/mode/python')
  },
  methods: {
    async play () {
      try {
        const result = await axios.post('http://localhost:3000/api/v1/exercise/sandbox', {
          lang: 'python',
          tests: this.tests_editor.getValue(),
          solution: this.solution_editor.getValue()
        })
        console.log(JSON.parse(JSON.stringify(result.data)))
      } catch (err) {
        this.errorLogin = err
      }
    },
    async save () {
      try {
        var date = new Date()
        const result = await axios.post('http://localhost:3000/api/v1/exercise', {
          consignes: this.instructions,
          lang: 'python',
          title: this.title,
          tests: this.tests_editor.getValue(),
          solution: this.solution_editor.getValue(),
          template_regions: [],
          template_regions_rw: [],
          difficulty: 10,
          score: 5,
          creation_date: date
        })
        console.log('Sauvegarde de l\'exercice', JSON.parse(JSON.stringify(result.data)))
      } catch (err) {
        this.errorLogin = err
      }
    }
  }
}
</script>

<style>
.exercise-editor-ace-editor {
 position: relative;
 height: 20rem;
}
</style>
