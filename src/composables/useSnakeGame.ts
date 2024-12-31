import { snakeImages } from "@/snake_images";

interface Segment {
  x: number;
  y: number;
}
interface Item {
  x: number;
  y: number;
  type: string;
  born: number;
}
export type Direction = "up" | "down" | "left" | "right";
export interface GameInfo {
  state: "init" | "playing" | "gameover";
  score: number;
  snakeLength: number;
  elapsedSec: string;
  ateStack: string[];
}

export function useSnakeGame(
  canvas: HTMLCanvasElement,
  gameInfo: GameInfo,
  gameOverHandler: (reason: string, score: number) => void,
  comboHandler: (combo: string, bonus: number) => void
) {
  // ========= ゲーム設定 =========
  const COLS = 20;
  const ROWS = 20;
  const CELL_SIZE = 40;
  const MAX_ITEMS = 3;
  const ITEM_LIFETIME = 10000;
  const GAME_TIME_LIMIT = 120;
  const snakeSpeed = 200;

  // ========= 状態管理 =========
  let lastUpdateTime = 0;
  let snake: Segment[] = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
  ];
  let vx = 1,
    vy = 0;
  let snakeLength = snake.length;
  let ateStack: string[] = [];
  let items: Item[] = [];
  let score = 0;
  let startTime = 0;
  let animationFrameId = 0;

  canvas.width = COLS * CELL_SIZE;
  canvas.height = ROWS * CELL_SIZE;

  // ========= 関数群(同内容) =========
  const initGame = () => {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
    ];
    vx = 1;
    vy = 0;
    snakeLength = snake.length;
    ateStack = [];
    items = [];
    startTime = Date.now();

    for (let i = 0; i < MAX_ITEMS; i++) spawnItem();
    updateInfo();
  };

  const gameLoop = (timestamp: number) => {
    const now = Date.now();
    const elapsedSec = (now - startTime) / 1000;
    if (elapsedSec >= GAME_TIME_LIMIT) {
      endGame("TIME UP");
      return;
    }
    if (timestamp - lastUpdateTime >= snakeSpeed) {
      lastUpdateTime = timestamp;
      moveSnake();
      if (checkCollisions()) {
        return;
      }
      updateItems();
    }
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
  };

  const moveSnake = () => {
    const head = snake[0];
    const newHead = {
      x: head.x + vx,
      y: head.y + vy,
    };
    // 頭を先頭に追加
    snake.unshift(newHead);

    // アイテムを食べたかチェック
    const eatenIndex = items.findIndex(
      (it) => it.x === newHead.x && it.y === newHead.y
    );
    if (eatenIndex >= 0) {
      const eatenItem = items[eatenIndex];
      score += 10;
      snakeLength++;
      // スタックに追加
      ateStack.push(eatenItem.type);

      // コンボ判定
      const comboResult = checkCombo();
      if (comboResult) {
        let cutCount = comboResult.length;
        for (let i = 0; i < cutCount; i++) {
          ateStack.pop();
          snake.pop();
        }
        snakeLength = snake.length; // 実際の配列長と合わせる

        // ボーナス
        const bonus = comboResult === "2025" ? 100 : 50;
        score += bonus;
        comboHandler(comboResult, bonus);
      }

      // 食べたアイテムを削除 & 新規生成
      items.splice(eatenIndex, 1);
      spawnItem();
    }

    // 蛇の長さを揃える
    while (snake.length > snakeLength) {
      snake.pop();
    }

    gameInfo.score = score;
    gameInfo.snakeLength = snakeLength;
    gameInfo.ateStack = [...ateStack];
  };

  const checkCombo = () => {
    const comboStr = ateStack.join("");
    if (comboStr.endsWith("2025")) {
      return "2025";
    } else if (comboStr.endsWith("00000")) {
      return "00000";
    } else if (comboStr.endsWith("55555")) {
      return "55555";
    } else if (comboStr.endsWith("22222")) {
      return "22222";
    }
    return "";
  };

  const checkCollisions = () => {
    const head = snake[0];
    // 壁
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      console.log("壁に衝突", head);
      endGame("壁に衝突");
      return true;
    }
    // 自己衝突
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        endGame("自分の体に衝突");
        return true;
      }
    }
    return false;
  };

  const updateItems = () => {
    const now = Date.now();
    // 古いアイテムを消去
    items = items.filter((it) => now - it.born < ITEM_LIFETIME);
    // 足りなければ補充
    while (items.length < MAX_ITEMS) {
      spawnItem();
    }
  };

  const spawnItem = () => {
    const now = Date.now();
    const types = ["0", "2", "5"];
    const type = types[Math.floor(Math.random() * types.length)];

    let x = Math.floor(Math.random() * COLS);
    let y = Math.floor(Math.random() * ROWS);

    // かんたん衝突回避
    for (let i = 0; i < 10; i++) {
      if (
        !snake.some((s) => s.x === x && s.y === y) &&
        !items.some((it) => it.x === x && it.y === y)
      ) {
        break;
      }
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
    }

    items.push({ x, y, type, born: now });
  };

  const changeDirection = (direction: Direction) => {
    switch (direction) {
      case "up":
        if (vy !== 1) {
          vy = -1;
          vx = 0;
        }
        break;
      case "down":
        if (vy !== -1) {
          vy = 1;
          vx = 0;
        }
        break;
      case "left":
        if (vx !== 1) {
          vx = -1;
          vy = 0;
        }
        break;
      case "right":
        if (vx !== -1) {
          vx = 1;
          vy = 0;
        }
        break;
    }
  };

  /*
  const handleKey = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        if (vx !== 1) {
          vx = -1;
          vy = 0;
        }
        break;
      case "ArrowRight":
        if (vx !== -1) {
          vx = 1;
          vy = 0;
        }
        break;
      case "ArrowUp":
        if (vy !== 1) {
          vy = -1;
          vx = 0;
        }
        break;
      case "ArrowDown":
        if (vy !== -1) {
          vy = 1;
          vx = 0;
        }
        break;
    }
  };
  */
  const loadImage = (src: string) => {
    const img = new Image();
    img.src = src;
    return img;
  };

  const headImages = {
    up: loadImage(snakeImages.head.up),
    down: loadImage(snakeImages.head.down),
    left: loadImage(snakeImages.head.left),
    right: loadImage(snakeImages.head.right),
  };

  const tailImages = {
    up: loadImage(snakeImages.tail.up),
    down: loadImage(snakeImages.tail.down),
    left: loadImage(snakeImages.tail.left),
    right: loadImage(snakeImages.tail.right),
  };

  const bodyImages: { [key: string]: HTMLImageElement } = {
    up_down: loadImage(snakeImages.body.up_down),
    down_up: loadImage(snakeImages.body.down_up),
    left_right: loadImage(snakeImages.body.left_right),
    right_left: loadImage(snakeImages.body.right_left),
    up_right: loadImage(snakeImages.body.up_right),
    right_up: loadImage(snakeImages.body.right_up),
    up_left: loadImage(snakeImages.body.up_left),
    left_up: loadImage(snakeImages.body.left_up),
    down_right: loadImage(snakeImages.body.down_right),
    right_down: loadImage(snakeImages.body.right_down),
    down_left: loadImage(snakeImages.body.down_left),
    left_down: loadImage(snakeImages.body.left_down),
  };

  const draw = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 背景は黒
    // 背景は灰色
    ctx.fillStyle = "#866";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const getDirection = (
      seg1: Segment,
      seg2: Segment
    ): "up" | "down" | "left" | "right" => {
      if (seg1.x === seg2.x) {
        return seg1.y > seg2.y ? "up" : "down";
      } else {
        return seg1.x > seg2.x ? "left" : "right";
      }
    };

    snake.forEach((seg, i) => {
      let px = seg.x * CELL_SIZE;
      let py = seg.y * CELL_SIZE;

      if (i === 0) {
        // Head
        const direction = getDirection(seg, snake[1]);
        ctx.drawImage(headImages[direction], px, py, CELL_SIZE, CELL_SIZE);
      } else if (i === snake.length - 1) {
        // Tail
        const direction = getDirection(seg, snake[i - 1]);
        ctx.drawImage(tailImages[direction], px, py, CELL_SIZE, CELL_SIZE);
      } else {
        // Body
        const srcDirection = getDirection(seg, snake[i - 1]);
        const dstDirection = getDirection(seg, snake[i + 1]);
        const bodyKey = `${srcDirection}_${dstDirection}`;
        if (!bodyImages[bodyKey]) {
          console.error("Invalid body key", bodyKey);
          console.error("prev_snake", snake[i - 1]);
          console.error("seg", seg);
          console.error("next_snake", snake[i + 1]);
          return;
        }
        ctx.drawImage(bodyImages[bodyKey], px, py, CELL_SIZE, CELL_SIZE);
      }

      // Draw ateStack numbers
      let stackIndex = i - 1;
      if (stackIndex >= 0 && stackIndex < ateStack.length) {
        ctx.fillStyle = "black";
        ctx.font = "20px sans-serif";
        ctx.fillText(
          ateStack[ateStack.length - stackIndex - 1],
          px + CELL_SIZE / 2 - 6,
          py + CELL_SIZE / 2 + 8
        );
      }
    });

    // アイテム描画
    items.forEach((item) => {
      let color;
      switch (item.type) {
        case "0":
          color = "#CD7F32";
          break;
        case "2":
          color = "#C0C0C0";
          break;
        case "5":
          color = "#FFD700";
          break;
        default:
          color = "gray";
          break;
      }
      ctx.fillStyle = color;
      let px = item.x * CELL_SIZE;
      let py = item.y * CELL_SIZE;
      // 円で塗りつぶし
      ctx.beginPath();
      ctx.arc(
        px + CELL_SIZE / 2,
        py + CELL_SIZE / 2,
        CELL_SIZE / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // アイテム文字
      ctx.fillStyle = "black";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(item.type, px + CELL_SIZE / 2 - 8, py + CELL_SIZE / 2 + 8);
    });
    updateInfo();
  };

  const updateInfo = () => {
    const now = Date.now();
    const elapsedSec = ((now - startTime) / 1000).toFixed(1);
    gameInfo.elapsedSec = elapsedSec;
    gameInfo.score = score;
    gameInfo.snakeLength = snakeLength;
    gameInfo.ateStack = [...ateStack];
  };

  const endGame = (reason: string) => {
    gameInfo.state = "gameover";
    gameOverHandler(reason, score);
  };

  const gameStart = () => {
    console.log("game start");
    if (gameInfo.state === "playing") return;
    gameInfo.state = "playing";
    initGame();
    animationFrameId = requestAnimationFrame(gameLoop);
  };

  const onUnmountedHandler = () => {
    cancelAnimationFrame(animationFrameId);
  };

  return {
    gameStart,
    onUnmountedHandler,
    changeDirection,
  };
}
