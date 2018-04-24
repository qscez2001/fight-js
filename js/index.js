class BaseCharacter {
  // 使用 this 來設定物件的所有屬性
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }

  attack(character, damage) {
    // 先檢查要發動攻擊的角色是否還活著
    if (this.alive == false) {
      return;
    }
    // 表示敵對角色受到傷害
    character.getHurt(damage);
  }

  heal() {
    if (this.alive == false) {
      return;
    }
    this.hp += 30;

    if (this.hp >= this.maxHp) {
      this.hp = this.maxHp;
    }
      
    this.updateHtml(this.hpElement, this.hurtElement);

    // _this 是用來暫時儲存 this
    var _this = this;
    var i = 1;

    // 把 setInterval 回傳的 id 存在 _this 的新增屬性 id 裡。
    _this.id = setInterval(function() {
    
    if (i == 1) {
      // index 0 會是最靠近 monster-image-block／hero-image-block 的 element，
      // 因為 effect-image 和 hurt- text 是他們的子節點（childNode
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = 30;
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/heal/'+ i +'.png';

      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
     }
    }, 50);

  }

  getHurt(damage) { 
    this.hp -= damage;
    if (this.hp <= 0) { 
      this.die();
    }
    // _this 是用來暫時儲存 this
    var _this = this;
    var i = 1;

    // 把 setInterval 回傳的 id 存在 _this 的新增屬性 id 裡。
    _this.id = setInterval(function() {
    
    if (i == 1) {
      // index 0 會是最靠近 monster-image-block／hero-image-block 的 element，
      // 因為 effect-image 和 hurt- text 是他們的子節點（childNode
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }
      
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i +'.png';
      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
     }
    }, 50);

  }

  die() { 
    this.alive = false;
  }

  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%";
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    // 用 super去呼叫 BaseCharacter class 的 contructor 方法
    super(name, hp, ap);
    // 先列出會隨著戰鬥進展而會更動的 HTML 標籤
    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    // 測試物件是否創建成功
    console.log("召喚英雄 " + this.name + "！");
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  // 因為 subclass (Hero／Monster) 的 getHurt 方法會覆蓋在 superclass 的方法上，所以必須使用 super 把方法給串接起來
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("遇到怪獸 " + this.name + "了!");
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 10);
var rounds = 10;


// 撰寫回合結束的機制
function endTurn() {
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1) {
    // 「遊戲結束」空白區
    finish();
  }
}

// 新增技能事件
function addSkillEvent() {
  var skill = document.getElementById("skill");
  skill.onclick = function() { 
    heroAttack(); 
  }

  var heal = document.getElementById("heal");
  heal.onclick = function() {
    heroHeal();
  }

  document.onkeyup = function(event) {
    var key = String.fromCharCode(event.keyCode);
    if (key == "A") {
      heroAttack();
    } 
    if (key == "D") {
      heroHeal();
    } 
  }
}
// 完成設定事件驅動
addSkillEvent();

function heroAttack() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  // setTimeout 這個 function 會在設定的時間後被執行
  // 在第一個 setTimeout 的匿名 function 裡，再使用 setTimeout 一次
  setTimeout(function() {
    hero.element.classList.add("attacking");
    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100);
  // 怪獸的移動和回歸與英雄相同，但如果在英雄攻擊結束後，怪獸陣亡，那就不需要怪獸的移動和歸位了。
  // 由於怪獸的 setTimeout 和英雄在同一個層級，所以他的時間就必須和英雄同時計算
  setTimeout(function() {
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        // 執行回合結束的 endTurn function
        endTurn();
        if (hero.alive == false) {
          // 「遊戲結束」空白區
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      // 「遊戲結束」空白區
      finish();
    }
  }, 1100);
}

// 透過 getElementById 取得 dialog 的 <div> 物件。
// 將隱藏的 dialog 設定為顯示添加 win class，透過 css 樣式的設定開啟勝利畫面
function finish() {
  var dialog = document.getElementById("dialog")
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}

function heroHeal() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function() {
    setTimeout(function() {
      hero.heal();
    }, 500);

  }, 100);

  setTimeout(function() {
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        // 執行回合結束的 endTurn function
        endTurn();
        if (hero.alive == false) {
          // 「遊戲結束」空白區
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      // 「遊戲結束」空白區
      finish();
    }
  }, 1100);
}



