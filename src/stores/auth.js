import { reactive } from "vue"
//import { defineStore } from 'pinia' - nesanāca ar pinia izveidot funkcionalitāti auth :/ bet sanāca ar reactive
import router from "../router"

export const useAuthStore = reactive({
  user: {
    name: "NAME",
    surname: "SURNAME",
    code: "IT1234",
    favorite_songs: localStorage.favorite_songs ? localStorage.favorite_songs.split(",") : []
  },
  authenticated:  false,
  setUserData(name, surname, code) {
    this.user.name = name;
    this.user.surname = surname;
    this.user.code = code;
  },
  authenticate(email, password) {
    if (email === "oto.jauja@va.lv" && password === "123456") {
      localStorage.is_authenticated = true;
      this.authenticated = true;
      router.push("/");
    }
  },
  logout() {
    localStorage.clear();
    this.authenticated = false;
    router.push("/login");
  },
  toggleFavorite(songID) {
    console.log(this.user.favorite_songs);
    const song_index = this.user.favorite_songs.indexOf(songID);

    if (song_index < 0) {
      this.user.favorite_songs.push(songID);
    } else {
      this.user.favorite_songs.splice(song_index);
    }
    localStorage.favorite_songs = this.user.favorite_songs;
  },
  getFavoriteSongs() {
    return this.user.favorite_songs;
  },
  is_authenticated() {
    return localStorage.is_authenticated ?? false;
  },
})