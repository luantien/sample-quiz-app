<script>
import OnlinePlayers from '../common/OnlinePlayers.vue';

export default {
    props: {
        socket: Object
    },
    components: {
        OnlinePlayers
    },
    data() {
        return {
            joinBtnSubmitted: false,
            showQuestions: false,
            isRoomClosed: false,
            roomCode: null,
            playerName: null,
            didPlayerJoinedRoom: false,
            didHostStartGame: false,
            onlinePlayers: [],
        }
        
    },
    methods: {
        joinQuizRoom() {
            this.joinBtnSubmitted = true;

            this.socket.emit('joinRoom', {
                roomCode: this.roomCode,
                playerName: this.playerName,
            });

            this.socket.on('roomNotFound', () => {
                this.joinBtnSubmitted = false;
            });

            this.socket.on('playerJoined', (data) => {
                this.didPlayerJoinedRoom = true;
                this.onlinePlayers = data.onlinePlayers;
            });

            this.socket.on('playerLeft', (data) => {
                this.onlinePlayers = data.onlinePlayers;
            });
        },
        backToHostView() {
            this.$router.push('/');
        },
        leaveRoom() {
            this.socket.emit('leaveRoom', {
                roomCode: this.roomCode,
                playerName: this.playerName,
            });
            this.backToHostView();
        }
    }   
}
</script>

<template>
    <div>
        <div v-if="!showQuestions" class="player-view card">
            <h2>Live Quiz App</h2>
            <div v-if="!isRoomClosed" class="card-body">
                <h5 class="card-title"> Hello {{ playerName }} </h5>
                <template v-if="!didPlayerJoinedRoom">
                    <p class="card-text">Enter the room code to join the quiz</p>
                    <div class="roomcode-input">
                        <input
                            class="form-control input-box"
                            placeholder="Enter room code"
                            v-model="roomCode"
                            :disabled="joinBtnSubmitted"
                            />
                    </div>
                    <br/>
                    <p class="card-text">How should others identify you?</p>
                    <div class="nickname-input">
                        <input
                            class="form-control input-box"
                            placeholder="Enter a nickname"
                            v-model="playerName"
                            :disabled="joinBtnSubmitted"
                            @keyup.enter="joinQuizRoom()"/>
                    </div>
                    <button
                        type="button create-random-btn"
                        class="btn"
                        @click="joinQuizRoom()"
                        :disabled="joinBtnSubmitted"
                        >
                        Join Now!
                    </button>
                </template>
                
                <template v-else>
                    <OnlinePlayers :onlinePlayers="onlinePlayers"></OnlinePlayers>
                    <div v-if="!didHostStartGame">
                        <hr />
                        <small class="text-muted">Waiting for your host to start the quiz</small>
                    </div>
                    <hr />
                    <div class="card-footer div-black">
                        <button type="button" class="btn back-btn" @click="leaveRoom()">
                            &larr; Leave Room
                        </button>
                    </div>
                </template>
            </div>
            <div class="card-footer div-black" v-if="!didPlayerJoinedRoom">
                <button type="button" class="btn back-btn" @click="backToHostView()">
                    &larr; Back to Homepage
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-view {
    padding: 20px 0 0 0;
    margin: 0px auto;
    text-align: center;
    max-width: 900px;
    min-width: 300px;
}
.roomcode-input, .nickname-input {
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    margin: 0 auto;
}
button {
    min-width: 240px;
    margin: 15px 0 0 0;
    background: rgb(47, 216, 157);
    border: 1px solid #ffffff;
    color: #ffffff;
}
button:hover {
    background: #ffffff;
    color: red;
    border: 1px solid red;
}
.div-black {
    background-color: #03020d;
    color: #ffffff;
}
.div-black:hover {
    background-color: rgb(47, 216, 157);;
    color: #000000;
}
.back-btn {
    background: none;
    border: none;
    color: #ffffff;
    padding: 0px;
    margin: 0px;
}
.back-btn:hover {
    border: none;
    background: none;
    color: #ffffff;
}
</style>