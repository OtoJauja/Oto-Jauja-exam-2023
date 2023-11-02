<template>
    <div id="album-view">
        <div class="wrapper-header">
            <h1>ALBUMS</h1>
            <div class="settings">
                <button id="btn-grid" :class="{ active: isGrid }" @click="isGrid = true">
                    <IconGrid />
                </button>
                <button id="btn-list" :class="{ active: !isGrid }" @click="isGrid = false">
                    <IconList />
                </button>
            </div>
        </div>
        <ul id="list-albums" :class="{ grid: isGrid }">
            <li class="album" v-for="album in albums" @click="selectAlbum(album.id)">
                <img id="img-album" :src="album.images[1].url" />
                <div class="album-info">
                    <h4 id="txt-album-name">{{ album.name }}</h4>
                    <p id="txt-album-artists">{{ getArtists(album.artists) }}</p>
                    <div class="album-year">
                        <p id="txt-album-year">{{ getYear(album.release_date) }}</p>
                        <p id="txt-album-tracks">{{ getTrackAmountt(album.tracks.length) }}</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import IconGrid from '../components/icons/IconGrid.vue'
import IconList from '../components/icons/IconList.vue'
import { usePlayerStore } from '@/stores/player'
import songsAPI from '../data/songs'

export default {
    components: {
        IconGrid,
        IconList
    },
    data() {
        return {
            player: usePlayerStore,
            isGrid: true,
            click: 0,
        }
    },
    methods: {
        selectAlbum(albumID) {
            const player = usePlayerStore();
            this.click++;
            let timer;
            if (this.click === 1) {
                timer = setTimeout(() => {
                    this.click = 0;
                }, 500);
            } else {
                clearTimeout(timer);
                player.setPlaylist(this.albums[albumID].tracks);
                player.setNowPlaying(this.albums[albumID].tracks[0]);
                this.click = 0;
            }
        },
        getArtists(artists) {
            return artists.map(artist => artist.name).join(', ');
        },
        getYear(release_date) {
            const year = new Date(release_date);
            return year.getFullYear();
        },
        getTrackAmountt(trackCount) {
            if (trackCount > 1) {
                return `${trackCount} songs`;
            } else {
                return `${trackCount} song`;
            }
        },
    },
    computed: {
        albums() {
            return songsAPI.reduce((accumulator, currentSong) => {
                accumulator[currentSong.album.id] = accumulator[currentSong.album.id] || {
                    ...currentSong.album,
                    tracks: []
                };
                accumulator[currentSong.album.id].tracks.push(currentSong);
                return accumulator;
            }, Object.create(null));
        }
    }
}
</script>