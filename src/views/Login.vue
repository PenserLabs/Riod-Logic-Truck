<template>
    <v-container fluid>
        <v-img height="760" :src="require('../assets/img2.jpg')">
            <v-container>
            <v-layout row wrap>
            <v-flex xs12 class="text-xs-center ma-2">
                <form @submit.prevent="login">
                    <v-layout row wrap>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                solo
                                label="Username"
                                prepend-inner-icon="mdi-account"
                                v-model="access"
                                required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                solo
                                label="Password"
                                prepend-inner-icon="mdi-lock"
                                v-model="key"
                                type="password"
                                required
                                :error-messages="error"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn 
                                color="primary" 
                                large
                                class="ma-4"
                                type="submit"
                            >
                                Login
                            </v-btn>  
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex>  
        </v-layout>
        </v-container>
        </v-img>
        
    </v-container>
</template>

<script>

export default {
    data() {
        return {
            access: '',
            key: '',
            ar6t87w1: 'admin',
            qa34g3aa: 'qwerty123',
            error: ''
        }
    },
    methods: {
        login () {
            if ((this.access == this.ar6t87w1) && (this.key == this.qa34g3aa)) {
                this.$store.commit('login');
                localStorage.riodToken = true;
                this.$router.push('/');
            }
            this.error = 'Username or password is incorrect';
            this.access = this.key = '';
        }
    },
    mounted () {
        if(localStorage.riodToken) {
            this.$store.commit('login');
            this.$router.push('/');
        }
    } 
}
</script>

