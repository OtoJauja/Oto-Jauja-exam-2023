<template>
    <div id="about-view">
        <div class="wrapper-header">
            <h1>ABOUT ME</h1>
            <div class="settings">
                <button id="btn-edit" :class="{ active: editForm }" @click="editForm = !editForm">{{ editForm ? "Cancel" : "Edit Form"
                }}</button>
                <button id="btn-save" v-if="editForm" class="submit" @click="saveForm()">Save Form</button>
            </div>
        </div>
        <form>
            <div class="wrapper-input">
                <label>NAME</label>
                <input id="input-name" v-if="editForm" v-model="userForm.name" />
                <p id="txt-name" v-else>{{ useAuthStore.user.name }}</p>
            </div>
            <div class="wrapper-input">
                <label>SURNAME</label>
                <input id="input-surname" v-if="editForm" v-model="userForm.surname" />
                <p id="txt-surname" v-else>{{ useAuthStore.user.surname }}</p>
            </div>
            <div class="wrapper-input">
                <label>STUDENT CODE</label>
                <input id="input-code" v-if="editForm" v-model="userForm.code" />
                <p id="txt-code" v-else>{{ useAuthStore.user.code }}</p>
            </div>
            <div class="wrapper-songs">
                <label>FAVORITE SONGS</label>
                <ul v-if="favorite_songs.length>0">
                    <li v-for="song in favorite_songs">
                        <img id="img-album" :src="song.album.images[1].url" />
                        <div class="song-info">
                            <p id="txt-song" class="song-name">{{ song.name }}</p>
                            <p id="txt-artist" class="song-artists">{{ getArtists(song.artists) }}</p>
                        </div>
                    </li>
                </ul>
                <div v-else id="txt-empty" class="empty">NO SONGS FOUND</div>
            </div>
        </form>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import songsAPI from '../data/songs'

export default {
    data() {
        return {
            useAuthStore,
            editForm: false,
            userForm: {
                name: useAuthStore.user.name,
                surname: useAuthStore.user.surname,
                code: useAuthStore.user.code
            }
        }
    },
    methods: {
        getArtists(artists) {
            return artists.map(artist => artist.name).join(", ");
        },
        saveForm() {
            useAuthStore.setUserData(this.userForm.name, this.userForm.surname, this.userForm.code);
            this.editForm = false;
        }
    },
    computed: {
        favorite_songs() {
            return useAuthStore.getFavoriteSongs().map(songID => {
                return songsAPI.find(song => song.id == songID);
            });
        }
    }
}
</script>
