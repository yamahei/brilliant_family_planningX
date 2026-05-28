import * as vm from '../bfpviewmodel.ts';

export class Storage {

    private storagekey: string = "_BFP_VIEWMODEL_";
    private data: vm.BfpViewModel = null;

    constructor() {
        this.data = this.load();
    }

    private emptydata(): vm.BfpViewModel {
        // return {
        //     accounts: [],
        //     klasses: [],
        //     summarycaches: [],
        //     presetvalues: null,
        // };
        return {
            accounts: [],
            klasses: [
                // {
                //     sortorder: 0,
                //     name: "👨お父さん",
                //     presetklassid: null,
                //     categories: [],
                // },
                // {
                //     sortorder: 0,
                //     name: "🏍バイク",
                //     presetklassid: null,
                //     categories: [],
                // },
            ],
            summarycaches: [],
            presetvalues: null,
        };
    }

    private load(): vm.BfpViewModel {
        const raw = localStorage.getItem(this.storagekey);
        try{
            return raw ? JSON.parse(raw) as vm.BfpViewModel : this.emptydata();
        }catch(e) {
            console.error(e);
            throw e;
        }
    }

    public clear(): Promise<void> {
        this.data = null;
        localStorage.removeItem(this.storagekey);
        return new Promise((resolve) => {
            resolve();
        });
    }

    public get(): Promise<vm.BfpViewModel> {
        const data: vm.BfpViewModel = this.data || this.load();
        return new Promise((resolve) => {
            resolve(data);
        });
    }

    public save(data: vm.BfpViewModel): Promise<void> {
        this.data = data;
        localStorage.setItem(this.storagekey, JSON.stringify(this.data));
        return new Promise((resolve) => {
            resolve();
        });
    }
}