import { onMounted, onUnmounted, ref, reactive } from "vue";

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
export interface GameInfo {
  score: number;
  snakeLength: number;
  elapsedSec: string;
  ateStack: string[];
}

export function useSnakeGame(
  canvas: HTMLCanvasElement | null,
  gameInfo: GameInfo,
  gameOverHandler: (reason: string, score: number) => void
) {
  // ========= ゲーム設定 =========
  const COLS = 20;
  const ROWS = 20;
  const CELL_SIZE = 20;
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

  // ========= 関数群(同内容) =========
  const initGame = () => {
    document.addEventListener("keydown", handleKey);
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
      checkCollisions();
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

      // 2025判定
      if (check2025Combo()) {
        // 末尾から4つ pop
        ateStack.pop(); // '5'
        ateStack.pop(); // '2'
        ateStack.pop(); // '0'
        ateStack.pop(); // '2'

        // 尻尾を4つ削る (最低1セグメントは残す)
        let cutCount = 4;
        while (cutCount > 0 && snake.length > 1) {
          snake.pop();
          cutCount--;
        }
        snakeLength = snake.length; // 実際の配列長と合わせる

        // ボーナス
        score += 50;
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

  const check2025Combo = () => {
    if (ateStack.length < 4) return false;
    let last4 = ateStack.slice(-4).join(""); // 末尾4つの文字列
    return last4 === "2025";
  };

  const checkCollisions = () => {
    const head = snake[0];
    // 壁
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      endGame("壁に衝突");
      return;
    }
    // 自己衝突
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        endGame("自分の体に衝突");
        return;
      }
    }
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

  const draw = () => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // スネーク描画
    snake.forEach((seg, i) => {
      // 頭は色を変える
      ctx.fillStyle = i === 0 ? "green" : "limegreen";
      let px = seg.x * CELL_SIZE;
      let py = seg.y * CELL_SIZE;
      ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

      // 2番目のセグメント (i=1) から ateStack[0] を表示
      // 3番目のセグメント (i=2) に ateStack[1], ... という対応
      let stackIndex = i - 1;
      if (stackIndex >= 0 && stackIndex < ateStack.length) {
        ctx.fillStyle = "white";
        ctx.font = "12px sans-serif";
        ctx.fillText(
          ateStack[ateStack.length - stackIndex - 1],
          px + 6,
          py + 14
        );
      }
    });

    // アイテム描画
    items.forEach((item) => {
      let color;
      switch (item.type) {
        case "0":
          color = "red";
          break;
        case "2":
          color = "blue";
          break;
        case "5":
          color = "orange";
          break;
        default:
          color = "gray";
          break;
      }
      ctx.fillStyle = color;
      let px = item.x * CELL_SIZE;
      let py = item.y * CELL_SIZE;
      ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

      // アイテム文字
      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.fillText(item.type, px + 6, py + 14);
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
    draw();
    gameOverHandler(reason, score);
  };

  const onMountedHandler = () => {
    initGame();
    animationFrameId = requestAnimationFrame(gameLoop);
  };

  const onUnmountedHandler = () => {
    cancelAnimationFrame(animationFrameId);
    document.removeEventListener("keydown", handleKey);
  };

  return {
    onMountedHandler,
    onUnmountedHandler,
  };
}
