/**
STG DEMO
Copyright (c) 2016, Yoji Suzuki (SUZUKI PLAN)
All rights reserved.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var MY = new Object();

// メインループ
MY.mainloop = function() {
    MY.frame++;
    if (0 == MY.frame % 10) {
        MY.addEnemy(0, 0, -24);
        MY.addEnemy(0, 296, -24);
    }
    MY.moveHit();
    MY.movePlayer();
    MY.movePShot();
    MY.moveEnemy();
    MY.moveBomb();
}

// ヒット・エフェクトの移動
MY.moveHit = function() {
    for (var i = 0; i < MY.hit.length; i++) {
        MY.hit[i].s.y += 2;
        MY.hit[i].frame++;
        if (18 <= MY.hit[i].frame) {
            MY.hit[i].s.remove();
            MY.hit.splice(i, 1);
            i--;
        }
    }
}

// プレイヤーの移動
MY.movePlayer = function() {
    // body
    if (MY.g.input.left) {
        MY.player.s.x -= 4;
        if (MY.player.s.x < 0) MY.player.s.x = 0;
        if (0 < MY.player.b) MY.player.b--;
    } else if (MY.g.input.right) {
        MY.player.s.x += 4;
        if (284 < MY.player.s.x) MY.player.s.x = 284;
        if (MY.player.b < 35) MY.player.b++;
    } else {
        if (MY.player.b != 18) {
            if (MY.player.b < 18) MY.player.b++;
            else MY.player.b--;
        }
    }
    var k = parseInt(MY.player.b / 4);
    MY.player.s.frame = MY.player.f[k];
    if (MY.g.input.up) {
        MY.player.s.y -= 4;
        if (MY.player.s.y < 0) MY.player.s.y = 0;
    } else if (MY.g.input.down) {
        MY.player.s.y += 4;
        if (284 < MY.player.s.y) MY.player.s.y = 284;
    }

    // options
    var n = Math.abs(k - 4);
    MY.player.o1.x = MY.player.s.x - 4 - n * 3;
    MY.player.o1.y = MY.player.s.y - 13 + n * 4;
    MY.player.o2.x = MY.player.s.x + 16 + n * 3;
    MY.player.o2.y = MY.player.s.y - 13 + n * 4;
    if (MY.g.input.a) {
        MY.player.f1.x = MY.player.o1.x;
        MY.player.f1.y = MY.player.o1.y - 8;
        MY.player.f2.x = MY.player.o2.x;
        MY.player.f2.y = MY.player.o2.y - 8;
        MY.player.f1.visible = true;
        MY.player.f2.visible = true;
        if (0 === MY.frame % 4) {
            MY.a.pshot.w[MY.a.pshot.i].play();
            MY.a.pshot.i++;
            MY.a.pshot.i &= 7;
            MY.player.ps++;
            switch (n) {
                case 0:
                    MY.addPShot(MY.player.o1.x - 4, MY.player.o1.y, 2);
                    MY.addPShot(MY.player.o2.x - 4, MY.player.o2.y, 2);
                    break;
                case 1:
                    switch (parseInt(MY.player.ps % 3)) {
                        case 0:
                            MY.addPShot(MY.player.o1.x - 4, MY.player.o1.y, 2);
                            MY.addPShot(MY.player.o2.x - 4, MY.player.o2.y, 2);
                            break;
                        case 1:
                            MY.addPShot(MY.player.o1.x - 4, MY.player.o1.y, 1);
                            MY.addPShot(MY.player.o2.x - 4, MY.player.o2.y, 3);
                            break;
                        case 2:
                            MY.addPShot(MY.player.o1.x - 4, MY.player.o1.y, 3);
                            MY.addPShot(MY.player.o2.x - 4, MY.player.o2.y, 1);
                            break;
                    }
                    break;
                default:
                    switch (parseInt(MY.player.ps % 6)) {
                        case 0:
                        case 3:
                            MY.addPShot(MY.player.o1.x - 4, MY.player.o1.y, 2);
                            MY.addPShot(MY.player.o2.x - 4, MY.player.o2.y, 2);
                            break;
                        case 1:
                            MY.addPShot(MY.player.o1.x - 4, MY.player.o1.y, 1);
                            MY.addPShot(MY.player.o2.x - 4, MY.player.o2.y, 3);
                            break;
                        case 2:
                            MY.addPShot(MY.player.o1.x - 4, MY.player.o1.y, 3);
                            MY.addPShot(MY.player.o2.x - 4, MY.player.o2.y, 1);
                            break;
                        case 4:
                            MY.addPShot(MY.player.o1.x - 4, MY.player.o1.y, 0);
                            MY.addPShot(MY.player.o2.x - 4, MY.player.o2.y, 4);
                            break;
                        case 5:
                            MY.addPShot(MY.player.o1.x - 4, MY.player.o1.y, 4);
                            MY.addPShot(MY.player.o2.x - 4, MY.player.o2.y, 0);
                            break;
                    }
                    break;
            }
        }
    } else {
        MY.player.f1.visible = false;
        MY.player.f2.visible = false;
    }
}

// ショットの発射
MY.addPShot = function(x, y, k) {
    var i = MY.pshot.length;
    MY.pshot[i] = new Object();
    MY.pshot[i].s = new Sprite(32, 32);
    MY.pshot[i].s.frame = [0, 1];
    MY.pshot[i].s.x = x;
    MY.pshot[i].s.y = y;
    switch (k) {
        case 0:
            MY.pshot[i].s.image = MY.g.assets["image/pshot0.png"];
            MY.pshot[i].vx = -6;
            MY.pshot[i].vy = -18;
            break;
        case 1:
            MY.pshot[i].s.image = MY.g.assets["image/pshot1.png"];
            MY.pshot[i].vx = -3;
            MY.pshot[i].vy = -21;
            break;
        case 2:
            MY.pshot[i].s.image = MY.g.assets["image/pshot2.png"];
            MY.pshot[i].vx = 0;
            MY.pshot[i].vy = -24;
            break;
        case 3:
            MY.pshot[i].s.image = MY.g.assets["image/pshot3.png"];
            MY.pshot[i].vx = 3;
            MY.pshot[i].vy = -21;
            break;
        case 4:
            MY.pshot[i].s.image = MY.g.assets["image/pshot4.png"];
            MY.pshot[i].vx = 6;
            MY.pshot[i].vy = -18;
            break;
    }
    MY.g.rootScene.addChild(MY.pshot[i].s);
}

// ショットの移動
MY.movePShot = function() {
    for (var i = 0; i < MY.pshot.length; i++) {
        MY.pshot[i].s.x += MY.pshot[i].vx;
        MY.pshot[i].s.y += MY.pshot[i].vy;
        if (MY.pshot[i].s.y < -32 || MY.pshot[i].s.x < -32 || 320 < MY.pshot[i].s.x) {
            MY.pshot[i].s.remove();
            MY.pshot.splice(i, 1);
            i--;
        }
    }
}

// ショット x 敵 の ヒット・エフェクト を追加
MY.addHit = function(x, y) {
    MY.a.hit.play();
    var i = MY.hit.length;
    MY.hit[i] = new Object();
    var h = MY.hit[i];
    h.frame = 0;
    h.s = new Sprite(24, 24);
    h.s.image = MY.g.assets["image/hit.png"];
    h.s.x = x;
    h.s.y = y;
    h.s.frame = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, null];
    MY.g.rootScene.addChild(h.s);
}

// 爆破エフェクトを追加
MY.addBomb = function(type, x, y, vx, vy) {
    var i = MY.bomb.length;
    MY.bomb[i] = new Object();
    var b = MY.bomb[i];
    b.vx = vx;
    b.vy = vy;
    switch (type) {
        case 0:
            MY.a.bomb0.play();
            b.s = new Sprite(48,48);
            b.s.image = MY.g.assets["image/bomb0.png"];
            b.s.frame = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 12, 13, 14, null];
            break;
    }
    b.frame = b.s.frame.length;
    b.s.x = x;
    b.s.y = y;
    MY.g.rootScene.addChild(b.s);
}

// 爆破エフェクトの移動
MY.moveBomb = function() {
    for (var i = 0; i < MY.bomb.length; i++) {
        var b = MY.bomb[i];
        b.s.x += b.vx;
        b.s.y += b.vy;
        b.frame--;
        if (0 == b.frame) {
            b.s.remove();
            MY.bomb.splice(i, 1);
            i--;
        }
    }
}

// 敵の移動
MY.moveEnemy = function() {
    for (var i = 0; i < MY.enemy.length; i++) {
        var e = MY.enemy[i];
        if (!e.alg(e)) {
            for (var j = 0; j < e.sprites.length; j++) e.sprites[j].remove();
            MY.enemy.splice(i, 1);
            i--;
            continue;
        } else {
            // ショットとの当たり判定
            var enemyDead = false;
            for (var j = 0; j < MY.pshot.length; j++) {
                var p = MY.pshot[j];
                for (var k = 0; k < e.hits.length; k++) {
                    var h = e.hits[k];
                    if (p.s.x + 8 < e.s.x + h[2] && e.s.x + h[0] < p.s.x + 16 && p.s.y + 8 < e.s.y + h[3] && e.s.y + h[1] < p.s.y + 16) {
                        MY.addHit(p.s.x + 4, p.s.y + 4);
                        p.s.remove();
                        MY.pshot.splice(j, 1);
                        j--;
                        e.hp--;
                        if (0 == e.hp) enemyDead = true;
                        break;
                    }
                }
                if (enemyDead) break;
            }
            // 敵撃破の演出
            if (enemyDead) {
                switch (e.btype) {
                    case 0:
                        MY.addBomb(0, e.s.x + (e.width - 48) / 2, e.s.y + (e.height - 48) / 2, 0, -2);
                        break;
                }
                for (var j = 0; j < e.sprites.length; j++) e.sprites[j].remove();
                MY.enemy.splice(i, 1);
                i--;
                continue;
            }
        }
    }
}

// 敵の追加
MY.addEnemy = function(n, x, y) {
    var i = MY.enemy.length;
    MY.enemy[i] = new Object();
    var e = MY.enemy[i];
    e.x = x;
    e.y = y;
    var width;
    var height;
    switch (n) {
        case 0:
            e.frame = 0;
            e.vx = 0;
            e.alg = MY.enemyAlg0;
            width = 24;
            height = 24;
            e.s = new Sprite(24, 24);
            e.s.image = MY.g.assets["image/enemy0.png"];
            e.s.x = x;
            e.s.y = y;
            e.fpos = 0;
            e.fs = [[0], [1], [2], [3]];
            e.s.frame = [e.fs[e.fpos]];
            e.sprites = [e.s];
            e.hits = [[5, 3, 20, 20]];
            e.hp = 2;
            e.btype = 0;
            break;
    }
    e.width = width;
    e.height = height;
    for (i = 0; i < e.sprites.length; i++) {
        MY.g.rootScene.addChild(e.sprites[i]);
    }
}

// 敵アルゴリズム0: 雑魚1
MY.enemyAlg0 = function(e) {
    e.frame++;
    // 下へ移動
    e.y += 2;
    if (360 < e.y) return false;
    e.s.y = e.y;
    // 自機を追いかける(慣性付き)
    if (MY.player) {
        if (MY.player.s.x + 18 < e.x + 12) {
            e.vx--;
            if (e.vx < -16) e.vx = -16;
        } else {
            e.vx++;
            if (16 < e.vx) e.vx = 16;
        }
    }
    e.x += e.vx / 3;
    e.s.x = e.x;
    // 回転アニメーション（進行方向に）
    if (e.frame % 3 === 0) {
        if (0 < e.vx) {
            e.fpos--;
            if (e.fpos < 0) e.fpos = 3;
        } else {
            e.fpos++;
            e.fpos &= 3;
        }
        e.s.frame = [e.fs[e.fpos]];
    }
    return true;
}

// 初期化
onload = function() {
    window.focus();
    enchant();
    MY.g = new Game(320, 320);
    MY.g.fps = 60;
    MY.g.preload([
        "image/player.png", "image/option.png", "image/fire1.png",
        "image/pshot0.png", "image/pshot1.png", "image/pshot2.png", "image/pshot3.png", "image/pshot4.png",
        "image/enemy0.png",
        "image/bomb0.png",
        "image/hit.png",
        "audio/pshot.ogg", "audio/hit.ogg", "audio/bomb0.ogg"
    ]);
    MY.g.onload = function() {
        MY.g.rootScene.backgroundColor = "#050a40";
        MY.initAudio();
        MY.initPlayer();
        MY.pshot = new Array();
        MY.enemy = new Array();
        MY.hit = new Array();
        MY.bomb = new Array();
        MY.frame = 0;;
        MY.g.keybind('z'.charCodeAt(0), 'a');
        MY.g.keybind('Z'.charCodeAt(0), 'a');
        MY.g.keybind('x'.charCodeAt(0), 'b');
        MY.g.keybind('X'.charCodeAt(0), 'b');
        MY.g.rootScene.addEventListener(Event.ENTER_FRAME, MY.mainloop);
    }
    MY.g.start();
};

// 音声の初期化
MY.initAudio = function() {
    MY.a = new Object();
    MY.a.pshot = new Object();
    MY.a.pshot.w = new Array(8);
    for (i = 0; i < 8; i++) {
        MY.a.pshot.w[i] = MY.g.assets['audio/pshot.ogg'].clone();
    }
    MY.a.pshot.i = 0;
    MY.a.hit = MY.g.assets['audio/hit.ogg'].clone();
    MY.a.bomb0 = MY.g.assets['audio/bomb0.ogg'];
}

// プレイヤーの初期化
MY.initPlayer = function() {
    // プレイヤー
    MY.player = new Object();
    MY.player.ps = 0;
    MY.player.b = 18;
    MY.player.f = [[0], [1], [2], [3], [3], [3], [4], [5], [6]];
    MY.player.s = new Sprite(36, 36);
    MY.player.s.image = MY.g.assets["image/player.png"];
    MY.player.s.frame = MY.player.f[4];
    MY.player.s.x = (320 - 36) / 2;
    MY.player.s.y = 280;
    MY.g.rootScene.addChild(MY.player.s);

    MY.player.o1 = new Sprite(24, 24);
    MY.player.o1.image = MY.g.assets["image/option.png"];
    MY.player.o1.x = MY.player.s.x - 4;
    MY.player.o1.y = MY.player.s.y - 13;
    MY.g.rootScene.addChild(MY.player.o1);

    MY.player.o2 = new Sprite(24, 24);
    MY.player.o2.image = MY.g.assets["image/option.png"];
    MY.player.o2.x = MY.player.s.x + 16;
    MY.player.o2.y = MY.player.s.y - 13;
    MY.g.rootScene.addChild(MY.player.o2);

    MY.player.f1 = new Sprite(24, 24);
    MY.player.f1.image = MY.g.assets["image/fire1.png"];
    MY.player.f1.frame = [0, 0, 1, 1, 2, 2, 3, 3];
    MY.player.f1.x = MY.player.o1.x;
    MY.player.f1.y = MY.player.o1.y - 8;
    MY.g.rootScene.addChild(MY.player.f1);
    MY.player.f1.visible = false;

    MY.player.f2 = new Sprite(24, 24);
    MY.player.f2.image = MY.g.assets["image/fire1.png"];
    MY.player.f2.frame = [0, 0, 1, 1, 2, 2, 3, 3];
    MY.player.f2.x = MY.player.o2.x;
    MY.player.f2.y = MY.player.o2.y - 8;
    MY.g.rootScene.addChild(MY.player.f2);
    MY.player.f2.visible = false;
}
