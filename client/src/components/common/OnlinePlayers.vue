<script>
    export default {
        name: 'OnlinePlayers',
        props: {
            onlinePlayers: Array,
        }
    };
</script>

<template>
    <div>
        You'll see other players as they join
        <div class="online-players">
            <div v-for="player in onlinePlayers" :key="player.playerUniqueID" class="player-avatar">
                <figure class="figure">
                    <i class="fas fa-user-circle fa-3x"></i>
                    <figcaption class="figure-caption">
                        {{ player.playerName }}
                    </figcaption>
                </figure>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.online-players {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    margin: 20px auto;
    max-width: 80%;
}  
.player-avatar {
    width: 70px;
    height: 70px;
    max-width: 70px;
    max-height: 70px;
    color: #cccccc;
}
</style>
