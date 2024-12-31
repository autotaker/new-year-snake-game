import snake_body_down_left from "@/assets/snake_images/snake_body_down_left.png";
import snake_body_down_right from "@/assets/snake_images/snake_body_down_right.png";
import snake_body_down_up from "@/assets/snake_images/snake_body_down_up.png";
import snake_body_left_up from "@/assets/snake_images/snake_body_left_up.png";
import snake_body_left_down from "@/assets/snake_images/snake_body_left_down.png";
import snake_body_left_right from "@/assets/snake_images/snake_body_left_right.png";
import snake_body_up_down from "@/assets/snake_images/snake_body_up_down.png";
import snake_body_up_left from "@/assets/snake_images/snake_body_up_left.png";
import snake_body_up_right from "@/assets/snake_images/snake_body_up_right.png";
import snake_body_right_down from "@/assets/snake_images/snake_body_right_down.png";
import snake_body_right_up from "@/assets/snake_images/snake_body_right_up.png";
import snake_body_right_left from "@/assets/snake_images/snake_body_right_left.png";
import snake_head_down from "@/assets/snake_images/snake_head_down.png";
import snake_head_left from "@/assets/snake_images/snake_head_left.png";
import snake_head_right from "@/assets/snake_images/snake_head_right.png";
import snake_head_up from "@/assets/snake_images/snake_head_up.png";
import snake_tail_down from "@/assets/snake_images/snake_tail_down.png";
import snake_tail_left from "@/assets/snake_images/snake_tail_left.png";
import snake_tail_right from "@/assets/snake_images/snake_tail_right.png";
import snake_tail_up from "@/assets/snake_images/snake_tail_up.png";

export const snakeImages = {
  head: {
    up: snake_head_up,
    down: snake_head_down,
    left: snake_head_left,
    right: snake_head_right,
  },
  tail: {
    up: snake_tail_up,
    down: snake_tail_down,
    left: snake_tail_left,
    right: snake_tail_right,
  },
  body: {
    up_down: snake_body_up_down,
    up_right: snake_body_up_right,
    up_left: snake_body_up_left,
    down_up: snake_body_down_up,
    down_right: snake_body_down_right,
    down_left: snake_body_down_left,
    left_up: snake_body_left_up,
    left_right: snake_body_left_right,
    left_down: snake_body_left_down,
    right_left: snake_body_right_left,
    right_up: snake_body_right_up,
    right_down: snake_body_right_down,
  } as { [key: string]: string },
};
