<template>
    <v-container>
        <v-layout row wrap class="text-xs-center">
            <v-flex xs12 sm6 offset-sm3 class="text-xs-center my-4 headline">
                Time Interval (In Minutes):
            </v-flex>
            <v-flex xs12 sm6 offset-sm3>
                <v-select
                    :items="intervalSelect"
                    label="Interval (minutes)"
                    solo
                    v-model="interval"
                ></v-select>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3>
                <v-btn 
                    color="primary" 
                    large
                    class="ma-4"
                    :loading="timeLoading"
                    @click="updateInterval"
                >
                    Update Time Interval
                </v-btn>  
            </v-flex>
            <v-flex xs12 sm6 offset-sm3 class="text-xs-center my-4 headline">
                Temperature offset (In Celsius):
            </v-flex>
            <v-flex xs12 sm6 offset-sm3>
                <v-select
                    :items="offsetSelect"
                    label="Offset (Celsius)"
                    solo
                    v-model="offset"
                ></v-select>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3>
                <v-btn 
                    color="primary" 
                    large
                    class="ma-4"
                    :loading="tempLoading"
                    @click="updateOffset"
                >
                    Update Offset Temperature
                </v-btn>  
            </v-flex>
        </v-layout>
        <div>
            <v-alert 
                type="error"
                :value="error"
            >
                Connection Error
            </v-alert>
        </div>
    </v-container>
</template>

<script>
import axios from 'axios'

export default {
    data () {
        return {
            intervalSelect: ['0','10', '30', '60', '120'],
            interval: '',
            offsetSelect: ['0','-4', '-5', '-6', '-7'],
            offset: '',
            error: false,
            timeLoading: false,
            tempLoading: false
        }
    },
    methods: {
        start () {
            axios
                .get('/truck/settings')
                .then( (response) => {
                    this.error =false;

                    this.interval = response.data.interval;
                    this.offset = response.data.offset;
                })
                .catch( () => {
                    this.error = true;
                })
        },
        updateInterval () {
            this.timeLoading = true;
            this.error = false
            axios
                .post('/truck/editinterval', {
                    interval: this.interval
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
                    offset: this.offset
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
    mounted () {
        this.start();
    }
}
</script>
