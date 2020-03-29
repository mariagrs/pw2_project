<template>
    <v-card
    height="100%"
    width="100%"
    >
      <div class = "dashboard">
        <v-toolbar dense>
          <v-toolbar-title>Editeur d'exercice</v-toolbar-title>
        </v-toolbar>
        <v-form>
          <v-row>
            <v-col>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      v-model="title"
                      label="title"
                      single-line
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-select
                      :items="items"
                    ></v-select>
                  </v-col>

                  <v-btn class="ma-6" color="blue" dark  @click="save">
                    <v-icon dark>mdi-content-save</v-icon>
                  </v-btn>
                </v-row>
                <div>
                  <p class="font-weight-bold headline">Consignes</p>
                </div>
                <v-col cols="12" md="10">
                  <v-textarea
                    v-model="consignes"
                    solo
                    name="input-7-4"
                  ></v-textarea>
                </v-col>
                <div>
                  <p class="font-weight-bold headline">Template de résolution</p>
                </div>
                <v-col cols="12" md="10">
                  <v-textarea
                    solo
                    name="input-7-4"
                  ></v-textarea>
                </v-col>
              </v-container>
            </v-col>

            <v-col>
              <div>
                <p class="font-weight-bold headline">Test</p>
              </div>
              <div id="tests_editor" class="exercise-editor-ace-editor" ></div>
              <br>
              <v-row>
                <div>
                  <p class="font-weight-bold headline">Sandbox</p>
                </div>
                <v-btn small color="blue" dark @click="play">
                <v-icon dark>mdi-play</v-icon>
                </v-btn>
              </v-row>
              <div id="solution_editor"  class="exercise-editor-ace-editor">
              </div>
              <br>
              <div>
                <p class="font-weight-bold headline">Résultats des tests</p>
              </div>
            </v-col>
          </v-row>
        </v-form>
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
    title: '',
    items: ['Python'],
    consignes: '',
    solution_editor: null,
    tests_editor: null
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
