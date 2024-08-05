<script>
import { io } from 'socket.io-client';

export default {
    name: 'App',
    components: {},
    data() {
        return {
            socket: null
        };
    },
    created() {
        // TODO: Enhance this to use the environment variable
        this.socket = io('ws://localhost:3000');
        this.socket.on('connect', () => {
            console.log('Connected to the server');
        });
    },
    unmounted() {
        this.socket.disconnect();
    },
}   
</script>

<template>
    <div id="app">
        <router-view :socket="socket"></router-view>
    </div>
</template>

<style scoped>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}
</style>