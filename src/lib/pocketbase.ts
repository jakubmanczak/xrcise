import pocketbase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new pocketbase('http://vm.manczak.net:8090');
export const user = writable(pb.authStore.model);
