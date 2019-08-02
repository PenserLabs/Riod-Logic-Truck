<template>
    <v-container>
        <v-chip
            class="my-4 pa-4 headline font-weight-regular"
            color="primary"
            outline
            label
        >
            <v-icon left>mdi-truck</v-icon>
            {{ nid }}
        </v-chip>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4>
                <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="date1"
                        label="From"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="date1" @input="menu2 = false" :max="date2"></v-date-picker>
                </v-menu>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="date2"
                        label="To"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" @input="menu2 = false" :min="date1"></v-date-picker>
                </v-menu>
            </v-flex>
            <v-flex xs12 md4 class="text-xs-center">
                <v-btn class="text-xs-center" @click="getLogs" :loading="loading">Get Logs</v-btn>
            </v-flex>
        </v-layout>

        <div>
            <v-alert 
                type="error"
                :value="error"
            >
                Could not find any data for the specified dates.
            </v-alert>
        </div>
        <v-data-table
            v-if="tableFlag"
            :headers="headers"
            :items="logs"
            :rows-per-page-items="rowsPerPageItems"
            :pagination.sync="pagination"
            class="elevation-1 my-3"
        >
            <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.SlNo }}</td>
                <td class="text-xs-left">{{ props.item.Time }}</td>
                <td class="text-xs-left">{{ props.item.Temperature }} &#8451;</td>
            </template>
        </v-data-table>

        <v-layout row wrap>
            <v-flex xs6>
                <download-excel
                    :data="logs"
                    v-if="tableFlag"
                    :title="'Temperature Data for Truck No.'+nid+' ('+date1+' to '+date2+')'"
                    :name = "'Truck '+nid+' '+date1+' to '+date2"
                    class="text-xs-right ma-3"
                >
                <v-btn
                >
                    <v-icon class="mr-2">mdi-folder-download</v-icon>
                    Export as Excel
                </v-btn>
                </download-excel>
            </v-flex>

            <v-flex xs6>
                <div class="ma-3 text-xs-left">
                    <v-btn
                    @click="createPDF"
                    v-if="tableFlag"
                >
                    <v-icon class="mr-2">mdi-file-document</v-icon>
                    Export as PDF
                </v-btn>
                </div>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>
import axios from 'axios'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
    data() {
        return {
            nid: this.$route.params.id,
            date1: new Date().toISOString().substr(0, 10),
            date2: new Date().toISOString().substr(0, 10),
            menu1: false,
            menu2: false,
            tableFlag: false,
            loading: false,
            error: false,
            logs: [{
                SlNo: '',
                Time: '',
                Temperature: ''
            }],
            headers: [
                { text: 'Sl No', value:'SlNo', width: 5},
                { text: 'Time', value: 'Time', sortable: false },
                { text: 'Temperature', align: 'left', sortable: false, value: 'Temperature', width:5 }
                
            ],
            export: [],
            rowsPerPageItems: [10, 20, 30, 40],
            pagination: {
                            rowsPerPage: 10
                        },
        }
    },
    methods: {
        getLogs() {
            this.loading = true;

            //From Date converted to milliseconds and adjusted for offset.
            
            this.from = new Date(this.date1);

            //Getting offset and converting to milliseconds

            let offset = this.from.getTimezoneOffset();
            offset = offset*60000;

            this.from = this.from.getTime() + offset;

            //Converting To date to milliseconds. +1 Date to include final day.
            
            this.to = new Date(this.date2);
            this.to.setDate(this.to.getDate() + 1);

            this.to = this.to.getTime() + offset;            

            //Calling API

            axios
                .get('/truck/logs/' + this.nid + '/' + this.from + '/' + this.to)
                .then( (response) => {
                    this.error = false;

                    for(let i=0; i<response.data.length; i++){

                        let tempLog = {
                            SlNo: '',
                            Time: '',
                            Temperature: ''
                            
                        }

                        let date = response.data[i].ts;
                        tempLog.SlNo = i + 1;
                        tempLog.Time = new Date(+date).toString().substring(0,25);
                        tempLog.Temperature = response.data[i].temp;


                        this.$set(this.logs, i, tempLog);
                        this.tableFlag = true;
                        
                    }

                    this.loading = false;
                })
                .catch( () => {
                    this.tableFlag = false;
                    this.loading = false;
                    this.error = true;
                })
        },
        createPDF () {
            let pdfName = 'Truck '+this.nid+' ('+this.date1+' to '+this.date2+')'; 
            
            let doc = new jsPDF();
            
            let header = (data) => {
                doc.setFontSize(18);
                doc.setTextColor(40);
                doc.setFontStyle('bold');
                doc.text("TRUCK "+this.nid, data.settings.margin.left, 30);
            };

            doc.autoTable(  
                {   
                    columns: [{header: 'Serial No.', dataKey: 'SlNo'}, {header: 'Time', dataKey: 'Time'}, {header: 'Temperature (Celsius)', dataKey: 'Temperature'}],
                    body: this.logs,
                    margin: {top: 40}, didDrawPage: header
                }
            );
            doc.save(pdfName + '.pdf');
        }
    }
}
</script>
