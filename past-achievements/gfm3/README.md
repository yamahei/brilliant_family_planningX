# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


BFP: Brilliant Family Planning3
===============================

Setup
-----

### Install Deno to Windows(on Git Bash)
参考：[インストール方法 > ダウンロードとインストール > Shellの場合 (macOS and Linux):](https://yoshixmk.github.io/deno-manual-ja/getting_started/installation.html)
```sh
$ curl -fsSL https://deno.land/x/install/install.sh | sh
    ######################################## 100.0%
    Archive:  /c/Users/default.MYCOMPUTER/.deno/bin/deno.zip
    inflating: /c/Users/default.MYCOMPUTER/.deno/bin/deno.exe
    Deno was installed successfully to /c/Users/default.MYCOMPUTER/.deno/bin/deno
    Run '/c/Users/default.MYCOMPUTER/.deno/bin/deno --help' to get started

    Stuck? Join our Discord https://discord.gg/deno

$ echo 'export PATH=/c/Users/default.MYCOMPUTER/.deno/bin:$PATH' >> ~/.bashrc
$ source ~/.bashrc
$ deno -v
    deno 2.1.4
```

### Create project
```sh
$ deno run -A npm:create-vite
    √ Project name: ... brilliant_family_planning3
    √ Select a framework: » Vue
    √ Select a variant: » TypeScript

    Scaffolding project in C:\Users\default.MYCOMPUTER\Desktop\brilliant_family_planning3...
    Done. Now run:
        cd brilliant_family_planning3
        deno install
        deno run dev

$ cd brilliant_family_planning3
$ deno install
$ deno run dev
    Task dev vite
        VITE v  6.0.7  ready in 754 ms
        ➜  Local:   http://localhost:5173/
        ➜  Network: use --host to expose
        ➜  press h + enter to show help

# Vue.js でファイルベースルーティングを実現する「Unplugin Vue Router」の紹介
# https://zenn.dev/comm_vue_nuxt/articles/2024-08-13-unplugin-vue-router
$ deno add npm:vue-router
$ deno add npm:unplugin-vue-router
```

### Run project
```sh
# $ deno install --reload # update all dependencies
$ deno upgrade && deno run dev
```


# Vue3で作ったWebサイトを Vite PWA でPWA化する方法 2024年版
# https://future-architect.github.io/articles/20241127a/