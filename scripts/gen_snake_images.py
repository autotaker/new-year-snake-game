"""
このスクリプトはスネークゲーム用の画像を生成するためのスクリプトです。

出力先: src/assets/snake_images

画像の一覧:
- snake_head_{dst_position}.png
- snake_body_{src_position}_{dst_position}.png
- snake_tail_{src_position}.png

src_position: 進行方向(頭がある方向)
  - up
  - down
  - left
  - right
dst_position: 進行後の方向(尾がある方向)
  - up
  - down
  - left
  - right

例: snake_body_up_right.png: 蛇の頭が上に進行していて、尾が右にある、胴体の画像

画像のサイズは48x48で、背景は透過です。黒い線で蛇の形を書くこと。
蛇の顔は目があるとわかりやすいです。
"""

import os
from PIL import Image, ImageDraw

snake_body_color = "white"
snake_eye_color = "red"


def create_snake_image(filename, draw_function):
    img = Image.new("RGBA", (48, 48), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    draw_function(draw)
    img.save(filename)


def draw_snake_head(draw, direction):
    # Draw snake head with eyes based on direction
    if direction == "up":
        draw.rectangle([12, 0, 36, 24], fill=snake_body_color)
        draw.rectangle([18, 6, 22, 10], fill=snake_eye_color)
        draw.rectangle([26, 6, 30, 10], fill=snake_eye_color)
    elif direction == "down":
        draw.rectangle([12, 24, 36, 48], fill=snake_body_color)
        draw.rectangle([18, 38, 22, 42], fill=snake_eye_color)
        draw.rectangle([26, 38, 30, 42], fill=snake_eye_color)
    elif direction == "left":
        draw.rectangle([0, 12, 24, 36], fill=snake_body_color)
        draw.rectangle([6, 18, 10, 22], fill=snake_eye_color)
        draw.rectangle([6, 26, 10, 30], fill=snake_eye_color)
    elif direction == "right":
        draw.rectangle([24, 12, 48, 36], fill=snake_body_color)
        draw.rectangle([38, 18, 42, 22], fill=snake_eye_color)
        draw.rectangle([38, 26, 42, 30], fill=snake_eye_color)


def draw_snake_body(draw, src_direction, dst_direction):
    # Draw snake body based on directions
    if src_direction == "up" and dst_direction == "down":
        draw.rectangle([12, 0, 36, 48], fill=snake_body_color)
    elif src_direction == "down" and dst_direction == "up":
        draw.rectangle([12, 0, 36, 48], fill=snake_body_color)
    elif src_direction == "left" and dst_direction == "right":
        draw.rectangle([0, 12, 48, 36], fill=snake_body_color)
    elif src_direction == "right" and dst_direction == "left":
        draw.rectangle([0, 12, 48, 36], fill=snake_body_color)
    elif src_direction == "up" and dst_direction == "right":
        draw.rectangle([12, 0, 36, 24], fill=snake_body_color)
        draw.rectangle([24, 12, 48, 36], fill=snake_body_color)
    elif src_direction == "right" and dst_direction == "up":
        draw.rectangle([24, 12, 48, 36], fill=snake_body_color)
        draw.rectangle([12, 0, 36, 24], fill=snake_body_color)
    elif src_direction == "up" and dst_direction == "left":
        draw.rectangle([12, 0, 36, 24], fill=snake_body_color)
        draw.rectangle([0, 12, 24, 36], fill=snake_body_color)
    elif src_direction == "left" and dst_direction == "up":
        draw.rectangle([0, 12, 24, 36], fill=snake_body_color)
        draw.rectangle([12, 0, 36, 24], fill=snake_body_color)
    elif src_direction == "down" and dst_direction == "right":
        draw.rectangle([12, 24, 36, 48], fill=snake_body_color)
        draw.rectangle([24, 12, 48, 36], fill=snake_body_color)
    elif src_direction == "right" and dst_direction == "down":
        draw.rectangle([24, 12, 48, 36], fill=snake_body_color)
        draw.rectangle([12, 24, 36, 48], fill=snake_body_color)
    elif src_direction == "down" and dst_direction == "left":
        draw.rectangle([12, 24, 36, 48], fill=snake_body_color)
        draw.rectangle([0, 12, 24, 36], fill=snake_body_color)
    elif src_direction == "left" and dst_direction == "down":
        draw.rectangle([0, 12, 24, 36], fill=snake_body_color)
        draw.rectangle([12, 24, 36, 48], fill=snake_body_color)


def draw_snake_tail(draw, direction):
    # Draw snake tail based on direction
    if direction == "up":
        draw.rectangle([12, 24, 36, 48], fill=snake_body_color)
    elif direction == "down":
        draw.rectangle([12, 0, 36, 24], fill=snake_body_color)
    elif direction == "left":
        draw.rectangle([24, 12, 48, 36], fill=snake_body_color)
    elif direction == "right":
        draw.rectangle([0, 12, 24, 36], fill=snake_body_color)


def generate_images():
    positions = ["up", "down", "left", "right"]
    output_dir = "src/assets/snake_images"
    os.makedirs(output_dir, exist_ok=True)

    for dst_position in positions:
        create_snake_image(
            f"{output_dir}/snake_head_{dst_position}.png",
            lambda draw: draw_snake_head(draw, dst_position),
        )

    for src_position in positions:
        for dst_position in positions:
            if src_position == dst_position:
                continue
            create_snake_image(
                f"{output_dir}/snake_body_{src_position}_{dst_position}.png",
                lambda draw: draw_snake_body(draw, src_position, dst_position),
            )

    for src_position in positions:
        create_snake_image(
            f"{output_dir}/snake_tail_{src_position}.png",
            lambda draw: draw_snake_tail(draw, src_position),
        )


if __name__ == "__main__":
    generate_images()
