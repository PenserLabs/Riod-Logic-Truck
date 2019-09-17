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
        
        <v-btn flat icon color="primary" v-if="$store.state.admin" @click="offsetDialog=true"><v-icon>mdi-settings-outline</v-icon></v-btn>
        
        <v-layout row wrap class="mb-5">
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
            <v-flex xs12 md4 class="text-xs-center ">
                <v-btn class="text-xs-center" @click="getLogs" :loading="loading">Get Logs</v-btn>
            </v-flex>
            <!-- <v-flex xs12 offset-md4 md4 class="text-xs-center">
                <v-select v-model="displaySelect" label="Display as" :items="display"></v-select>
            </v-flex> -->
        </v-layout>

        <div>
            <v-alert 
                type="error"
                :value="error"
            >
                Could not find any data for the specified dates.
            </v-alert>
        </div>

        <Plotly v-if="tableFlag" :data="data" :layout="layout" :displayModeBar="true"/>

        <v-data-table
            v-if="tableFlag"
            :headers="headers"
            :items="logs"
            :rows-per-page-items="rowsPerPageItems"
            :pagination.sync="pagination"
            class="elevation-1 my-5"
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

        <v-dialog 
            v-model="offsetDialog"
            max-width="330"    
        >
            <v-card>
                <v-layout row wrap class="text-xs-center">
                        <v-flex xs12>
                            <div class="title mt-4">
                                Temperature Offset  (Celsius)
                            </div>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-select
                                :items="offsetSelect"
                                label="Offset"
                                solo
                                class="pa-4"
                                v-model="offset"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn 
                                color="primary" 
                                class="mb-4"
                                :loading="tempLoading"
                                @click="updateOffset"
                            >
                                Update
                            </v-btn>  
                        </v-flex>
                        <v-flex xs12>
                            <div class="title">
                                Temperature Interval  (Minutes)
                            </div>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-select
                                :items="intervalSelect"
                                label="Interval"
                                solo
                                class="pa-4"
                                v-model="interval"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn 
                                color="primary" 
                                class="mb-4"
                                :loading="timeLoading"
                                @click="updateInterval"
                            >
                                Update
                            </v-btn>  
                        </v-flex>
                    </v-layout>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Plotly } from 'vue-plotly'

export default {
    components: {
        Plotly
    },
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
            offsetDialog: false,
            tempLoading: false,
            timeLoading: false,
            offset: '',
            interval: '',
            offsetSelect: ['0','-4', '-5', '-6', '-7'],
            intervalSelect: ['5','10', '30', '60', '120'],
            // offsetTemp: '',
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
            layout: {
                plot_bgcolor: '#FAFAFA',
                paper_bgcolor: '#FAFAFA',
                title: 'Temperature in Celsius'
            },
            data: [
                    {
                        x: [],
                        y: [],
                        type: 'scatter'
                    }
            ],
            xaxis: [],
            yaxis: [],
            display: ['Graph', 'Table']    
        }
    },
    methods: {
        start () {
            axios
                .get('/truck/settings/'+this.nid)
                .then( (response) => {
                    this.error = false;
                    this.offset = response.data.offset;
                    this.interval = response.data.interval;
                    // this.offsetTemp = response.data.offset;
                })
                .catch( () => {
                    this.error = true;
                })
        },
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
                    this.xaxis = [];
                    this.yaxis = [];

                    for(let i=0; i<response.data.length; i++){

                        let tempLog = {
                            SlNo: '',
                            Time: '',
                            Temperature: ''
                            
                        }

                        let date = response.data[i].ts;
                        tempLog.SlNo = i + 1;
                        tempLog.Time = new Date(+date).toString().substring(0,25);
                        tempLog.Temperature = parseFloat(response.data[i].temp);

                        this.$set(this.logs, i, tempLog);
                        this.$set(this.xaxis, i, tempLog.Time);
                        this.$set(this.yaxis, i, tempLog.Temperature);
                        this.tableFlag = true;
                        
                    }

                    let plotObject = {
                        x: this.xaxis,
                        y: this.yaxis,
                        type: 'scatter'
                    }

                    this.$set(this.data, 0, plotObject);
                    this.loading = false;
                })
                .catch( () => {
                    this.data = [];
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
        },
        updateInterval () {
            this.timeLoading = true;
            this.error = false
            axios
                .post('/truck/editinterval', {
                    interval: this.interval,
                    nid: this.nid
                })
                .then( () => {
                    this.timeLoading = false;
                })
                .catch( () => {
                    this.error = true;
                    this.timeLoading =  false;
                })
        },
        updateOffset () {
            this.tempLoading = true;
            this.error = false
            axios
                .post('/truck/editoffset', {
                    offset: this.offset,
                    nid: this.nid
                })
                .then( () => {
                    this.tempLoading = false;
                })
                .catch( () => {
                    this.error = true;
                    this.tempLoading =  false;
                })
        }
    },
    mounted() {
        this.start();
    }
}
</script>
